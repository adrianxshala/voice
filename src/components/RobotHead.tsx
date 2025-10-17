"use client";
import { useState, useEffect, useRef } from "react";

interface RobotHeadProps {
  isActive?: boolean;
  isListening?: boolean;
  isSpeaking?: boolean;
  isProcessing?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function RobotHead({
  isActive = false,
  isListening = false,
  isSpeaking = false,
  isProcessing = false,
  size = "large",
  className = "",
}: RobotHeadProps) {
  const [eyeAnimation, setEyeAnimation] = useState(0);
  const [mouthAnimation, setMouthAnimation] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);

  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32 md:w-40 md:h-40",
  };

  // Animate robot expressions
  useEffect(() => {
    const animate = () => {
      if (isListening) {
        setEyeAnimation(Math.sin(Date.now() * 0.01) * 0.3);
        setMouthAnimation(Math.sin(Date.now() * 0.008) * 0.2);
      } else if (isSpeaking) {
        setEyeAnimation(Math.sin(Date.now() * 0.015) * 0.4);
        setMouthAnimation(Math.sin(Date.now() * 0.012) * 0.3);
      } else if (isProcessing) {
        setEyeAnimation(Math.sin(Date.now() * 0.02) * 0.2);
        setMouthAnimation(0);
      } else {
        setEyeAnimation(0);
        setMouthAnimation(0);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, isSpeaking, isProcessing]);

  const getStatusColor = () => {
    if (isListening) return "#00ff88"; // Green
    if (isSpeaking) return "#0088ff"; // Blue
    if (isProcessing) return "#ffaa00"; // Orange
    return "#666666"; // Gray
  };

  const getStatusGlow = () => {
    if (isListening) return "shadow-lg shadow-green-500/50";
    if (isSpeaking) return "shadow-lg shadow-blue-500/50";
    if (isProcessing) return "shadow-lg shadow-orange-500/50";
    return "shadow-lg shadow-gray-500/30";
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Robot Head Container */}
      <div
        className={`relative w-full h-full rounded-full border-4 transition-all duration-500 ${getStatusGlow()}`}
        style={{
          background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
          borderColor: getStatusColor(),
          boxShadow: `0 0 30px ${getStatusColor()}40, inset 0 0 20px rgba(255,255,255,0.1)`,
        }}
      >
        {/* Circuit Pattern Overlay */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full opacity-30"
            style={{ filter: `drop-shadow(0 0 10px ${getStatusColor()})` }}
          >
            {/* Circuit lines */}
            <path
              d="M20 20 L40 20 L40 40 L60 40 L60 20 L80 20"
              stroke={getStatusColor()}
              strokeWidth="0.5"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M20 60 L40 60 L40 80 L60 80 L60 60 L80 60"
              stroke={getStatusColor()}
              strokeWidth="0.5"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <circle cx="40" cy="40" r="2" fill={getStatusColor()} />
            <circle cx="60" cy="60" r="2" fill={getStatusColor()} />
          </svg>
        </div>

        {/* Eyes */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4">
          {/* Left Eye */}
          <div
            className="w-6 h-6 rounded-full border-2 transition-all duration-300"
            style={{
              backgroundColor: getStatusColor(),
              borderColor: getStatusColor(),
              boxShadow: `0 0 15px ${getStatusColor()}`,
              transform: `translateY(${eyeAnimation * 2}px)`,
            }}
          >
            <div
              className="w-2 h-2 bg-white rounded-full absolute top-1 left-1 transition-all duration-200"
              style={{
                transform: `translate(${eyeAnimation * 3}px, ${
                  eyeAnimation * 2
                }px)`,
              }}
            />
          </div>

          {/* Right Eye */}
          <div
            className="w-6 h-6 rounded-full border-2 transition-all duration-300"
            style={{
              backgroundColor: getStatusColor(),
              borderColor: getStatusColor(),
              boxShadow: `0 0 15px ${getStatusColor()}`,
              transform: `translateY(${eyeAnimation * 2}px)`,
            }}
          >
            <div
              className="w-2 h-2 bg-white rounded-full absolute top-1 left-1 transition-all duration-200"
              style={{
                transform: `translate(${eyeAnimation * 3}px, ${
                  eyeAnimation * 2
                }px)`,
              }}
            />
          </div>
        </div>

        {/* Mouth */}
        <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div
            className="w-8 h-4 rounded-full border-2 transition-all duration-300"
            style={{
              backgroundColor: isSpeaking ? getStatusColor() : "transparent",
              borderColor: getStatusColor(),
              boxShadow: isSpeaking ? `0 0 15px ${getStatusColor()}` : "none",
              transform: `scaleY(${1 + mouthAnimation})`,
            }}
          >
            {/* Mouth animation for speaking */}
            {isSpeaking && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </div>
        </div>

        {/* Antenna */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <div
            className="w-1 h-6 rounded-full transition-all duration-300"
            style={{
              backgroundColor: getStatusColor(),
              boxShadow: `0 0 10px ${getStatusColor()}`,
            }}
          />
          <div
            className="w-2 h-2 rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2 transition-all duration-300"
            style={{
              backgroundColor: getStatusColor(),
              boxShadow: `0 0 15px ${getStatusColor()}`,
              animation: isActive ? "pulse 1s infinite" : "none",
            }}
          />
        </div>

        {/* Status Indicator Ring */}
        <div
          className="absolute inset-0 rounded-full border-2 transition-all duration-500"
          style={{
            borderColor: getStatusColor(),
            boxShadow: `0 0 20px ${getStatusColor()}40`,
            animation: isActive ? "spin 3s linear infinite" : "none",
          }}
        />

        {/* Scanning Line */}
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

