'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil,
  Eraser,
  Palette,
  Users,
  Download,
  Trash2,
  Undo,
  Redo,
  MousePointer2
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Tool = 'pencil' | 'eraser' | 'selector';
type Color = string;

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  id: string;
  points: Point[];
  color: Color;
  width: number;
  tool: Tool;
  userId: string;
  userName: string;
}

interface User {
  id: string;
  name: string;
  color: Color;
  cursor?: Point;
}

interface CollaborativeWhiteboardProps {
  className?: string;
  width?: number;
  height?: number;
  initialStrokes?: Stroke[];
  onStrokesChange?: (strokes: Stroke[]) => void;
  currentUser?: User;
  collaborators?: User[];
  readOnly?: boolean;
}

const COLORS = [
  '#00f0ff', // Cyan
  '#9d00ff', // Purple
  '#ff0080', // Pink
  '#f0ff00', // Yellow
  '#00ff00', // Green
  '#ff6600', // Orange
  '#ffffff', // White
  '#808080', // Gray
];

const STROKE_WIDTHS = [2, 4, 8, 12, 16];

export function CollaborativeWhiteboard({
  className,
  width = 1200,
  height = 800,
  initialStrokes = [],
  onStrokesChange,
  currentUser = { id: 'local', name: 'You', color: '#00f0ff' },
  collaborators = [],
  readOnly = false
}: CollaborativeWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>(initialStrokes);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>('pencil');
  const [selectedColor, setSelectedColor] = useState<Color>(COLORS[0]);
  const [selectedWidth, setSelectedWidth] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);

  // Draw all strokes on canvas
  const drawStrokes = useCallback((allStrokes: Stroke[], current?: Stroke) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all strokes
    [...allStrokes, current].filter(Boolean).forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }

      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });

    // Draw collaborator cursors
    collaborators.forEach((collaborator) => {
      if (collaborator.cursor) {
        ctx.beginPath();
        ctx.arc(collaborator.cursor.x, collaborator.cursor.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = collaborator.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw name
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText(collaborator.name, collaborator.cursor.x + 12, collaborator.cursor.y + 4);
      }
    });
  }, [collaborators]);

  useEffect(() => {
    drawStrokes(strokes, currentStroke);
  }, [strokes, currentStroke, drawStrokes]);

  const getPoint = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
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

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (readOnly) return;

    const point = getPoint(e);
    setIsDrawing(true);

    const newStroke: Stroke = {
      id: Date.now().toString(),
      points: [point],
      color: selectedTool === 'eraser' ? '#0a0a0f' : selectedColor,
      width: selectedTool === 'eraser' ? selectedWidth * 2 : selectedWidth,
      tool: selectedTool,
      userId: currentUser.id,
      userName: currentUser.name
    };

    setCurrentStroke(newStroke);
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentStroke) return;

    const point = getPoint(e);
    setCurrentStroke({
      ...currentStroke,
      points: [...currentStroke.points, point]
    });
  };

  const handleEnd = () => {
    if (!isDrawing || !currentStroke) return;

    const newStrokes = [...strokes, currentStroke];
    setStrokes(newStrokes);
    setUndoStack([...undoStack, strokes]);
    setRedoStack([]);
    setCurrentStroke(null);
    setIsDrawing(false);

    onStrokesChange?.(newStrokes);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;

    const newStrokes = undoStack[undoStack.length - 1];
    setRedoStack([strokes, ...redoStack]);
    setUndoStack(undoStack.slice(0, -1));
    setStrokes(newStrokes);
    onStrokesChange?.(newStrokes);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const newStrokes = redoStack[0];
    setUndoStack([...undoStack, strokes]);
    setRedoStack(redoStack.slice(1));
    setStrokes(newStrokes);
    onStrokesChange?.(newStrokes);
  };

  const handleClear = () => {
    setUndoStack([...undoStack, strokes]);
    setStrokes([]);
    onStrokesChange?.([]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className={cn(
      'flex flex-col bg-black/50 backdrop-blur-xl rounded-2xl border border-cyan-500/30 overflow-hidden',
      'shadow-[0_0_40px_rgba(0,240,255,0.1)]',
      className
    )}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 to-purple-950/20">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-cyan-400" />
          <div className="flex items-center gap-2">
            {currentUser && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: currentUser.color }}
              >
                {currentUser.name[0]}
              </div>
            )}
            <div className="flex -space-x-2">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: collaborator.color }}
                  title={collaborator.name}
                >
                  {collaborator.name[0]}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUndo}
            disabled={undoStack.length === 0 || readOnly}
            className="p-2 rounded-lg hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title="撤销"
          >
            <Undo className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRedo}
            disabled={redoStack.length === 0 || readOnly}
            className="p-2 rounded-lg hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title="重做"
          >
            <Redo className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClear}
            disabled={readOnly}
            className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title="清空"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-all duration-300"
            title="下载"
          >
            <Download className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Side Tools */}
        <div className="w-16 border-r border-cyan-500/20 bg-gray-900/50 flex flex-col items-center py-4 gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTool('selector')}
            disabled={readOnly}
            className={cn(
              'p-3 rounded-xl transition-all duration-300',
              selectedTool === 'selector'
                ? 'bg-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                : 'hover:bg-gray-800 text-gray-400'
            )}
            title="选择"
          >
            <MousePointer2 className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTool('pencil')}
            disabled={readOnly}
            className={cn(
              'p-3 rounded-xl transition-all duration-300',
              selectedTool === 'pencil'
                ? 'bg-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                : 'hover:bg-gray-800 text-gray-400'
            )}
            title="铅笔"
          >
            <Pencil className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTool('eraser')}
            disabled={readOnly}
            className={cn(
              'p-3 rounded-xl transition-all duration-300',
              selectedTool === 'eraser'
                ? 'bg-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                : 'hover:bg-gray-800 text-gray-400'
            )}
            title="橡皮擦"
          >
            <Eraser className="w-5 h-5" />
          </motion.button>

          <div className="flex-1" />

          {/* Colors */}
          <div className="flex flex-col gap-2">
            {COLORS.map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedColor(color)}
                disabled={readOnly}
                className={cn(
                  'w-8 h-8 rounded-full transition-all duration-300',
                  selectedColor === color
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-black'
                    : 'hover:scale-110'
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          <div className="w-full h-px bg-cyan-500/20 my-2" />

          {/* Stroke Width */}
          <div className="flex flex-col gap-2">
            {STROKE_WIDTHS.map((width) => (
              <motion.button
                key={width}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedWidth(width)}
                disabled={readOnly}
                className={cn(
                  'rounded-full transition-all duration-300 bg-cyan-400',
                  selectedWidth === width ? 'ring-2 ring-white' : 'hover:ring-2 hover:ring-white/50'
                )}
                style={{ width: `${Math.min(width + 8, 24)}px`, height: `${Math.min(width + 8, 24)}px` }}
                title={`宽度: ${width}`}
              />
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-hidden relative">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            className={cn(
              'bg-gray-950 cursor-crosshair',
              readOnly && 'cursor-default'
            )}
            style={{ touchAction: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}
