/**
 * TextScramble Component - 文字乱码动画组件
 * 赛博朋克风格的文字解码动画效果
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const CHARACTERS = '!<>-_\\/[]{}—=+*^?#________';

export interface TextScrambleProps {
  text: string;
  className?: string;
  speed?: number;
  scrambleLength?: number;
  revealDuration?: number;
  onScrambleComplete?: () => void;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export function TextScramble({
  text,
  className,
  speed = 50,
  scrambleLength = 20,
  revealDuration = 1000,
  onScrambleComplete,
  as: Component = 'span',
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);

  const scramble = (input: string, duration: number) => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      let output = '';
      for (let i = 0; i < input.length; i++) {
        if (i < progress * input.length) {
          output += input[i];
        } else {
          output += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        }
      }

      setDisplayText(output);

      if (now < endTime) {
        setTimeout(animate, speed);
      } else {
        setDisplayText(input);
        setIsAnimating(false);
        onScrambleComplete?.();
      }
    };

    setIsAnimating(true);
    animate();
  };

  useEffect(() => {
    if (text !== displayText && !isAnimating) {
      const timeout = setTimeout(() => {
        scramble(text, revealDuration);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [text]);

  return (
    <Component className={cn(className)}>
      {displayText}
    </Component>
  );
}

/**
 * TextDecode Component - 文字解码动画
 * 逐字显示的解码效果
 */
export interface TextDecodeProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
}

export function TextDecode({
  text,
  className,
  delay = 0,
  speed = 30,
  onComplete,
}: TextDecodeProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const revealNext = () => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
        timeout = setTimeout(revealNext, speed);
      } else {
        onComplete?.();
      }
    };

    timeout = setTimeout(revealNext, delay);

    return () => clearTimeout(timeout);
  }, [currentIndex, text, speed, delay, onComplete]);

  return <span className={className}>{displayText}</span>;
}

/**
 * TextGlitch Component - 文字故障效果
 */
export interface TextGlitchProps {
  text: string;
  className?: string;
  hover?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export function TextGlitch({
  text,
  className,
  hover = true,
  intensity = 'medium',
}: TextGlitchProps) {
  const [isHovered, setIsHovered] = useState(false);

  const glitchChars = {
    low: 1,
    medium: 3,
    high: 5,
  };

  const generateGlitch = () => {
    if (!isHovered || !hover) return text;

    const chars = glitchChars[intensity];
    let result = '';

    for (let i = 0; i < text.length; i++) {
      if (Math.random() < 0.1) {
        for (let j = 0; j < chars; j++) {
          result += CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
        }
      }
      result += text[i];
    }

    return result;
  };

  return (
    <motion.span
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        textShadow: isHovered && hover
          ? [
              '2px 0 #ff00ff, -2px 0 #00ffff',
              '-2px 0 #ff00ff, 2px 0 #00ffff',
              '2px 0 #ff00ff, -2px 0 #00ffff',
            ]
          : 'none',
      }}
      transition={{
        duration: 0.1,
        repeat: isHovered && hover ? Infinity : 0,
      }}
    >
      {generateGlitch()}
    </motion.span>
  );
}

/**
 * TextCycle Component - 文字循环切换
 */
export interface TextCycleProps {
  texts: string[];
  className?: string;
  interval?: number;
  animation?: 'fade' | 'slide' | 'scramble';
}

export function TextCycle({
  texts,
  className,
  interval = 3000,
  animation = 'fade',
}: TextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  if (animation === 'fade') {
    return (
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className={className}
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    );
  }

  if (animation === 'slide') {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="block"
          >
            {texts[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    );
  }

  return <TextScramble text={texts[currentIndex]} className={className} />;
}

/**
 * TypeWriter Component - 打字机效果
 */
export interface TypeWriterProps {
  text: string | string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  delay?: number;
  pauseDuration?: number;
  loop?: boolean;
  cursor?: boolean;
  onComplete?: () => void;
}

export function TypeWriter({
  text: texts,
  className,
  speed = 100,
  deleteSpeed = 50,
  delay = 0,
  pauseDuration = 2000,
  loop = true,
  cursor = true,
  onComplete,
}: TypeWriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const textArray = Array.isArray(texts) ? texts : [texts];

  useEffect(() => {
    const currentText = textArray[textIndex];
    const timeout = setTimeout(() => {
      if (isPaused) {
        setIsPaused(false);
        setIsDeleting(true);
        return;
      }

      if (isDeleting) {
        setDisplayText(currentText.slice(0, displayText.length - 1));

        if (displayText.length === 1) {
          setIsDeleting(false);
          setTextIndex((prev) => {
            const next = (prev + 1) % textArray.length;
            if (next === 0 && !loop) {
              onComplete?.();
            }
            return next;
          });
        }
      } else {
        setDisplayText(currentText.slice(0, displayText.length + 1));

        if (displayText.length === currentText.length - 1) {
          if (textIndex === textArray.length - 1 && !loop) {
            onComplete?.();
          } else {
            setIsPaused(true);
            setTimeout(() => setIsPaused(false), pauseDuration);
          }
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, isPaused, textIndex, textArray, speed, deleteSpeed, pauseDuration, loop, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="inline-block w-0.5 h-4 bg-cyber-cyan ml-1"
        />
      )}
    </span>
  );
}
