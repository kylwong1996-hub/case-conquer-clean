import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { caseDetails, problems } from "@/data/problems";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MicLevelIndicator } from "@/components/MicLevelIndicator";
import { AudioSettingsModal } from "@/components/AudioSettingsModal";
import { RetryFailedDialog } from "@/components/RetryFailedDialog";
import {
  ArrowLeft,
  Clock,
  Building2,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Mic,
  MicOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface QAItem {
  question: string;
  answer: string;
}

interface ScoreEvaluation {
  totalScore: number;
  breakdown: {
    structure: number;
    analysis: number;
    quantitative: number;
    businessInsight: number;
  };
  strengths: string[];
  improvements: string[];
  feedback: string;
}

const TRANSCRIBE_TIMEOUT_MS = 45_000;
const AUDIO_READ_TIMEOUT_MS = 15_000;
const AI_CALL_TIMEOUT_MS = 60_000;
const MAX_RETRY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1500;

function isAbortError(err: unknown): boolean {
  if (!err) return false;

  if (err instanceof DOMException) return err.name === "AbortError";
  if (err instanceof Error) return err.name === "AbortError";

  if (typeof err === "object") {
    const anyErr = err as any;
    // @supabase/functions-js wraps fetch aborts inside FunctionsFetchError.context
    const contextName = anyErr?.context?.name;
    return contextName === "AbortError";
  }

  return false;
}

function blobToBase64(blob: Blob, timeoutMs = AUDIO_READ_TIMEOUT_MS): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    const timeoutId = setTimeout(() => {
      try {
        reader.abort();
      } catch {
        // ignore
      }
      reject(new Error("Audio processing timed out"));
    }, timeoutMs);

    const cleanup = () => clearTimeout(timeoutId);

    reader.onerror = () => {
      cleanup();
      reject(reader.error ?? new Error("Audio processing failed"));
    };

    reader.onabort = () => {
      cleanup();
      reject(new Error("Audio processing aborted"));
    };

    reader.onloadend = () => {
      cleanup();

      if (!reader.result || typeof reader.result !== "string") {
        reject(new Error("Audio processing failed"));
        return;
      }

      const base64 = reader.result.split(",")[1];
      if (!base64) {
        reject(new Error("Invalid audio data"));
        return;
      }

      resolve(base64);
    };

    try {
      reader.readAsDataURL(blob);
    } catch (e) {
      cleanup();
      reject(e instanceof Error ? e : new Error("Audio processing failed"));
    }
  });
}

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const caseData = id ? caseDetails[id] : null;
  const problem = problems.find((p) => p.id === id);
  const { toast } = useToast();

  const [timeLeft, setTimeLeft] = useState(caseData ? caseData.timeEstimate * 60 : 0);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showFramework, setShowFramework] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [userResponse, setUserResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<ScoreEvaluation | null>(null);
  const [qaHistory, setQaHistory] = useState<QAItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isQaRecording, setIsQaRecording] = useState(false);
  const [isQaTranscribing, setIsQaTranscribing] = useState(false);
  const [selectedMicId, setSelectedMicId] = useState("");
  const [retryFailedDialog, setRetryFailedDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
  }>({ open: false, title: "", description: "" });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const qaMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const qaAudioChunksRef = useRef<Blob[]>([]);

  // Ensure we can cancel in-flight AI/backend calls (prevents "zombie" requests piling up)
  const transcribeAbortRef = useRef<AbortController | null>(null);
  const qaTranscribeAbortRef = useRef<AbortController | null>(null);
  const askAbortRef = useRef<AbortController | null>(null);
  const scoreAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    return () => {
      transcribeAbortRef.current?.abort();
      qaTranscribeAbortRef.current?.abort();
      askAbortRef.current?.abort();
      scoreAbortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setTimeLeft(caseData ? caseData.timeEstimate * 60 : 0);
    setIsRunning(false);
  };

  const revealHint = (index: number) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints([...revealedHints, index]);
    }
  };

  const startRecording = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: selectedMicId
          ? { deviceId: { exact: selectedMicId } }
          : { echoCancellation: true, noiseSuppression: true },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Determine supported mime type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "audio/ogg";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());

        const chunks = audioChunksRef.current;
        audioChunksRef.current = [];

        if (chunks.length === 0) {
          toast({
            title: "No audio recorded",
            description: "Please try again and speak into the microphone.",
            variant: "destructive",
          });
          return;
        }

        const audioBlob = new Blob(chunks, { type: mimeType });

        // Cancel any previous transcription call that might still be in-flight
        transcribeAbortRef.current?.abort();
        const controller = new AbortController();
        transcribeAbortRef.current = controller;

        // Set transcribing state immediately to show loading
        setIsTranscribing(true);

        let lastError: unknown = null;
        let success = false;

        for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
          if (controller.signal.aborted) break;

          try {
            const base64 = await blobToBase64(audioBlob);

            const { data, error } = await supabase.functions.invoke("voice-to-text", {
              body: { audio: base64, mimeType },
              signal: controller.signal,
              timeout: TRANSCRIBE_TIMEOUT_MS,
            });

            if (error) throw error;

            if (data?.text?.trim()) {
              setUserResponse((prev) => (prev ? prev + " " + data.text.trim() : data.text.trim()));
              toast({
                title: "Transcription complete",
                description: "Your speech has been added to the response.",
              });
              success = true;
              break;
            } else {
              toast({
                title: "No speech detected",
                description: "Try speaking louder or closer to your microphone.",
                variant: "destructive",
              });
              success = true; // Not an error, just no speech
              break;
            }
          } catch (err) {
            lastError = err;

            // If aborted by a newer request, exit silently
            if (transcribeAbortRef.current !== controller) return;
            if (isAbortError(err) || controller.signal.aborted) break;

            // If more attempts remain, wait and retry
            if (attempt < MAX_RETRY_ATTEMPTS) {
              console.log(`Transcription attempt ${attempt} failed, retrying...`);
              await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
            }
          }
        }

        // Handle final failure after all retries
        if (!success && transcribeAbortRef.current === controller) {
          if (!isAbortError(lastError)) {
            setRetryFailedDialog({
              open: true,
              title: "Transcription Failed",
              description: "We couldn't transcribe your audio after multiple attempts. Please try again later.",
            });
          }
        }

        if (transcribeAbortRef.current === controller) {
          transcribeAbortRef.current = null;
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);

      toast({
        title: "Recording started",
        description: "Speak now. Click stop when finished.",
      });
    } catch (err: any) {
      console.error("Error starting recording:", err);
      const message =
        err?.name === "NotAllowedError"
          ? "Microphone permission denied. Please allow access and try again."
          : "Could not access the microphone. Please check your settings.";
      toast({
        title: "Recording failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const startQaRecording = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: selectedMicId
          ? { deviceId: { exact: selectedMicId } }
          : { echoCancellation: true, noiseSuppression: true },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "audio/ogg";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      qaMediaRecorderRef.current = mediaRecorder;
      qaAudioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          qaAudioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());

        const chunks = qaAudioChunksRef.current;
        qaAudioChunksRef.current = [];

        if (chunks.length === 0) {
          toast({
            title: "No audio recorded",
            description: "Please try again and speak into the microphone.",
            variant: "destructive",
          });
          return;
        }

        const audioBlob = new Blob(chunks, { type: mimeType });

        qaTranscribeAbortRef.current?.abort();
        const controller = new AbortController();
        qaTranscribeAbortRef.current = controller;

        // Set transcribing state immediately to show loading
        setIsQaTranscribing(true);

        let lastError: unknown = null;
        let success = false;

        for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
          if (controller.signal.aborted) break;

          try {
            const base64 = await blobToBase64(audioBlob);

            const { data, error } = await supabase.functions.invoke("voice-to-text", {
              body: { audio: base64, mimeType },
              signal: controller.signal,
              timeout: TRANSCRIBE_TIMEOUT_MS,
            });

            if (error) throw error;

            if (data?.text?.trim()) {
              setCurrentQuestion((prev) =>
                prev ? prev + " " + data.text.trim() : data.text.trim()
              );
              toast({
                title: "Transcription complete",
                description: "Your question has been transcribed.",
              });
              success = true;
              break;
            } else {
              toast({
                title: "No speech detected",
                description: "Try speaking louder or closer to your microphone.",
                variant: "destructive",
              });
              success = true; // Not an error, just no speech
              break;
            }
          } catch (err) {
            lastError = err;

            if (qaTranscribeAbortRef.current !== controller) return;
            if (isAbortError(err) || controller.signal.aborted) break;

            if (attempt < MAX_RETRY_ATTEMPTS) {
              console.log(`QA transcription attempt ${attempt} failed, retrying...`);
              await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
            }
          }
        }

        // Handle final failure after all retries
        if (!success && qaTranscribeAbortRef.current === controller) {
          if (!isAbortError(lastError)) {
            setRetryFailedDialog({
              open: true,
              title: "Transcription Failed",
              description: "We couldn't transcribe your audio after multiple attempts. Please try again later.",
            });
          }
        }

        if (qaTranscribeAbortRef.current === controller) {
          qaTranscribeAbortRef.current = null;
          setIsQaTranscribing(false);
        }
      };

      mediaRecorder.start(1000);
      setIsQaRecording(true);

      toast({
        title: "Recording started",
        description: "Speak your question. Click stop when finished.",
      });
    } catch (err: any) {
      console.error("Error starting recording:", err);
      const message =
        err?.name === "NotAllowedError"
          ? "Microphone permission denied. Please allow access and try again."
          : "Could not access the microphone. Please check your settings.";
      toast({
        title: "Recording failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const stopQaRecording = () => {
    if (qaMediaRecorderRef.current && qaMediaRecorderRef.current.state !== "inactive") {
      qaMediaRecorderRef.current.stop();
    }
    setIsQaRecording(false);
  };

  const askClarifyingQuestion = async () => {
    if (!currentQuestion.trim()) return;

    askAbortRef.current?.abort();
    const controller = new AbortController();
    askAbortRef.current = controller;

    setIsAskingQuestion(true);
    const questionText = currentQuestion;
    setCurrentQuestion("");

    let lastError: unknown = null;
    let success = false;

    for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
      if (controller.signal.aborted) break;

      try {
        const { data, error } = await supabase.functions.invoke("answer-question", {
          body: {
            caseContext: caseData.context,
            caseQuestion: caseData.question,
            userQuestion: questionText,
          },
          signal: controller.signal,
          timeout: AI_CALL_TIMEOUT_MS,
        });

        if (error) throw error;
        
        if (data?.error) {
          throw new Error(data.error);
        }

        setQaHistory((prev) => [
          ...prev,
          { question: questionText, answer: data.answer },
        ]);
        success = true;
        break;
      } catch (error) {
        lastError = error;

        if (askAbortRef.current !== controller) return;
        if (isAbortError(error) || controller.signal.aborted) break;

        if (attempt < MAX_RETRY_ATTEMPTS) {
          console.log(`Ask question attempt ${attempt} failed, retrying...`);
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        }
      }
    }

    // Handle final failure after all retries
    if (!success && askAbortRef.current === controller) {
      if (!isAbortError(lastError)) {
        setRetryFailedDialog({
          open: true,
          title: "Could Not Get Answer",
          description: "We couldn't get an answer to your question after multiple attempts. Please try again later.",
        });
      }
    }

    if (askAbortRef.current === controller) {
      askAbortRef.current = null;
      setIsAskingQuestion(false);
    }
  };

  const submitResponse = async () => {
    if (!userResponse.trim()) {
      toast({
        title: "Empty Response",
        description: "Please enter your response before submitting.",
        variant: "destructive",
      });
      return;
    }

    scoreAbortRef.current?.abort();
    const controller = new AbortController();
    scoreAbortRef.current = controller;

    setIsSubmitting(true);
    setEvaluation(null);

    let lastError: unknown = null;
    let success = false;

    for (let attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
      if (controller.signal.aborted) break;

      try {
        const { data, error } = await supabase.functions.invoke("score-response", {
          body: {
            caseContext: caseData.context,
            question: caseData.question,
            userResponse: userResponse,
          },
          signal: controller.signal,
          timeout: AI_CALL_TIMEOUT_MS,
        });

        if (error) throw error;
        
        if (data?.error) {
          throw new Error(data.error);
        }

        setEvaluation(data);
        
        // Save progress if score >= 70
        const { data: { user } } = await supabase.auth.getUser();
        if (user && id) {
          const isCompleted = data.totalScore >= 70;
          await supabase
            .from("problem_progress")
            .upsert({
              user_id: user.id,
              problem_id: id,
              score: data.totalScore,
              completed: isCompleted,
              completed_at: isCompleted ? new Date().toISOString() : null,
            }, { onConflict: "user_id,problem_id" });
        }
        
        toast({
          title: "Response Evaluated",
          description: `Your score: ${data.totalScore}/100${data.totalScore >= 70 ? " - Problem completed!" : ""}`,
        });
        success = true;
        break;
      } catch (error) {
        lastError = error;

        if (scoreAbortRef.current !== controller) return;
        if (isAbortError(error) || controller.signal.aborted) break;

        if (attempt < MAX_RETRY_ATTEMPTS) {
          console.log(`Score response attempt ${attempt} failed, retrying...`);
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        }
      }
    }

    // Handle final failure after all retries
    if (!success && scoreAbortRef.current === controller) {
      if (!isAbortError(lastError)) {
        setRetryFailedDialog({
          open: true,
          title: "Evaluation Failed",
          description: "We couldn't evaluate your response after multiple attempts. Please try again later.",
        });
      }
    }

    if (scoreAbortRef.current === controller) {
      scoreAbortRef.current = null;
      setIsSubmitting(false);
    }
  };

  if (!caseData || !problem) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Case not found</h1>
          <Link to="/problems">
            <Button>Back to Problems</Button>
          </Link>
        </div>
      </div>
    );
  }

  const difficultyVariant = caseData.difficulty.toLowerCase() as "easy" | "medium" | "hard";
  const progress = (1 - timeLeft / (caseData.timeEstimate * 60)) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back button */}
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Problems
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="category">{caseData.category}</Badge>
              <Badge variant={difficultyVariant}>{caseData.difficulty}</Badge>
              {caseData.company && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  {caseData.company}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {caseData.title}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {caseData.timeEstimate} minutes recommended
              </span>
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                70% to pass
              </span>
            </div>
          </div>

          {/* Timer Card */}
          <div className="glass rounded-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-mono font-bold text-foreground">
                  {formatTime(timeLeft)}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button size="icon" variant="outline" onClick={resetTimer}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="w-full sm:w-48 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timeLeft < 60 ? "bg-hard" : timeLeft < 300 ? "bg-medium" : "bg-primary"
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Case Content */}
          <div className="space-y-8">
            {/* Context */}
            <section className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Case Context
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {caseData.context}
              </p>
            </section>

            {/* Question */}
            <section className="glass rounded-xl p-6 border-l-4 border-primary">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                The Question
              </h2>
              <p className="text-lg text-foreground font-medium">
                {caseData.question}
              </p>
            </section>

            {/* Hints */}
            <section className="glass rounded-xl overflow-hidden">
              <button
                className="w-full p-6 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
                onClick={() => setShowHints(!showHints)}
              >
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <span className="text-xl font-semibold text-foreground">
                    Hints ({revealedHints.length}/{caseData.hints.length})
                  </span>
                </div>
                {showHints ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              {showHints && (
                <div className="px-6 pb-6 space-y-3">
                  {caseData.hints.map((hint, index) => (
                    <div
                      key={index}
                      className="p-4 bg-secondary rounded-lg cursor-pointer transition-all"
                      onClick={() => revealHint(index)}
                    >
                      {revealedHints.includes(index) ? (
                        <p className="text-foreground">{hint}</p>
                      ) : (
                        <p className="text-muted-foreground italic">
                          Click to reveal hint {index + 1}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Framework */}
            <section className="glass rounded-xl overflow-hidden">
              <button
                className="w-full p-6 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
                onClick={() => setShowFramework(!showFramework)}
              >
                <div className="flex items-center gap-3">
                  <ListChecks className="w-5 h-5 text-success" />
                  <span className="text-xl font-semibold text-foreground">
                    Suggested Framework
                  </span>
                </div>
                {showFramework ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              {showFramework && (
                <div className="px-6 pb-6">
                  <ul className="space-y-3">
                    {caseData.framework.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-4 bg-secondary rounded-lg"
                      >
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Ask Clarifying Questions */}
            <section className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-info" />
                Ask Clarifying Questions
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                In a real case interview, you can ask the interviewer questions. Try asking about company goals, market data, or constraints.
              </p>

              {/* Q&A History */}
              {qaHistory.length > 0 && (
                <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                  {qaHistory.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-primary">Q</span>
                        </div>
                        <p className="text-foreground text-sm">{item.question}</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-info/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-info">A</span>
                        </div>
                        <p className="text-muted-foreground text-sm">{item.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recording indicator for Q&A */}
              {isQaRecording && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                  <span className="text-sm text-destructive flex-1">Recording... Speak your question!</span>
                  <MicLevelIndicator
                    isRecording={isQaRecording}
                    selectedMicId={selectedMicId}
                    onError={(message) =>
                      toast({
                        title: "Microphone issue",
                        description: message,
                        variant: "destructive",
                      })
                    }
                  />
                </div>
              )}

              {/* Question Input */}
              <div className="flex gap-2">
                <Input
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  placeholder="e.g., What is the company's current market share?"
                  className="flex-1 bg-secondary border-border"
                  disabled={isAskingQuestion || isQaRecording || isQaTranscribing}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isAskingQuestion && currentQuestion.trim()) {
                      askClarifyingQuestion();
                    }
                  }}
                />
                <Button
                  variant={isQaRecording ? "destructive" : "outline"}
                  size="icon"
                  onClick={isQaRecording ? stopQaRecording : startQaRecording}
                  disabled={isAskingQuestion || isQaTranscribing}
                  title={isQaRecording ? "Stop recording" : "Voice input"}
                >
                  {isQaTranscribing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isQaRecording ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  onClick={askClarifyingQuestion}
                  disabled={isAskingQuestion || !currentQuestion.trim() || isQaRecording || isQaTranscribing}
                  variant="outline"
                >
                  {isAskingQuestion ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </section>

            {/* Your Response */}
            <section className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Your Response
                </div>
                <div className="flex items-center gap-2">
                  <AudioSettingsModal
                    selectedMicId={selectedMicId}
                    onMicChange={setSelectedMicId}
                  />
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="sm"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isSubmitting || isTranscribing}
                    className="flex items-center gap-2"
                  >
                    {isTranscribing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Transcribing...
                      </>
                    ) : isRecording ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        Voice Input
                      </>
                    )}
                  </Button>
                </div>
              </h2>
              {isRecording && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                  <span className="text-sm text-destructive flex-1">Recording... Speak now!</span>
                  <MicLevelIndicator
                    isRecording={isRecording}
                    selectedMicId={selectedMicId}
                    onError={(message) =>
                      toast({
                        title: "Microphone issue",
                        description: message,
                        variant: "destructive",
                      })
                    }
                  />
                </div>
              )}
              <Textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Enter your structured response to the case question here. Be thorough and organized in your analysis..."
                className="min-h-[200px] bg-secondary border-border mb-4"
                disabled={isSubmitting || isRecording}
              />
              <Button
                onClick={submitResponse}
                disabled={isSubmitting || !userResponse.trim() || isRecording}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit for Evaluation
                  </>
                )}
              </Button>
            </section>

            {/* Evaluation Results */}
            {evaluation && (
              <section className="glass rounded-xl p-6 border-l-4 border-primary">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Case Evaluation
                </h2>
                
                {/* Total Score */}
                <div className="flex items-center justify-center mb-8">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-secondary"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(evaluation.totalScore / 100) * 352} 352`}
                        className={
                          evaluation.totalScore >= 80
                            ? "text-success"
                            : evaluation.totalScore >= 60
                            ? "text-medium"
                            : "text-hard"
                        }
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">
                        {evaluation.totalScore}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Structure", value: evaluation.breakdown.structure, max: 25 },
                    { label: "Analysis", value: evaluation.breakdown.analysis, max: 25 },
                    { label: "Quantitative", value: evaluation.breakdown.quantitative, max: 25 },
                    { label: "Business Insight", value: evaluation.breakdown.businessInsight, max: 25 },
                  ].map((item) => (
                    <div key={item.label} className="bg-secondary rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {item.value}/{item.max}
                      </div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Feedback */}
                <div className="mb-6 p-4 bg-secondary rounded-lg">
                  <p className="text-foreground">{evaluation.feedback}</p>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {evaluation.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-medium/10 rounded-lg border border-medium/20">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-medium" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {evaluation.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <RetryFailedDialog
        open={retryFailedDialog.open}
        onClose={() => setRetryFailedDialog({ open: false, title: "", description: "" })}
        title={retryFailedDialog.title}
        description={retryFailedDialog.description}
      />
    </div>
  );
}