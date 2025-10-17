"use client";
import { useState, useEffect, useRef } from "react";

interface FuturisticAILogoProps {
  isActive?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function FuturisticAILogo({
  isActive = false,
  size = "medium",
  className = "",
}: FuturisticAILogoProps) {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);
  const animationRef = useRef<number | undefined>(undefined);

  const sizeClasses = {
    small: "w-12 h-12 sm:w-16 sm:h-16",
    medium: "w-20 h-20 sm:w-24 sm:h-24",
    large: "w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36",
  };

  // Generate particles for background effect
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x: (particle.x + 0.1) % 100,
          y: (particle.y + 0.05) % 100,
        }))
      );
      animationRef.current = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animation: isActive ? "pulse 2s infinite" : "none",
            }}
          />
        ))}
      </div>

      {/* Main AI Brain Icon */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Outer glow ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
            isActive
              ? "border-blue-400 shadow-lg shadow-blue-400/50 animate-spin"
              : "border-gray-300"
          }`}
          style={{
            animationDuration: "3s",
            boxShadow: isActive ? "0 0 20px rgba(59, 130, 246, 0.5)" : "none",
          }}
        />

        {/* Middle ring */}
        <div
          className={`absolute inset-2 rounded-full border transition-all duration-300 ${
            isActive
              ? "border-cyan-300 shadow-md shadow-cyan-300/40"
              : "border-gray-200"
          }`}
          style={{
            animation: isActive ? "pulse 1.5s infinite" : "none",
          }}
        />

        {/* Inner core */}
        <div
          className={`absolute inset-4 rounded-full transition-all duration-200 ${
            isActive
              ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
              : "bg-gradient-to-br from-gray-400 to-gray-600"
          }`}
          style={{
            boxShadow: isActive ? "0 0 15px rgba(59, 130, 246, 0.6)" : "none",
          }}
        />

        {/* Neural network pattern */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-3/4 h-3/4"
            style={{
              filter: isActive
                ? "drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))"
                : "none",
            }}
          >
            {/* Neural network nodes */}
            <circle
              cx="20"
              cy="30"
              r="3"
              fill={isActive ? "#60a5fa" : "#9ca3af"}
              className="transition-all duration-300"
            />
            <circle
              cx="50"
              cy="20"
              r="4"
              fill={isActive ? "#3b82f6" : "#6b7280"}
              className="transition-all duration-300"
            />
            <circle
              cx="80"
              cy="35"
              r="3"
              fill={isActive ? "#60a5fa" : "#9ca3af"}
              className="transition-all duration-300"
            />
            <circle
              cx="30"
              cy="60"
              r="3"
              fill={isActive ? "#60a5fa" : "#9ca3af"}
              className="transition-all duration-300"
            />
            <circle
              cx="50"
              cy="70"
              r="4"
              fill={isActive ? "#3b82f6" : "#6b7280"}
              className="transition-all duration-300"
            />
            <circle
              cx="70"
              cy="65"
              r="3"
              fill={isActive ? "#60a5fa" : "#9ca3af"}
              className="transition-all duration-300"
            />

            {/* Neural connections */}
            <line
              x1="20"
              y1="30"
              x2="50"
              y2="20"
              stroke={isActive ? "#60a5fa" : "#9ca3af"}
              strokeWidth="1"
              className="transition-all duration-300"
              style={{
                strokeDasharray: isActive ? "3,2" : "none",
                animation: isActive ? "dash 2s linear infinite" : "none",
              }}
            />
            <line
              x1="50"
              y1="20"
              x2="80"
              y2="35"
              stroke={isActive ? "#60a5fa" : "#9ca3af"}
              strokeWidth="1"
              className="transition-all duration-300"
              style={{
                strokeDasharray: isActive ? "3,2" : "none",
                animation: isActive
                  ? "dash 2s linear infinite reverse"
                  : "none",
              }}
            />
            <line
              x1="20"
              y1="30"
              x2="30"
              y2="60"
              stroke={isActive ? "#60a5fa" : "#9ca3af"}
              strokeWidth="1"
              className="transition-all duration-300"
              style={{
                strokeDasharray: isActive ? "3,2" : "none",
                animation: isActive ? "dash 2s linear infinite" : "none",
              }}
            />
            <line
              x1="30"
              y1="60"
              x2="50"
              y2="70"
              stroke={isActive ? "#60a5fa" : "#9ca3af"}
              strokeWidth="1"
              className="transition-all duration-300"
              style={{
                strokeDasharray: isActive ? "3,2" : "none",
                animation: isActive
                  ? "dash 2s linear infinite reverse"
                  : "none",
              }}
            />
            <line
              x1="50"
              y1="70"
              x2="70"
              y2="65"
              stroke={isActive ? "#60a5fa" : "#9ca3af"}
              strokeWidth="1"
              className="transition-all duration-300"
              style={{
                strokeDasharray: isActive ? "3,2" : "none",
                animation: isActive ? "dash 2s linear infinite" : "none",
              }}
            />
            <line
              x1="80"
              y1="35"
              x2="70"
              y2="65"
              stroke={isActive ? "#60a5fa" : "#9ca3af"}
              strokeWidth="1"
              className="transition-all duration-300"
              style={{
                strokeDasharray: isActive ? "3,2" : "none",
                animation: isActive
                  ? "dash 2s linear infinite reverse"
                  : "none",
              }}
            />
          </svg>
        </div>

        {/* Central AI symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`text-white font-bold text-lg transition-all duration-300 ${
              isActive ? "animate-pulse" : ""
            }`}
            style={{
              textShadow: isActive
                ? "0 0 10px rgba(59, 130, 246, 0.8)"
                : "none",
            }}
          >
            AI
          </div>
        </div>

        {/* Scanning line effect */}
        {isActive && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{
                animation: "scan 2s linear infinite",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }

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
