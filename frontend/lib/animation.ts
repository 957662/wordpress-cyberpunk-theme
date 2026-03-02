/**
 * Animation utility functions for CyberPress Platform
 */

// Easing functions
export const easings = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => 1 + --t * t * t * t * t,
  easeInOutQuint: (t: number) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
  easeInElastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
  },
  easeOutElastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
  },
  easeInOutElastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    t = t * 2;
    if (t < 1) {
      return -0.5 * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
    }
    return 0.5 * Math.pow(2, -10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1;
  },
};

// Spring animation
export interface SpringConfig {
  tension?: number;
  friction?: number;
  mass?: number;
}

export function spring(
  current: number,
  target: number,
  config: SpringConfig = {}
): { value: number; velocity: number } {
  const { tension = 300, friction = 10, mass = 1 } = config;

  const acceleration = (tension * (target - current) - friction * 0) / mass;
  const velocity = acceleration;
  const value = current + velocity;

  return { value, velocity };
}

// Animate value over time
export function animateValue(
  from: number,
  to: number,
  duration: number,
  easing: keyof typeof easings = 'easeInOutCubic',
  callback: (value: number) => void
): { cancel: () => void } {
  const startTime = performance.now();
  const easingFn = easings[easing];

  let animationId: number;

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easedProgress = easingFn(progress);
    const currentValue = from + (to - from) * easedProgress;

    callback(currentValue);

    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    }
  }

  animationId = requestAnimationFrame(animate);

  return {
    cancel: () => cancelAnimationFrame(animationId),
  };
}

// Animate element with CSS
export function animateCSS(
  element: HTMLElement,
  keyframes: Keyframe[],
  options?: KeyframeAnimationOptions
): Animation {
  return element.animate(keyframes, {
    duration: 300,
    easing: 'ease-in-out',
    fill: 'forwards',
    ...options,
  });
}

// Common animation presets
export const animations = {
  fadeIn: [
    { opacity: 0 },
    { opacity: 1 },
  ],
  fadeOut: [
    { opacity: 1 },
    { opacity: 0 },
  ],
  slideInUp: [
    { transform: 'translateY(100%)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 },
  ],
  slideOutUp: [
    { transform: 'translateY(0)', opacity: 1 },
    { transform: 'translateY(-100%)', opacity: 0 },
  ],
  slideInDown: [
    { transform: 'translateY(-100%)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 },
  ],
  slideOutDown: [
    { transform: 'translateY(0)', opacity: 1 },
    { transform: 'translateY(100%)', opacity: 0 },
  ],
  slideInLeft: [
    { transform: 'translateX(-100%)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 },
  ],
  slideOutLeft: [
    { transform: 'translateX(0)', opacity: 1 },
    { transform: 'translateX(-100%)', opacity: 0 },
  ],
  slideInRight: [
    { transform: 'translateX(100%)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 },
  ],
  slideOutRight: [
    { transform: 'translateX(0)', opacity: 1 },
    { transform: 'translateX(100%)', opacity: 0 },
  ],
  scaleIn: [
    { transform: 'scale(0)', opacity: 0 },
    { transform: 'scale(1)', opacity: 1 },
  ],
  scaleOut: [
    { transform: 'scale(1)', opacity: 1 },
    { transform: 'scale(0)', opacity: 0 },
  ],
  rotateIn: [
    { transform: 'rotate(-180deg)', opacity: 0 },
    { transform: 'rotate(0)', opacity: 1 },
  ],
  rotateOut: [
    { transform: 'rotate(0)', opacity: 1 },
    { transform: 'rotate(180deg)', opacity: 0 },
  ],
  bounce: [
    { transform: 'translateY(0)', easing: 'ease-out' },
    { transform: 'translateY(-20px)', easing: 'ease-in', offset: 0.3 },
    { transform: 'translateY(0)', easing: 'ease-out', offset: 0.5 },
    { transform: 'translateY(-10px)', easing: 'ease-in', offset: 0.7 },
    { transform: 'translateY(0)', easing: 'ease-out' },
  ],
  shake: [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(-10px)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(0)' },
  ],
  pulse: [
    { transform: 'scale(1)' },
    { transform: 'scale(1.05)' },
    { transform: 'scale(1)' },
  ],
  wiggle: [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(-3deg)' },
    { transform: 'rotate(3deg)' },
    { transform: 'rotate(-3deg)' },
    { transform: 'rotate(3deg)' },
    { transform: 'rotate(0deg)' },
  ],
};

// Apply animation to element
export function applyAnimation(
  element: HTMLElement,
  animationName: keyof typeof animations,
  options?: KeyframeAnimationOptions
): Animation {
  return animateCSS(element, animations[animationName], options);
}

// Lerp (Linear Interpolation)
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

// Clamp value
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Map range
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Smooth step
export function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

// Ping pong effect
export function pingPong(value: number, min: number, max: number): number {
  const range = max - min;
  const modValue = ((value - min) % (range * 2));
  return modValue > range ? max - (modValue - range) : modValue + min;
}

// Oscillate value
export function oscillate(min: number, max: number, frequency: number, time: number): number {
  const amplitude = (max - min) / 2;
  const center = min + amplitude;
  return center + Math.sin(time * frequency * Math.PI * 2) * amplitude;
}
