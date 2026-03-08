/**
 * Quantum Random Number Generator
 * 量子随机数生成器 - 赛博朋克风格
 *
 * 模拟量子随机性生成的可视化组件
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Activity } from 'lucide-react';

interface QuantumRandomProps {
  min?: number;
  max?: number;
  onGenerate?: (value: number) => void;
  className?: string;
}

export function QuantumRandom({
  min = 0,
  max = 100,
  onGenerate,
  className = '',
}: QuantumRandomProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentValue, setCurrentValue] = useState<number>(min);
  const [quantumStates, setQuantumStates] = useState<number[]>([]);
  const [entanglementLevel, setEntanglementLevel] = useState(0);

  // 生成量子随机数
  const generateQuantumRandom = useCallback(() => {
    setIsGenerating(true);

    // 模拟量子态叠加
    const states: number[] = [];
    for (let i = 0; i < 20; i++) {
      states.push(Math.random() * (max - min) + min);
    }
    setQuantumStates(states);

    // 模拟量子坍缩过程
    let iteration = 0;
    const maxIterations = 30;
    const interval = setInterval(() => {
      iteration++;
      const randomValue = Math.random() * (max - min) + min;
      setCurrentValue(randomValue);
      setEntanglementLevel(iteration / maxIterations);

      if (iteration >= maxIterations) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * (max - min + 1)) + min;
        setCurrentValue(finalValue);
        setIsGenerating(false);
        setQuantumStates([]);
        setEntanglementLevel(0);
        onGenerate?.(finalValue);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [min, max, onGenerate]);

  // 快捷键支持
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        generateQuantumRandom();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [generateQuantumRandom]);

  return (
    <div className={`cyber-card p-8 ${className}`}>
      {/* 标题 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Activity className="w-8 h-8 text-cyber-cyan" />
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Activity className="w-8 h-8 text-cyber-cyan" />
            </motion.div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">量子随机生成器</h3>
            <p className="text-sm text-gray-400">基于量子态叠加的随机数生成</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-cyber-cyan">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-mono">QUANTUM</span>
        </div>
      </div>

      {/* 主显示区域 */}
      <div className="relative mb-6">
        <motion.div
          className="relative h-40 flex items-center justify-center"
          animate={{
            scale: isGenerating ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: isGenerating ? Infinity : 0,
          }}
        >
          {/* 背景光晕 */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.5, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/20 to-cyber-purple/20 rounded-full blur-3xl"
              />
            )}
          </AnimatePresence>

          {/* 量子态可视化 */}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink font-mono">
                    {Math.floor(currentValue)}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <motion.div
                      className="w-2 h-2 bg-cyber-cyan rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                      }}
                    />
                    <span className="text-cyber-cyan text-sm">量子态坍缩中...</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-center"
                >
                  <div className="text-7xl font-bold text-cyber-cyan font-mono mb-2">
                    {Math.floor(currentValue)}
                  </div>
                  <div className="text-gray-400 text-sm">
                    范围: [{min}, {max}]
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 量子态粒子 */}
          <AnimatePresence>
            {isGenerating &&
              quantumStates.map((state, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 1,
                    scale: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    opacity: 0,
                    scale: 1,
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1,
                    delay: index * 0.05,
                  }}
                  className="absolute w-1 h-1 bg-cyber-cyan rounded-full"
                  style={{
                    boxShadow: '0 0 10px #00f0ff',
                  }}
                />
              ))}
          </AnimatePresence>
        </motion.div>

        {/* 纠缠级别指示器 */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 left-0 right-0"
          >
            <div className="h-1 bg-cyber-dark/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
                style={{
                  width: `${entanglementLevel * 100}%`,
                }}
              />
            </div>
            <div className="text-center mt-2">
              <span className="text-xs text-cyber-cyan font-mono">
                纠缠级别: {(entanglementLevel * 100).toFixed(0)}%
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* 控制按钮 */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateQuantumRandom}
          disabled={isGenerating}
          className="flex-1 relative overflow-hidden bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-semibold py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="relative z-10 flex items-center justify-center gap-2">
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
                <span>生成中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>生成量子随机数</span>
              </>
            )}
          </div>

          {/* 按钮光效 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.button>
      </div>

      {/* 说明文字 */}
      <div className="mt-6 p-4 bg-cyber-dark/50 rounded-lg border border-cyber-border/50">
        <p className="text-sm text-gray-400 leading-relaxed">
          <span className="text-cyber-cyan font-semibold">提示:</span> 点击按钮或按空格键生成随机数。
          此组件模拟量子态叠加和坍缩过程，展示了赛博朋克风格的随机数生成可视化效果。
        </p>
      </div>

      {/* 统计信息 */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 grid grid-cols-3 gap-4"
        >
          <div className="text-center p-3 bg-cyber-cyan/10 rounded-lg border border-cyber-cyan/20">
            <div className="text-2xl font-bold text-cyber-cyan font-mono">
              {quantumStates.length}
            </div>
            <div className="text-xs text-gray-400 mt-1">量子态数量</div>
          </div>
          <div className="text-center p-3 bg-cyber-purple/10 rounded-lg border border-cyber-purple/20">
            <div className="text-2xl font-bold text-cyber-purple font-mono">
              {(entanglementLevel * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-400 mt-1">纠缠级别</div>
          </div>
          <div className="text-center p-3 bg-cyber-pink/10 rounded-lg border border-cyber-pink/20">
            <div className="text-2xl font-bold text-cyber-pink font-mono">
              {(Math.random() * 100).toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-1">量子相干性</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// 使用示例组件
export function QuantumRandomExample() {
  const handleGenerate = (value: number) => {
    console.log('Generated quantum random number:', value);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <QuantumRandom
        min={1}
        max={1000}
        onGenerate={handleGenerate}
      />
    </div>
  );
}
