'use client';

import React, { useRef, useState, MouseEvent } from 'react';

interface LiquidButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
}

export function LiquidButton({
  children,
  onClick,
  className = '',
  variant = 'cyan',
}: LiquidButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const colors = {
    cyan: 'from-cyan-400 to-blue-500',
    purple: 'from-purple-400 to-pink-500',
    pink: 'from-pink-400 to-red-500',
    yellow: 'from-yellow-400 to-orange-500',
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1000);

    onClick?.();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`relative overflow-hidden bg-gradient-to-r ${colors[variant]} px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${className}`}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute animate-ping rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px',
            marginLeft: '-10px',
            marginTop: '-10px',
          }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
