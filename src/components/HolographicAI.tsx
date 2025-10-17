"use client";
import { useState, useEffect, useRef } from "react";

interface HolographicAIProps {
  isSpeaking: boolean;
  isProcessing: boolean;
  onStartDemo: () => void;
}

export default function HolographicAI({
  isSpeaking,
  isProcessing,
  onStartDemo,
}: HolographicAIProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      opacity: number;
      velocity: { x: number; y: number };
    }>
  >([]);
  const [waveRings, setWaveRings] = useState<
    Array<{ id: number; radius: number; opacity: number; thickness: number }>
  >([]);
  const animationRef = useRef<number | undefined>(undefined);
  const particleRef = useRef<number | undefined>(undefined);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        velocity: {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5,
        },
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            opacity: Math.sin(Date.now() * 0.001 + particle.id) * 0.3 + 0.4,
          }))
          .filter(
            (particle) =>
              particle.x > -50 &&
              particle.x < window.innerWidth + 50 &&
              particle.y > -50 &&
              particle.y < window.innerHeight + 50
          )
      );
      particleRef.current = requestAnimationFrame(animateParticles);
    };

    animateParticles();
    return () => {
      if (particleRef.current) {
        cancelAnimationFrame(particleRef.current);
      }
    };
  }, []);

  // Generate waveform rings
  useEffect(() => {
    if (isSpeaking) {
      const generateRing = () => {
        const newRing = {
          id: Date.now() + Math.random(),
          radius: 50,
          opacity: 0.8,
          thickness: 2,
        };
        setWaveRings((prev) => [...prev.slice(-5), newRing]);
      };

      const interval = setInterval(generateRing, 200);
      return () => clearInterval(interval);
    } else {
      setWaveRings([]);
    }
  }, [isSpeaking]);

  // Animate waveform rings
  useEffect(() => {
    const animateRings = () => {
      setWaveRings((prev) =>
        prev
          .map((ring) => ({
            ...ring,
            radius: ring.radius + 3,
            opacity: Math.max(0, ring.opacity - 0.02),
            thickness: Math.max(0, ring.thickness - 0.1),
          }))
          .filter((ring) => ring.opacity > 0)
      );
      animationRef.current = requestAnimationFrame(animateRings);
    };

    if (isSpeaking) {
      animateRings();
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
    if (isProcessing) return "text-purple-400";
    if (isSpeaking) return "text-cyan-400";
    return "text-gray-400";
  };

  const getGlowColor = () => {
    if (isSpeaking) return "shadow-2xl shadow-cyan-400/50";
    if (isProcessing) return "shadow-2xl shadow-purple-400/50";
    return "shadow-2xl shadow-blue-400/30";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Volumetric Lighting Background */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-purple-900" />

        {/* Volumetric light rays */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-cyan-400/50 via-transparent to-transparent animate-pulse" />
          <div
            className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-purple-400/50 via-transparent to-transparent animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-blue-400/30 via-transparent to-transparent animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Ambient volumetric lighting */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-500/15 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-cyan-400 animate-pulse"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px cyan`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light mb-8 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Holographic
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              AI Assistant
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light max-w-3xl mx-auto leading-relaxed">
            Experience the future of AI communication with our holographic voice
            technology. Interact with consciousness through light and sound.
          </p>

          {/* Status Display */}
          <div className="mb-12">
            <div
              className={`text-3xl font-light ${getStatusColor()} mb-4 animate-pulse`}
            >
              {getStatusText()}
            </div>
            <div className="flex justify-center space-x-4">
              <div
                className={`w-4 h-4 rounded-full ${
                  isProcessing ? "bg-purple-400 animate-pulse" : "bg-gray-600"
                }`}
              />
              <div
                className={`w-4 h-4 rounded-full ${
                  isSpeaking ? "bg-cyan-400 animate-pulse" : "bg-gray-600"
                }`}
              />
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onStartDemo}
            disabled={isProcessing}
            className="group relative px-12 py-6 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-medium text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-cyan-500/25 backdrop-blur-sm border border-cyan-400/50"
          >
            <span className="relative z-10">Activate Holographic AI</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-600 to-purple-600 animate-pulse opacity-75" />
          </button>
        </div>

        {/* Holographic AI Sphere */}
        <div className="relative">
          {/* Main Holographic Sphere */}
          <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px]">
            {/* Outer glow ring */}
            <div
              className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${getGlowColor()}`}
              style={{
                borderColor: isSpeaking
                  ? "#06b6d4"
                  : isProcessing
                  ? "#8b5cf6"
                  : "#3b82f6",
                animation:
                  isSpeaking || isProcessing
                    ? "spin 8s linear infinite"
                    : "none",
              }}
            />

            {/* Holographic sphere container */}
            <div
              className={`relative w-full h-full rounded-full border-2 transition-all duration-500 backdrop-blur-sm ${
                isSpeaking
                  ? "border-cyan-400/70 shadow-2xl shadow-cyan-400/30"
                  : isProcessing
                  ? "border-purple-400/70 shadow-2xl shadow-purple-400/30"
                  : "border-blue-400/50 shadow-xl shadow-blue-400/20"
              }`}
              style={{
                background: `radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, rgba(0, 0, 0, 0.8) 100%)`,
                backdropFilter: "blur(20px)",
                boxShadow: `0 0 60px ${
                  isSpeaking
                    ? "rgba(6, 182, 212, 0.4)"
                    : isProcessing
                    ? "rgba(139, 92, 246, 0.4)"
                    : "rgba(59, 130, 246, 0.3)"
                }, inset 0 0 30px rgba(255,255,255,0.1)`,
              }}
            >
              {/* Holographic texture overlay */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-purple-400/20" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />

                {/* Holographic scan lines */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div
                    className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    style={{
                      animation: "scan 2s linear infinite",
                      top: "30%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <div
                    className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                    style={{
                      animation: "scan 2s linear infinite",
                      top: "70%",
                      transform: "translateY(-50%)",
                      animationDelay: "1s",
                    }}
                  />
                </div>
              </div>

              {/* Neural network pattern */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
                  <defs>
                    <radialGradient
                      id="neuralGradient"
                      cx="50%"
                      cy="50%"
                      r="50%"
                    >
                      <stop
                        offset="0%"
                        stopColor={
                          isSpeaking
                            ? "#06b6d4"
                            : isProcessing
                            ? "#8b5cf6"
                            : "#3b82f6"
                        }
                        stopOpacity="0.8"
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          isSpeaking
                            ? "#06b6d4"
                            : isProcessing
                            ? "#8b5cf6"
                            : "#3b82f6"
                        }
                        stopOpacity="0.2"
                      />
                    </radialGradient>
                  </defs>
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="url(#neuralGradient)"
                    className="animate-pulse"
                  />
                  <path
                    d="M20 20 L40 20 L40 40 L60 40 L60 20 L80 20"
                    stroke={
                      isSpeaking
                        ? "#06b6d4"
                        : isProcessing
                        ? "#8b5cf6"
                        : "#3b82f6"
                    }
                    strokeWidth="0.5"
                    fill="none"
                    className="animate-pulse"
                  />
                  <path
                    d="M20 60 L40 60 L40 80 L60 80 L60 60 L80 60"
                    stroke={
                      isSpeaking
                        ? "#06b6d4"
                        : isProcessing
                        ? "#8b5cf6"
                        : "#3b82f6"
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
                        ? "#06b6d4"
                        : isProcessing
                        ? "#8b5cf6"
                        : "#3b82f6"
                    }
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="2"
                    fill={
                      isSpeaking
                        ? "#06b6d4"
                        : isProcessing
                        ? "#8b5cf6"
                        : "#3b82f6"
                    }
                  />
                </svg>
              </div>

              {/* Central AI Core */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div
                  className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full border-2 transition-all duration-300 backdrop-blur-sm"
                  style={{
                    backgroundColor: isSpeaking
                      ? "rgba(6, 182, 212, 0.4)"
                      : isProcessing
                      ? "rgba(139, 92, 246, 0.4)"
                      : "rgba(59, 130, 246, 0.3)",
                    borderColor: isSpeaking
                      ? "#06b6d4"
                      : isProcessing
                      ? "#8b5cf6"
                      : "#3b82f6",
                    boxShadow: `0 0 40px ${
                      isSpeaking
                        ? "#06b6d4"
                        : isProcessing
                        ? "#8b5cf6"
                        : "#3b82f6"
                    }`,
                    backdropFilter: "blur(15px)",
                    animation:
                      isSpeaking || isProcessing ? "pulse 1s infinite" : "none",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-2xl md:text-3xl lg:text-4xl font-bold animate-pulse">
                      AI
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating UI Elements */}
              <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 border border-cyan-400/30 shadow-xl">
                  <div className="text-cyan-400 font-mono text-sm animate-pulse">
                    NEURAL_NETWORK: ACTIVE
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 border border-purple-400/30 shadow-xl">
                  <div className="text-purple-400 font-mono text-sm animate-pulse">
                    HOLOGRAPHIC_CORE: {getStatusText()}
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Audio Waveform Rings */}
            {isSpeaking &&
              waveRings.map((ring) => (
                <div
                  key={ring.id}
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-pulse"
                  style={{
                    width: `${ring.radius}%`,
                    height: `${ring.radius}%`,
                    left: `${(100 - ring.radius) / 2}%`,
                    top: `${(100 - ring.radius) / 2}%`,
                    opacity: ring.opacity,
                    borderWidth: ring.thickness,
                    animationDuration: "2s",
                    boxShadow: `0 0 ${ring.radius}px rgba(6, 182, 212, 0.3)`,
                  }}
                />
              ))}

            {/* Volumetric light beams */}
            {(isSpeaking || isProcessing) && (
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div
                  className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  style={{
                    animation: "scan 3s linear infinite",
                    top: "25%",
                    transform: "translateY(-50%)",
                    boxShadow: "0 0 20px cyan",
                  }}
                />
                <div
                  className="absolute w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                  style={{
                    animation: "scan 3s linear infinite",
                    top: "75%",
                    transform: "translateY(-50%)",
                    animationDelay: "1.5s",
                    boxShadow: "0 0 20px purple",
                  }}
                />
              </div>
            )}
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
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

