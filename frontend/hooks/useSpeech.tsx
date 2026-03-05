import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseSpeechOptions {
  /** 语速 (0.1 - 10) */
  rate?: number;
  /** 音调 (0 - 2) */
  pitch?: number;
  /** 音量 (0 - 1) */
  volume?: number;
  /** 语言 */
  lang?: string;
  /** 声音 */
  voice?: string;
  /** 开始说话时的回调 */
  onStart?: () => void;
  /** 结束说话时的回调 */
  onEnd?: () => void;
  /** 暂停时的回调 */
  onPause?: () => void;
  /** 恢复时的回调 */
  onResume?: () => void;
  /** 错误时的回调 */
  onError?: (error: SpeechSynthesisErrorEvent) => void;
}

export interface UseSpeechReturn {
  /** 说话 */
  speak: (text: string) => void;
  /** 暂停 */
  pause: () => void;
  /** 恢复 */
  resume: () => void;
  /** 取消 */
  cancel: () => void;
  /** 是否正在说话 */
  isSpeaking: boolean;
  /** 是否已暂停 */
  isPaused: boolean;
  /** 是否支持语音合成 */
  isSupported: boolean;
  /** 可用的声音列表 */
  voices: SpeechSynthesisVoice[];
  /** 设置语速 */
  setRate: (rate: number) => void;
  /** 设置音调 */
  setPitch: (pitch: number) => void;
  /** 设置音量 */
  setVolume: (volume: number) => void;
  /** 设置语言 */
  setLang: (lang: string) => void;
  /** 设置声音 */
  setVoice: (voice: string) => void;
}

/**
 * 语音合成 Hook
 *
 * @example
 * ```tsx
 * const { speak, cancel, isSpeaking, voices } = useSpeech({
 *   rate: 1,
 *   pitch: 1,
 *   volume: 1,
 *   lang: 'zh-CN',
 * });
 *
 * return (
 *   <div>
 *     <button onClick={() => speak('你好，世界！')}>说话</button>
 *     <button onClick={cancel}>停止</button>
 *     <p>Is speaking: {isSpeaking}</p>
 *   </div>
 * );
 * ```
 */
export function useSpeech(options: UseSpeechOptions = {}): UseSpeechReturn {
  const {
    rate: initialRate = 1,
    pitch: initialPitch = 1,
    volume: initialVolume = 1,
    lang: initialLang = 'zh-CN',
    voice: initialVoice,
    onStart,
    onEnd,
    onPause,
    onResume,
    onError,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(initialRate);
  const [pitch, setPitch] = useState(initialPitch);
  const [volume, setVolume] = useState(initialVolume);
  const [lang, setLang] = useState(initialLang);
  const [voice, setVoice] = useState(initialVoice || '');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // 检测是否支持语音合成
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // 加载可用声音
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // 如果没有指定声音且没有中文声音，选择第一个可用的
      if (!voice && availableVoices.length > 0) {
        const chineseVoice = availableVoices.find(v => v.lang.startsWith('zh'));
        if (chineseVoice) {
          setVoice(chineseVoice.name);
        } else {
          setVoice(availableVoices[0].name);
        }
      }
    };

    loadVoices();

    // 某些浏览器需要等待 voiceschanged 事件
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported, voice]);

  const speak = useCallback((text: string) => {
    if (!isSupported) {
      console.warn('Speech synthesis is not supported');
      return;
    }

    // 取消当前的说话
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // 设置语音参数
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = lang;

    // 设置声音
    const selectedVoice = voices.find(v => v.name === voice);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // 事件监听
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      onStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      onEnd?.();
    };

    utterance.onpause = () => {
      setIsPaused(true);
      onPause?.();
    };

    utterance.onresume = () => {
      setIsPaused(false);
      onResume?.();
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      setIsPaused(false);
      onError?.(event);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, rate, pitch, volume, lang, voice, voices, onStart, onEnd, onPause, onResume, onError]);

  const pause = useCallback(() => {
    if (!isSupported || !isSpeaking) return;
    window.speechSynthesis.pause();
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    if (!isSupported || !isPaused) return;
    window.speechSynthesis.resume();
  }, [isSupported, isPaused]);

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, [isSupported]);

  return {
    speak,
    pause,
    resume,
    cancel,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    setRate,
    setPitch,
    setVolume,
    setLang,
    setVoice,
  };
}

export default useSpeech;
