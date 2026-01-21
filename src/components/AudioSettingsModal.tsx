import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Settings, Mic, Volume2, CheckCircle, AlertCircle } from "lucide-react";

interface AudioDevice {
  deviceId: string;
  label: string;
}

interface AudioSettingsModalProps {
  selectedMicId: string;
  onMicChange: (deviceId: string) => void;
}

export function AudioSettingsModal({
  selectedMicId,
  onMicChange,
}: AudioSettingsModalProps) {
  const [open, setOpen] = useState(false);
  const [microphones, setMicrophones] = useState<AudioDevice[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [testLevel, setTestLevel] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState<
    "granted" | "denied" | "prompt" | "unknown"
  >("unknown");

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  // Check permission status
  const checkPermission = useCallback(async () => {
    try {
      if (navigator.permissions) {
        const result = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });
        setPermissionStatus(result.state as "granted" | "denied" | "prompt");
        result.onchange = () => {
          setPermissionStatus(result.state as "granted" | "denied" | "prompt");
        };
      }
    } catch {
      setPermissionStatus("unknown");
    }
  }, []);

  // Load available microphones
  const loadMicrophones = useCallback(async () => {
    try {
      // Request permission first to get device labels
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices
        .filter((d) => d.kind === "audioinput")
        .map((d) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${d.deviceId.slice(0, 8)}`,
        }));

      setMicrophones(mics);
      setPermissionStatus("granted");

      // If no mic selected yet, pick the default
      if (!selectedMicId && mics.length > 0) {
        onMicChange(mics[0].deviceId);
      }
    } catch (err: any) {
      console.error("Error loading microphones:", err);
      if (err.name === "NotAllowedError") {
        setPermissionStatus("denied");
      }
    }
  }, [selectedMicId, onMicChange]);

  useEffect(() => {
    if (open) {
      checkPermission();
      loadMicrophones();
    }
    return () => {
      stopTest();
    };
  }, [open, checkPermission, loadMicrophones]);

  const startTest = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: selectedMicId
          ? { deviceId: { exact: selectedMicId } }
          : true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const AudioContextAPI =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioContext: AudioContext = new AudioContextAPI();
      audioContextRef.current = audioContext;

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsTesting(true);

      const timeData = new Uint8Array(analyser.fftSize);

      const updateLevel = () => {
        const a = analyserRef.current;
        if (!a) return;

        a.getByteTimeDomainData(timeData);

        let sumSquares = 0;
        for (let i = 0; i < timeData.length; i++) {
          const v = (timeData[i] - 128) / 128;
          sumSquares += v * v;
        }
        const rms = Math.sqrt(sumSquares / timeData.length);
        const level = Math.min(1, rms * 6);

        setTestLevel(level);
        animationRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.error("Error starting mic test:", err);
      setPermissionStatus("denied");
    }
  };

  const stopTest = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }

    analyserRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => undefined);
      audioContextRef.current = null;
    }

    setIsTesting(false);
    setTestLevel(0);
  };

  const handleMicChange = (deviceId: string) => {
    onMicChange(deviceId);
    if (isTesting) {
      stopTest();
      // Restart test with new mic after a brief delay
      setTimeout(() => startTest(), 100);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Audio Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Permission Status */}
          <div className="flex items-center gap-2 text-sm">
            {permissionStatus === "granted" ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">
                  Microphone access granted
                </span>
              </>
            ) : permissionStatus === "denied" ? (
              <>
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-destructive">
                  Microphone access blocked. Please allow in browser settings.
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-warning" />
                <span className="text-muted-foreground">
                  Click "Test Microphone" to grant access
                </span>
              </>
            )}
          </div>

          {/* Microphone Selection */}
          <div className="space-y-2">
            <Label htmlFor="mic-select" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Input Device
            </Label>
            <Select
              value={selectedMicId}
              onValueChange={handleMicChange}
              disabled={microphones.length === 0}
            >
              <SelectTrigger id="mic-select">
                <SelectValue placeholder="Select microphone" />
              </SelectTrigger>
              <SelectContent>
                {microphones.map((mic) => (
                  <SelectItem key={mic.deviceId} value={mic.deviceId}>
                    {mic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Microphone Test */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Test Microphone
            </Label>

            <div className="flex items-center gap-4">
              <Button
                variant={isTesting ? "destructive" : "outline"}
                onClick={isTesting ? stopTest : startTest}
                className="min-w-[140px]"
              >
                {isTesting ? "Stop Test" : "Test Microphone"}
              </Button>

              {/* Level Meter */}
              <div className="flex-1 h-6 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-75"
                  style={{ width: `${testLevel * 100}%` }}
                />
              </div>
            </div>

            {isTesting && (
              <p className="text-sm text-muted-foreground">
                Speak into your microphone—you should see the meter move.
              </p>
            )}
          </div>

          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={loadMicrophones}
            className="w-full"
          >
            Refresh Device List
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
