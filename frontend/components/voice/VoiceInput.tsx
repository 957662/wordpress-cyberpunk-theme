'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  showInterim?: boolean;
  autoStart?: boolean;
  onStop?: () => void;
  onStart?: () => void;
  onError?: (error: string) => void;
}

export interface VoiceRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  language = 'zh-CN',
  continuous = false,
  interimResults = true,
  maxAlternatives = 1,
  className,
  placeholder = '点击麦克风开始说话...',
  disabled = false,
  showInterim = true,
  autoStart = false,
  onStop,
  onStart,
  onError,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [confidence, setConfidence] = useState(0);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // 检查浏览器支持
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        onError?.('您的浏览器不支持语音识别功能');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.maxAlternatives = maxAlternatives;

      recognition.onstart = () => {
        setIsListening(true);
        setHasPermission(true);
        onStart?.();
      };

      recognition.onend = () => {
        setIsListening(false);
        onStop?.();

        // 如果设置了自动开始且不是手动停止，则重新开始
        if (autoStart && isListening) {
          timeoutRef.current = setTimeout(() => {
            startListening();
          }, 300);
        }
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscripts = '';
        let lastConfidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;

          if (result.isFinal) {
            finalTranscript += transcript;
            lastConfidence = result[0].confidence;
          } else {
            interimTranscripts += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          setConfidence(lastConfidence);
          onTranscript(finalTranscript);
        }

        if (interimTranscripts && showInterim) {
          setInterimTranscript(interimTranscripts);
        }
      };

      recognition.onerror = (event: SpeechRecognitionError) => {
        console.error('Speech recognition error:', event.error);

        if (event.error === 'not-allowed') {
          setHasPermission(false);
          onError?.('未授予麦克风权限');
        } else if (event.error === 'no-speech') {
          onError?.('未检测到语音输入');
        } else if (event.error === 'network') {
          onError?.('网络错误，请检查网络连接');
        } else {
          onError?.(`语音识别错误: ${event.error}`);
        }

        setIsListening(false);
      };

      recognitionRef.current = recognition;

      // 检查麦克风权限
      navigator.mediaDevices?.getUserMedia({ audio: true })
        .then(() => setHasPermission(true))
        .catch(() => setHasPermission(false))
        .finally(() => {
          if (autoStart) {
            startListening();
          }
        });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [language, continuous, interimResults, maxAlternatives, autoStart]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !disabled) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  }, [disabled]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setInterimTranscript('');
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setConfidence(0);
  }, []);

  const handleToggle = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  if (!isSupported) {
    return (
      <div className={cn(
        'p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm',
        className
      )}>
        <div className="flex items-center gap-2">
          <VolumeX className="w-4 h-4" />
          <span>您的浏览器不支持语音识别功能</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* 控制按钮 */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggle}
          disabled={disabled || hasPermission === false}
          className={cn(
            'relative group px-4 py-2 rounded-lg font-medium transition-all duration-200',
            'flex items-center gap-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isListening
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
          )}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>停止录音</span>
              {/* 录音动画 */}
              <span className="absolute inset-0 rounded-lg animate-ping bg-red-500/20" />
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>开始录音</span>
            </>
          )}
        </button>

        {transcript && (
          <button
            onClick={clearTranscript}
            className="px-3 py-2 rounded-lg bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30 transition-colors text-sm"
          >
            清除
          </button>
        )}

        {/* 权限提示 */}
        {hasPermission === false && (
          <div className="flex items-center gap-2 text-yellow-400 text-sm">
            <VolumeX className="w-4 h-4" />
            <span>需要麦克风权限</span>
          </div>
        )}
      </div>

      {/* 识别结果 */}
      <div className={cn(
        'min-h-[120px] p-4 rounded-lg border transition-colors',
        isListening
          ? 'border-cyan-500/50 bg-cyan-500/5'
          : 'border-gray-700 bg-gray-800/50'
      )}>
        {isListening && !transcript && !interimTranscript && (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>正在聆听...</span>
          </div>
        )}

        {transcript && (
          <div className="space-y-2">
            <p className="text-white whitespace-pre-wrap">{transcript}</p>
            {confidence > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${confidence * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">
                  置信度: {Math.round(confidence * 100)}%
                </span>
              </div>
            )}
          </div>
        )}

        {interimTranscript && showInterim && (
          <p className="text-gray-400 italic whitespace-pre-wrap">
            {interimTranscript}
          </p>
        )}

        {!transcript && !interimTranscript && !isListening && (
          <p className="text-gray-500">{placeholder}</p>
        )}
      </div>

      {/* 语言选择提示 */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Volume2 className="w-3 h-3" />
        <span>当前语言: {language}</span>
      </div>
    </div>
  );
};

export default VoiceInput;
