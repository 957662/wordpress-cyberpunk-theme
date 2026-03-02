'use client';

import { HTMLAttributes } from 'react';

interface DecorationComponentProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'gradient';
}

/**
 * 赛博边框装饰组件
 * 用于为卡片、模态框等添加赛博朋克风格的边框装饰
 */
export const CyberBorder = ({
  variant = 'cyan',
  className = '',
  children,
  ...props
}: DecorationComponentProps) => {
  const variantColors = {
    cyan: 'border-cyber-cyan shadow-neon-cyan',
    purple: 'border-cyber-purple shadow-neon-purple',
    pink: 'border-cyber-pink shadow-neon-pink',
    yellow: 'border-cyber-yellow',
    gradient: 'border-gradient-cyber'
  };

  return (
    <div
      className={`relative p-[1px] rounded-lg ${variantColors[variant]} ${className}`}
      {...props}
    >
      <div className="bg-cyber-dark rounded-lg p-4">
        {children}
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-current"/>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-current"/>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-current"/>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-current"/>
    </div>
  );
};

/**
 * 扫描线效果组件
 * 添加复古CRT显示器扫描线效果
 */
export const ScanlinesOverlay = ({ className = '' }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 ${className}`}
      style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.03) 2px, rgba(0, 240, 255, 0.03) 4px)'
      }}
    />
  );
};

/**
 * 发光文本组件
 * 带有霓虹发光效果的文本
 */
export const GlowingText = ({
  variant = 'cyan',
  className = '',
  children,
  ...props
}: DecorationComponentProps) => {
  const variantColors = {
    cyan: 'text-cyber-cyan text-glow-cyan',
    purple: 'text-cyber-purple text-glow-purple',
    pink: 'text-cyber-pink text-glow-pink',
    yellow: 'text-cyber-yellow',
    gradient: 'text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink'
  };

  return (
    <span className={`${variantColors[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

/**
 * 数据流动画组件
 * 模拟数据流动的视觉效果
 */
export const DataStream = ({
  direction = 'down',
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement> & { direction?: 'down' | 'up' | 'left' | 'right' }) => {
  const directionClasses = {
    down: 'flex-col',
    up: 'flex-col-reverse',
    left: 'flex-row-reverse',
    right: 'flex-row'
  };

  return (
    <div className={`flex gap-1 ${directionClasses[direction]} ${className}`} {...props}>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="w-1 h-8 bg-gradient-to-b from-cyber-cyan to-cyber-purple rounded-full opacity-60"
          style={{
            animation: `dataStream ${1 + Math.random()}s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes dataStream {
          0%, 100% { opacity: 0.2; transform: scaleY(0.8); }
          50% { opacity: 1; transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
};

/**
 * 脉冲圆环组件
 * 带有脉冲动画的圆环装饰
 */
export const PulseRing = ({
  variant = 'cyan',
  size = 100,
  className = '',
  ...props
}: DecorationComponentProps & { size?: number }) => {
  const variantColors = {
    cyan: 'border-cyber-cyan',
    purple: 'border-cyber-purple',
    pink: 'border-cyber-pink',
    yellow: 'border-cyber-yellow',
    gradient: 'border-gradient-cyber'
  };

  return (
    <div
      className={`relative rounded-full ${variantColors[variant]} ${className}`}
      style={{ width: size, height: size }}
      {...props}
    >
      {/* Static Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-current opacity-30"/>

      {/* Pulsing Ring 1 */}
      <div
        className="absolute inset-0 rounded-full border-2 border-current animate-ping"
        style={{ animationDuration: '2s' }}
      />

      {/* Pulsing Ring 2 */}
      <div
        className="absolute inset-0 rounded-full border-2 border-current animate-ping"
        style={{ animationDuration: '2s', animationDelay: '1s' }}
      />

      {/* Center Dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-current animate-pulse"/>
      </div>
    </div>
  );
};

/**
 * 网格背景组件
 * 赛博朋克风格的网格背景
 */
export const GridBackground = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}
      {...props}
    >
      {children}

      {/* Glowing Grid Points */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyber-cyan rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.6
            }}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * 故障效果装饰组件
 * 添加赛博朋克风格的故障视觉效果
 */
export const GlitchDecoration = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`relative ${className}`} {...props}>
      {children}

      {/* Glitch Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-100">
        <div
          className="absolute inset-0 bg-cyber-cyan mix-blend-color-dodge"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 33%, 0 33%)',
            animation: 'glitch1 0.3s infinite'
          }}
        />
        <div
          className="absolute inset-0 bg-cyber-pink mix-blend-color-dodge"
          style={{
            clipPath: 'polygon(0 33%, 100% 33%, 100% 66%, 0 66%)',
            animation: 'glitch2 0.3s infinite'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes glitch1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        @keyframes glitch2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }
      `}</style>
    </div>
  );
};

/**
 * 角标装饰组件
 * 添加赛博朋克风格的角落装饰
 */
export const CornerBrackets = ({
  variant = 'cyan',
  className = '',
  children,
  ...props
}: DecorationComponentProps) => {
  const variantColors = {
    cyan: 'text-cyber-cyan',
    purple: 'text-cyber-purple',
    pink: 'text-cyber-pink',
    yellow: 'text-cyber-yellow',
    gradient: 'text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple'
  };

  return (
    <div className={`relative p-6 ${className}`} {...props}>
      {/* Top Left */}
      <svg className={`absolute top-0 left-0 w-8 h-8 ${variantColors[variant]}`} viewBox="0 0 32 32">
        <path d="M4 4 L4 12 L12 12" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="4" cy="4" r="2" fill="currentColor"/>
      </svg>

      {/* Top Right */}
      <svg className={`absolute top-0 right-0 w-8 h-8 ${variantColors[variant]}`} viewBox="0 0 32 32">
        <path d="M28 4 L28 12 L20 12" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="28" cy="4" r="2" fill="currentColor"/>
      </svg>

      {/* Bottom Left */}
      <svg className={`absolute bottom-0 left-0 w-8 h-8 ${variantColors[variant]}`} viewBox="0 0 32 32">
        <path d="M4 28 L4 20 L12 20" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="4" cy="28" r="2" fill="currentColor"/>
      </svg>

      {/* Bottom Right */}
      <svg className={`absolute bottom-0 right-0 w-8 h-8 ${variantColors[variant]}`} viewBox="0 0 32 32">
        <path d="M28 28 L28 20 L20 20" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="28" cy="28" r="2" fill="currentColor"/>
      </svg>

      {children}
    </div>
  );
};

export default CyberBorder;
