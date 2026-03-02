/**
 * CyberPress Logo Icon - 赛博朋克风格 Logo
 */

export interface LogoIconProps {
  size?: number;
  className?: string;
  variant?: 'full' | 'compact' | 'minimal';
  showText?: boolean;
}

export function LogoIcon({
  size = 200,
  className = '',
  variant = 'full',
  showText = true,
}: LogoIconProps) {
  const viewBox = variant === 'full' ? '0 0 200 60' : '0 0 60 60';

  return (
    <svg
      width={size}
      height={variant === 'full' ? size * 0.3 : size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* 霓虹发光滤镜 */}
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* 赛博网格图案 */}
        <pattern id="cyberGrid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#00f0ff" strokeWidth="0.3" opacity="0.3"/>
        </pattern>

        {/* 渐变定义 */}
        <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#00a0cc" />
        </linearGradient>

        <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9d00ff" />
          <stop offset="100%" stopColor="#7000b8" />
        </linearGradient>

        <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0080" />
          <stop offset="100%" stopColor="#b8005c" />
        </linearGradient>
      </defs>

      {variant === 'compact' || variant === 'minimal' ? (
        // 紧凑版/极简版 Logo
        <>
          {/* 背景六边形 */}
          <path
            d="M30 5 L52 17.5 L52 42.5 L30 55 L8 42.5 L8 17.5 Z"
            fill="url(#cyanGradient)"
            opacity="0.1"
          />

          {/* 外圈 */}
          <path
            d="M30 8 L49 19 L49 41 L30 52 L11 41 L11 19 Z"
            stroke="url(#cyanGradient)"
            strokeWidth="1.5"
            fill="none"
            filter="url(#neonGlow)"
          />

          {/* 内圈 */}
          <path
            d="M30 14 L44 22 L44 38 L30 46 L16 38 L16 22 Z"
            stroke="url(#purpleGradient)"
            strokeWidth="1"
            fill="none"
            opacity="0.8"
          />

          {/* 中心闪电符号 */}
          <path
            d="M30 18 L24 30 L30 30 L28 42 L36 28 L30 28 Z"
            fill="url(#cyanGradient)"
            filter="url(#neonGlow)"
          />

          {/* 装饰点 */}
          {variant === 'full' && (
            <>
              <circle cx="30" cy="5" r="1.5" fill="#00f0ff" filter="url(#neonGlow)" />
              <circle cx="30" cy="55" r="1.5" fill="#ff0080" filter="url(#neonGlow)" />
              <circle cx="8" cy="30" r="1.5" fill="#9d00ff" filter="url(#neonGlow)" />
              <circle cx="52" cy="30" r="1.5" fill="#00f0ff" filter="url(#neonGlow)" />
            </>
          )}
        </>
      ) : (
        // 完整版 Logo
        <>
          {/* 图标部分 */}
          <g transform="translate(5, 5)">
            {/* 背景六边形 */}
            <path
              d="M25 0 L45 12 L45 38 L25 50 L5 38 L5 12 Z"
              fill="url(#cyanGradient)"
              opacity="0.1"
            />

            {/* 外圈 */}
            <path
              d="M25 3 L42 13 L42 37 L25 47 L8 37 L8 13 Z"
              stroke="url(#cyanGradient)"
              strokeWidth="1.5"
              fill="none"
              filter="url(#neonGlow)"
            />

            {/* 内圈 */}
            <path
              d="M25 8 L38 16 L38 34 L25 42 L12 34 L12 16 Z"
              stroke="url(#purpleGradient)"
              strokeWidth="1"
              fill="none"
              opacity="0.8"
            />

            {/* 中心闪电符号 */}
            <path
              d="M25 12 L20 23 L25 23 L23 35 L30 22 L25 22 Z"
              fill="url(#cyanGradient)"
              filter="url(#neonGlow)"
            />
          </g>

          {/* 文字部分 */}
          {showText && (
            <g transform="translate(60, 30)">
              {/* CYBER 文字 */}
              <text
                x="0"
                y="5"
                fontFamily="Orbitron, sans-serif"
                fontSize="24"
                fontWeight="bold"
                fill="url(#cyanGradient)"
                filter="url(#neonGlow)"
                letterSpacing="2"
              >
                CYBER
              </text>

              {/* PRESS 文字 */}
              <text
                x="68"
                y="5"
                fontFamily="Orbitron, sans-serif"
                fontSize="24"
                fontWeight="bold"
                fill="url(#purpleGradient)"
                filter="url(#neonGlow)"
                letterSpacing="2"
              >
                PRESS
              </text>

              {/* 装饰线 */}
              <line
                x1="0"
                y1="15"
                x2="130"
                y2="15"
                stroke="url(#pinkGradient)"
                strokeWidth="1"
                opacity="0.5"
              />

              {/* 小文字标签 */}
              <text
                x="0"
                y="28"
                fontFamily="JetBrains Mono, monospace"
                fontSize="8"
                fill="#00f0ff"
                opacity="0.7"
                letterSpacing="1"
              >
                &lt;BLOG_PLATFORM /&gt;
              </text>
            </g>
          )}
        </>
      )}
    </svg>
  );
}

// 导出预设变体
export function LogoFull(props: Omit<LogoIconProps, 'variant'>) {
  return <LogoIcon {...props} variant="full" />;
}

export function LogoCompact(props: Omit<LogoIconProps, 'variant'>) {
  return <LogoIcon {...props} variant="compact" />;
}

export function LogoMinimal(props: Omit<LogoIconProps, 'variant'>) {
  return <LogoIcon {...props} variant="minimal" />;
}
