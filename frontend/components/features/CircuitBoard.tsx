/**
 * 电路板组件
 * 创建赛博朋克风格的电路板图案背景
 */

'use client';

import { useEffect, useRef } from 'react';

export interface CircuitBoardProps {
  lineColor?: string;
  nodeColor?: string;
  density?: 'low' | 'medium' | 'high';
  animation?: boolean;
  className?: string;
}

export function CircuitBoard({
  lineColor = 'rgba(0, 240, 255, 0.3)',
  nodeColor = '#00f0ff',
  density = 'medium',
  animation = true,
  className = '',
}: CircuitBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const nodeCount = {
    low: 15,
    medium: 25,
    high: 40,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    interface CircuitNode {
      x: number;
      y: number;
      connections: number[];
      pulse: number;
    }

    // 生成电路节点
    const nodes: CircuitNode[] = [];
    const count = nodeCount[density];

    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        connections: [],
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // 建立连接
    nodes.forEach((node, index) => {
      const nearbyNodes = nodes
        .map((otherNode, otherIndex) => ({
          index: otherIndex,
          distance: Math.sqrt(
            (node.x - otherNode.x) ** 2 + (node.y - otherNode.y) ** 2
          ),
        }))
        .filter(({ distance }) => distance < 300)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);

      node.connections = nearbyNodes.map(({ index }) => index);
    });

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制连接线
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      nodes.forEach((node) => {
        node.connections.forEach((connectedIndex) => {
          const connectedNode = nodes[connectedIndex];
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);

          // 绘制直角线路径
          const midX = (node.x + connectedNode.x) / 2;
          ctx.lineTo(midX, node.y);
          ctx.lineTo(midX, connectedNode.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);

          ctx.stroke();
        });
      });

      // 绘制节点
      nodes.forEach((node) => {
        // 脉冲动画
        if (animation) {
          node.pulse += 0.05;
          const pulseSize = Math.sin(node.pulse) * 2 + 4;
          const pulseOpacity = (Math.sin(node.pulse) + 1) / 4;

          // 外圈脉冲
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
          ctx.fillStyle = nodeColor.replace(')', `, ${pulseOpacity})`).replace('rgb', 'rgba');
          ctx.fill();
        }

        // 核心节点
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // 发光效果
        ctx.shadowBlur = 10;
        ctx.shadowColor = nodeColor;
      });

      if (animation) {
        time += 0.01;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [lineColor, nodeColor, density, animation]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  );
}

export default CircuitBoard;
