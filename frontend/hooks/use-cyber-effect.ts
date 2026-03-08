/**
 * CyberPress Custom Hooks
 * 赛博朋克效果自定义 Hooks
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 使用故障效果
 */
export function useGlitchEffect(enabled: boolean = true, intensity: number = 0.5) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      if (Math.random() < intensity) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 100);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [enabled, intensity]);

  return isGlitching;
}

/**
 * 使用霓虹发光效果
 */
export function useNeonGlow(color: 'cyan' | 'purple' | 'pink' | 'green' = 'cyan') {
  const [glowIntensity, setGlowIntensity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => {
        const change = (Math.random() - 0.5) * 0.2;
        return Math.max(0.5, Math.min(1.5, prev + change));
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const glowStyle = {
    textShadow: `0 0 ${10 * glowIntensity}px currentColor, 0 0 ${20 * glowIntensity}px currentColor`,
  };

  return { glowIntensity, glowStyle };
}

/**
 * 使用扫描线效果
 */
export function useScanlineEffect(enabled: boolean = true, speed: number = 1) {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setPosition(prev => (prev + speed) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, [enabled, speed]);

  const scanlineStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.5), transparent)',
    transform: `translateY(${position}%)`,
    pointerEvents: 'none',
    zIndex: 10,
  };

  return { position, scanlineStyle };
}

/**
 * 使用全息投影效果
 */
export function useHologramEffect(enabled: boolean = true) {
  const [opacity, setOpacity] = useState(0.8);
  const [distortion, setDistortion] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const opacityInterval = setInterval(() => {
      setOpacity(prev => {
        const change = (Math.random() - 0.5) * 0.1;
        return Math.max(0.6, Math.min(1, prev + change));
      });
    }, 100);

    const distortionInterval = setInterval(() => {
      setDistortion(Math.random() * 2);
    }, 200);

    return () => {
      clearInterval(opacityInterval);
      clearInterval(distortionInterval);
    };
  }, [enabled]);

  const hologramStyle: React.CSSProperties = {
    opacity,
    filter: `blur(${distortion * 0.5}px)`,
    transform: `translateX(${distortion}px)`,
  };

  return { opacity, distortion, hologramStyle };
}

/**
 * 使用粒子动画效果
 */
export function useParticleEffect(count: number = 50) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 初始化粒子
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      // 清理
    };
  }, [count]);

  return canvasRef;
}

/**
 * 使用赛博朋克主题切换
 */
export function useCyberTheme() {
  const [theme, setTheme] = useState<'cyber' | 'neon' | 'matrix'>('cyber');

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const themes: Array<'cyber' | 'neon' | 'matrix'> = ['cyber', 'neon', 'matrix'];
      const currentIndex = themes.indexOf(prev);
      const nextIndex = (currentIndex + 1) % themes.length;
      return themes[nextIndex];
    });
  }, []);

  const themeStyles = {
    cyber: {
      primary: '#00f0ff',
      secondary: '#9d00ff',
      accent: '#ff0080',
      background: '#0a0a0f',
    },
    neon: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ffff00',
      background: '#0a0a0f',
    },
    matrix: {
      primary: '#00ff00',
      secondary: '#003300',
      accent: '#00ff00',
      background: '#000500',
    },
  };

  return { theme, toggleTheme, colors: themeStyles[theme] };
}

/**
 * 使用数据流动画
 */
export function useDataFlow() {
  const [dataPoints, setDataPoints] = useState<Array<{ x: number; y: number; value: number }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints(prev => {
        const newPoint = {
          x: Math.random() * 100,
          y: Math.random() * 100,
          value: Math.random(),
        };

        return [...prev.slice(-9), newPoint];
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return dataPoints;
}

/**
 * 使用打字机效果
 */
export function useTypewriter(text: string, speed: number = 50) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [text, currentIndex, speed]);

  const reset = useCallback(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, []);

  return { displayText, isComplete: currentIndex === text.length, reset };
}

/**
 * 使用滚动进度
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

/**
 * 使用鼠标位置追踪
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}
