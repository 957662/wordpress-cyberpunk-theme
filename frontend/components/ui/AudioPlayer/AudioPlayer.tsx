/**
 * CyberPress Platform - AudioPlayer Component
 * 音频播放器组件 - 赛博朋克风格
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover?: string;
  duration?: number;
}

export interface AudioPlayerProps {
  tracks: AudioTrack[];
  autoPlay?: boolean;
  showPlaylist?: boolean;
  className?: string;
}

export function AudioPlayer({
  tracks,
  autoPlay = false,
  showPlaylist = true,
  className,
}: AudioPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(showPlaylist);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  // 播放/暂停
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 上一首
  const playPrevious = () => {
    const newIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(newIndex);
    setCurrentTime(0);
  };

  // 下一首
  const playNext = () => {
    const newIndex = currentTrackIndex === tracks.length - 1 ? 0 : currentTrackIndex + 1;
    setCurrentTrackIndex(newIndex);
    setCurrentTime(0);
  };

  // 进度条点击
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
    setCurrentTime(percent * duration);
  };

  // 音量控制
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // 时间格式化
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 音频事件监听
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  // 自动播放
  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrackIndex, autoPlay]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn('bg-cyber-card border border-cyber-border rounded-lg overflow-hidden', className)}>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
      />

      {/* 主控制区 */}
      <div className="p-6">
        {/* 专辑封面 */}
        <div className="flex items-center space-x-4 mb-6">
          <motion.div
            className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-cyber-cyan/30 shadow-neon-cyan"
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={isPlaying ? { duration: 8, repeat: Infinity, ease: 'linear' } : {}}
          >
            {currentTrack.cover ? (
              <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
                <svg className="w-8 h-8 text-cyber-dark" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-cyber-cyan truncate">{currentTrack.title}</h3>
            <p className="text-sm text-cyber-muted">{currentTrack.artist}</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaylistVisible(!isPlaylistVisible)}
            className="p-2 text-cyber-muted hover:text-cyber-cyan transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>

        {/* 进度条 */}
        <div
          ref={progressBarRef}
          className="relative h-2 bg-cyber-darker rounded-full cursor-pointer mb-2 group"
          onClick={handleProgressClick}
        >
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-cyber-cyan rounded-full shadow-neon-cyan"
              style={{ left: `${progress}%` }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        </div>

        <div className="flex justify-between text-xs text-cyber-muted mb-4">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={playPrevious}
            className="p-2 text-cyber-muted hover:text-cyber-cyan transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlayPause}
            className="p-4 bg-cyber-cyan text-cyber-dark rounded-full shadow-neon-cyan hover:shadow-neon-cyan-lg transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={playNext}
            className="p-2 text-cyber-muted hover:text-cyber-cyan transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </motion.button>
        </div>

        {/* 音量控制 */}
        <div className="flex items-center space-x-2 mt-4">
          <Volume2 className="w-4 h-4 text-cyber-muted" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-cyber-darker rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #00f0ff ${volume * 100}%, #1a1a2e ${volume * 100}%)`,
            }}
          />
        </div>
      </div>

      {/* 播放列表 */}
      <AnimatePresence>
        {isPlaylistVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-cyber-border"
          >
            <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
              {tracks.map((track, index) => (
                <motion.button
                  key={track.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setCurrentTrackIndex(index)}
                  className={cn(
                    'w-full flex items-center space-x-3 p-3 rounded-lg transition-all',
                    'hover:bg-cyber-border/20',
                    index === currentTrackIndex && 'bg-cyber-cyan/10 border border-cyber-cyan/30'
                  )}
                >
                  <span className="text-sm text-cyber-muted w-6">{index + 1}</span>
                  <div className="flex-1 min-w-0 text-left">
                    <div
                      className={cn(
                        'text-sm font-medium truncate',
                        index === currentTrackIndex ? 'text-cyber-cyan' : 'text-gray-300'
                      )}
                    >
                      {track.title}
                    </div>
                    <div className="text-xs text-cyber-muted truncate">{track.artist}</div>
                  </div>
                  {index === currentTrackIndex && isPlaying && (
                    <motion.div
                      className="flex space-x-0.5"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1 h-4 bg-cyber-cyan rounded-full" />
                      ))}
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
