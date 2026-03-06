'use client';

import React, { useMemo } from 'react';
import { Clock, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface ReadingTimeProps {
  content: string;
  wordsPerMinute?: number;
  variant?: 'badge' | 'text' | 'icon';
  showWords?: boolean;
  showProgress?: boolean;
  currentProgress?: number; // 0-100
}

export function ReadingTime({
  content,
  wordsPerMinute = 200,
  variant = 'badge',
  showWords = false,
  showProgress = false,
  currentProgress = 0,
}: ReadingTimeProps) {
  const { minutes, seconds, wordCount } = useMemo(() => {
    // Strip HTML tags and count words
    const textContent = content.replace(/<[^>]*>/g, '');
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    const totalWords = words.length;

    // Calculate reading time
    const totalSeconds = Math.ceil((totalWords / wordsPerMinute) * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return {
      minutes: mins,
      seconds: secs,
      wordCount: totalWords,
    };
  }, [content, wordsPerMinute]);

  const formatTime = () => {
    if (minutes === 0) {
      return `${seconds}秒`;
    }
    if (seconds === 0) {
      return `${minutes}分钟`;
    }
    return `${minutes}分${seconds}秒`;
  };

  const renderBadge = () => (
    <Badge variant="ghost" size="sm" className="gap-1">
      <Clock size={12} />
      <span>{formatTime()}</span>
      {showWords && <span className="text-gray-500">({wordCount}字)</span>}
    </Badge>
  );

  const renderText = () => (
    <span className="text-sm text-gray-400 flex items-center gap-2">
      <Clock size={14} />
      <span>
        阅读时长: {formatTime()}
        {showWords && ` · ${wordCount}字`}
      </span>
    </span>
  );

  const renderIcon = () => (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <Clock size={12} />
      <span>{formatTime()}</span>
    </div>
  );

  const renderWithProgress = () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <BookOpen size={14} />
          <span>阅读进度</span>
        </div>
        <span className="text-cyber-cyan">{Math.round(currentProgress)}%</span>
      </div>
      <div className="h-1 bg-cyber-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple transition-all duration-300"
          style={{ width: `${currentProgress}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock size={10} />
          {formatTime()}
        </span>
        {showWords && <span>{wordCount}字</span>}
      </div>
    </div>
  );

  if (showProgress) {
    return renderWithProgress();
  }

  if (variant === 'badge') {
    return renderBadge();
  }

  if (variant === 'text') {
    return renderText();
  }

  return renderIcon();
}

// Hook to track reading progress
export function useReadingProgress() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const trackLength = documentHeight - windowHeight;
      const percentScrolled = Math.min((scrollTop / trackLength) * 100, 100);

      setProgress(percentScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

// Hook to estimate reading time for scroll-based progress
export function useEstimatedReadingTime(content: string, wordsPerMinute: number = 200) {
  const { minutes, seconds } = useMemo(() => {
    const textContent = content.replace(/<[^>]*>/g, '');
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    const totalWords = words.length;
    const totalSeconds = Math.ceil((totalWords / wordsPerMinute) * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return { minutes: mins, seconds: secs };
  }, [content, wordsPerMinute]);

  const totalSeconds = minutes * 60 + seconds;

  const progress = useReadingProgress();
  const timeElapsed = Math.floor((progress / 100) * totalSeconds);
  const timeRemaining = totalSeconds - timeElapsed;

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    if (mins === 0) return `${secs}秒`;
    if (secs === 0) return `${mins}分钟`;
    return `${mins}分${secs}秒`;
  };

  return {
    totalReadingTime: { minutes, seconds },
    timeElapsed: formatTime(timeElapsed),
    timeRemaining: formatTime(timeRemaining),
    progress,
  };
}
