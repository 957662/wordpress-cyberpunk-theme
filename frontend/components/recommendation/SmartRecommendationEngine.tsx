'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Recommendation {
  id: string;
  type: 'article' | 'author' | 'topic' | 'series';
  title: string;
  description: string;
  reason: string;
  score: number;
  thumbnail?: string;
  metadata?: {
    readTime?: number;
    category?: string;
    date?: string;
  };
}

interface SmartRecommendationEngineProps {
  recommendations: Recommendation[];
  maxDisplay?: number;
  className?: string;
  onRecommendationClick?: (recommendation: Recommendation) => void;
}

export function SmartRecommendationEngine({
  recommendations,
  maxDisplay = 5,
  className,
  onRecommendationClick,
}: SmartRecommendationEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const displayed = recommendations.slice(0, maxDisplay);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayed.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, displayed.length]);

  const getIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'article':
        return <BookOpen className="w-5 h-5" />;
      case 'author':
        return <Sparkles className="w-5 h-5" />;
      case 'topic':
        return <TrendingUp className="w-5 h-5" />;
      case 'series':
        return <Clock className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'article':
        return 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30';
      case 'author':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'topic':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'series':
        return 'from-orange-500/20 to-red-500/20 border-orange-500/30';
      default:
        return 'from-gray-500/20 to-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyber-cyan" />
          <h3 className="text-lg font-semibold text-white">Recommended for You</h3>
        </div>
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className="px-3 py-1 text-xs bg-cyber-dark/50 border border-cyber-cyan/30 rounded-full text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors"
        >
          {autoPlay ? 'Pause' : 'Play'}
        </button>
      </div>

      {/* Main Recommendation */}
      <AnimatePresence mode="wait">
        {displayed.length > 0 && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onClick={() => onRecommendationClick?.(displayed[currentIndex])}
            className={cn(
              'relative p-6 rounded-xl border-2 cursor-pointer',
              'bg-gradient-to-br backdrop-blur-sm',
              'hover:scale-[1.02] transition-transform duration-300',
              getTypeColor(displayed[currentIndex].type)
            )}
          >
            {/* Type Badge */}
            <div className="absolute top-4 right-4">
              <div className={cn(
                'flex items-center gap-2 px-3 py-1 rounded-full',
                'bg-cyber-dark/50 backdrop-blur-sm text-sm'
              )}>
                {getIcon(displayed[currentIndex].type)}
                <span className="capitalize">{displayed[currentIndex].type}</span>
              </div>
            </div>

            {/* Score Badge */}
            <div className="absolute bottom-4 right-4">
              <div className="flex items-center gap-1 px-2 py-1 bg-cyber-cyan/20 rounded-full">
                <Sparkles className="w-3 h-3 text-cyber-cyan" />
                <span className="text-xs font-semibold text-cyber-cyan">
                  {Math.round(displayed[currentIndex].score * 100)}% match
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3 pr-32">
              <div>
                <h4 className="text-xl font-bold text-white mb-2">
                  {displayed[currentIndex].title}
                </h4>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {displayed[currentIndex].description}
                </p>
              </div>

              {/* Reason */}
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-cyber-purple" />
                <span className="text-gray-400">
                  {displayed[currentIndex].reason}
                </span>
              </div>

              {/* Metadata */}
              {displayed[currentIndex].metadata && (
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  {displayed[currentIndex].metadata.category && (
                    <span>{displayed[currentIndex].metadata.category}</span>
                  )}
                  {displayed[currentIndex].metadata.readTime && (
                    <span>{displayed[currentIndex].metadata.readTime} min read</span>
                  )}
                </div>
              )}
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:animate-shimmer pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dots Indicator */}
      {displayed.length > 1 && (
        <div className="flex items-center justify-center gap-2">
          {displayed.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'bg-cyber-cyan w-8'
                  : 'bg-gray-600 hover:bg-gray-500'
              )}
              aria-label={`Go to recommendation ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* List View */}
      <div className="space-y-2">
        {displayed.map((rec, index) => (
          <motion.button
            key={rec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => {
              setCurrentIndex(index);
              onRecommendationClick?.(rec);
            }}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-lg',
              'text-left transition-all duration-200',
              'hover:bg-cyber-dark/50',
              index === currentIndex
                ? 'bg-cyber-cyan/10 border border-cyber-cyan/30'
                : 'border border-transparent'
            )}
          >
            <div className={cn(
              'p-2 rounded-lg',
              getTypeColor(rec.type)
            )}>
              {getIcon(rec.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-white truncate">
                {rec.title}
              </h5>
              <p className="text-xs text-gray-400 truncate">
                {rec.reason}
              </p>
            </div>
            <ArrowRight className={cn(
              'w-4 h-4 transition-transform duration-200',
              index === currentIndex ? 'text-cyber-cyan rotate-0' : 'text-gray-500 -rotate-45'
            )} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/**
 * 推荐理由组件
 */
interface RecommendationReasonProps {
  type: 'reading_history' | 'similar_topics' | 'popular' | 'trending' | 'new';
  className?: string;
}

export function RecommendationReason({ type, className }: RecommendationReasonProps) {
  const reasons = {
    reading_history: {
      icon: <Clock className="w-4 h-4" />,
      text: 'Based on your reading history',
      color: 'text-blue-400',
    },
    similar_topics: {
      icon: <Sparkles className="w-4 h-4" />,
      text: 'Similar to topics you follow',
      color: 'text-purple-400',
    },
    popular: {
      icon: <TrendingUp className="w-4 h-4" />,
      text: 'Popular in the community',
      color: 'text-green-400',
    },
    trending: {
      icon: <TrendingUp className="w-4 h-4" />,
      text: 'Trending now',
      color: 'text-orange-400',
    },
    new: {
      icon: <Sparkles className="w-4 h-4" />,
      text: 'Fresh content',
      color: 'text-cyan-400',
    },
  };

  const { icon, text, color } = reasons[type];

  return (
    <div className={cn('flex items-center gap-2 text-sm', color, className)}>
      {icon}
      <span>{text}</span>
    </div>
  );
}
