'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Clock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeaturedArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  views: number;
  readTime: number;
  featured: boolean;
  badge?: string;
}

interface FeaturedArticlesProps {
  articles: FeaturedArticle[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  aspectRatio?: '16:9' | '21:9' | '4:3';
}

export const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({
  articles,
  className,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  aspectRatio = '16:9',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || articles.length <= 1) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, articles.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const aspectRatioClasses = {
    '16:9': 'aspect-video',
    '21:9': 'aspect-[21/9]',
    '4:3': 'aspect-[4/3]',
  };

  if (articles.length === 0) {
    return null;
  }

  const currentArticle = articles[currentIndex];

  return (
    <div className={cn('relative w-full overflow-hidden rounded-xl', className)}>
      {/* Main Slider */}
      <div className={cn('relative overflow-hidden', aspectRatioClasses[aspectRatio])}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${currentArticle.image})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-cyber-dark/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-dark/80 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
              {/* Badge */}
              <div className="flex items-center gap-3 mb-4">
                {currentArticle.featured && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="flex items-center gap-1 px-3 py-1 bg-cyber-pink/20 border border-cyber-pink rounded-full"
                  >
                    <Star className="w-3 h-3 fill-cyber-pink text-cyber-pink" />
                    <span className="text-xs font-semibold text-cyber-pink">精选</span>
                  </motion.div>
                )}

                {currentArticle.badge && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="px-3 py-1 text-xs bg-cyber-cyan/20 border border-cyber-cyan rounded-full text-cyber-cyan"
                  >
                    {currentArticle.badge}
                  </motion.span>
                )}

                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="px-3 py-1 text-xs bg-cyber-purple/20 border border-cyber-purple rounded-full text-cyber-purple"
                >
                  {currentArticle.category}
                </motion.span>
              </div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl md:text-5xl font-bold text-cyber-white mb-4 line-clamp-2"
              >
                {currentArticle.title}
              </motion.h1>

              {/* Excerpt */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-cyber-gray text-sm md:text-base mb-6 line-clamp-2 max-w-2xl"
              >
                {currentArticle.excerpt}
              </motion.p>

              {/* Meta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-6 text-sm"
              >
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyber-cyan">
                    <img
                      src={currentArticle.author.avatar}
                      alt={currentArticle.author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-cyber-white font-semibold">
                      {currentArticle.author.name}
                    </div>
                    <div className="text-cyber-gray text-xs">
                      {new Date(currentArticle.publishedAt).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-cyber-gray">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{currentArticle.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{currentArticle.readTime} 分钟</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {showArrows && articles.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-cyber-dark/80 backdrop-blur-sm border border-cyber-cyan/30 rounded-full text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-cyber-dark/80 backdrop-blur-sm border border-cyber-cyan/30 rounded-full text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </>
      )}

      {/* Dots */}
      {showDots && articles.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'w-8 bg-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.8)]'
                  : 'bg-cyber-gray/50 hover:bg-cyber-gray'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {autoPlay && articles.length > 1 && (
        <motion.div
          key={currentIndex}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink origin-left"
        />
      )}
    </div>
  );
};

export default FeaturedArticles;
