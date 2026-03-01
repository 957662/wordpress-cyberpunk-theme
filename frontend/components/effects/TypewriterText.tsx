/**
 * 打字机文字效果
 */

'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  className,
  speed = 50,
  delay = 0,
  cursor = true,
  onComplete,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let index = 0;

    const start = () => {
      timeout = setTimeout(() => {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index));
          index++;
          if (index <= text.length) {
            timeout = setTimeout(start, speed);
          } else {
            setIsComplete(true);
            onComplete?.();
          }
        }
      }, speed);
    };

    const initialDelay = setTimeout(start, delay);

    return () => {
      clearTimeout(timeout);
      clearTimeout(initialDelay);
    };
  }, [text, speed, delay, onComplete]);

  return (
    <span className={cn('font-mono', className)}>
      {displayedText}
      {cursor && !isComplete && (
        <motion.span
          className="inline-block w-0.5 h-5 bg-cyber-cyan ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </span>
  );
}
