'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Ghost, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Custom404Page() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glitchText, setGlitchText] = useState('404');
  const [matrixChars, setMatrixChars] = useState<string[][]>([]);

  // 跟踪鼠标位置
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 故障效果
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const randomChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      let glitchString = '';
      for (let i = 0; i < 3; i++) {
        glitchString += randomChars[Math.floor(Math.random() * randomChars.length)];
      }
      setGlitchText(glitchString);

      setTimeout(() => {
        setGlitchText('404');
      }, 100);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Matrix 雨效果
  useEffect(() => {
    const columns = Math.floor(window.innerWidth / 20);
    const rows = Math.floor(window.innerHeight / 20);
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

    const initialMatrix: string[][] = [];
    for (let i = 0; i < rows; i++) {
      initialMatrix.push(Array(columns).fill(''));
    }
    setMatrixChars(initialMatrix);

    const interval = setInterval(() => {
      setMatrixChars((prev) => {
        const newMatrix = [...prev];
        const randomColumn = Math.floor(Math.random() * columns);
        const randomRow = Math.floor(Math.random() * rows);

        for (let i = 0; i < rows; i++) {
          newMatrix[i][randomColumn] = chars[Math.floor(Math.random() * chars.length)];
        }

        return newMatrix;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const quickLinks = [
    { href: '/', icon: Home, label: '返回首页' },
    { href: '/blog', icon: Search, label: '浏览文章' },
    { href: '/portfolio', icon: Ghost, label: '查看作品' },
    { href: '/contact', icon: Zap, label: '联系我们' },
  ];

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-hidden flex items-center justify-center">
      {/* Matrix 背景 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {matrixChars.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((char, colIndex) => (
              <span
                key={`${rowIndex}-${colIndex}`}
                className="w-5 h-5 text-xs text-green-500 font-mono leading-5"
              >
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* 动态光晕效果 */}
      <motion.div
        animate={{
          x: mousePosition.x - 250,
          y: mousePosition.y - 250,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%)',
        }}
      />

      {/* 内容 */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* 故障文字效果 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1
            className={cn(
              'text-[200px] font-bold leading-none',
              'bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500',
              'animate-pulse'
            )}
            style={{
              textShadow: '0 0 80px rgba(0,240,255,0.5)',
              fontFamily: 'Orbitron, monospace',
            }}
          >
            {glitchText}
          </h1>
        </motion.div>

        {/* 描述文字 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            页面未找到
          </h2>
          <p className="text-xl text-gray-400">
            您访问的页面可能已被移动、删除或从未存在过
          </p>
        </motion.div>

        {/* 快速链接 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {quickLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'group p-6 rounded-xl',
                'bg-gray-900/50 border border-gray-800',
                'hover:border-cyan-500/50 hover:bg-gray-800/50',
                'transition-all duration-300',
                'relative overflow-hidden'
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-cyan-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />

              <link.icon className="w-8 h-8 mx-auto mb-3 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span className="block text-white font-medium group-hover:text-cyan-400 transition-colors">
                {link.label}
              </span>
            </Link>
          ))}
        </motion.div>

        {/* 返回按钮 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/"
            className={cn(
              'inline-flex items-center gap-2 px-8 py-4',
              'bg-gradient-to-r from-cyan-500 to-purple-500',
              'text-white font-semibold rounded-lg',
              'hover:from-cyan-400 hover:to-purple-400',
              'transition-all duration-300',
              'shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70',
              'group'
            )}
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>返回首页</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className={cn(
              'inline-flex items-center gap-2 px-8 py-4',
              'bg-gray-800/50 border border-gray-700',
              'text-white font-semibold rounded-lg',
              'hover:bg-gray-800 hover:border-gray-600',
              'transition-all duration-300'
            )}
          >
            <span>返回上一页</span>
          </button>
        </motion.div>

        {/* 装饰元素 */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-10"
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            style={{
              stroke: 'url(#gradient)',
              strokeWidth: '0.5',
              fill: 'none',
            }}
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor="#9d00ff" />
                <stop offset="100%" stopColor="#ff0080" />
              </linearGradient>
            </defs>
            {[...Array(12)].map((_, i) => (
              <polygon
                key={i}
                points={`100,${10 + i * 7.5} ${110 + i * 3},${100} 100,${190 - i * 7.5} ${90 - i * 3},${100}`}
                transform={`rotate(${i * 30} 100 100)`}
              />
            ))}
          </svg>
        </motion.div>
      </div>

      {/* 扫描线效果 */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
        }} />
      </div>

      {/* 额外的装饰光点 */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-cyan-500 opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}
