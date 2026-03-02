import { useState, useEffect, useCallback } from 'react';

interface UseTypewriterProps {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  onComplete?: () => void;
}

export function useTypewriter({
  words,
  typeSpeed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
  loop = true,
  onComplete,
}: UseTypewriterProps) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);

      return () => clearTimeout(pauseTimeout);
    }

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (text.length < currentWord.length) {
          setText(currentWord.slice(0, text.length + 1));
        } else {
          // Word completed
          if (wordIndex === words.length - 1 && !loop) {
            onComplete?.();
            return;
          }
          setIsPaused(true);
        }
      } else {
        // Deleting
        if (text.length > 0) {
          setText(currentWord.slice(0, text.length - 1));
        } else {
          // Deletion completed
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timeout);
  }, [text, wordIndex, isDeleting, isPaused, words, typeSpeed, deleteSpeed, pauseDuration, loop, onComplete]);

  const reset = useCallback(() => {
    setText('');
    setWordIndex(0);
    setIsDeleting(false);
    setIsPaused(false);
  }, []);

  return { text, reset };
}

interface TypewriterReturn {
  displayText: string;
  isTyping: boolean;
  isDeleting: boolean;
  currentWordIndex: number;
}

export function useTypewriterEffect(words: string[], options?: Partial<UseTypewriterProps>): TypewriterReturn {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const {
      typeSpeed = 100,
      deleteSpeed = 50,
      pauseDuration = 2000,
    } = options || {};

    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else {
          setIsTyping(false);
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setIsTyping(true);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, currentWordIndex, isDeleting, isTyping, words, options]);

  return { displayText, isTyping, isDeleting, currentWordIndex };
}
