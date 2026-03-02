'use client';

/**
 * useSpeechSynthesis Hook
 * 语音合成 Hook - 文字转语音功能
 */

import { useState, useEffect, useCallback, useRef } from 'react';

type SpeechState = 'idle' | 'speaking' | 'paused' | 'error';

interface SpeechSynthesisOptions {
  pitch?: number;
  rate?: number;
  volume?: number;
  voice?: string;
  lang?: string;
}

interface UseSpeechSynthesisReturn {
  speak: (text: string, options?: SpeechSynthesisOptions) => void;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  state: SpeechState;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [state, setState] = useState<SpeechState>('idle');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      // 加载语音列表
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();

      // 某些浏览器需要监听 voiceschanged 事件
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const speak = useCallback((text: string, options: SpeechSynthesisOptions = {}) => {
    if (!isSupported) {
      console.warn('Speech synthesis is not supported');
      return;
    }

    // 取消当前正在播放的语音
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // 设置语音参数
    if (options.pitch !== undefined) utterance.pitch = options.pitch;
    if (options.rate !== undefined) utterance.rate = options.rate;
    if (options.volume !== undefined) utterance.volume = options.volume;
    if (options.lang !== undefined) utterance.lang = options.lang;

    // 选择语音
    if (options.voice) {
      const selectedVoice = voices.find(v => v.name === options.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onstart = () => setState('speaking');
    utterance.onend = () => setState('idle');
    utterance.onerror = () => setState('error');
    utterance.onpause = () => setState('paused');
    utterance.onresume = () => setState('speaking');

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setState('idle');
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.pause();
      setState('paused');
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.resume();
      setState('speaking');
    }
  }, [isSupported]);

  return {
    speak,
    cancel,
    pause,
    resume,
    state,
    isSupported,
    voices,
  };
}
