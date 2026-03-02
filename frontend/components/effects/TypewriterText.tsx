/**
 * 打字机文字效果 - 支持多文本循环
 */

'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TypewriterTextProps {
  text?: string;
  texts?: string[];
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  loop?: boolean;
  pauseDuration?: number;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  texts,
  className,
  speed = 100,
  delay = 0,
  cursor = true,
  loop = true,
  pauseDuration = 2000,
  onComplete,
}: TypewriterTextProps) {
  const textArray = texts || (text ? [text] : ['']);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let charIndex = displayedText.length;

    const type = () => {
      const currentText = textArray[currentIndex];

      if (isPaused) {
        timeout = setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
        return;
      }

      if (isDeleting) {
        if (charIndex > 0) {
          setDisplayedText(currentText.slice(0, charIndex - 1));
          timeout = setTimeout(type, speed / 2);
        } else {
          setIsDeleting(false);
          if (loop) {
            setCurrentIndex((prev) => (prev + 1) % textArray.length);
          } else if (currentIndex < textArray.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          } else {
            onComplete?.();
            return;
          }
          timeout = setTimeout(type, speed);
        }
      } else {
        if (charIndex < currentText.length) {
          setDisplayedText(currentText.slice(0, charIndex + 1));
          timeout = setTimeout(type, speed);
        } else {
          if (loop || currentIndex < textArray.length - 1) {
            setIsPaused(true);
            timeout = setTimeout(type, speed);
          } else {
            onComplete?.();
          }
        }
      }
    };

    const initialDelay = setTimeout(() => {
      timeout = setTimeout(type, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearTimeout(initialDelay);
    };
  }, [textArray, currentIndex, isDeleting, isPaused, speed, delay, pauseDuration, loop, displayedText.length, onComplete]);

  return (
    <span className={cn('font-mono', className)}>
      {displayedText}
      {cursor && (
        <motion.span
          className="inline-block w-0.5 h-5 bg-cyber-cyan ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </span>
  );
}
