"use client";
import { useState, useRef } from "react";
import FuturisticAILogo from "../components/FuturisticAILogo";

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Start continuous listening
  const startAssistant = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      setListening(false);
      // restart automatically for continuous mode
      recognition.start();
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const text = event.results[event.results.length - 1][0].transcript;
      console.log("Heard:", text);
      await handleMessage(text);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // Stop listening
  const stopAssistant = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  // Send recognized speech to AI backend
  const handleMessage = async (text: string) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.text();
    speak(data);
  };

  // Speak the AI response
  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    synth.speak(utter);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Futuristic Header */}
      <div className="text-center mb-8 px-4">
        <div className="mb-6">
          <FuturisticAILogo
            isActive={listening}
            size="large"
            className="mx-auto"
          />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          AI Voice Assistant
        </h1>
        <p className="text-gray-300 text-base md:text-lg">
          Powered by Advanced Neural Networks
        </p>
      </div>

      {/* Interactive Control Panel */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700/50 shadow-2xl mx-4 max-w-md w-full">
        <button
          onClick={listening ? stopAssistant : startAssistant}
          className={`relative px-6 md:px-8 py-3 md:py-4 rounded-xl text-white font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 w-full ${
            listening
              ? "bg-gradient-to-r from-red-500 to-pink-600 shadow-lg shadow-red-500/25"
              : "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
          }`}
        >
          <span className="relative z-10">
            {listening ? "🛑 Stop Listening" : "🎤 Start Assistant"}
          </span>
          {listening && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 animate-pulse opacity-75"></div>
          )}
        </button>

        <div className="mt-6 text-center">
          <p
            className={`text-lg transition-all duration-300 ${
              listening ? "text-cyan-300 animate-pulse" : "text-gray-400"
            }`}
          >
            {listening
              ? "🔊 Listening for your voice..."
              : "👆 Click to talk to AI"}
          </p>

          {listening && (
            <div className="mt-4 flex justify-center space-x-1">
              <div className="w-2 h-8 bg-blue-400 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-6 bg-purple-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-10 bg-cyan-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
              <div
                className="w-2 h-6 bg-purple-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <div
                className="w-2 h-8 bg-blue-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.8s" }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-8 flex items-center space-x-2 text-sm text-gray-400">
        <div
          className={`w-3 h-3 rounded-full ${
            listening ? "bg-green-400 animate-pulse" : "bg-gray-500"
          }`}
        ></div>
        <span>{listening ? "Active" : "Standby"}</span>
      </div>
    </main>
  );
}
