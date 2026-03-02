/**
 * 赛博朋克风格工具函数
 *
 * 提供赛博朋克主题相关的颜色、特效等工具函数
 */

/**
 * 赛博朋克颜色系统
 */
export const cyberColors = {
  dark: '#0a0a0f',
  darker: '#050816',
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  green: '#00ff88',
  yellow: '#f0ff00',
  blue: '#0066ff',
  red: '#ff3366',
  orange: '#ff9900',
  border: 'rgba(0, 240, 255, 0.2)',
  borderGlow: 'rgba(0, 240, 255, 0.5)',
} as const;

export type CyberColor = keyof typeof cyberColors;

/**
 * 获取随机赛博朋克颜色
 */
export function getRandomCyberColor(): string {
  const colors = Object.values(cyberColors);
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 生成渐变色
 */
export function generateCyberGradient(
  colors: CyberColor[] = ['cyan', 'purple', 'pink']
): string {
  const colorValues = colors.map((c) => cyberColors[c]);
  return `linear-gradient(135deg, ${colorValues.join(', ')})`;
}

/**
 * 添加发光效果
 */
export function addGlow(
  color: CyberColor = 'cyan',
  intensity: number = 20
): string {
  return `0 0 ${intensity}px ${cyberColors[color]}`;
}

/**
 * 生成故障文本效果
 */
export function generateGlitchText(text: string): {
  original: string;
  glitch1: string;
  glitch2: string;
} {
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const glitch1 = text
    .split('')
    .map((char) =>
      Math.random() > 0.7
        ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
        : char
    )
    .join('');

  const glitch2 = text
    .split('')
    .map((char) =>
      Math.random() > 0.8
        ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
        : char
    )
    .join('');

  return {
    original: text,
    glitch1,
    glitch2,
  };
}

/**
 * 生成扫描线样式
 */
export function getScanlineStyle() {
  return {
    background: `repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    )`,
  };
}

/**
 * 生成网格背景
 */
export function getGridStyle(color: CyberColor = 'cyan', size: number = 50) {
  return {
    backgroundImage: `
      linear-gradient(${cyberColors[color]} 1px, transparent 1px),
      linear-gradient(90deg, ${cyberColors[color]} 1px, transparent 1px)
    `,
    backgroundSize: `${size}px ${size}px`,
    backgroundOpacity: '0.1',
  };
}

/**
 * 赛博朋克边框样式
 */
export function cyberBorder(
  color: CyberColor = 'cyan',
  glow: boolean = true
): React.CSSProperties {
  return {
    border: `1px solid ${cyberColors[color]}`,
    ...(glow
      ? {
          boxShadow: `
            0 0 5px ${cyberColors[color]},
            0 0 10px ${cyberColors[color]},
            inset 0 0 5px rgba(0, 240, 255, 0.1)
          `,
        }
      : {}),
  };
}

/**
 * 动画关键帧
 */
export const cyberAnimations = {
  /**
   * 故障效果动画
   */
  glitch: `
    @keyframes glitch {
      0% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(-2px, -2px); }
      60% { transform: translate(2px, 2px); }
      80% { transform: translate(2px, -2px); }
      100% { transform: translate(0); }
    }
  `,

  /**
   * 霓虹闪烁动画
   */
  neonFlicker: `
    @keyframes neon-flicker {
      0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
        opacity: 1;
        text-shadow:
          0 0 5px ${cyberColors.cyan},
          0 0 10px ${cyberColors.cyan},
          0 0 20px ${cyberColors.cyan};
      }
      20%, 24%, 55% {
        opacity: 0.8;
        text-shadow: none;
      }
    }
  `,

  /**
   * 扫描线动画
   */
  scanline: `
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
  `,

  /**
   * 打字机效果
   */
  typewriter: `
    @keyframes typewriter {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes blink {
      50% { border-color: transparent; }
    }
  `,

  /**
   * 脉冲发光动画
   */
  pulseGlow: `
    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 5px ${cyberColors.cyan};
      }
      50% {
        box-shadow: 0 0 20px ${cyberColors.cyan}, 0 0 30px ${cyberColors.cyan};
      }
    }
  `,

  /**
   * 数据流动画
   */
  dataFlow: `
    @keyframes data-flow {
      0% {
        transform: translateY(-100%);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(100vh);
        opacity: 0;
      }
    }
  `,
};

/**
 * 获取动画类名
 */
export function getCyberAnimation(name: keyof typeof cyberAnimations): string {
  return `cyber-animation-${name}`;
}

/**
 * 生成随机数据流效果
 */
export function generateDataFlow(): string {
  const chars = '01アイウエオカキクケコサシスセソタチツテト';
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * 转换为赛博朋克风格的时间显示
 */
export function formatCyberTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `[${seconds}s ago]`;
  } else if (minutes < 60) {
    return `[${minutes}m ago]`;
  } else if (hours < 24) {
    return `[${hours}h ago]`;
  } else {
    return `[${days}d ago]`;
  }
}

/**
 * 赛博朋克卡片悬停效果
 */
export function cyberCardHover(color: CyberColor = 'cyan'): React.CSSProperties {
  return {
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: `
        0 10px 30px rgba(0, 240, 255, 0.3),
        0 0 20px ${cyberColors[color]}
      `,
      borderColor: cyberColors[color],
    },
  };
}

/**
 * 生成全息效果样式
 */
export function hologramStyle(): React.CSSProperties {
  return {
    background: `
      linear-gradient(
        135deg,
        rgba(0, 240, 255, 0.1) 0%,
        rgba(157, 0, 255, 0.1) 50%,
        rgba(255, 0, 128, 0.1) 100%
      )
    `,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 240, 255, 0.3)',
    boxShadow: `
      0 0 30px rgba(0, 240, 255, 0.2),
      inset 0 0 30px rgba(0, 240, 255, 0.1)
    `,
  };
}

/**
 * 获取赛博朋克主题变体
 */
export function getCyberTheme() {
  return {
    colors: cyberColors,
    animations: cyberAnimations,
    gradients: {
      primary: generateCyberGradient(['cyan', 'blue']),
      secondary: generateCyberGradient(['purple', 'pink']),
      accent: generateCyberGradient(['green', 'cyan']),
    },
    shadows: {
      glow: addGlow('cyan', 20),
      glowLarge: addGlow('purple', 40),
    },
  };
}
