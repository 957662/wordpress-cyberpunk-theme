'use client';

/**
 * CollaborativeWhiteboard - 协作白板组件
 * 支持多人实时协作绘图，带有赛博朋克风格
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil,
  Eraser,
  Square,
  Circle,
  Type,
  Image,
  Undo,
  Redo,
  Trash2,
  Download,
  Users,
  Palette,
  Minus,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

type Tool = 'pencil' | 'eraser' | 'rectangle' | 'circle' | 'text' | 'image';

interface Point {
  x: number;
  y: number;
}

interface DrawnElement {
  id: string;
  type: Tool;
  points: Point[];
  color: string;
  lineWidth: number;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  text?: string;
  image?: string;
}

interface User {
  id: string;
  name: string;
  color: string;
}

interface CollaborativeWhiteboardProps {
  onSave?: (elements: DrawnElement[]) => void;
  onExport?: (dataUrl: string) => void;
  users?: User[];
  currentUser?: User;
  className?: string;
}

// ============================================
// Sub-components
// ============================================

const Toolbar: React.FC<{
  selectedTool: Tool;
  onToolSelect: (tool: Tool) => void;
  color: string;
  onColorChange: (color: string) => void;
  lineWidth: number;
  onLineWidthChange: (width: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}> = ({
  selectedTool,
  onToolSelect,
  color,
  onColorChange,
  lineWidth,
  onLineWidthChange,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
}) => {
  const tools: { tool: Tool; icon: React.ReactNode; label: string }[] = [
    { tool: 'pencil', icon: <Pencil className="h-5 w-5" />, label: 'Pencil' },
    { tool: 'eraser', icon: <Eraser className="h-5 w-5" />, label: 'Eraser' },
    { tool: 'rectangle', icon: <Square className="h-5 w-5" />, label: 'Rectangle' },
    { tool: 'circle', icon: <Circle className="h-5 w-5" />, label: 'Circle' },
    { tool: 'text', icon: <Type className="h-5 w-5" />, label: 'Text' },
    { tool: 'image', icon: <Image className="h-5 w-5" />, label: 'Image' },
  ];

  const colors = [
    '#00f0ff', // Cyan
    '#9d00ff', // Purple
    '#ff0080', // Pink
    '#f0ff00', // Yellow
    '#ffffff', // White
    '#000000', // Black
    '#ff4400', // Orange
    '#00ff00', // Green
  ];

  return (
    <div className="space-y-4 rounded-lg border border-cyber-cyan/30 bg-cyber-dark/50 p-4 backdrop-blur-sm">
      {/* 工具选择 */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase text-cyber-gray">Tools</h4>
        <div className="grid grid-cols-3 gap-2">
          {tools.map(({ tool, icon, label }) => (
            <motion.button
              key={tool}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToolSelect(tool)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border p-3 transition-colors',
                selectedTool === tool
                  ? 'border-cyber-cyan bg-cyber-cyan/20 text-cyber-cyan'
                  : 'border-cyber-gray/30 bg-cyber-dark/30 text-cyber-gray hover:bg-cyber-gray/20'
              )}
              title={label}
            >
              {icon}
              <span className="text-xs">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 颜色选择 */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase text-cyber-gray">Color</h4>
        <div className="grid grid-cols-4 gap-2">
          {colors.map((c) => (
            <motion.button
              key={c}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onColorChange(c)}
              className={cn(
                'h-8 w-full rounded border-2 transition-all',
                color === c ? 'border-cyber-white scale-110' : 'border-transparent'
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* 自定义颜色 */}
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="h-10 w-full cursor-pointer rounded border border-cyber-gray/30 bg-cyber-dark/30"
        />
      </div>

      {/* 线宽 */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase text-cyber-gray">Line Width</h4>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onLineWidthChange(Math.max(1, lineWidth - 1))}
            className="rounded border border-cyber-gray/30 bg-cyber-dark/30 p-2 text-cyber-gray"
          >
            <Minus className="h-4 w-4" />
          </motion.button>
          <div className="flex-1 rounded border border-cyber-gray/30 bg-cyber-dark/30 px-3 py-2 text-center text-sm text-cyber-white">
            {lineWidth}px
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onLineWidthChange(Math.min(50, lineWidth + 1))}
            className="rounded border border-cyber-gray/30 bg-cyber-dark/30 p-2 text-cyber-gray"
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase text-cyber-gray">Actions</h4>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUndo}
            disabled={!canUndo}
            className="flex-1 rounded border border-cyber-purple/50 bg-cyber-purple/10 px-3 py-2 text-cyber-purple transition-colors hover:bg-cyber-purple/20 disabled:cursor-not-allowed disabled:opacity-50"
            title="Undo"
          >
            <Undo className="mx-auto h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRedo}
            disabled={!canRedo}
            className="flex-1 rounded border border-cyber-purple/50 bg-cyber-purple/10 px-3 py-2 text-cyber-purple transition-colors hover:bg-cyber-purple/20 disabled:cursor-not-allowed disabled:opacity-50"
            title="Redo"
          >
            <Redo className="mx-auto h-5 w-5" />
          </motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClear}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyber-pink/50 bg-cyber-pink/10 px-3 py-2 text-cyber-pink transition-colors hover:bg-cyber-pink/20"
        >
          <Trash2 className="h-4 w-4" />
          Clear Canvas
        </motion.button>
      </div>
    </div>
  );
};

const UserList: React.FC<{ users: User[]; currentUser?: User }> = ({ users, currentUser }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-cyber-gray">
        <Users className="h-4 w-4" />
        <span className="text-xs font-bold uppercase">{users.length} Online</span>
      </div>
      <div className="space-y-1">
        {users.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 rounded-lg border border-cyber-cyan/20 bg-cyber-dark/30 px-3 py-2"
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: user.color }}
            />
            <span className="flex-1 text-sm text-cyber-white">
              {user.name}
              {user.id === currentUser?.id && ' (You)'}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// Main Component
// ============================================

export const CollaborativeWhiteboard: React.FC<CollaborativeWhiteboardProps> = ({
  onSave,
  onExport,
  users = [],
  currentUser,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#00f0ff');
  const [lineWidth, setLineWidth] = useState(3);
  const [elements, setElements] = useState<DrawnElement[]>([]);
  const [currentElement, setCurrentElement] = useState<DrawnElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<DrawnElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // 绘制所有元素
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制网格背景
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.lineWidth = 1;
    const gridSize = 20;

    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 绘制所有元素
    [...elements, currentElement].forEach((element) => {
      if (!element) return;

      ctx.strokeStyle = element.color;
      ctx.lineWidth = element.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (element.type === 'pencil' || element.type === 'eraser') {
        ctx.beginPath();
        if (element.points.length > 0) {
          ctx.moveTo(element.points[0].x, element.points[0].y);
          element.points.forEach((point) => {
            ctx.lineTo(point.x, point.y);
          });
        }
        ctx.stroke();
      } else if (element.type === 'rectangle') {
        ctx.strokeRect(
          element.startX || 0,
          element.startY || 0,
          (element.endX || 0) - (element.startX || 0),
          (element.endY || 0) - (element.startY || 0)
        );
      } else if (element.type === 'circle') {
        const radiusX = ((element.endX || 0) - (element.startX || 0)) / 2;
        const radiusY = ((element.endY || 0) - (element.startY || 0)) / 2;
        const centerX = (element.startX || 0) + radiusX;
        const centerY = (element.startY || 0) + radiusY;

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, Math.abs(radiusX), Math.abs(radiusY), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }, [elements, currentElement]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // 鼠标事件处理
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setIsDrawing(true);

      if (selectedTool === 'pencil' || selectedTool === 'eraser') {
        setCurrentElement({
          id: Date.now().toString(),
          type: selectedTool,
          points: [{ x, y }],
          color: selectedTool === 'eraser' ? '#0a0a0f' : color,
          lineWidth: selectedTool === 'eraser' ? lineWidth * 3 : lineWidth,
        });
      } else if (selectedTool === 'rectangle' || selectedTool === 'circle') {
        setCurrentElement({
          id: Date.now().toString(),
          type: selectedTool,
          points: [],
          color,
          lineWidth,
          startX: x,
          startY: y,
          endX: x,
          endY: y,
        });
      }
    },
    [selectedTool, color, lineWidth]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !currentElement) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (currentElement.type === 'pencil' || currentElement.type === 'eraser') {
        setCurrentElement({
          ...currentElement,
          points: [...currentElement.points, { x, y }],
        });
      } else if (currentElement.type === 'rectangle' || currentElement.type === 'circle') {
        setCurrentElement({
          ...currentElement,
          endX: x,
          endY: y,
        });
      }
    },
    [isDrawing, currentElement]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentElement) return;

    setElements((prev) => [...prev, currentElement]);
    setCurrentElement(null);
    setIsDrawing(false);

    // 保存到历史记录
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), [...elements, currentElement]]);
    setHistoryIndex((prev) => prev + 1);
  }, [isDrawing, currentElement, elements, historyIndex]);

  // 操作处理
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex] || []);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex] || []);
    }
  };

  const handleClear = () => {
    setElements([]);
    setCurrentElement(null);
    setHistory((prev) => [...prev, []]);
    setHistoryIndex((prev) => prev + 1);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    onExport?.(dataUrl);

    // 触发下载
    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className={cn('flex gap-4', className)}>
      {/* 工具栏 */}
      <div className="w-64 flex-shrink-0">
        <Toolbar
          selectedTool={selectedTool}
          onToolSelect={setSelectedTool}
          color={color}
          onColorChange={setColor}
          lineWidth={lineWidth}
          onLineWidthChange={setLineWidth}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClear}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />

        {/* 在线用户 */}
        {users.length > 0 && (
          <div className="mt-4 rounded-lg border border-cyber-cyan/30 bg-cyber-dark/50 p-4">
            <UserList users={users} currentUser={currentUser} />
          </div>
        )}

        {/* 导出按钮 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-cyber-cyan/50 bg-cyber-cyan/10 px-4 py-3 font-bold text-cyber-cyan transition-colors hover:bg-cyber-cyan/20"
        >
          <Download className="h-4 w-4" />
          Export as PNG
        </motion.button>
      </div>

      {/* 画布 */}
      <div className="flex-1 overflow-hidden rounded-lg border-2 border-cyber-cyan/30 bg-cyber-black">
        <canvas
          ref={canvasRef}
          width={1200}
          height={800}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-crosshair"
        />
      </div>
    </div>
  );
};

export default CollaborativeWhiteboard;
