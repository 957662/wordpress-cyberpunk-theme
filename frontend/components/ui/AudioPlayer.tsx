/**
 * AudioPlayer Component
 * 音频播放器组件
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  album?: string;
  cover?: string;
  autoPlay?: boolean;
  loop?: boolean;
  showSkipButtons?: boolean;
  showVolumeControl?: boolean;
  variant?: 'default' | 'neon' | 'cyber';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onProgress?: (progress: number) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title,
  artist,
  album,
  cover,
  autoPlay = false,
  loop = false,
  showSkipButtons = true,
  showVolumeControl = true,
  variant = 'default',
  size = 'md',
  className = '',
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onProgress,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const setAudioProgress = () => {
      const current = audio.currentTime;
      const dur = audio.duration;
      setCurrentTime(current);
      setProgress((current / dur) * 100);
      onTimeUpdate?.(current);
      onProgress?.((current / dur) * 100);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioProgress);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioProgress);
    };
  }, [onTimeUpdate, onProgress]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
      onPlay?.();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skipBack = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.min(duration, audio.currentTime + 10);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const sizeStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const variantStyles = {
    default: 'border-cyber-border',
    neon: 'border-cyber-cyan shadow-neon-cyan',
    cyber: 'border-cyber-purple shadow-neon-purple',
  };

  return (
    <div
      className={cn(
        'bg-cyber-card border-2 rounded-lg',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      <audio
        ref={audioRef}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
      />

      <div className="flex items-center gap-4">
        {/* Cover Art */}
        {cover && (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={cover}
              alt={title || 'Album Cover'}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          {title && (
            <div className="text-white font-semibold truncate">{title}</div>
          )}
          {artist && <div className="text-sm text-gray-400 truncate">{artist}</div>}
          {album && <div className="text-xs text-gray-500 truncate">{album}</div>}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {showSkipButtons && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={skipBack}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <SkipBack size={20} />
              </motion.button>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className={cn(
              'p-3 rounded-full',
              isPlaying
                ? 'bg-cyber-cyan text-cyber-dark'
                : 'bg-cyber-purple text-white'
            )}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </motion.button>

          {showSkipButtons && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={skipForward}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <SkipForward size={20} />
              </motion.button>
            </>
          )}
        </div>

        {/* Volume Control */}
        {showVolumeControl && (
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMute}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </motion.button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 accent-cyber-cyan"
            />
          </div>
        )}

        {/* Progress Bar */}
        <div className="flex-1 min-w-[200px] flex items-center gap-2">
          <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="flex-1 accent-cyber-cyan"
          />
          <span className="text-xs text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
