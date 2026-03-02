'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
}

export default function Typewriter({
  texts,
  speed = 100,
  deleteSpeed = 50,
  delay = 2000,
  className = '',
  cursor = true,
}: TypewriterProps) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const targetText = texts[currentIndex];

      if (isPaused) {
        setIsPaused(false);
        return;
      }

      if (isDeleting) {
        if (currentText.length > 0) {
          setCurrentText(targetText.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        if (currentText.length < targetText.length) {
          setCurrentText(targetText.slice(0, currentText.length + 1));
        } else {
          setIsPaused(true);
          setTimeout(() => setIsDeleting(true), delay);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, isPaused, texts, speed, deleteSpeed, delay]);

  return (
    <span className={className}>
      <motion.span
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {currentText}
      </motion.span>
      {cursor && (
        <motion.span
          className="inline-block w-0.5 h-1.5 bg-cyber-cyan ml-1 align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </span>
  );
}
