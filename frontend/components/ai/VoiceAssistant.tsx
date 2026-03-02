/**
 * 语音助手组件
 * 支持语音识别、语音合成、多语言
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  RotateCcw,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

export interface VoiceAssistantProps {
  onTranscript?: (text: string) => void;
  onSpeak?: (text: string) => void;
  language?: 'zh-CN' | 'en-US' | 'ja-JP' | 'ko-KR';
  autoListen?: boolean;
  showTranscript?: boolean;
  showVisualizer?: boolean;
  className?: string;
}

const LANGUAGE_OPTIONS = [
  { code: 'zh-CN', name: '中文' },
  { code: 'en-US', name: 'English' },
  { code: 'ja-JP', name: '日本語' },
  { code: 'ko-KR', name: '한국어' }
];

export function VoiceAssistant({
  onTranscript,
  onSpeak,
  language = 'zh-CN',
  autoListen = false,
  showTranscript = true,
  showVisualizer = true,
  className
}: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [copied, setCopied] = useState(false);
  const [volume, setVolume] = useState(1);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // 初始化语音识别
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = currentLanguage;

      recognitionRef.current.onresult = (event: any) => {
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
          if (onTranscript) {
            onTranscript(finalTranscript);
          }
        }
        setInterimTranscript(interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('语音识别错误:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentLanguage, onTranscript]);

  // 初始化语音合成
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // 自动开始监听
  useEffect(() => {
    if (autoListen && recognitionRef.current && !isListening) {
      startListening();
    }
  }, [autoListen]);

  // 音频可视化
  useEffect(() => {
    if (showVisualizer && canvasRef.current && (isListening || isSpeaking)) {
      drawVisualizer();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, isSpeaking, showVisualizer]);

  const drawVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 绘制音频波形
      const bars = 32;
      const radius = 30;

      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2;
        const barHeight = isListening
          ? Math.random() * 30 + 10
          : isSpeaking
          ? Math.random() * 20 + 5
          : 5;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isListening
          ? '#06b6d4'
          : isSpeaking
          ? '#8b5cf6'
          : '#4b5563';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      if (isListening || isSpeaking) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = currentLanguage;
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage;
      utterance.volume = volume;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);

      if (onSpeak) {
        onSpeak(text);
      }
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  const toggleLanguage = () => {
    const currentIndex = LANGUAGE_OPTIONS.findIndex(
      lang => lang.code === currentLanguage
    );
    const nextIndex = (currentIndex + 1) % LANGUAGE_OPTIONS.length;
    const nextLanguage = LANGUAGE_OPTIONS[nextIndex].code;
    setCurrentLanguage(nextLanguage);
  };

  return (
    <Card className={cn('p-6', className)}>
      <div className="flex flex-col items-center space-y-4">
        {/* 可视化 */}
        {showVisualizer && (
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={120}
              height={120}
              className="rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar
                className={cn(
                  'w-16 h-16 transition-colors',
                  isListening ? 'bg-cyber-cyan' : isSpeaking ? 'bg-cyber-purple' : 'bg-cyber-muted'
                )}
              >
                {isListening || isSpeaking ? (
                  <Sparkles className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-cyber-cyan" />
                )}
              </Avatar>
            </div>
          </div>
        )}

        {/* 状态指示 */}
        <AnimatePresence>
          {(isListening || isSpeaking) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm font-medium text-cyber-cyan"
            >
              {isListening ? '正在聆听...' : '正在说话...'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 转录文本 */}
        {showTranscript && (transcript || interimTranscript) && (
          <div className="w-full">
            <div className="bg-cyber-dark rounded-lg p-4 mb-4 min-h-[100px] max-h-[200px] overflow-y-auto">
              <p className="text-sm whitespace-pre-wrap">
                {transcript}
                <span className="text-cyber-muted">{interimTranscript}</span>
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speak(transcript)}
                  leftIcon={<Volume2 className="w-4 h-4" />}
                  disabled={!transcript || isSpeaking}
                >
                  朗读
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  leftIcon={copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  disabled={!transcript}
                >
                  {copied ? '已复制' : '复制'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                  disabled={!transcript}
                >
                  重置
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                leftIcon={<Languages className="w-4 h-4" />}
              >
                {LANGUAGE_OPTIONS.find(lang => lang.code === currentLanguage)?.name}
              </Button>
            </div>
          </div>
        )}

        {/* 控制按钮 */}
        <div className="flex items-center gap-4">
          <Button
            variant={isListening ? 'danger' : 'primary'}
            size="lg"
            onClick={isListening ? stopListening : startListening}
            leftIcon={isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            className="rounded-full w-16 h-16"
          >
            {isListening ? '停止' : '开始'}
          </Button>

          {isSpeaking && (
            <Button
              variant="outline"
              size="lg"
              onClick={stopSpeaking}
              leftIcon={<VolumeX className="w-5 h-5" />}
              className="rounded-full"
            >
              停止朗读
            </Button>
          )}
        </div>

        {/* 音量控制 */}
        <div className="flex items-center gap-2 w-full">
          <Volume2 className="w-4 h-4 text-cyber-muted" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-cyber-border rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-cyber-muted w-12">{Math.round(volume * 100)}%</span>
        </div>
      </div>
    </Card>
  );
}
