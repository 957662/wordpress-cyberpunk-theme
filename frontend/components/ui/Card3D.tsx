/**
 * 3D Card Flip Component
 * 3D 卡片翻转组件
 *
 * 赛博朋克风格的 3D 翻转效果卡片
 */

'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import { Code, Globe, Smartphone, Rocket } from 'lucide-react';

export interface Card3DData {
  icon: React.ReactNode;
  title: string;
  description: string;
  backContent?: React.ReactNode;
  color: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange';
  stats?: {
    label: string;
    value: string;
  }[];
}

interface Card3DProps {
  data: Card3DData;
  className?: string;
  width?: number;
  height?: number;
}

const colorGradients = {
  cyan: 'from-cyber-cyan to-cyber-purple',
  purple: 'from-cyber-purple to-cyber-pink',
  pink: 'from-cyber-pink to-cyber-orange',
  yellow: 'from-cyber-yellow to-cyber-green',
  green: 'from-cyber-green to-cyber-cyan',
  orange: 'from-cyber-orange to-cyber-pink',
};

const colorBorders = {
  cyan: 'group-hover:border-cyber-cyan',
  purple: 'group-hover:border-cyber-purple',
  pink: 'group-hover:border-cyber-pink',
  yellow: 'group-hover:border-cyber-yellow',
  green: 'group-hover:border-cyber-green',
  orange: 'group-hover:border-cyber-orange',
};

export function Card3D({ data, className = '', width = 320, height = 400 }: Card3DProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      className={`perspective-1000 ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <motion.div
        ref={ref}
        className="relative w-full h-full cursor-pointer group"
        style={{
          transformStyle: 'preserve-3d',
          rotateX: isFlipped ? 180 : rotateX.get(),
          rotateY: rotateY.get(),
          transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* 正面 */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <motion.div
            className={`w-full h-full cyber-card p-6 border-2 border-cyber-border/30 ${colorBorders[data.color]} transition-all duration-300`}
            whileHover={{
              boxShadow: `0 0 30px ${data.color === 'cyan' ? '#00f0ff' : data.color === 'purple' ? '#9d00ff' : '#ff0080'}40`,
            }}
          >
            {/* 背景装饰 */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colorGradients[data.color]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

            {/* 顶部图标 */}
            <div className="relative z-10 mb-6">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  '--tw-gradient-from': `var(--cyber-${data.color})`,
                  '--tw-gradient-to': `var(--cyber-${data.color === 'cyan' ? 'purple' : data.color === 'purple' ? 'pink' : 'cyan'})`,
                } as React.CSSProperties}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, -5, 0],
                }}
                transition={{
                  rotate: { duration: 0.5 },
                  scale: { duration: 0.2 },
                }}
              >
                {data.icon}
              </motion.div>
            </div>

            {/* 标题 */}
            <div className="relative z-10 mb-4">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">
                {data.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {data.description}
              </p>
            </div>

            {/* 统计数据 */}
            {data.stats && (
              <div className="relative z-10 mt-6 space-y-3">
                {data.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-cyber-dark/50 rounded-lg border border-cyber-border/30"
                  >
                    <span className="text-sm text-gray-400">{stat.label}</span>
                    <span className={`text-lg font-bold bg-gradient-to-r ${colorGradients[data.color]} bg-clip-text text-transparent`}>
                      {stat.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* 底部提示 */}
            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>点击翻转</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.div>
              </div>
            </div>

            {/* 角落装饰 */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan/30 group-hover:border-cyber-cyan transition-colors rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan/30 group-hover:border-cyber-cyan transition-colors rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan/30 group-hover:border-cyber-cyan transition-colors rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan/30 group-hover:border-cyber-cyan transition-colors rounded-br-lg" />
          </motion.div>
        </div>

        {/* 背面 */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <motion.div
            className={`w-full h-full cyber-card p-6 border-2 border-cyber-border/30 ${colorBorders[data.color]} transition-all duration-300`}
            whileHover={{
              boxShadow: `0 0 30px ${data.color === 'cyan' ? '#00f0ff' : data.color === 'purple' ? '#9d00ff' : '#ff0080'}40`,
            }}
          >
            {data.backContent || (
              <div className="h-full flex flex-col">
                {/* 背景装饰 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colorGradients[data.color]} opacity-5`} />

                {/* 标题 */}
                <div className="relative z-10 mb-6">
                  <h4 className="text-xl font-bold text-white mb-2">
                    {data.title} - 详情
                  </h4>
                  <div className="h-0.5 w-20 bg-gradient-to-r from-cyber-cyan to-cyber-purple" />
                </div>

                {/* 内容区域 */}
                <div className="relative z-10 flex-1 overflow-y-auto space-y-4">
                  <div className="p-4 bg-cyber-dark/50 rounded-lg border border-cyber-border/30">
                    <h5 className="text-cyber-cyan font-semibold mb-2">特性</h5>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-cyber-cyan mt-0.5">▸</span>
                        <span>高性能架构设计</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyber-cyan mt-0.5">▸</span>
                        <span>现代化技术栈</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyber-cyan mt-0.5">▸</span>
                        <span>赛博朋克风格 UI</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyber-cyan mt-0.5">▸</span>
                        <span>响应式设计</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-cyber-dark/50 rounded-lg border border-cyber-border/30">
                    <h5 className="text-cyber-cyan font-semibold mb-2">技术栈</h5>
                    <div className="flex flex-wrap gap-2">
                      {['Next.js', 'React', 'TypeScript', 'Tailwind CSS'].map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs bg-cyber-cyan/10 text-cyber-cyan rounded-full border border-cyber-cyan/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 底部按钮 */}
                <div className="relative z-10 mt-4 pt-4 border-t border-cyber-border/50">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-semibold rounded-lg"
                  >
                    了解更多
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// 预定义卡片数据
export const card3DData: Card3DData[] = [
  {
    icon: <Code className="w-8 h-8 text-white" />,
    title: '前端开发',
    description: '构建现代化、高性能的用户界面，提供卓越的用户体验。',
    color: 'cyan',
    stats: [
      { label: '项目数量', value: '50+' },
      { label: '代码行数', value: '100K+' },
      { label: '客户满意度', value: '98%' },
    ],
  },
  {
    icon: <Globe className="w-8 h-8 text-white" />,
    title: 'Web 应用',
    description: '开发响应式、跨平台的 Web 应用程序，适配各种设备。',
    color: 'purple',
    stats: [
      { label: '活跃用户', value: '10K+' },
      { label: '响应速度', value: '<100ms' },
      { label: '正常运行', value: '99.9%' },
    ],
  },
  {
    icon: <Smartphone className="w-8 h-8 text-white" />,
    title: '移动开发',
    description: '创建原生和跨平台的移动应用，提供流畅的移动体验。',
    color: 'pink',
    stats: [
      { label: '下载量', value: '50K+' },
      { label: '评分', value: '4.8/5' },
      { label: '更新频率', value: '每周' },
    ],
  },
  {
    icon: <Rocket className="w-8 h-8 text-white" />,
    title: '性能优化',
    description: '优化应用性能，提升加载速度和用户体验。',
    color: 'yellow',
    stats: [
      { label: '性能提升', value: '+300%' },
      { label: '加载时间', value: '-70%' },
      { label: '转化率', value: '+150%' },
    ],
  },
];

// 使用示例
export function Card3DExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
      {card3DData.map((card, index) => (
        <Card3D key={index} data={card} />
      ))}
    </div>
  );
}
