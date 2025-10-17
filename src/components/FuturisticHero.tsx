"use client";
import { useState, useEffect, useRef } from "react";

interface FuturisticHeroProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  onStartDemo: () => void;
}

export default function FuturisticHero({
  isListening,
  isSpeaking,
  isProcessing,
  onStartDemo,
}: FuturisticHeroProps) {
  const [voiceWaves, setVoiceWaves] = useState<
    Array<{ id: number; size: number; opacity: number; delay: number }>
  >([]);
  const animationRef = useRef<number | undefined>(undefined);

  // Generate voice waves animation
  useEffect(() => {
    if (isSpeaking) {
      const generateWave = () => {
        const newWave = {
          id: Date.now() + Math.random(),
          size: Math.random() * 100 + 50,
          opacity: Math.random() * 0.8 + 0.2,
          delay: Math.random() * 0.5,
        };
        setVoiceWaves((prev) => [...prev.slice(-4), newWave]);
      };

      const interval = setInterval(generateWave, 200);
      return () => clearInterval(interval);
    } else {
      setVoiceWaves([]);
    }
  }, [isSpeaking]);

  // Animate voice waves
  useEffect(() => {
    const animate = () => {
      setVoiceWaves((prev) =>
        prev
          .map((wave) => ({
            ...wave,
            size: wave.size + 2,
            opacity: Math.max(0, wave.opacity - 0.02),
          }))
          .filter((wave) => wave.opacity > 0)
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isSpeaking) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpeaking]);

  const getStatusText = () => {
    if (isListening) return "LISTENING...";
    if (isProcessing) return "PROCESSING...";
    if (isSpeaking) return "SPEAKING...";
    return "READY";
  };

  const getStatusColor = () => {
    if (isListening) return "text-cyan-400";
    if (isProcessing) return "text-yellow-400";
    if (isSpeaking) return "text-blue-400";
    return "text-gray-400";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900" />

        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1000 1000">
            <defs>
              <pattern
                id="circuit"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M20 20 L40 20 L40 40 L60 40 L60 20 L80 20"
                  stroke="#00ffff"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.3"
                />
                <path
                  d="M20 60 L40 60 L40 80 L60 80 L60 60 L80 60"
                  stroke="#8b5cf6"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.3"
                />
                <circle cx="40" cy="40" r="1" fill="#00ffff" opacity="0.5" />
                <circle cx="60" cy="60" r="1" fill="#8b5cf6" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>

        {/* Holographic grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 grid-rows-12 h-full">
            {Array.from({ length: 144 }, (_, i) => (
              <div
                key={i}
                className="border border-cyan-400/20 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Ambient glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Hero Text */}
        <div className="text-center mb-16 max-w-4xl">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Your Futuristic
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              AI Assistant
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light max-w-3xl mx-auto leading-relaxed">
            Experience the future of voice interaction with our advanced AI
            companion. Seamlessly communicate through cutting-edge technology.
          </p>

          {/* Status Display */}
          <div className="mb-12">
            <div
              className={`text-3xl font-mono font-bold ${getStatusColor()} mb-4 animate-pulse`}
            >
              {getStatusText()}
            </div>
            <div className="flex justify-center space-x-4">
              <div
                className={`w-4 h-4 rounded-full ${
                  isListening ? "bg-cyan-400 animate-pulse" : "bg-gray-600"
                }`}
              />
              <div
                className={`w-4 h-4 rounded-full ${
                  isProcessing ? "bg-yellow-400 animate-pulse" : "bg-gray-600"
                }`}
              />
              <div
                className={`w-4 h-4 rounded-full ${
                  isSpeaking ? "bg-blue-400 animate-pulse" : "bg-gray-600"
                }`}
              />
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onStartDemo}
            disabled={isProcessing}
            className="group relative px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-cyan-500/25 border-2 border-cyan-400"
          >
            <span className="relative z-10">Try Voice Demo</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 animate-pulse opacity-75" />
          </button>
        </div>

        {/* Giant Robot */}
        <div className="relative">
          {/* Robot Head */}
          <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px]">
            {/* Robot Head Container */}
            <div
              className={`relative w-full h-full rounded-full border-4 transition-all duration-500 ${
                isSpeaking
                  ? "border-blue-400 shadow-2xl shadow-blue-400/50"
                  : isListening
                  ? "border-cyan-400 shadow-2xl shadow-cyan-400/50"
                  : isProcessing
                  ? "border-yellow-400 shadow-2xl shadow-yellow-400/50"
                  : "border-gray-400 shadow-xl shadow-gray-400/30"
              }`}
              style={{
                background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
                boxShadow: `0 0 50px ${
                  isSpeaking
                    ? "#3b82f6"
                    : isListening
                    ? "#06b6d4"
                    : isProcessing
                    ? "#f59e0b"
                    : "#6b7280"
                }40, inset 0 0 30px rgba(255,255,255,0.1)`,
              }}
            >
              {/* Metallic texture overlay */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300/20 via-transparent to-gray-600/20" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
              </div>

              {/* Circuit patterns */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
                  <path
                    d="M20 20 L40 20 L40 40 L60 40 L60 20 L80 20"
                    stroke={
                      isSpeaking
                        ? "#3b82f6"
                        : isListening
                        ? "#06b6d4"
                        : "#8b5cf6"
                    }
                    strokeWidth="0.5"
                    fill="none"
                    className="animate-pulse"
                  />
                  <path
                    d="M20 60 L40 60 L40 80 L60 80 L60 60 L80 60"
                    stroke={
                      isSpeaking
                        ? "#3b82f6"
                        : isListening
                        ? "#06b6d4"
                        : "#8b5cf6"
                    }
                    strokeWidth="0.5"
                    fill="none"
                    className="animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="2"
                    fill={
                      isSpeaking
                        ? "#3b82f6"
                        : isListening
                        ? "#06b6d4"
                        : "#8b5cf6"
                    }
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="2"
                    fill={
                      isSpeaking
                        ? "#3b82f6"
                        : isListening
                        ? "#06b6d4"
                        : "#8b5cf6"
                    }
                  />
                </svg>
              </div>

              {/* Eyes */}
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-8">
                <div
                  className="w-12 h-12 rounded-full border-3 transition-all duration-300"
                  style={{
                    backgroundColor: isSpeaking
                      ? "#3b82f6"
                      : isListening
                      ? "#06b6d4"
                      : isProcessing
                      ? "#f59e0b"
                      : "#6b7280",
                    borderColor: isSpeaking
                      ? "#3b82f6"
                      : isListening
                      ? "#06b6d4"
                      : isProcessing
                      ? "#f59e0b"
                      : "#6b7280",
                    boxShadow: `0 0 30px ${
                      isSpeaking
                        ? "#3b82f6"
                        : isListening
                        ? "#06b6d4"
                        : isProcessing
                        ? "#f59e0b"
                        : "#6b7280"
                    }`,
                  }}
                >
                  <div className="w-4 h-4 bg-white rounded-full absolute top-2 left-2 animate-pulse" />
                </div>
                <div
                  className="w-12 h-12 rounded-full border-3 transition-all duration-300"
                  style={{
                    backgroundColor: isSpeaking
                      ? "#3b82f6"
                      : isListening
                      ? "#06b6d4"
                      : isProcessing
                      ? "#f59e0b"
                      : "#6b7280",
                    borderColor: isSpeaking
                      ? "#3b82f6"
                      : isListening
                      ? "#06b6d4"
                      : isProcessing
                      ? "#f59e0b"
                      : "#6b7280",
                    boxShadow: `0 0 30px ${
                      isSpeaking
                        ? "#3b82f6"
                        : isListening
                        ? "#06b6d4"
                        : isProcessing
                        ? "#f59e0b"
                        : "#6b7280"
                    }`,
                  }}
                >
                  <div className="w-4 h-4 bg-white rounded-full absolute top-2 left-2 animate-pulse" />
                </div>
              </div>

              {/* Mouth */}
              <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div
                  className="w-16 h-8 rounded-full border-3 transition-all duration-300"
                  style={{
                    backgroundColor: isSpeaking
                      ? isSpeaking
                        ? "#3b82f6"
                        : "#6b7280"
                      : "transparent",
                    borderColor: isSpeaking
                      ? "#3b82f6"
                      : isListening
                      ? "#06b6d4"
                      : isProcessing
                      ? "#f59e0b"
                      : "#6b7280",
                    boxShadow: isSpeaking ? `0 0 30px #3b82f6` : "none",
                    transform: isSpeaking ? "scaleY(1.2)" : "scaleY(1)",
                  }}
                >
                  {isSpeaking && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              </div>

              {/* Antenna */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div
                  className="w-2 h-12 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isSpeaking
                      ? "#3b82f6"
                      : isListening
                      ? "#06b6d4"
                      : isProcessing
                      ? "#f59e0b"
                      : "#6b7280",
                    boxShadow: `0 0 20px ${
                      isSpeaking
                        ? "#3b82f6"
                        : isListening
                        ? "#06b6d4"
                        : isProcessing
                        ? "#f59e0b"
                        : "#6b7280"
                    }`,
                  }}
                />
                <div
                  className="w-4 h-4 rounded-full absolute -top-2 left-1/2 transform -translate-x-1/2 transition-all duration-300"
                  style={{
                    backgroundColor: isSpeaking
                      ? "#3b82f6"
                      : isListening
                      ? "#06b6d4"
                      : isProcessing
                      ? "#f59e0b"
                      : "#6b7280",
                    boxShadow: `0 0 30px ${
                      isSpeaking
                        ? "#3b82f6"
                        : isListening
                        ? "#06b6d4"
                        : isProcessing
                        ? "#f59e0b"
                        : "#6b7280"
                    }`,
                    animation:
                      isSpeaking || isListening || isProcessing
                        ? "pulse 1s infinite"
                        : "none",
                  }}
                />
              </div>

              {/* Status ring */}
              <div
                className="absolute inset-0 rounded-full border-4 transition-all duration-500"
                style={{
                  borderColor: isSpeaking
                    ? "#3b82f6"
                    : isListening
                    ? "#06b6d4"
                    : isProcessing
                    ? "#f59e0b"
                    : "#6b7280",
                  boxShadow: `0 0 40px ${
                    isSpeaking
                      ? "#3b82f6"
                      : isListening
                      ? "#06b6d4"
                      : isProcessing
                      ? "#f59e0b"
                      : "#6b7280"
                  }40`,
                  animation:
                    isSpeaking || isListening || isProcessing
                      ? "spin 3s linear infinite"
                      : "none",
                }}
              />
            </div>

            {/* Voice Waves */}
            {isSpeaking &&
              voiceWaves.map((wave) => (
                <div
                  key={wave.id}
                  className="absolute inset-0 rounded-full border-2 border-blue-400 animate-pulse"
                  style={{
                    width: `${wave.size}%`,
                    height: `${wave.size}%`,
                    left: `${(100 - wave.size) / 2}%`,
                    top: `${(100 - wave.size) / 2}%`,
                    opacity: wave.opacity,
                    animationDelay: `${wave.delay}s`,
                    animationDuration: "2s",
                  }}
                />
              ))}

            {/* Scanning line */}
            {(isSpeaking || isListening || isProcessing) && (
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div
                  className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  style={{
                    animation: "scan 2s linear infinite",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              </div>
            )}
          </div>

          {/* Holographic UI Elements */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-cyan-400/50 shadow-xl">
              <div className="text-cyan-400 font-mono text-sm">
                AI_STATUS: {getStatusText()}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-purple-400/50 shadow-xl">
              <div className="text-purple-400 font-mono text-sm">
                VOICE_MODULE: ACTIVE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-50%) translateX(-100%);
          }
          100% {
            transform: translateY(-50%) translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

