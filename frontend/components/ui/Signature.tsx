'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Eraser, Download, Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SignatureProps {
  width?: number;
  height?: number;
  onSave?: (dataUrl: string) => void;
  className?: string;
  showActions?: boolean;
  penColor?: string;
  penWidth?: number;
}

export function Signature({
  width = 600,
  height = 200,
  onSave,
  className,
  showActions = true,
  penColor = '#00f0ff',
  penWidth = 2
}: SignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布样式
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 绘制背景网格
    drawGrid(ctx);
  }, [penColor, penWidth]);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#2a2a4a';
    ctx.lineWidth = 0.5;

    // 垂直线
    for (let x = 0; x <= width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 水平线
    for (let y = 0; y <= height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 恢复画笔设置
    ctx.strokeStyle = currentTool === 'pen' ? penColor : '#1a1a2e';
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    
    ctx.strokeStyle = currentTool === 'pen' ? penColor : '#1a1a2e';
    ctx.lineWidth = currentTool === 'pen' ? penWidth : penWidth * 5;
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    drawGrid(ctx);
    setHasSignature(false);
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    onSave?.(dataUrl);
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = `signature-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Canvas */}
      <div className="relative inline-block bg-gray-900/50 border-2 border-cyan-500/30 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* 提示文字 */}
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-500 text-lg">请在此处签名</p>
          </div>
        )}
      </div>

      {/* 工具栏 */}
      {showActions && (
        <div className="flex items-center justify-between gap-4 p-4 bg-gray-900/50 border border-cyan-500/20 rounded-lg">
          {/* 工具选择 */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentTool('pen')}
              className={cn(
                'p-3 rounded-lg transition-all',
                currentTool === 'pen'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              )}
              title="画笔"
            >
              <PenTool size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentTool('eraser')}
              className={cn(
                'p-3 rounded-lg transition-all',
                currentTool === 'eraser'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              )}
              title="橡皮擦"
            >
              <Eraser size={20} />
            </motion.button>

            {/* 颜色选择 */}
            <div className="flex items-center gap-2 ml-2">
              {['#00f0ff', '#9d00ff', '#ff0080', '#00ff88', '#ffff00'].map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentTool('pen')}
                  className={cn(
                    'w-6 h-6 rounded-full transition-all',
                    penColor === color && 'ring-2 ring-white ring-offset-2 ring-offset-gray-900'
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clear}
              disabled={!hasSignature}
              className="p-3 bg-gray-800 text-gray-400 rounded-lg hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="清除"
            >
              <Trash2 size={20} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={save}
              disabled={!hasSignature}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              title="保存"
            >
              {hasSignature ? (
                <>
                  <Check size={20} />
                  保存签名
                </>
              ) : (
                <>
                  <Download size={20} />
                  保存
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}

      {/* 状态指示 */}
      {hasSignature && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-green-400 text-sm"
        >
          <Check size={16} />
          <span>签名已完成</span>
        </motion.div>
      )}
    </div>
  );
}

// 签名预览组件
export interface SignaturePreviewProps {
  dataUrl: string;
  onClear?: () => void;
  className?: string;
}

export function SignaturePreview({ dataUrl, onClear, className }: SignaturePreviewProps) {
  return (
    <div className={cn('relative inline-block', className)}>
      <img src={dataUrl} alt="签名预览" className="border border-cyan-500/30 rounded-lg" />
      
      {onClear && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClear}
          className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-400 transition-colors"
          title="清除签名"
        >
          <Trash2 size={16} />
        </motion.button>
      )}
    </div>
  );
}
