/**
 * useImageZoom Hook
 * 图片缩放功能
 */

import { useState, useCallback, useRef, useEffect } from 'react';

interface ImageZoomOptions {
  /**
   * 最大缩放倍数
   * @default 3
   */
  maxZoom?: number;

  /**
   * 最小缩放倍数
   * @default 1
   */
  minZoom?: number;

  /**
   * 缩放步长
   * @default 0.5
   */
  zoomStep?: number;

  /**
   * 是否启用拖拽
   * @default true
   */
  enableDrag?: boolean;
}

interface ImageZoomReturn {
  /**
   * 当前缩放倍数
   */
  scale: number;

  /**
   * X轴偏移
   */
  translateX: number;

  /**
   * Y轴偏移
   */
  translateY: number;

  /**
   * 是否正在拖拽
   */
  isDragging: boolean;

  /**
   * 放大
   */
  zoomIn: () => void;

  /**
   * 缩小
   */
  zoomOut: () => void;

  /**
   * 重置
   */
  reset: () => void;

  /**
   * 设置缩放
   */
  setScale: (scale: number) => void;

  /**
   * 鼠标事件处理器
   */
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
    onWheel: (e: React.WheelEvent) => void;
  };

  /**
   * 图片容器引用
   */
  containerRef: React.RefObject<HTMLDivElement>;
}

export function useImageZoom(options: ImageZoomOptions = {}): ImageZoomReturn {
  const {
    maxZoom = 3,
    minZoom = 1,
    zoomStep = 0.5,
    enableDrag = true,
  } = options;

  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // 放大
  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + zoomStep, maxZoom));
  }, [maxZoom, zoomStep]);

  // 缩小
  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - zoomStep, minZoom));
  }, [minZoom, zoomStep]);

  // 重置
  const reset = useCallback(() => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  }, []);

  // 鼠标滚轮缩放
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
    setScale((prev) => {
      const newScale = prev + delta;
      return Math.max(minZoom, Math.min(maxZoom, newScale));
    });
  }, [maxZoom, minZoom, zoomStep]);

  // 鼠标按下
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enableDrag || scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - translateX, y: e.clientY - translateY });
  }, [enableDrag, scale, translateX, translateY]);

  // 鼠标移动
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const newTranslateX = e.clientX - dragStart.x;
    const newTranslateY = e.clientY - dragStart.y;
    setTranslateX(newTranslateX);
    setTranslateY(newTranslateY);
  }, [isDragging, dragStart]);

  // 鼠标抬起
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 鼠标离开
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ESC 键重置
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reset]);

  return {
    scale,
    translateX,
    translateY,
    isDragging,
    zoomIn,
    zoomOut,
    reset,
    setScale,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onWheel: handleWheel,
    },
    containerRef,
  };
}
