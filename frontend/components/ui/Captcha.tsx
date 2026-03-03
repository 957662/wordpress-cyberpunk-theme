'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CaptchaProps {
  length?: number;
  onValidate?: (isValid: boolean) => void;
  onRefresh?: () => void;
  className?: string;
  caseSensitive?: boolean;
}

export function Captcha({
  length = 4,
  onValidate,
  onRefresh,
  className,
  caseSensitive = false
}: CaptchaProps) {
  const [captcha, setCaptcha] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 生成随机验证码
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // 绘制验证码到 Canvas
  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 设置背景
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 添加干扰线
    for (let i = 0; i < 7; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // 添加噪点
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
      ctx.fill();
    }

    // 绘制文字
    const code = generateCaptcha();
    setCaptcha(code);

    const charWidth = canvas.width / (length + 1);
    const fontSize = 28;

    for (let i = 0; i < length; i++) {
      ctx.save();
      
      // 随机位置和旋转
      const x = charWidth * (i + 0.8);
      const y = canvas.height / 2 + fontSize / 3;
      const angle = (Math.random() - 0.5) * 0.4;
      
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = `rgb(${150 + Math.random() * 105}, ${150 + Math.random() * 105}, ${150 + Math.random() * 105})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.fillText(code[i], 0, 0);
      
      ctx.restore();
    }

    onRefresh?.();
  };

  // 验证用户输入
  const validate = () => {
    let valid = false;
    if (caseSensitive) {
      valid = userInput === captcha;
    } else {
      valid = userInput.toLowerCase() === captcha.toLowerCase();
    }
    
    setIsValid(valid);
    onValidate?.(valid);
    return valid;
  };

  // 刷新验证码
  const refresh = () => {
    const newCaptcha = drawCaptcha();
    setUserInput('');
    setIsValid(null);
  };

  // 初始化
  useEffect(() => {
    drawCaptcha();
  }, [length]);

  // 监听用户输入
  useEffect(() => {
    if (userInput.length === length) {
      validate();
    } else {
      setIsValid(null);
    }
  }, [userInput]);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Canvas */}
      <div className="relative inline-block">
        <canvas
          ref={canvasRef}
          width={200}
          height={60}
          className="rounded-lg border border-cyan-500/30 cursor-pointer"
          onClick={refresh}
          title="点击刷新验证码"
        />
        
        {/* 刷新按钮 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={refresh}
          className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          title="刷新验证码"
        >
          <RefreshCw size={20} />
        </motion.button>
      </div>

      {/* 输入框 */}
      <div className="relative">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value.slice(0, length))}
          placeholder={`请输入 ${length} 位验证码`}
          maxLength={length}
          className={cn(
            'w-full px-4 py-3 bg-gray-900/50 border-2 rounded-lg',
            'text-white placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
            'transition-all duration-200',
            isValid === true && 'border-green-500 focus:ring-green-500/50',
            isValid === false && 'border-red-500 focus:ring-red-500/50',
            isValid === null && 'border-cyan-500/30'
          )}
        />

        {/* 状态图标 */}
        {isValid !== null && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500"
              >
                <Shield size={20} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-red-500"
              >
                ✕
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* 验证提示 */}
      {isValid !== null && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'text-sm',
            isValid ? 'text-green-400' : 'text-red-400'
          )}
        >
          {isValid ? '验证通过' : '验证码错误，请重试'}
        </motion.p>
      )}

      {/* 进度条 */}
      <div className="flex gap-1">
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-200',
              i < userInput.length
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                : 'bg-gray-800'
            )}
          />
        ))}
      </div>
    </div>
  );
}

// 滑块验证码组件
export interface SliderCaptchaProps {
  onVerify?: (success: boolean) => void;
  width?: number;
  height?: number;
  className?: string;
}

export function SliderCaptcha({
  onVerify,
  width = 300,
  height = 200,
  className
}: SliderCaptchaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const requiredPosition = 200; // 目标位置

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => {
    setIsDragging(false);
    
    // 验证是否在正确位置（允许 5px 误差）
    const isValid = Math.abs(sliderPosition - requiredPosition) <= 5;
    setIsVerified(isValid);
    onVerify?.(isValid);
    
    if (!isValid) {
      // 失败时重置
      setTimeout(() => {
        setSliderPosition(0);
      }, 500);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPosition = Math.max(0, Math.min(x, width - 40));
    setSliderPosition(newPosition);
  };

  return (
    <div className={cn('inline-block', className)}>
      <div
        ref={containerRef}
        className="relative bg-gray-900 rounded-lg overflow-hidden select-none"
        style={{ width, height }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 背景图 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-700 text-4xl font-bold">
            CyberPress
          </div>
        </div>

        {/* 目标位置指示 */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-green-500/50"
          style={{ left: requiredPosition }}
        />

        {/* 滑块 */}
        <motion.div
          className="absolute top-0 bottom-0 w-40 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 backdrop-blur-sm border-2 border-cyan-500/50 rounded"
          style={{ left: sliderPosition }}
          animate={{ opacity: isVerified ? 0 : 1 }}
        />

        {/* 滑块按钮 */}
        <motion.div
          className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded cursor-grab active:cursor-grabbing flex items-center justify-center"
          style={{ left: sliderPosition }}
          drag="x"
          dragConstraints={{ left: 0, right: width - 48 }}
          dragElastic={0}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, info) => {
            setIsDragging(false);
            const finalPosition = sliderPosition + info.offset.x;
            const isValid = Math.abs(finalPosition - requiredPosition) <= 5;
            setIsVerified(isValid);
            onVerify?.(isValid);
            
            if (!isValid) {
              setTimeout(() => setSliderPosition(0), 500);
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-white">
            {isVerified ? '✓' : '→'}
          </div>
        </motion.div>

        {/* 成功提示 */}
        {isVerified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-sm"
          >
            <div className="text-green-400 text-2xl font-bold">验证成功！</div>
          </motion.div>
        )}
      </div>

      <p className="text-center text-gray-400 text-sm mt-2">
        拖动滑块到绿色位置完成验证
      </p>
    </div>
  );
}
