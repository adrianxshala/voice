"use client";
import { useState, useEffect } from "react";

interface RobotCommunicationProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  lastMessage: string;
  error: string | null;
  onDismissError: () => void;
}

export default function RobotCommunication({
  isListening,
  isSpeaking,
  isProcessing,
  lastMessage,
  error,
  onDismissError,
}: RobotCommunicationProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (lastMessage) {
      setIsTyping(true);
      setDisplayText("");

      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < lastMessage.length) {
          setDisplayText(lastMessage.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(typeInterval);
        }
      }, 50);

      return () => clearInterval(typeInterval);
    }
  }, [lastMessage]);

  const getStatusMessage = () => {
    if (isListening) return "🤖 ROBOT LISTENING...";
    if (isProcessing) return "🧠 PROCESSING DATA...";
    if (isSpeaking) return "🗣️ ROBOT SPEAKING...";
    return "👽 READY FOR COMMUNICATION";
  };

  const getStatusColor = () => {
    if (isListening) return "text-green-400";
    if (isProcessing) return "text-yellow-400";
    if (isSpeaking) return "text-blue-400";
    return "text-gray-400";
  };

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4">
      {/* Robot Communication Panel */}
      <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            ROBOT COMMUNICATION
          </h1>
          <p className="text-gray-300 text-lg">Interdimensional AI Assistant</p>
        </div>

        {/* Status Display */}
        <div className="text-center mb-8">
          <div
            className={`text-2xl font-mono font-bold ${getStatusColor()} mb-4`}
          >
            {getStatusMessage()}
          </div>

          {/* Status Indicators */}
          <div className="flex justify-center space-x-4 mb-6">
            <div
              className={`w-4 h-4 rounded-full ${
                isListening ? "bg-green-400 animate-pulse" : "bg-gray-600"
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

        {/* Communication Display */}
        <div className="bg-black/60 rounded-2xl p-6 border border-gray-600/50 mb-6">
          <div className="text-green-400 font-mono text-sm mb-2">
            &gt; ROBOT_INTERFACE v2.1.0
          </div>
          <div className="text-cyan-400 font-mono text-sm mb-2">
            &gt; STATUS:{" "}
            {isListening
              ? "LISTENING"
              : isProcessing
              ? "PROCESSING"
              : isSpeaking
              ? "SPEAKING"
              : "STANDBY"}
          </div>

          {displayText && (
            <div className="text-white font-mono text-sm">
              &gt; USER_INPUT: {displayText}
              {isTyping && <span className="animate-pulse">|</span>}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 rounded-xl p-4 mb-6">
            <div className="text-red-300 font-mono text-sm">
              &gt; ERROR: {error}
            </div>
            <button
              onClick={onDismissError}
              className="mt-2 text-red-400 hover:text-red-300 text-xs underline font-mono"
            >
              &gt; DISMISS_ERROR
            </button>
          </div>
        )}

        {/* Robot Status Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/30">
            <div className="text-cyan-400 font-mono text-sm mb-2">
              AUDIO_INPUT
            </div>
            <div
              className={`text-lg ${
                isListening ? "text-green-400" : "text-gray-500"
              }`}
            >
              {isListening ? "ACTIVE" : "STANDBY"}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/30">
            <div className="text-cyan-400 font-mono text-sm mb-2">
              AI_PROCESSOR
            </div>
            <div
              className={`text-lg ${
                isProcessing ? "text-yellow-400" : "text-gray-500"
              }`}
            >
              {isProcessing ? "THINKING" : "READY"}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/30">
            <div className="text-cyan-400 font-mono text-sm mb-2">
              AUDIO_OUTPUT
            </div>
            <div
              className={`text-lg ${
                isSpeaking ? "text-blue-400" : "text-gray-500"
              }`}
            >
              {isSpeaking ? "SPEAKING" : "SILENT"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

