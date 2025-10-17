"use client";
import { useState, useRef, useEffect } from "react";
import FuturisticAILogo from "../components/FuturisticAILogo";
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
  const [listening, setListening] = useState(false);
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

  // Start continuous listening
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

  // Stop listening
  const stopAssistant = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  };

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
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700/50 shadow-2xl mx-4 max-w-lg w-full">
        {/* Main Control Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={listening ? stopAssistant : startAssistant}
            disabled={isProcessing}
            className={`relative flex-1 px-4 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              listening
                ? "bg-gradient-to-r from-red-500 to-pink-600 shadow-lg shadow-red-500/25"
                : "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25"
            }`}
          >
            <span className="relative z-10">
              {listening ? "🛑 Stop" : "🎤 Listen"}
            </span>
            {listening && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 animate-pulse opacity-75"></div>
            )}
          </button>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-4 py-3 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-orange-500 to-red-600 shadow-lg shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
            >
              🔇 Stop Speech
            </button>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-3 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-gray-600 to-gray-700 shadow-lg shadow-gray-600/25 transition-all duration-300 transform hover:scale-105"
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Status Display */}
        <div className="text-center mb-4">
          <p
            className={`text-lg transition-all duration-300 ${
              listening
                ? "text-cyan-300 animate-pulse"
                : isProcessing
                ? "text-yellow-300 animate-pulse"
                : isSpeaking
                ? "text-green-300 animate-pulse"
                : "text-gray-400"
            }`}
          >
            {listening
              ? "🔊 Listening..."
              : isProcessing
              ? "🤖 Processing..."
              : isSpeaking
              ? "🗣️ Speaking..."
              : "👆 Click to talk to AI"}
          </p>

          {/* Audio Visualization */}
          {(listening || isSpeaking) && (
            <div className="mt-4">
              <AudioVisualizer isActive={listening || isSpeaking} />
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">⚠️ {error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-red-400 hover:text-red-300 text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Last Message Display */}
        {lastMessage && (
          <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm">
              <span className="font-semibold">You said:</span> {lastMessage}
            </p>
          </div>
        )}

        {/* Voice Settings Panel */}
        {showSettings && (
          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
            <h3 className="text-white font-semibold mb-4">Voice Settings</h3>

            {/* Voice Selection */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">Voice:</label>
              <select
                value={voiceSettings.voice}
                onChange={(e) => updateVoiceSettings({ voice: e.target.value })}
                className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
              >
                {availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Speech Rate */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">
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
                className="w-full"
              />
            </div>

            {/* Pitch */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">
                Pitch: {voiceSettings.pitch}
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
                className="w-full"
              />
            </div>

            {/* Volume */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">
                Volume: {Math.round(voiceSettings.volume * 100)}%
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
                className="w-full"
              />
            </div>

            {/* Test Voice Button */}
            <button
              onClick={() =>
                speak("Hello! This is how I sound with your current settings.")
              }
              className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              🔊 Test Voice
            </button>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              listening ? "bg-green-400 animate-pulse" : "bg-gray-500"
            }`}
          ></div>
          <span>{listening ? "Listening" : "Standby"}</span>
        </div>

        {isProcessing && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
            <span>Processing</span>
          </div>
        )}

        {isSpeaking && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
            <span>Speaking</span>
          </div>
        )}
      </div>
    </main>
  );
}
