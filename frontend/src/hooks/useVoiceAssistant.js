import { useState, useEffect, useRef } from 'react';

// BCP 47 mapping for Indian Languages for browser Web Speech API
const LANGUAGE_BCP47_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  mr: 'mr-IN',
  ur: 'ur-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  as: 'as-IN'
};

export function useVoiceAssistant(currentLangCode = 'en') {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasVoiceSupport, setHasVoiceSupport] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setHasVoiceSupport(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = LANGUAGE_BCP47_MAP[currentLangCode] || 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      recognitionRef.current = recognition;
    } else {
      setHasVoiceSupport(false);
    }
  }, [currentLangCode]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Speech recognition start failed:', e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const cleanText = text.replace(/[*#_•`]/g, ''); // Clean markdown formatting
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = LANGUAGE_BCP47_MAP[currentLangCode] || 'en-IN';
      utterance.rate = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return {
    isListening,
    isSpeaking,
    transcript,
    hasVoiceSupport,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  };
}
