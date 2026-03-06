'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../Button';

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
  isInitiallyLiked?: boolean;
  onLike?: (postId: string, liked: boolean) => Promise<void>;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'animated';
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialLikes = 0,
  isInitiallyLiked = false,
  onLike,
  showCount = true,
  size = 'md',
  variant = 'animated',
  className = '',
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [isLoading, setIsLoading] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  // Load like state from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem('liked_posts');
    if (savedLikes) {
      const likedPosts = JSON.parse(savedLikes);
      setIsLiked(likedPosts.includes(postId));
    }
  }, [postId]);

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const newLikedState = !isLiked;

    // Optimistic update
    setLikes((prev) => (newLikedState ? prev + 1 : prev - 1));
    setIsLiked(newLikedState);

    if (newLikedState) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1000);
    }

    try {
      if (onLike) {
        await onLike(postId, newLikedState);
      }

      // Save to localStorage
      const savedLikes = localStorage.getItem('liked_posts');
      const likedPosts = savedLikes ? JSON.parse(savedLikes) : [];

      if (newLikedState) {
        likedPosts.push(postId);
      } else {
        const index = likedPosts.indexOf(postId);
        if (index > -1) likedPosts.splice(index, 1);
      }

      localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
    } catch (error) {
      console.error('Like error:', error);
      // Revert on error
      setLikes((prev) => (newLikedState ? prev - 1 : prev + 1));
      setIsLiked(!newLikedState);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '12px', gap: '4px' },
    md: { padding: '8px 16px', fontSize: '14px', gap: '6px' },
    lg: { padding: '12px 20px', fontSize: '16px', gap: '8px' },
  };

  const renderDefault = () => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="like-button-default"
    >
      <Button
        onClick={handleLike}
        disabled={isLoading}
        variant={isLiked ? 'primary' : 'ghost'}
        size={size}
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: sizeStyles[size].gap,
          padding: sizeStyles[size].padding,
          border: isLiked ? '1px solid #ff0080' : '1px solid rgba(0, 240, 255, 0.3)',
          background: isLiked
            ? 'linear-gradient(135deg, #ff0080 0%, #9d00ff 100%)'
            : 'rgba(0, 0, 0, 0.5)',
          color: isLiked ? '#fff' : '#00f0ff',
          transition: 'all 0.3s ease',
        }}
      >
        <motion.span
          animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
          style={{ fontSize: sizeStyles[size].fontSize }}
        >
          {isLiked ? '❤️' : '🤍'}
        </motion.span>
        {showCount && (
          <motion.span
            key={likes}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ fontSize: sizeStyles[size].fontSize }}
          >
            {likes.toLocaleString()}
          </motion.span>
        )}
      </Button>
    </motion.div>
  );

  const renderMinimal = () => (
    <motion.button
      onClick={handleLike}
      disabled={isLoading}
      className={`like-button-minimal ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: isLiked ? '#ff0080' : '#00f0ff',
        transition: 'color 0.3s ease',
      }}
    >
      <motion.span
        animate={isLiked ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.3 }}
        style={{ fontSize: '20px' }}
      >
        {isLiked ? '♥' : '♡'}
      </motion.span>
      {showCount && (
        <span style={{ fontSize: '13px', fontWeight: 600 }}>
          {likes.toLocaleString()}
        </span>
      )}
    </motion.button>
  );

  const renderAnimated = () => (
    <motion.div
      className={`like-button-animated ${className}`}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <motion.button
        onClick={handleLike}
        disabled={isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: sizeStyles[size].padding,
          background: isLiked
            ? 'linear-gradient(135deg, #ff0080 0%, #ff0080 50%, #9d00ff 100%)'
            : 'rgba(0, 0, 0, 0.5)',
          border: `2px solid ${isLiked ? '#ff0080' : 'rgba(0, 240, 255, 0.3)'}`,
          borderRadius: '50px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: sizeStyles[size].gap,
          color: '#fff',
          fontSize: sizeStyles[size].fontSize,
          fontWeight: '600',
          boxShadow: isLiked
            ? '0 0 20px rgba(255, 0, 128, 0.6), 0 0 40px rgba(255, 0, 128, 0.3)'
            : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <motion.span
          animate={isLiked ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.5 }}
          style={{ fontSize: `calc(${sizeStyles[size].fontSize} + 4px)` }}
        >
          {isLiked ? '❤️' : '🤍'}
        </motion.span>
        {showCount && (
          <motion.span
            key={likes}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ fontWeight: 700 }}
          >
            {likes.toLocaleString()}
          </motion.span>
        )}
      </motion.button>

      {/* Particle Effects */}
      {showParticles && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0],
                x: [0, (i - 2.5) * 30],
                y: [0, -50 - Math.random() * 30],
                opacity: [1, 0],
              }}
              transition={{ duration: 1, delay: i * 0.05 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                fontSize: '12px',
              }}
            >
              {['💖', '✨', '💕', '❤️', '💗', '💓'][i]}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="like-button-wrapper">
      {variant === 'minimal' && renderMinimal()}
      {variant === 'default' && renderDefault()}
      {variant === 'animated' && renderAnimated()}

      <style jsx>{`
        .like-button-wrapper {
          display: inline-block;
        }

        .like-button-wrapper :global(button:disabled) {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Glow animation for liked state */
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 0, 128, 0.6);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 0, 128, 0.8), 0 0 50px rgba(255, 0, 128, 0.4);
          }
        }

        .like-button-animated button {
          animation: ${isLiked ? 'pulse-glow 2s ease-in-out infinite' : 'none'};
        }
      `}</style>
    </div>
  );
};

export default LikeButton;
