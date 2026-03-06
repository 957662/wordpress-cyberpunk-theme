'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../Button';

interface BookmarkButtonEnhancedProps {
  postId: string;
  initialBookmarked?: boolean;
  onBookmark?: (postId: string, bookmarked: boolean) => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'icon-only';
  showLabel?: boolean;
  className?: string;
}

const BookmarkButtonEnhanced: React.FC<BookmarkButtonEnhancedProps> = ({
  postId,
  initialBookmarked = false,
  onBookmark,
  size = 'md',
  variant = 'default',
  showLabel = true,
  className = '',
}) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Load bookmark state from localStorage
    const saved = localStorage.getItem('bookmarked_posts');
    if (saved) {
      const bookmarkedPosts = JSON.parse(saved);
      setIsBookmarked(bookmarkedPosts.includes(postId));
    }
  }, [postId]);

  const handleBookmark = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const newState = !isBookmarked;

    // Optimistic update
    setIsBookmarked(newState);

    if (newState) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 1000);
    }

    try {
      if (onBookmark) {
        await onBookmark(postId, newState);
      }

      // Save to localStorage
      const saved = localStorage.getItem('bookmarked_posts');
      const bookmarkedPosts = saved ? JSON.parse(saved) : [];

      if (newState) {
        bookmarkedPosts.push(postId);
      } else {
        const index = bookmarkedPosts.indexOf(postId);
        if (index > -1) bookmarkedPosts.splice(index, 1);
      }

      localStorage.setItem('bookmarked_posts', JSON.stringify(bookmarkedPosts));
    } catch (error) {
      console.error('Bookmark error:', error);
      setIsBookmarked(!newState);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeStyles = {
    sm: { fontSize: '14px', padding: '6px 12px', iconSize: '16px' },
    md: { fontSize: '16px', padding: '8px 16px', iconSize: '20px' },
    lg: { fontSize: '18px', padding: '12px 20px', iconSize: '24px' },
  };

  const renderDefault = () => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={handleBookmark}
        disabled={isLoading}
        variant={isBookmarked ? 'primary' : 'ghost'}
        size={size}
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: isBookmarked ? '1px solid #9d00ff' : '1px solid rgba(0, 240, 255, 0.3)',
          background: isBookmarked
            ? 'linear-gradient(135deg, #9d00ff 0%, #00f0ff 100%)'
            : 'rgba(0, 0, 0, 0.5)',
          color: '#fff',
          transition: 'all 0.3s ease',
        }}
      >
        <motion.span
          animate={isBookmarked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
          style={{ fontSize: sizeStyles[size].iconSize }}
        >
          {isBookmarked ? '🔖' : '📑'}
        </motion.span>
        {showLabel && (
          <span style={{ fontSize: sizeStyles[size].fontSize }}>
            {isBookmarked ? 'Saved' : 'Save'}
          </span>
        )}
      </Button>
    </motion.div>
  );

  const renderMinimal = () => (
    <motion.button
      onClick={handleBookmark}
      disabled={isLoading}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        color: isBookmarked ? '#9d00ff' : '#00f0ff',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'color 0.3s ease',
      }}
    >
      <motion.span
        animate={isBookmarked ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.3 }}
        style={{ fontSize: '20px' }}
      >
        {isBookmarked ? '🔖' : '📑'}
      </motion.span>
      {showLabel && (
        <span style={{ fontSize: '13px', fontWeight: 600 }}>
          {isBookmarked ? 'Saved' : 'Save'}
        </span>
      )}
    </motion.button>
  );

  const renderIconOnly = () => (
    <motion.button
      onClick={handleBookmark}
      disabled={isLoading}
      whileHover={{ scale: 1.1, rotate: isBookmarked ? 0 : 12 }}
      whileTap={{ scale: 0.9 }}
      style={{
        background: isBookmarked
          ? 'linear-gradient(135deg, #9d00ff 0%, #00f0ff 100%)'
          : 'rgba(0, 240, 255, 0.1)',
        border: `1px solid ${isBookmarked ? '#9d00ff' : 'rgba(0, 240, 255, 0.3)'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        padding: '10px',
        fontSize: '20px',
        transition: 'all 0.3s ease',
        boxShadow: isBookmarked ? '0 0 20px rgba(157, 0, 255, 0.5)' : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.span
        animate={isBookmarked ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.4, type: 'spring' }}
      >
        {isBookmarked ? '🔖' : '📑'}
      </motion.span>

      {/* Sparkle effect on bookmark */}
      {showAnimation && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 60],
                y: [0, (Math.random() - 0.5) * 60],
                opacity: [1, 0],
              }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                fontSize: '12px',
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}
    </motion.button>
  );

  return (
    <div className="bookmark-button-enhanced">
      {variant === 'minimal' && renderMinimal()}
      {variant === 'default' && renderDefault()}
      {variant === 'icon-only' && renderIconOnly()}

      <style jsx>{`
        .bookmark-button-enhanced :global(button:disabled) {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes bookmark-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(157, 0, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(157, 0, 255, 0.8), 0 0 50px rgba(0, 240, 255, 0.4);
          }
        }
      `}</style>
    </div>
  );
};

export default BookmarkButtonEnhanced;
