'use client';

/**
 * Voice Recognition Component
 * 语音识别组件 - 支持多语言、实时转写、命令识别
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

// 类型定义
type VoiceLanguage =
  | 'zh-CN'
  | 'en-US'
  | 'ja-JP'
  | 'ko-KR'
  | 'fr-FR'
  | 'de-DE'
  | 'es-ES'
  | 'ru-RU';

type RecognitionState = 'idle' | 'listening' | 'processing' | 'error';

interface VoiceCommand {
  phrase: string;
  action: () => void;
  description?: string;
}

interface VoiceRecognizerProps {
  language?: VoiceLanguage;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStateChange?: (state: RecognitionState) => void;
  commands?: VoiceCommand[];
  theme?: 'cyan' | 'purple' | 'pink' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  showVisualizer?: boolean;
  autoStart?: boolean;
}

export function VoiceRecognizer({
  language = 'zh-CN',
  continuous = true,
  interimResults = true,
  maxAlternatives = 1,
  onResult,
  onError,
  onStateChange,
  commands = [],
  theme = 'cyan',
  size = 'md',
  showVisualizer = true,
  autoStart = false,
}: VoiceRecognizerProps) {
  const [state, setState] = useState<RecognitionState>('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStream | null>(null);

  // 主题颜色配置
  const themeColors = {
    cyan: {
      primary: '#00f0ff',
      glow: 'rgba(0, 240, 255, 0.5)',
    },
    purple: {
      primary: '#9d00ff',
      glow: 'rgba(157, 0, 255, 0.5)',
    },
    pink: {
      primary: '#ff0080',
      glow: 'rgba(255, 0, 128, 0.5)',
    },
    yellow: {
      primary: '#f0ff00',
      glow: 'rgba(240, 255, 0, 0.5)',
    },
  };

  const colors = themeColors[theme];

  // 更新状态并触发回调
  const updateState = useCallback((newState: RecognitionState) => {
    setState(newState);
    onStateChange?.(newState);
  }, [onStateChange]);

  // 检查浏览器支持
  const checkSupport = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const error = '您的浏览器不支持语音识别功能';
      onError?.(error);
      updateState('error');
      return false;
    }
    return SpeechRecognition;
  }, [onError, updateState]);

  // 初始化语音识别
  useEffect(() => {
    const SpeechRecognition = checkSupport();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.maxAlternatives = maxAlternatives;

    recognition.onstart = () => {
      updateState('listening');
    };

    recognition.onresult = (event: any) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      setInterimTranscript(interimText);

      if (finalText) {
        setTranscript(finalText);
        onResult?.(finalText, true);

        // 检查语音命令
        checkCommands(finalText);
      } else if (interimText) {
        onResult?.(interimText, false);
      }
    };

    recognition.onerror = (event: any) => {
      const errorMap: Record<string, string> = {
        'no-speech': '没有检测到语音输入',
        'audio-capture': '无法访问麦克风',
        'not-allowed': '麦克风权限被拒绝',
        'network': '网络连接错误',
        'aborted': '语音识别被中止',
      };

      const errorMessage = errorMap[event.error] || event.error || '未知错误';
      onError?.(errorMessage);
      updateState('error');
    };

    recognition.onend = () => {
      if (state === 'listening') {
        // 如果是连续模式，自动重启
        if (continuous) {
          try {
            recognition.start();
          } catch (e) {
            updateState('idle');
          }
        } else {
          updateState('idle');
        }
      }
    };

    recognitionRef.current = recognition;

    // 自动开始
    if (autoStart) {
      startListening();
    }

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // 忽略停止错误
      }
    };
  }, [language, continuous, interimResults, maxAlternatives, autoStart, state, checkSupport, updateState, onError, onResult]);

  // 检查并执行语音命令
  const checkCommands = useCallback((text: string) => {
    const lowerText = text.toLowerCase().trim();

    commands.forEach((command) => {
      const phrases = Array.isArray(command.phrase) ? command.phrase : [command.phrase];
      const matched = phrases.some(phrase =>
        lowerText.includes(phrase.toLowerCase())
      );

      if (matched) {
        console.log('Voice command matched:', command.phrase);
        command.action();
      }
    });
  }, [commands]);

  // 初始化音频可视化
  const initAudioVisualizer = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneRef.current = stream;

      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        if (state === 'listening' && !isMuted) {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setVolume(average / 255);
        }
        requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (error) {
      console.error('Audio visualizer error:', error);
    }
  }, [state, isMuted]);

  // 清理音频资源
  const cleanupAudio = useCallback(() => {
    if (microphoneRef.current) {
      microphoneRef.current.getTracks().forEach(track => track.stop());
      microphoneRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  // 开始监听
  const startListening = useCallback(async () => {
    const SpeechRecognition = checkSupport();
    if (!SpeechRecognition) return;

    try {
      setTranscript('');
      setInterimTranscript('');
      updateState('listening');

      if (showVisualizer) {
        await initAudioVisualizer();
      }

      recognitionRef.current?.start();
    } catch (error) {
      console.error('Start error:', error);
      onError?.('无法启动语音识别');
      updateState('error');
    }
  }, [checkSupport, updateState, onError, showVisualizer, initAudioVisualizer]);

  // 停止监听
  const stopListening = useCallback(() => {
    updateState('processing');
    recognitionRef.current?.stop();
    cleanupAudio();
    setVolume(0);
  }, [updateState, cleanupAudio]);

  // 切换静音
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // 清理
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  // 尺寸配置
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 主按钮 */}
      <motion.button
        onClick={state === 'listening' ? stopListening : startListening}
        className={`
          ${sizeClasses[size]} rounded-full flex items-center justify-center
          transition-all duration-300 relative overflow-hidden
          ${state === 'listening' ? 'ring-4 ring-offset-2 ring-offset-black' : ''}
        `}
        style={{
          backgroundColor: state === 'listening' ? colors.primary : '#1a1a2e',
          ringColor: colors.primary,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={
          state === 'listening'
            ? {
                boxShadow: [
                  `0 0 20px ${colors.glow}`,
                  `0 0 40px ${colors.glow}`,
                  `0 0 20px ${colors.glow}`,
                ],
              }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: state === 'listening' ? Infinity : 0,
        }}
      >
        <AnimatePresence mode="wait">
          {state === 'listening' ? (
            <motion.div
              key="listening"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Mic size={iconSizes[size]} className="text-black" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <MicOff size={iconSizes[size]} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 音量可视化 */}
        {showVisualizer && state === 'listening' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: colors.primary,
              scale: 1 + volume * 0.3,
              opacity: volume * 0.5,
            }}
          />
        )}
      </motion.button>

      {/* 状态指示器 */}
      <div className="flex items-center gap-2">
        {state === 'listening' && (
          <motion.div
            className="flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-4 rounded-full"
                style={{ backgroundColor: colors.primary }}
                animate={{
                  scaleY: [1, 2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        )}

        <span className="text-xs text-gray-400">
          {state === 'listening' && '正在聆听...'}
          {state === 'processing' && '处理中...'}
          {state === 'error' && '发生错误'}
          {state === 'idle' && '点击开始'}
        </span>
      </div>

      {/* 转写结果 */}
      {(transcript || interimTranscript) && (
        <motion.div
          className="w-full max-w-md p-4 rounded-lg bg-gray-900/50 backdrop-blur border border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {transcript && (
            <p className="text-white mb-2">{transcript}</p>
          )}
          {interimTranscript && (
            <p className="text-gray-400 italic">{interimTranscript}</p>
          )}
        </motion.div>
      )}

      {/* 语言选择器 */}
      <select
        value={language}
        onChange={(e) => {
          const newLang = e.target.value as VoiceLanguage;
          if (recognitionRef.current) {
            recognitionRef.current.lang = newLang;
          }
        }}
        className="px-3 py-1 rounded bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-cyan-500"
        disabled={state === 'listening'}
      >
        <option value="zh-CN">中文</option>
        <option value="en-US">English</option>
        <option value="ja-JP">日本語</option>
        <option value="ko-KR">한국어</option>
        <option value="fr-FR">Français</option>
        <option value="de-DE">Deutsch</option>
        <option value="es-ES">Español</option>
        <option value="ru-RU">Русский</option>
      </select>
    </div>
  );
}

// 导出
export default VoiceRecognizer;
