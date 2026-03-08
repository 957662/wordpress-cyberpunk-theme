/**
 * useCyberAnimation - 赛博朋克动画 Hook
 * 提供赛博朋克风格的动画控制
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, AnimationControls } from 'framer-motion';

export interface CyberAnimationOptions {
  duration?: number;
  delay?: number;
  repeat?: number;
  repeatType?: 'loop' | 'reverse' | 'mirror';
  ease?: string;
}

/**
 * 赛博朋克故障文字效果
 */
export function useCyberGlitch(text: string, options: CyberAnimationOptions = {}) {
  const [glitchedText, setGlitchedText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  const glitchChars = '!<>-_\\/[]{}—=+*^?#________';

  const triggerGlitch = useCallback(() => {
    setIsGlitching(true);
    let iterations = 0;
    const maxIterations = 10;

    const interval = setInterval(() => {
      setGlitchedText(
        text
          .split('')
          .map((letter, index) => {
            if (index < iterations) {
              return text[index];
            }
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join('')
      );

      if (iterations >= maxIterations) {
        clearInterval(interval);
        setGlitchedText(text);
        setIsGlitching(false);
      }

      iterations += 1 / 3;
    }, 30);
  }, [text]);

  return { glitchedText, isGlitching, triggerGlitch };
}

/**
 * 赛博朋克发光效果
 */
export function useCyberGlow(intensity: number = 1) {
  const controls = useAnimation();
  const glowValue = useMotionValue(0);

  const glowOpacity = useTransform(glowValue, [0, 1], [0.3, 1]);
  const glowBlur = useTransform(glowValue, [0, 1], [10, 30]);

  const startGlow = useCallback(async () => {
    await controls.start({
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    });
  }, [controls]);

  const stopGlow = useCallback(() => {
    controls.stop();
  }, [controls]);

  useEffect(() => {
    startGlow();
    return () => stopGlow();
  }, [startGlow, stopGlow]);

  return { controls, glowOpacity, glowBlur, startGlow, stopGlow };
}

/**
 * 赛博朋克扫描线效果
 */
export function useCyberScanlines(enabled: boolean = true) {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setPosition(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, [enabled]);

  return { position };
}

/**
 * 赛博朋克打字机效果
 */
export function useCyberTypewriter(texts: string[], options: CyberAnimationOptions = {}) {
  const { duration = 100, delay = 2000 } = options;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = texts[currentIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < currentFullText.length) {
            setCurrentText(currentFullText.slice(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), delay);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(currentFullText.slice(0, currentText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? duration / 2 : duration
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentIndex, texts, duration, delay]);

  return { currentText, currentIndex, isDeleting };
}

/**
 * 赛博朋克粒子效果
 */
export function useCyberParticles(count: number = 50) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // 创建粒子
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
    }));

    // 动画循环
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 边界检查
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [count]);

  return { canvasRef };
}

/**
 * 赛博朋克数据流动画
 */
export function useCyberDataStream(enabled: boolean = true) {
  const [streams, setStreams] = useState<Array<{ id: number; position: number; speed: number }>>([]);

  useEffect(() => {
    if (!enabled) return;

    // 创建数据流
    const newStreams = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      position: Math.random() * 100,
      speed: Math.random() * 0.5 + 0.1,
    }));

    setStreams(newStreams);

    const interval = setInterval(() => {
      setStreams(prev =>
        prev.map(stream => ({
          ...stream,
          position: (stream.position + stream.speed) % 100,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [enabled]);

  return streams;
}

/**
 * 赛博朋克翻转卡片效果
 */
export function useCyberCardFlip() {
  const [isFlipped, setIsFlipped] = useState(false);

  const flip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const reset = useCallback(() => {
    setIsFlipped(false);
  }, []);

  return { isFlipped, flip, reset };
}

/**
 * 赛博朋克进度动画
 */
export function useCyberProgress(duration: number = 1000) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let startTime: number | null = null;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);

      setProgress(progress);

      if (progress < 100) {
        animationId = requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [duration]);

  const reset = useCallback(() => {
    setProgress(0);
    setIsComplete(false);
  }, []);

  return { progress, isComplete, reset };
}

/**
 * 赛博朋克波浪动画
 */
export function useCyberWave() {
  const waveRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => (prev + 1) % 360);
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return { waveRef, offset };
}

export default {
  useCyberGlitch,
  useCyberGlow,
  useCyberScanlines,
  useCyberTypewriter,
  useCyberParticles,
  useCyberDataStream,
  useCyberCardFlip,
  useCyberProgress,
  useCyberWave,
};
