"use client";
import { useEffect, useRef, useState, useCallback } from "react";

interface AudioVisualizerProps {
  isActive: boolean;
  className?: string;
}

export default function AudioVisualizer({
  isActive,
  className = "",
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [microphone, setMicrophone] =
    useState<MediaStreamAudioSourceNode | null>(null);

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (microphone) {
      microphone.disconnect();
    }
    if (audioContext) {
      audioContext.close();
    }
    setAudioContext(null);
    setMicrophone(null);
  }, [microphone, audioContext]);

  const initializeAudioVisualization = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitAudioContext)();
      const analyserNode = audioCtx.createAnalyser();
      const microphoneNode = audioCtx.createMediaStreamSource(stream);

      analyserNode.fftSize = 256;
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArrayBuffer = new Uint8Array(bufferLength);

      microphoneNode.connect(analyserNode);

      setAudioContext(audioCtx);
      setMicrophone(microphoneNode);

      // Start drawing animation
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const drawFrame = () => {
            if (!isActive) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (analyserNode && dataArrayBuffer) {
              analyserNode.getByteFrequencyData(dataArrayBuffer);

              const barWidth = canvas.width / dataArrayBuffer.length;
              let x = 0;

              for (let i = 0; i < dataArrayBuffer.length; i++) {
                const barHeight = (dataArrayBuffer[i] / 255) * canvas.height;

                // Create gradient
                const gradient = ctx.createLinearGradient(
                  0,
                  canvas.height,
                  0,
                  canvas.height - barHeight
                );
                gradient.addColorStop(0, "#3b82f6");
                gradient.addColorStop(0.5, "#8b5cf6");
                gradient.addColorStop(1, "#06b6d4");

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
              }
            }

            animationRef.current = requestAnimationFrame(drawFrame);
          };

          drawFrame();
        }
      }
    } catch (error) {
      console.warn("Could not initialize audio visualization:", error);
      // Fallback to animated bars without real audio data
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const drawFrame = () => {
            if (!isActive) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barCount = 20;
            const barWidth = canvas.width / barCount;

            for (let i = 0; i < barCount; i++) {
              const barHeight =
                Math.random() * canvas.height * 0.8 + canvas.height * 0.1;

              // Create gradient
              const gradient = ctx.createLinearGradient(
                0,
                canvas.height,
                0,
                canvas.height - barHeight
              );
              gradient.addColorStop(0, "#3b82f6");
              gradient.addColorStop(0.5, "#8b5cf6");
              gradient.addColorStop(1, "#06b6d4");

              ctx.fillStyle = gradient;
              ctx.fillRect(
                i * barWidth,
                canvas.height - barHeight,
                barWidth - 2,
                barHeight
              );
            }

            animationRef.current = requestAnimationFrame(drawFrame);
          };

          drawFrame();
        }
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      initializeAudioVisualization();
    } else {
      cleanup();
    }

    return () => cleanup();
  }, [isActive, initializeAudioVisualization, cleanup]);

  return (
    <div className={`w-full h-16 ${className}`}>
      <canvas
        ref={canvasRef}
        width={300}
        height={64}
        className="w-full h-full rounded-lg bg-slate-800/50 border border-slate-600/30"
      />
    </div>
  );
}
