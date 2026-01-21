import { useEffect, useRef, useState } from "react";

interface MicLevelIndicatorProps {
  isRecording: boolean;
  selectedMicId?: string;
  onError?: (message: string) => void;
}

export function MicLevelIndicator({ isRecording, selectedMicId, onError }: MicLevelIndicatorProps) {
  const [levels, setLevels] = useState<number[]>([0, 0, 0, 0, 0]);

  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const cleanup = () => {
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
        // Close the context to release hardware on Safari/iOS
        audioContextRef.current.close().catch(() => undefined);
        audioContextRef.current = null;
      }

      setLevels([0, 0, 0, 0, 0]);
    };

    if (!isRecording) {
      cleanup();
      return;
    }

    const startAnalysis = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          onError?.("Microphone access is not available in this browser.");
          return;
        }

        const constraints: MediaStreamConstraints = {
          audio: selectedMicId
            ? { deviceId: { exact: selectedMicId } }
            : {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        const AudioContextAPI = (window as any).AudioContext || (window as any).webkitAudioContext;
        const audioContext: AudioContext = new AudioContextAPI();
        audioContextRef.current = audioContext;

        // Some browsers start in a suspended state until resumed
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);
        analyserRef.current = analyser;

        const timeData = new Uint8Array(analyser.fftSize);

        const updateLevels = () => {
          const a = analyserRef.current;
          if (!a) return;

          a.getByteTimeDomainData(timeData);

          // RMS level (0..~1). This is a stable "mic level" compared to frequency bins.
          let sumSquares = 0;
          for (let i = 0; i < timeData.length; i++) {
            const v = (timeData[i] - 128) / 128;
            sumSquares += v * v;
          }
          const rms = Math.sqrt(sumSquares / timeData.length);

          // Boost quiet speech a bit so it feels responsive.
          const level = Math.min(1, rms * 6);

          // 5 bars with slight variation for a nicer animation feel.
          const multipliers = [0.65, 0.85, 1.0, 0.85, 0.65];
          const next = multipliers.map((m) => Math.min(1, level * m));
          setLevels(next);

          animationRef.current = requestAnimationFrame(updateLevels);
        };

        updateLevels();
      } catch (err: any) {
        console.error("MicLevelIndicator getUserMedia/audio error:", err);
        const message =
          err?.name === "NotAllowedError"
            ? "Microphone permission is blocked. Allow mic access and try again."
            : "Could not access the microphone for the level indicator.";
        onError?.(message);
      }
    };

    startAnalysis();

    return cleanup;
  }, [isRecording, selectedMicId, onError]);

  if (!isRecording) return null;

  return (
    <div className="flex items-end gap-1 h-6" aria-label="Microphone input level">
      {levels.map((level, index) => (
        <div
          key={index}
          className="w-1.5 bg-primary rounded-full transition-all duration-75"
          style={{
            height: `${Math.max(3, Math.round(level * 24))}px`,
            opacity: Math.max(0.35, level),
          }}
        />
      ))}
    </div>
  );
}

