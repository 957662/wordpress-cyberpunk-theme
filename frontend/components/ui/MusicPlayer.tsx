'use client';

/**
 * 赛博朋克风格音乐播放器组件
 * 支持播放/暂停、进度条、音量控制、播放列表
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  ListMusic,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  cover?: string;
}

export interface MusicPlayerProps {
  tracks: Track[];
  autoPlay?: boolean;
  showPlaylist?: boolean;
  className?: string;
}

export function MusicPlayer({
  tracks,
  autoPlay = false,
  showPlaylist = true,
  className,
}: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [showPlaylistList, setShowPlaylistList] = useState(showPlaylist);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (isPlaying && progress < 100) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 0.5;
        });
      }, 500);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, progress]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (isShuffle) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (nextIndex === currentTrackIndex && tracks.length > 1);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
    setProgress(0);
  };

  const handlePrev = () => {
    if (progress > 5) {
      setProgress(0);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
      setProgress(0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    setIsMuted(parseFloat(e.target.value) === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (currentTrack.duration * progress) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative bg-cyber-dark/80 backdrop-blur-sm border-2 border-cyber-border rounded-2xl overflow-hidden',
        'shadow-neon-cyan',
        className
      )}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #00f0ff 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

      <div className="relative z-10 p-6">
        {/* Album Art & Track Info */}
        <div className="flex items-center gap-6 mb-6">
          {/* Album Art */}
          <motion.div
            animate={{
              rotate: isPlaying ? 360 : 0,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className={cn(
              'relative rounded-lg overflow-hidden flex-shrink-0',
              'border-2 border-cyber-cyan shadow-neon-cyan'
            )}
            style={{
              width: '120px',
              height: '120px',
            }}
          >
            {currentTrack.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentTrack.cover}
                alt={currentTrack.album || 'Album'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
                <ListMusic className="w-12 h-12 text-white" />
              </div>
            )}
          </motion.div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <motion.h3
              key={currentTrack.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-display font-bold text-white truncate"
            >
              {currentTrack.title}
            </motion.h3>
            <motion.p
              key={`artist-${currentTrack.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-cyber-cyan truncate"
            >
              {currentTrack.artist}
            </motion.p>
            {currentTrack.album && (
              <p className="text-sm text-gray-500 truncate mt-1">{currentTrack.album}</p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
          <div className="relative h-2 bg-cyber-border rounded-full overflow-hidden group cursor-pointer">
            <motion.div
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Shuffle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsShuffle(!isShuffle)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isShuffle ? 'text-cyber-cyan bg-cyber-cyan/10' : 'text-gray-500 hover:text-white'
            )}
          >
            <Shuffle className="w-5 h-5" />
          </motion.button>

          {/* Previous */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="p-3 text-white hover:text-cyber-cyan transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </motion.button>

          {/* Play/Pause */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlayPause}
            className="p-4 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white shadow-neon-cyan"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </motion.button>

          {/* Next */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="p-3 text-white hover:text-cyber-cyan transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </motion.button>

          {/* Repeat */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsRepeat(!isRepeat)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              isRepeat ? 'text-cyber-cyan bg-cyber-cyan/10' : 'text-gray-500 hover:text-white'
            )}
          >
            <Repeat className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Volume & Playlist Toggle */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-cyber-border">
          {/* Volume */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMute}
              className="p-2 text-gray-500 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </motion.button>
            <div className="relative w-24 h-2 bg-cyber-border rounded-full overflow-hidden group cursor-pointer">
              <motion.div
                className="h-full bg-cyber-cyan rounded-full"
                animate={{ width: `${isMuted ? 0 : volume}%` }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Playlist Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPlaylistList(!showPlaylistList)}
            className={cn(
              'p-2 rounded-lg transition-colors flex items-center gap-2',
              showPlaylistList ? 'text-cyber-cyan bg-cyber-cyan/10' : 'text-gray-500 hover:text-white'
            )}
          >
            <ListMusic className="w-5 h-5" />
            <span className="text-sm">播放列表</span>
          </motion.button>
        </div>

        {/* Playlist */}
        <AnimatePresence>
          {showPlaylistList && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-cyber-border overflow-hidden"
            >
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {tracks.map((track, index) => (
                  <motion.button
                    key={track.id}
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      setCurrentTrackIndex(index);
                      setProgress(0);
                      setIsPlaying(true);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
                      index === currentTrackIndex
                        ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30'
                        : 'hover:bg-cyber-muted text-gray-400 hover:text-white'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{track.title}</div>
                      <div className="text-sm opacity-70 truncate">{track.artist}</div>
                    </div>
                    <div className="text-xs opacity-70">{formatTime(track.duration)}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default MusicPlayer;
