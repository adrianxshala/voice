"use client";
import { useState, useEffect, useRef } from "react";

interface ModernAIProps {
  isSpeaking: boolean;
  isProcessing: boolean;
  onStartDemo: () => void;
}

export default function ModernAI({
  isSpeaking,
  isProcessing,
  onStartDemo,
}: ModernAIProps) {
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
          size: Math.random() * 80 + 60,
          opacity: Math.random() * 0.6 + 0.3,
          delay: Math.random() * 0.3,
        };
        setVoiceWaves((prev) => [...prev.slice(-3), newWave]);
      };

      const interval = setInterval(generateWave, 300);
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
            size: wave.size + 1.5,
            opacity: Math.max(0, wave.opacity - 0.015),
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
    if (isProcessing) return "Processing...";
    if (isSpeaking) return "Speaking...";
    return "Ready";
  };

  const getStatusColor = () => {
    if (isProcessing) return "text-blue-400";
    if (isSpeaking) return "text-emerald-400";
    return "text-gray-400";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900">
      {/* Liquid Glass Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800" />

        {/* Liquid glass orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-20 grid-rows-20 h-full">
            {Array.from({ length: 400 }, (_, i) => (
              <div
                key={i}
                className="border border-white/10 animate-pulse"
                style={{ animationDelay: `${i * 0.01}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              AI Voice
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Assistant
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 font-light max-w-3xl mx-auto leading-relaxed">
            Experience the future of AI communication with our advanced voice
            technology. Professional, intelligent, and always ready to assist.
          </p>

          {/* Status Display */}
          <div className="mb-12">
            <div className={`text-2xl font-light ${getStatusColor()} mb-4`}>
              {getStatusText()}
            </div>
            <div className="flex justify-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  isProcessing ? "bg-blue-400 animate-pulse" : "bg-gray-600"
                }`}
              />
              <div
                className={`w-3 h-3 rounded-full ${
                  isSpeaking ? "bg-emerald-400 animate-pulse" : "bg-gray-600"
                }`}
              />
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onStartDemo}
            disabled={isProcessing}
            className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-blue-500/25 backdrop-blur-sm border border-white/10"
          >
            <span className="relative z-10">Start AI Demo</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Modern AI Robot */}
        <div className="relative">
          {/* Robot Container */}
          <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
            {/* Main Robot Body */}
            <div
              className={`relative w-full h-full rounded-3xl border-2 transition-all duration-500 backdrop-blur-sm ${
                isSpeaking
                  ? "border-emerald-400/50 shadow-2xl shadow-emerald-400/20"
                  : isProcessing
                  ? "border-blue-400/50 shadow-2xl shadow-blue-400/20"
                  : "border-gray-600/30 shadow-xl shadow-gray-600/10"
              }`}
              style={{
                background: `linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(50, 50, 50, 0.6) 50%, rgba(30, 30, 30, 0.8) 100%)`,
                backdropFilter: "blur(20px)",
                boxShadow: `0 0 40px ${
                  isSpeaking
                    ? "rgba(16, 185, 129, 0.3)"
                    : isProcessing
                    ? "rgba(59, 130, 246, 0.3)"
                    : "rgba(75, 85, 99, 0.2)"
                }, inset 0 0 20px rgba(255,255,255,0.05)`,
              }}
            >
              {/* Glass reflection overlay */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
              </div>

              {/* Circuit patterns */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
                  <path
                    d="M20 20 L40 20 L40 40 L60 40 L60 20 L80 20"
                    stroke={
                      isSpeaking
                        ? "#10b981"
                        : isProcessing
                        ? "#3b82f6"
                        : "#6b7280"
                    }
                    strokeWidth="0.3"
                    fill="none"
                    className="animate-pulse"
                  />
                  <path
                    d="M20 60 L40 60 L40 80 L60 80 L60 60 L80 60"
                    stroke={
                      isSpeaking
                        ? "#10b981"
                        : isProcessing
                        ? "#3b82f6"
                        : "#6b7280"
                    }
                    strokeWidth="0.3"
                    fill="none"
                    className="animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="1"
                    fill={
                      isSpeaking
                        ? "#10b981"
                        : isProcessing
                        ? "#3b82f6"
                        : "#6b7280"
                    }
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="1"
                    fill={
                      isSpeaking
                        ? "#10b981"
                        : isProcessing
                        ? "#3b82f6"
                        : "#6b7280"
                    }
                  />
                </svg>
              </div>

              {/* Eyes */}
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-6">
                <div
                  className="w-8 h-8 rounded-full border-2 transition-all duration-300 backdrop-blur-sm"
                  style={{
                    backgroundColor: isSpeaking
                      ? "rgba(16, 185, 129, 0.3)"
                      : isProcessing
                      ? "rgba(59, 130, 246, 0.3)"
                      : "rgba(75, 85, 99, 0.3)",
                    borderColor: isSpeaking
                      ? "#10b981"
                      : isProcessing
                      ? "#3b82f6"
                      : "#6b7280",
                    boxShadow: `0 0 20px ${
                      isSpeaking
                        ? "#10b981"
                        : isProcessing
                        ? "#3b82f6"
                        : "#6b7280"
                    }`,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1.5 left-1.5 animate-pulse" />
                </div>
                <div
                  className="w-8 h-8 rounded-full border-2 transition-all duration-300 backdrop-blur-sm"
                  style={{
                    backgroundColor: isSpeaking
                      ? "rgba(16, 185, 129, 0.3)"
                      : isProcessing
                      ? "rgba(59, 130, 246, 0.3)"
                      : "rgba(75, 85, 99, 0.3)",
                    borderColor: isSpeaking
                      ? "#10b981"
                      : isProcessing
                      ? "#3b82f6"
                      : "#6b7280",
                    boxShadow: `0 0 20px ${
                      isSpeaking
                        ? "#10b981"
                        : isProcessing
                        ? "#3b82f6"
                        : "#6b7280"
                    }`,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="w-2 h-2 bg-white rounded-full absolute top-1.5 left-1.5 animate-pulse" />
                </div>
              </div>

              {/* Mouth */}
              <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div
                  className="w-12 h-6 rounded-full border-2 transition-all duration-300 backdrop-blur-sm"
                  style={{
                    backgroundColor: isSpeaking
                      ? "rgba(16, 185, 129, 0.4)"
                      : "transparent",
                    borderColor: isSpeaking
                      ? "#10b981"
                      : isProcessing
                      ? "#3b82f6"
                      : "#6b7280",
                    boxShadow: isSpeaking ? `0 0 20px #10b981` : "none",
                    transform: isSpeaking ? "scaleY(1.1)" : "scaleY(1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {isSpeaking && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              </div>

              {/* Antenna */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div
                  className="w-1 h-8 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isSpeaking
                      ? "#10b981"
                      : isProcessing
                      ? "#3b82f6"
                      : "#6b7280",
                    boxShadow: `0 0 15px ${
                      isSpeaking
                        ? "#10b981"
                        : isProcessing
                        ? "#3b82f6"
                        : "#6b7280"
                    }`,
                  }}
                />
                <div
                  className="w-3 h-3 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2 transition-all duration-300"
                  style={{
                    backgroundColor: isSpeaking
                      ? "#10b981"
                      : isProcessing
                      ? "#3b82f6"
                      : "#6b7280",
                    boxShadow: `0 0 20px ${
                      isSpeaking
                        ? "#10b981"
                        : isProcessing
                        ? "#3b82f6"
                        : "#6b7280"
                    }`,
                    animation:
                      isSpeaking || isProcessing
                        ? "pulse 1.5s infinite"
                        : "none",
                  }}
                />
              </div>

              {/* Status ring */}
              <div
                className="absolute inset-0 rounded-3xl border-2 transition-all duration-500"
                style={{
                  borderColor: isSpeaking
                    ? "#10b981"
                    : isProcessing
                    ? "#3b82f6"
                    : "#6b7280",
                  boxShadow: `0 0 30px ${
                    isSpeaking
                      ? "#10b981"
                      : isProcessing
                      ? "#3b82f6"
                      : "#6b7280"
                  }30`,
                  animation:
                    isSpeaking || isProcessing
                      ? "spin 4s linear infinite"
                      : "none",
                }}
              />
            </div>

            {/* Voice Waves */}
            {isSpeaking &&
              voiceWaves.map((wave) => (
                <div
                  key={wave.id}
                  className="absolute inset-0 rounded-3xl border border-emerald-400/30 animate-pulse backdrop-blur-sm"
                  style={{
                    width: `${wave.size}%`,
                    height: `${wave.size}%`,
                    left: `${(100 - wave.size) / 2}%`,
                    top: `${(100 - wave.size) / 2}%`,
                    opacity: wave.opacity,
                    animationDelay: `${wave.delay}s`,
                    animationDuration: "3s",
                    backdropFilter: "blur(5px)",
                  }}
                />
              ))}

            {/* Scanning line */}
            {(isSpeaking || isProcessing) && (
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div
                  className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                  style={{
                    animation: "scan 3s linear infinite",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              </div>
            )}
          </div>

          {/* Status Panels */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50 shadow-xl">
              <div className="text-emerald-400 font-mono text-sm">
                AI_STATUS: {getStatusText()}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50 shadow-xl">
              <div className="text-blue-400 font-mono text-sm">
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

