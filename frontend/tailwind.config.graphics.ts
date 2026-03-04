/**
 * Tailwind CSS 配置 - 赛博朋克主题扩展
 *
 * 这个配置文件包含了所有 CyberPress Platform 的图形设计扩展
 * 包括颜色、渐变、阴影、动画和背景图案
 */

import type { Config } from 'tailwindcss'

const graphicsConfig: Config = {
  theme: {
    extend: {
      // ============================================
      // 🎨 颜色系统 - 赛博朋克配色
      // ============================================

      colors: {
        // 核心颜色
        'cyber-black': '#0a0a0f',
        'cyber-dark': '#12121a',
        'cyber-darker': '#08080c',

        // 主强调色
        'cyber-cyan': '#00f0ff',
        'cyber-cyan-light': '#4df4ff',
        'cyber-cyan-dark': '#00a0aa',
        'cyber-cyan-darker': '#006070',

        // 次强调色
        'cyber-purple': '#9d00ff',
        'cyber-purple-light': '#b34dff',
        'cyber-purple-dark': '#6600aa',
        'cyber-purple-darker': '#440077',

        // 强调色
        'cyber-pink': '#ff0080',
        'cyber-pink-light': '#ff3399',
        'cyber-pink-dark': '#cc0066',
        'cyber-pink-darker': '#880044',

        // 高亮色
        'cyber-yellow': '#f0ff00',
        'cyber-yellow-light': '#f4ff33',
        'cyber-yellow-dark': '#c0cc00',
        'cyber-yellow-darker': '#808800',

        // 特殊色
        'cyber-green': '#00ff88',
        'cyber-green-light': '#33ffaa',
        'cyber-green-dark': '#00cc66',
        'cyber-green-darker': '#008844',

        // 灰度系统
        'cyber-gray-50': '#f0f0f5',
        'cyber-gray-100': '#e0e0e8',
        'cyber-gray-200': '#a0a0b0',
        'cyber-gray-300': '#808090',
        'cyber-gray-400': '#606070',
        'cyber-gray-500': '#404050',
        'cyber-gray-600': '#303040',
        'cyber-gray-700': '#202030',
        'cyber-gray-800': '#181820',
        'cyber-gray-900': '#0a0a0f',

        // 语义色
        'cyber-success': '#00ff88',
        'cyber-warning': '#f0ff00',
        'cyber-error': '#ff0080',
        'cyber-info': '#00f0ff',
      },

      // ============================================
      // 🌈 渐变系统
      // ============================================

      backgroundImage: {
        // 赛博朋克渐变
        'cyber-gradient': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)',
        'cyber-gradient-simple': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',

        // 霓虹渐变
        'neon-gradient': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
        'neon-gradient-reverse': 'linear-gradient(135deg, #9d00ff 0%, #00f0ff 100%)',

        // 热力渐变
        'heat-gradient': 'linear-gradient(135deg, #ff0080 0%, #f0ff00 100%)',
        'heat-gradient-reverse': 'linear-gradient(135deg, #f0ff00 0%, #ff0080 100%)',

        // 深空渐变
        'deep-gradient': 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2f 100%)',
        'deep-gradient-reverse': 'linear-gradient(180deg, #1a1a2f 0%, #0a0a0f 100%)',

        // 全息渐变
        'holographic-gradient': 'linear-gradient(135deg, rgba(0, 240, 255, 0.3) 0%, rgba(157, 0, 255, 0.3) 50%, rgba(255, 0, 128, 0.3) 100%)',

        // 极光渐变
        'aurora-gradient': 'linear-gradient(135deg, #00f0ff 0%, #00ff88 25%, #9d00ff 50%, #ff0080 75%, #f0ff00 100%)',

        // 网格渐变
        'grid-gradient': 'linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px)',

        // 图案背景
        'pattern-grid': "url('/patterns/grid.svg')",
        'pattern-circuit': "url('/patterns/circuit.svg')",
        'pattern-scanlines': "url('/patterns/scanlines.svg')",
        'pattern-noise': "url('/patterns/noise.svg')",
        'pattern-hexagon': "url('/patterns/hexagon.svg')",
        'pattern-matrix': "url('/patterns/matrix.svg')",
        'pattern-holographic': "url('/patterns/holographic.svg')",
        'pattern-hex-grid': "url('/patterns/hex-grid.svg')",

        // 背景图像
        'bg-hero': "url('/backgrounds/hero-bg.svg')",
        'bg-card': "url('/backgrounds/card-bg.svg')",
        'bg-loading': "url('/backgrounds/loading-bg.svg')",
        'bg-404': "url('/backgrounds/404-bg.svg')",
      },

      // ============================================
      // ✨ 阴影系统 - 霓虹发光效果
      // ============================================

      boxShadow: {
        // 霓虹发光 - 青色
        'neon-cyan-sm': '0 0 5px #00f0ff, 0 0 10px rgba(0, 240, 255, 0.5)',
        'neon-cyan': '0 0 10px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-cyan-md': '0 0 15px #00f0ff, 0 0 30px rgba(0, 240, 255, 0.4)',
        'neon-cyan-lg': '0 0 20px #00f0ff, 0 0 40px rgba(0, 240, 255, 0.3), 0 0 60px rgba(0, 240, 255, 0.2)',
        'neon-cyan-xl': '0 0 30px #00f0ff, 0 0 60px rgba(0, 240, 255, 0.4), 0 0 90px rgba(0, 240, 255, 0.2)',

        // 霓虹发光 - 紫色
        'neon-purple-sm': '0 0 5px #9d00ff, 0 0 10px rgba(157, 0, 255, 0.5)',
        'neon-purple': '0 0 10px #9d00ff, 0 0 20px rgba(157, 0, 255, 0.3)',
        'neon-purple-md': '0 0 15px #9d00ff, 0 0 30px rgba(157, 0, 255, 0.4)',
        'neon-purple-lg': '0 0 20px #9d00ff, 0 0 40px rgba(157, 0, 255, 0.3), 0 0 60px rgba(157, 0, 255, 0.2)',
        'neon-purple-xl': '0 0 30px #9d00ff, 0 0 60px rgba(157, 0, 255, 0.4), 0 0 90px rgba(157, 0, 255, 0.2)',

        // 霓虹发光 - 粉色
        'neon-pink-sm': '0 0 5px #ff0080, 0 0 10px rgba(255, 0, 128, 0.5)',
        'neon-pink': '0 0 10px #ff0080, 0 0 20px rgba(255, 0, 128, 0.3)',
        'neon-pink-md': '0 0 15px #ff0080, 0 0 30px rgba(255, 0, 128, 0.4)',
        'neon-pink-lg': '0 0 20px #ff0080, 0 0 40px rgba(255, 0, 128, 0.3), 0 0 60px rgba(255, 0, 128, 0.2)',
        'neon-pink-xl': '0 0 30px #ff0080, 0 0 60px rgba(255, 0, 128, 0.4), 0 0 90px rgba(255, 0, 128, 0.2)',

        // 霓虹发光 - 黄色
        'neon-yellow-sm': '0 0 5px #f0ff00, 0 0 10px rgba(240, 255, 0, 0.5)',
        'neon-yellow': '0 0 10px #f0ff00, 0 0 20px rgba(240, 255, 0, 0.3)',
        'neon-yellow-md': '0 0 15px #f0ff00, 0 0 30px rgba(240, 255, 0, 0.4)',
        'neon-yellow-lg': '0 0 20px #f0ff00, 0 0 40px rgba(240, 255, 0, 0.3), 0 0 60px rgba(240, 255, 0, 0.2)',
        'neon-yellow-xl': '0 0 30px #f0ff00, 0 0 60px rgba(240, 255, 0, 0.4), 0 0 90px rgba(240, 255, 0, 0.2)',

        // 霓虹发光 - 绿色
        'neon-green-sm': '0 0 5px #00ff88, 0 0 10px rgba(0, 255, 136, 0.5)',
        'neon-green': '0 0 10px #00ff88, 0 0 20px rgba(0, 255, 136, 0.3)',
        'neon-green-md': '0 0 15px #00ff88, 0 0 30px rgba(0, 255, 136, 0.4)',
        'neon-green-lg': '0 0 20px #00ff88, 0 0 40px rgba(0, 255, 136, 0.3), 0 0 60px rgba(0, 255, 136, 0.2)',
        'neon-green-xl': '0 0 30px #00ff88, 0 0 60px rgba(0, 255, 136, 0.4), 0 0 90px rgba(0, 255, 136, 0.2)',

        // 组合霓虹效果
        'neon-cyber': '0 0 10px #00f0ff, 0 0 20px #9d00ff, 0 0 30px rgba(255, 0, 128, 0.5)',
        'neon-heat': '0 0 10px #ff0080, 0 0 20px #f0ff00, 0 0 30px rgba(240, 255, 0, 0.3)',

        // 内部发光
        'neon-cyan-inner': 'inset 0 0 10px rgba(0, 240, 255, 0.3)',
        'neon-purple-inner': 'inset 0 0 10px rgba(157, 0, 255, 0.3)',
        'neon-pink-inner': 'inset 0 0 10px rgba(255, 0, 128, 0.3)',

        // 边框发光
        'border-glow-cyan': '0 0 5px rgba(0, 240, 255, 0.5), inset 0 0 5px rgba(0, 240, 255, 0.1)',
        'border-glow-purple': '0 0 5px rgba(157, 0, 255, 0.5), inset 0 0 5px rgba(157, 0, 255, 0.1)',
        'border-glow-pink': '0 0 5px rgba(255, 0, 128, 0.5), inset 0 0 5px rgba(255, 0, 128, 0.1)',
      },

      // ============================================
      // 🎬 动画系统
      // ============================================

      animation: {
        // 霓虹脉冲
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'neon-pulse-fast': 'neon-pulse 1s ease-in-out infinite',
        'neon-pulse-slow': 'neon-pulse 3s ease-in-out infinite',

        // 霓虹闪烁
        'neon-blink': 'neon-blink 1.5s ease-in-out infinite',

        // 霓虹流动
        'neon-flow': 'neon-flow 3s ease-in-out infinite',

        // 故障效果
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'glitch-slow': 'glitch 0.5s ease-in-out infinite',

        // 扫描线
        'scan': 'scan 3s linear infinite',
        'scan-fast': 'scan 2s linear infinite',
        'scan-slow': 'scan 5s linear infinite',

        // 旋转
        'rotate-slow': 'rotate 10s linear infinite',
        'rotate-slower': 'rotate 20s linear infinite',

        // 浮动
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',

        // 呼吸
        'breathe': 'breathe 4s ease-in-out infinite',

        // 震动
        'shake': 'shake 0.5s ease-in-out infinite',

        // 打字机
        'typewriter': 'typewriter 2s steps(20) infinite',

        // 代码雨
        'matrix': 'matrix 10s linear infinite',

        // 全息闪烁
        'hologram': 'hologram 2s ease-in-out infinite',

        // 边框流动
        'border-flow': 'border-flow 3s linear infinite',
      },

      keyframes: {
        // 霓虹脉冲
        'neon-pulse': {
          '0%, 100%': {
            opacity: '1',
            filter: 'brightness(1) drop-shadow(0 0 5px currentColor)',
          },
          '50%': {
            opacity: '0.8',
            filter: 'brightness(1.2) drop-shadow(0 0 20px currentColor)',
          },
        },

        // 霓虹闪烁
        'neon-blink': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },

        // 霓虹流动
        'neon-flow': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },

        // 故障效果
        'glitch': {
          '0%': {
            transform: 'translate(0)',
          },
          '20%': {
            transform: 'translate(-2px, 2px)',
          },
          '40%': {
            transform: 'translate(-2px, -2px)',
          },
          '60%': {
            transform: 'translate(2px, 2px)',
          },
          '80%': {
            transform: 'translate(2px, -2px)',
          },
          '100%': {
            transform: 'translate(0)',
          },
        },

        // 扫描线
        'scan': {
          '0%': {
            transform: 'translateY(-100%)',
          },
          '100%': {
            transform: 'translateY(100%)',
          },
        },

        // 浮动
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },

        // 呼吸
        'breathe': {
          '0%, 100%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.05)',
          },
        },

        // 震动
        'shake': {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '25%': {
            transform: 'translateX(-5px)',
          },
          '75%': {
            transform: 'translateX(5px)',
          },
        },

        // 打字机
        'typewriter': {
          '0%, 100%': {
            width: '0',
          },
          '50%': {
            width: '100%',
          },
        },

        // 代码雨
        'matrix': {
          '0%': {
            transform: 'translateY(-100%)',
          },
          '100%': {
            transform: 'translateY(100%)',
          },
        },

        // 全息闪烁
        'hologram': {
          '0%, 100%': {
            opacity: '1',
          },
          '25%': {
            opacity: '0.8',
          },
          '50%': {
            opacity: '1',
          },
          '75%': {
            opacity: '0.6',
          },
        },

        // 边框流动
        'border-flow': {
          '0%': {
            backgroundPosition: '0% 0%',
          },
          '100%': {
            backgroundPosition: '200% 0%',
          },
        },
      },

      // ============================================
      // 📐 尺寸扩展
      // ============================================

      spacing: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '192': '48rem',
        '224': '56rem',
        '256': '64rem',
      },

      // ============================================
      // 🔤 字体扩展
      // ============================================

      fontFamily: {
        'mono': ['"Fira Code"', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        'cyber': ['"Orbitron"', 'system-ui', 'sans-serif'],
      },

      // ============================================
      // 🎭 滤镜效果
      // ============================================

      filter: {
        'neon': 'drop-shadow(0 0 5px currentColor) drop-shadow(0 0 10px currentColor)',
        'neon-strong': 'drop-shadow(0 0 10px currentColor) drop-shadow(0 0 20px currentColor)',
        'glitch': 'contrast(1.2) brightness(1.1) saturate(1.3)',
        'hologram': 'hue-rotate(90deg) saturate(1.5)',
      },

      // ============================================
      // 🎨 文字阴影
      // ============================================

      textShadow: {
        'neon-cyan': '0 0 5px #00f0ff, 0 0 10px #00f0ff',
        'neon-cyan-strong': '0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 30px #00f0ff',
        'neon-purple': '0 0 5px #9d00ff, 0 0 10px #9d00ff',
        'neon-purple-strong': '0 0 10px #9d00ff, 0 0 20px #9d00ff, 0 0 30px #9d00ff',
        'neon-pink': '0 0 5px #ff0080, 0 0 10px #ff0080',
        'neon-pink-strong': '0 0 10px #ff0080, 0 0 20px #ff0080, 0 0 30px #ff0080',
        'neon-yellow': '0 0 5px #f0ff00, 0 0 10px #f0ff00',
        'neon-green': '0 0 5px #00ff88, 0 0 10px #00ff88',
      },

      // ============================================
      // 🖼️ 背景尺寸
      // ============================================

      backgroundSize: {
        'pattern': 'auto',
        'pattern-lg': '200% 200%',
        'full-auto': '100% auto',
        'auto-full': 'auto 100%',
      },
    },
  },

  // ============================================
  // 🎯 插件配置
  // ============================================

  plugins: [
    // 可以添加其他插件
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/aspect-ratio'),
  ],
}

export default graphicsConfig