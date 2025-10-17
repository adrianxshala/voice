"use client";
import { useState, useRef, useEffect } from "react";
import HolographicAI from "../components/HolographicAI";
import AudioVisualizer from "../components/AudioVisualizer";

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface VoiceSettings {
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
}

export default function VoiceAssistant() {
  // const [listening, setListening] = useState(false); // Removed - not used in holographic mode
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voice: "",
    rate: 1,
    pitch: 1,
    volume: 1,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      if (voices.length > 0 && !voiceSettings.voice) {
        const defaultVoice =
          voices.find((v) => v.lang.startsWith("en")) || voices[0];
        setVoiceSettings((prev) => ({ ...prev, voice: defaultVoice.name }));
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [voiceSettings.voice]);

  // Start continuous listening - Not used in holographic mode
  /*
  const startAssistant = () => {
    setError(null);
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setListening(false);
      // restart automatically for continuous mode
      setTimeout(() => {
        if (recognitionRef.current) {
          recognition.start();
        }
      }, 100);
    };

    recognition.onerror = (event: Event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorEvent = event as any;
      console.error("Speech recognition error:", errorEvent.error);
      setError(`Speech recognition error: ${errorEvent.error}`);
      setListening(false);
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        const text = result[0].transcript;
        console.log("Heard:", text);
        setLastMessage(text);
        await handleMessage(text);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };
  */

  // Stop listening - Not used in holographic mode
  // const stopAssistant = () => {
  //   if (recognitionRef.current) {
  //     recognitionRef.current.stop();
  //     recognitionRef.current = null;
  //   }
  //   setListening(false);
  // };

  // Stop speaking
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Send recognized speech to AI backend
  const handleMessage = async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.text();
      speak(data);
    } catch (error) {
      console.error("Error processing message:", error);
      setError("Failed to process your message. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Enhanced speak function with voice settings
  const speak = (text: string) => {
    // Stop any current speech
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);

    // Apply voice settings
    const selectedVoice = availableVoices.find(
      (v) => v.name === voiceSettings.voice
    );
    if (selectedVoice) {
      utter.voice = selectedVoice;
    }

    utter.rate = voiceSettings.rate;
    utter.pitch = voiceSettings.pitch;
    utter.volume = voiceSettings.volume;
    utter.lang = "en-US";

    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    };

    speechRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  // Update voice settings
  const updateVoiceSettings = (newSettings: Partial<VoiceSettings>) => {
    setVoiceSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Holographic AI Voice Assistant */}
      <HolographicAI
        isSpeaking={isSpeaking}
        isProcessing={isProcessing}
        onStartDemo={() => {
          if (!isSpeaking && !isProcessing) {
            speak(
              "Hello! I am your holographic AI assistant. I exist in the realm of light and sound. How may I assist you today?"
            );
          }
        }}
      />

      {/* Floating Control Panel */}
      <div className="fixed bottom-8 right-8 z-20">
        <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 border border-cyan-400/30 shadow-2xl">
          {/* Quick Controls */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => {
                if (!isSpeaking && !isProcessing) {
                  speak(
                    "Hello! I am your holographic AI assistant. I exist in the realm of light and sound. How may I assist you today?"
                  );
                }
              }}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg text-white font-medium text-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                isSpeaking
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25"
                  : "bg-gradient-to-r from-purple-500 to-cyan-600 shadow-lg shadow-purple-500/25"
              }`}
            >
              {isSpeaking ? "🔊 Holographic" : "✨ Activate AI"}
            </button>

            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="px-4 py-2 rounded-lg text-white font-medium text-sm bg-gradient-to-r from-red-500 to-pink-600 shadow-lg shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
              >
                🔇 Deactivate
              </button>
            )}

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 rounded-lg text-white font-medium text-sm bg-gradient-to-r from-gray-600 to-gray-700 shadow-lg shadow-gray-600/25 transition-all duration-300 transform hover:scale-105"
            >
              ⚙️
            </button>
          </div>

          {/* Audio Visualization */}
          {isSpeaking && (
            <div className="mb-4">
              <AudioVisualizer isActive={isSpeaking} />
            </div>
          )}

          {/* Status Display */}
          <div className="text-center">
            <div
              className={`text-sm font-mono font-medium ${
                isProcessing
                  ? "text-purple-400"
                  : isSpeaking
                  ? "text-cyan-400"
                  : "text-gray-400"
              }`}
            >
              {isProcessing
                ? "PROCESSING"
                : isSpeaking
                ? "HOLOGRAPHIC"
                : "STANDBY"}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-xs">⚠️ {error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-1 text-red-400 hover:text-red-300 text-xs underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Last Message Display */}
          {lastMessage && (
            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-xs">
                <span className="font-semibold">You said:</span> {lastMessage}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Voice Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center p-4">
          <div className="bg-black/80 backdrop-blur-lg rounded-3xl p-8 border border-cyan-400/30 shadow-2xl max-w-md w-full">
            <h3 className="text-cyan-400 font-light mb-6 text-xl text-center">
              Holographic Configuration
            </h3>

            {/* Voice Selection */}
            <div className="mb-6">
              <label className="block text-gray-300 font-light text-sm mb-3">
                Holographic Voice Module:
              </label>
              <select
                value={voiceSettings.voice}
                onChange={(e) => updateVoiceSettings({ voice: e.target.value })}
                className="w-full p-3 bg-black/60 border border-cyan-400/30 rounded-lg text-white font-light text-sm focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              >
                {availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Speech Rate */}
            <div className="mb-6">
              <label className="block text-gray-300 font-light text-sm mb-3">
                Speech Rate: {voiceSettings.rate}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSettings.rate}
                onChange={(e) =>
                  updateVoiceSettings({ rate: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Pitch */}
            <div className="mb-6">
              <label className="block text-gray-300 font-light text-sm mb-3">
                Pitch Modifier: {voiceSettings.pitch}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSettings.pitch}
                onChange={(e) =>
                  updateVoiceSettings({ pitch: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Volume */}
            <div className="mb-6">
              <label className="block text-gray-300 font-light text-sm mb-3">
                Volume Level: {Math.round(voiceSettings.volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceSettings.volume}
                onChange={(e) =>
                  updateVoiceSettings({ volume: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Test Voice Button */}
            <button
              onClick={() =>
                speak("Hello! This is how I sound with your current settings.")
              }
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 border border-cyan-400/50 mb-4"
            >
              ✨ Test Holographic Voice
            </button>

            {/* Close Button */}
            <button
              onClick={() => setShowSettings(false)}
              className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 border border-gray-500/50"
            >
              Close Holographic Config
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
