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

  const currentAudioRef = useRef(null);

  const speak = async (text) => {
    stopSpeaking();
    const cleanText = text.replace(/[*#_•`]/g, '').trim();
    if (!cleanText) return;

    const cartesiaKey = localStorage.getItem('cartesia_api_key') || import.meta.env.VITE_CARTESIA_API_KEY;

    // 1. If Cartesia API key is available, use Cartesia Sonic multilingual TTS
    if (cartesiaKey && cartesiaKey.trim().length > 10) {
      try {
        setIsSpeaking(true);
        const voiceId = localStorage.getItem('cartesia_voice_id') || 'a0e99841-438c-4a64-b679-ae501e7d6091';
        
        // Cartesia supported language codes for sonic-multilingual (en, hi, etc.)
        const cartesiaLang = ['hi', 'en', 'es', 'fr', 'de', 'ja', 'zh', 'pt', 'it'].includes(currentLangCode) 
          ? currentLangCode 
          : 'en';

        const response = await fetch('https://api.cartesia.ai/tts/bytes', {
          method: 'POST',
          headers: {
            'Cartesia-Version': '2024-06-10',
            'X-API-Key': cartesiaKey.trim(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model_id: 'sonic-multilingual',
            transcript: cleanText.substring(0, 1000), // Cartesia chunk safe limit
            voice: {
              mode: 'id',
              id: voiceId
            },
            output_format: {
              container: 'wav',
              encoding: 'pcm_s16le',
              sample_rate: 24000
            },
            language: cartesiaLang
          })
        });

        if (response.ok) {
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;
          audio.onended = () => setIsSpeaking(false);
          audio.onerror = () => {
            setIsSpeaking(false);
            fallbackWebSpeech(cleanText);
          };
          await audio.play();
          return;
        } else {
          console.warn('Cartesia TTS responded with status', response.status, '- falling back to Web Speech API');
        }
      } catch (err) {
        console.warn('Cartesia TTS call failed, using Web Speech API fallback:', err);
      }
    }

    fallbackWebSpeech(cleanText);
  };

  const fallbackWebSpeech = (cleanText) => {
    // 2. Fallback to native Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
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
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
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
