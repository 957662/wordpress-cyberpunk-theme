'use client';

/**
 * Voice Search Component
 * 语音搜索组件，支持语音识别、实时反馈、多语言
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Search, X, Volume2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
type VoiceSearchStatus = 'idle' | 'listening' | 'processing' | 'result' | 'error';

interface VoiceSearchProps {
  /**
   * 搜索回调
   */
  onSearch: (query: string) => void;
  /**
   * 语言
   */
  language?: string;
  /**
   * 持续时间限制（毫秒）
   */
  maxDuration?: number;
  /**
   * 是否显示可视化
   */
  showVisualization?: boolean;
  /**
   * 自定义样式
   */
  className?: string;
  /**
   * 占位符
   */
  placeholder?: string;
}

// 声音可视化组件
const SoundWave: React.FC<{ isListening: boolean }> = ({ isListening }) => {
  const bars = Array.from({ length: 20 });

  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-cyan-500 to-purple-600 rounded-full"
          animate={
            isListening
              ? {
                  height: ['8px', '32px', '16px', '24px', '8px'],
                  opacity: [0.5, 1, 0.7, 0.9, 0.5],
                }
              : {
                  height: '8px',
                  opacity: 0.3,
                }
          }
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  );
};

export const VoiceSearch: React.FC<VoiceSearchProps> = ({
  onSearch,
  language = 'zh-CN',
  maxDuration = 10000,
  showVisualization = true,
  className,
  placeholder = '点击麦克风开始语音搜索...',
}) => {
  const [status, setStatus] = useState<VoiceSearchStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // 初始化语音识别
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        setError('您的浏览器不支持语音识别');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setStatus('listening');
        setError('');
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
        setInterimTranscript(interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('语音识别错误:', event.error);
        setStatus('error');
        setError(`识别错误: ${event.error}`);

        // 自动重启
        if (event.error === 'no-speech' || event.error === 'audio-capture') {
          setTimeout(() => {
            if (status === 'listening') {
              startListening();
            }
          }, 1000);
        }
      };

      recognition.onend = () => {
        if (status === 'listening') {
          // 如果还在监听状态，自动重启
          startListening();
        } else if (transcript) {
          setStatus('result');
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [language]);

  // 开始监听
  const startListening = () => {
    if (!recognitionRef.current) return;

    try {
      setTranscript('');
      setInterimTranscript('');
      setError('');
      recognitionRef.current.start();

      // 设置超时
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, maxDuration);
    } catch (err) {
      console.error('启动语音识别失败:', err);
      setStatus('error');
      setError('启动失败，请重试');
    }
  };

  // 停止监听
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (transcript || interimTranscript) {
      const finalQuery = transcript + interimTranscript;
      setStatus('processing');

      // 模拟处理延迟
      setTimeout(() => {
        onSearch(finalQuery);
        setStatus('result');
      }, 500);
    } else {
      setStatus('idle');
    }
  };

  // 重置
  const reset = () => {
    setTranscript('');
    setInterimTranscript('');
    setStatus('idle');
    setError('');
  };

  // 切换监听状态
  const toggleListening = () => {
    if (status === 'listening') {
      stopListening();
    } else {
      startListening();
    }
  };

  // 获取状态文本
  const getStatusText = () => {
    switch (status) {
      case 'listening':
        return '正在聆听...';
      case 'processing':
        return '处理中...';
      case 'result':
        return '搜索完成';
      case 'error':
        return error;
      default:
        return placeholder;
    }
  };

  // 获取状态图标
  const getStatusIcon = () => {
    switch (status) {
      case 'listening':
        return <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin text-purple-400" />;
      case 'result':
        return <Search className="w-5 h-5 text-green-400" />;
      case 'error':
        return <X className="w-5 h-5 text-red-400" />;
      default:
        return <Mic className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* 主输入区域 */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isSupported ? toggleListening : undefined}
          className={cn(
            'w-full p-4 rounded-2xl border-2 transition-all duration-300',
            'flex items-center gap-4',
            status === 'listening'
              ? 'border-cyan-500 bg-cyan-500/10'
              : status === 'result'
              ? 'border-green-500 bg-green-500/10'
              : status === 'error'
              ? 'border-red-500 bg-red-500/10'
              : 'border-gray-700 bg-black/50 hover:border-gray-600'
          )}
        >
          {/* 状态图标 */}
          <div className={cn(
            'p-3 rounded-xl transition-colors',
            status === 'listening'
              ? 'bg-cyan-500/20 text-cyan-400'
              : status === 'result'
              ? 'bg-green-500/20 text-green-400'
              : status === 'error'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-gray-800 text-gray-400'
          )}>
            {getStatusIcon()}
          </div>

          {/* 文本显示 */}
          <div className="flex-1 text-left">
            <p className={cn(
              'text-sm font-medium transition-colors',
              status === 'listening' || status === 'processing'
                ? 'text-cyan-300'
                : status === 'result'
                ? 'text-green-300'
                : status === 'error'
                ? 'text-red-300'
                : 'text-gray-400'
            )}>
              {getStatusText()}
            </p>
            {(transcript || interimTranscript) && (
              <p className="text-white mt-1">
                {transcript}
                <span className="text-cyan-400 opacity-70">{interimTranscript}</span>
              </p>
            )}
          </div>

          {/* 音量图标（仅监听时） */}
          {status === 'listening' && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Volume2 className="w-5 h-5 text-cyan-400" />
            </motion.div>
          )}

          {/* 关闭按钮 */}
          {status !== 'idle' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </motion.button>
          )}
        </motion.button>

        {/* 进度条 */}
        {status === 'listening' && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-b-2xl"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: maxDuration / 1000, ease: 'linear' }}
          />
        )}
      </div>

      {/* 声音可视化 */}
      <AnimatePresence>
        {showVisualization && status === 'listening' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-black/50 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6"
          >
            <SoundWave isListening={true} />
            <p className="text-center text-gray-400 text-sm mt-4">
              请开始说话...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 浏览器不支持提示 */}
      {!isSupported && (
        <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-red-400 text-sm">
            {error} 请使用 Chrome、Edge 或 Safari 浏览器
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceSearch;
