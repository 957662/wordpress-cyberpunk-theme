'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiPlay,
  FiPause,
  FiStop,
  FiFastForward,
  FiRewind,
  FiVolume2,
  FiVolumeX,
  FiSettings,
} from 'react-icons/fi';
import { clsx } from 'clsx';

/**
 * 文章语音朗读组件
 *
 * 功能特性:
 * - 文本转语音 (TTS)
 * - 播放控制（播放/暂停/停止）
 * - 语速调节
 * - 音调调节
 * - 音量控制
 * - 高亮当前朗读内容
 * - 多语言支持
 * - 语音选择
 *
 * @example
 * ```tsx
 * <ArticleVoiceReader
 *   content={articleContent}
 *   autoHighlight
 *   onStateChange={(state) => console.log(state)}
 * />
 * ```
 */

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'stopped';

export interface VoiceReaderSettings {
  rate: number; // 0.1-10
  pitch: number; // 0-2
  volume: number; // 0-1
  voice: string | null;
  lang: string;
}

export interface ArticleVoiceReaderProps {
  /** 文章内容 */
  content: string;
  /** 是否自动高亮当前朗读内容 */
  autoHighlight?: boolean;
  /** 状态变化回调 */
  onStateChange?: (state: PlaybackState) => void;
  /** 进度更新回调 */
  onProgress?: (current: number, total: number) => void;
  /** 自定义类名 */
  className?: string;
  /** 初始设置 */
  initialSettings?: Partial<VoiceReaderSettings>;
  /** 是否显示高级设置 */
  showAdvancedSettings?: boolean;
}

const DEFAULT_SETTINGS: VoiceReaderSettings = {
  rate: 1,
  pitch: 1,
  volume: 1,
  voice: null,
  lang: 'zh-CN',
};

/**
 * 分割文本为句子
 */
const splitIntoSentences = (text: string): string[] => {
  return text
    .split(/([。！？.!?]+)/)
    .reduce((acc: string[], part: string, index: number) => {
      if (index % 2 === 0) {
        acc.push(part);
      } else {
        if (acc.length > 0) {
          acc[acc.length - 1] += part;
        }
      }
      return acc;
    }, [])
    .filter(s => s.trim().length > 0);
};

/**
 * ArticleVoiceReader 组件
 */
export const ArticleVoiceReader: React.FC<ArticleVoiceReaderProps> = ({
  content,
  autoHighlight = true,
  onStateChange,
  onProgress,
  className,
  initialSettings,
  showAdvancedSettings = true,
}) => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [settings, setSettings] = useState<VoiceReaderSettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
  });
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [sentences, setSentences] = useState<string[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechSynthesisRef = useRef<typeof window.speechSynthesis | null>(null);

  useEffect(() => {
    // 初始化语音合成
    speechSynthesisRef.current = window.speechSynthesis;

    // 加载可用语音
    const loadVoices = () => {
      const availableVoices = speechSynthesisRef.current?.getVoices() || [];
      setVoices(availableVoices);
    };

    loadVoices();
    speechSynthesisRef.current?.addEventListener('voiceschanged', loadVoices);

    // 分割文本
    const textSentences = splitIntoSentences(content);
    setSentences(textSentences);

    return () => {
      speechSynthesisRef.current?.removeEventListener('voiceschanged', loadVoices);
      cleanup();
    };
  }, [content]);

  useEffect(() => {
    onStateChange?.(playbackState);
  }, [playbackState, onStateChange]);

  useEffect(() => {
    if (sentences.length > 0) {
      onProgress?.(currentSentenceIndex, sentences.length);
    }
  }, [currentSentenceIndex, sentences.length, onProgress]);

  /**
   * 清理资源
   */
  const cleanup = () => {
    if (playbackState === 'playing') {
      speechSynthesisRef.current?.cancel();
    }
  };

  /**
   * 播放
   */
  const handlePlay = () => {
    if (playbackState === 'playing') return;

    const utterance = new SpeechSynthesisUtterance();
    utteranceRef.current = utterance;

    // 设置语音属性
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = isMuted ? 0 : settings.volume;
    utterance.lang = settings.lang;

    // 设置语音
    if (settings.voice) {
      const selectedVoice = voices.find(v => v.name === settings.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    // 设置文本
    const remainingText = sentences.slice(currentSentenceIndex).join('');
    utterance.text = remainingText;

    // 事件监听
    utterance.onstart = () => {
      setPlaybackState('playing');
    };

    utterance.onend = () => {
      if (currentSentenceIndex + 1 >= sentences.length) {
        setPlaybackState('stopped');
        setCurrentSentenceIndex(0);
      } else {
        setCurrentSentenceIndex(prev => prev + 1);
      }
    };

    utterance.onpause = () => {
      setPlaybackState('paused');
    };

    utterance.onresume = () => {
      setPlaybackState('playing');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setPlaybackState('stopped');
    };

    // 单词边界事件（用于高亮）
    if (autoHighlight) {
      utterance.onboundary = (event) => {
        if (event.name === 'sentence') {
          const charIndex = event.charIndex || 0;
          // 计算当前句子索引
          let currentIndex = 0;
          let accumulatedLength = 0;

          for (let i = 0; i < sentences.length; i++) {
            accumulatedLength += sentences[i].length;
            if (charIndex < accumulatedLength) {
              currentIndex = i;
              break;
            }
          }

          setCurrentSentenceIndex(currentIndex);
        }
      };
    }

    speechSynthesisRef.current?.speak(utterance);
  };

  /**
   * 暂停
   */
  const handlePause = () => {
    if (playbackState === 'playing') {
      speechSynthesisRef.current?.pause();
    }
  };

  /**
   * 停止
   */
  const handleStop = () => {
    speechSynthesisRef.current?.cancel();
    setPlaybackState('stopped');
    setCurrentSentenceIndex(0);
  };

  /**
   * 快进
   */
  const handleForward = () => {
    handleStop();
    const nextIndex = Math.min(currentSentenceIndex + 1, sentences.length - 1);
    setCurrentSentenceIndex(nextIndex);
  };

  /**
   * 快退
   */
  const handleRewind = () => {
    handleStop();
    const prevIndex = Math.max(currentSentenceIndex - 1, 0);
    setCurrentSentenceIndex(prevIndex);
  };

  /**
   * 更新设置
   */
  const updateSetting = <K extends keyof VoiceReaderSettings>(
    key: K,
    value: VoiceReaderSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));

    // 如果正在播放，需要重新启动以应用新设置
    if (playbackState === 'playing') {
      const currentIndex = currentSentenceIndex;
      handleStop();
      setCurrentSentenceIndex(currentIndex);
      setTimeout(() => handlePlay(), 100);
    }
  };

  /**
   * 渲染设置面板
   */
  const renderSettingsPanel = () => {
    if (!showSettings) return null;

    return (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="mt-4 p-4 bg-[#1a1a2e] rounded-lg space-y-4"
      >
        {/* 语速 */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">语速: {settings.rate.toFixed(1)}x</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.rate}
            onChange={(e) => updateSetting('rate', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
          />
        </div>

        {/* 音调 */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">音调: {settings.pitch.toFixed(1)}</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.pitch}
            onChange={(e) => updateSetting('pitch', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyber-purple"
          />
        </div>

        {/* 音量 */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">音量: {Math.round(settings.volume * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.volume}
            onChange={(e) => updateSetting('volume', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyber-pink"
          />
        </div>

        {/* 语音选择 */}
        {voices.length > 0 && (
          <div>
            <label className="text-sm text-gray-400 mb-2 block">语音</label>
            <select
              value={settings.voice || ''}
              onChange={(e) => updateSetting('voice', e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0a0f] border border-cyber-cyan/20 rounded-lg text-white focus:outline-none focus:border-cyber-cyan"
            >
              <option value="">默认语音</option>
              {voices
                .filter(voice => voice.lang.startsWith(settings.lang.split('-')[0]))
                .map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
            </select>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div
      className={clsx(
        'bg-[#0a0a0f]/80 backdrop-blur-sm border border-cyber-cyan/20 rounded-lg p-6',
        className
      )}
    >
      {/* 主控制区 */}
      <div className="space-y-4">
        {/* 进度条 */}
        {sentences.length > 0 && (
          <div>
            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
              <span>进度</span>
              <span>
                {currentSentenceIndex + 1} / {sentences.length}
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyber-purple to-cyber-cyan"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentSentenceIndex + 1) / sentences.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* 控制按钮 */}
        <div className="flex items-center justify-center space-x-4">
          {/* 快退 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRewind}
            disabled={playbackState === 'idle' || currentSentenceIndex === 0}
            className={clsx(
              'p-3 rounded-full transition-colors',
              playbackState === 'idle' || currentSentenceIndex === 0
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            )}
          >
            <FiRewind className="w-5 h-5" />
          </motion.button>

          {/* 播放/暂停/停止 */}
          <div className="flex items-center space-x-2">
            {playbackState === 'playing' ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePause}
                  className="p-4 rounded-full bg-cyber-purple text-white hover:bg-cyber-purple/80"
                >
                  <FiPause className="w-6 h-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleStop}
                  className="p-3 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700"
                >
                  <FiStop className="w-5 h-5" />
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePlay}
                disabled={sentences.length === 0}
                className={clsx(
                  'p-4 rounded-full transition-colors',
                  sentences.length === 0
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-cyber-cyan text-black hover:bg-cyber-cyan/80'
                )}
              >
                <FiPlay className="w-6 h-6 ml-1" />
              </motion.button>
            )}
          </div>

          {/* 快进 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleForward}
            disabled={playbackState === 'idle' || currentSentenceIndex >= sentences.length - 1}
            className={clsx(
              'p-3 rounded-full transition-colors',
              playbackState === 'idle' || currentSentenceIndex >= sentences.length - 1
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            )}
          >
            <FiFastForward className="w-5 h-5" />
          </motion.button>

          {/* 音量 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700"
          >
            {isMuted ? (
              <FiVolumeX className="w-5 h-5" />
            ) : (
              <FiVolume2 className="w-5 h-5" />
            )}
          </motion.button>

          {/* 设置 */}
          {showAdvancedSettings && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSettings(!showSettings)}
              className={clsx(
                'p-3 rounded-full transition-colors',
                showSettings
                  ? 'bg-cyber-pink/20 text-cyber-pink'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              )}
            >
              <FiSettings className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* 状态指示 */}
        <div className="text-center">
          <span
            className={clsx(
              'text-sm',
              playbackState === 'playing'
                ? 'text-cyber-cyan'
                : playbackState === 'paused'
                ? 'text-yellow-400'
                : 'text-gray-500'
            )}
          >
            {playbackState === 'playing' && '正在播放...'}
            {playbackState === 'paused' && '已暂停'}
            {playbackState === 'idle' && '准备就绪'}
            {playbackState === 'stopped' && '已停止'}
          </span>
        </div>
      </div>

      {/* 设置面板 */}
      {renderSettingsPanel()}
    </div>
  );
};

export default ArticleVoiceReader;
