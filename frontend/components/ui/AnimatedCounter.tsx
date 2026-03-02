'use client';

import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({
  value,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000 });
  const displayValue = useTransform(spring, (latest) => {
    return latest.toFixed(decimals);
  });

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  return (
    <motion.span className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </motion.span>
  );
}

// 简化版本，使用 requestAnimationFrame
export function Counter({
  value,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutExpo)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const currentValue = startValue + (value - startValue) * eased;
      element.textContent = `${prefix}${currentValue.toFixed(decimals)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, decimals, prefix, suffix]);

  return <span ref={ref} className={className} />;
}
