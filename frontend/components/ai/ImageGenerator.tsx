'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Download, Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface GenerationConfig {
  prompt: string;
  style?: 'cyberpunk' | 'anime' | 'realistic' | 'abstract' | 'pixel-art';
  width?: number;
  height?: number;
  quality?: 'low' | 'medium' | 'high';
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  config: GenerationConfig;
  timestamp: Date;
}

export interface ImageGeneratorProps {
  /**
   * 生成图片的 API 端点
   */
  generateEndpoint?: string;

  /**
   * API 密钥
   */
  apiKey?: string;

  /**
   * 主题颜色
   */
  themeColor?: 'cyan' | 'purple' | 'pink';

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 生成的回调函数
   */
  onGenerate?: (image: GeneratedImage) => void;
}

const styleOptions = [
  { value: 'cyberpunk', label: '赛博朋克', color: 'bg-cyber-cyan' },
  { value: 'anime', label: '动漫', color: 'bg-cyber-pink' },
  { value: 'realistic', label: '写实', color: 'bg-cyber-purple' },
  { value: 'abstract', label: '抽象', color: 'bg-yellow-400' },
  { value: 'pixel-art', label: '像素艺术', color: 'bg-green-400' },
] as const;

const qualityOptions = [
  { value: 'low', label: '快速', resolution: '512x512' },
  { value: 'medium', label: '标准', resolution: '1024x1024' },
  { value: 'high', label: '高清', resolution: '1536x1536' },
] as const;

/**
 * AI 图片生成器组件
 * 使用 AI 生成赛博朋克风格的图片
 */
export const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  generateEndpoint,
  apiKey,
  themeColor = 'cyan',
  className = '',
  onGenerate,
}) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<GenerationConfig['style']>('cyberpunk');
  const [quality, setQuality] = useState<GenerationConfig['quality']>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const themeColors = {
    cyan: 'border-cyber-cyan text-cyber-cyan shadow-glow-cyan',
    purple: 'border-cyber-purple text-cyber-purple shadow-glow-purple',
    pink: 'border-cyber-pink text-cyber-pink shadow-glow-pink',
  };

  const theme = themeColors[themeColor];

  useEffect(() => {
    // 从 localStorage 加载历史记录
    const saved = localStorage.getItem('generated-images');
    if (saved) {
      const parsed = JSON.parse(saved);
      setGeneratedImages(parsed.map((img: any) => ({
        ...img,
        timestamp: new Date(img.timestamp),
      })));
    }
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);

    try {
      // 模拟 AI 生成 - 实际使用时调用真实 API
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 生成模拟图片 URL（使用占位符服务）
      const mockImage: GeneratedImage = {
        id: Date.now().toString(),
        url: `https://placehold.co/512x512/0a0a0f/${themeColor === 'cyan' ? '00f0ff' : themeColor === 'purple' ? '9d00ff' : 'ff0080'}?text=${encodeURIComponent(prompt.slice(0, 20))}`,
        prompt,
        config: {
          prompt,
          style,
          quality,
        },
        timestamp: new Date(),
      };

      const newImages = [mockImage, ...generatedImages];
      setGeneratedImages(newImages);
      setSelectedImage(mockImage);

      // 保存到 localStorage
      localStorage.setItem('generated-images', JSON.stringify(newImages));

      onGenerate?.(mockImage);
    } catch (error) {
      console.error('生成失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `cyberpress-${image.id}.png`;
    link.click();
  };

  const handleCopyPrompt = (image: GeneratedImage) => {
    navigator.clipboard.writeText(image.prompt);
    setCopiedId(image.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const examplePrompts = [
    '霓虹灯照耀的未来都市',
    '赛博格战士的肖像',
    '黑客帝国的数字雨',
    '悬浮车在夜空中穿梭',
    '全息投影的虚拟现实',
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* 生成器面板 */}
      <div className="bg-cyber-card border-2 border-cyber-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={cn('p-2 rounded-lg bg-opacity-20', themeColors[themeColor].color)}>
            <ImageIcon className={cn('w-6 h-6', themeColors[themeColor].text)} />
          </div>
          <div>
            <h2 className={cn('font-display font-bold text-xl', themeColors[themeColor].text)}>
              AI 图片生成器
            </h2>
            <p className="text-sm text-gray-400">使用 AI 创作赛博朋克风格图片</p>
          </div>
        </div>

        {/* 提示词输入 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            描述你想要生成的图片
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：霓虹灯照耀的未来都市，高楼大厦，飞行汽车..."
            className={cn(
              'w-full px-4 py-3 rounded-lg',
              'bg-cyber-darker border-2 border-cyber-border',
              'text-white placeholder:text-gray-500',
              'focus:outline-none focus:border-cyber-cyan',
              'resize-none',
              'min-h-[100px]'
            )}
            rows={3}
          />
        </div>

        {/* 示例提示词 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            快速选择
          </label>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example) => (
              <button
                key={example}
                onClick={() => setPrompt(example)}
                className="px-3 py-1.5 text-sm rounded-lg bg-cyber-darker border border-cyber-border text-gray-300 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* 风格选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            艺术风格
          </label>
          <div className="grid grid-cols-5 gap-2">
            {styleOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStyle(option.value)}
                className={cn(
                  'px-3 py-2 text-sm rounded-lg border-2 transition-all',
                  style === option.value
                    ? `${option.color} border-current text-cyber-dark`
                    : 'border-cyber-border text-gray-400 hover:border-gray-500'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 质量选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            画质
          </label>
          <div className="grid grid-cols-3 gap-2">
            {qualityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setQuality(option.value)}
                className={cn(
                  'px-3 py-2 text-sm rounded-lg border-2 transition-all',
                  quality === option.value
                    ? 'bg-cyber-cyan border-cyber-cyan text-cyber-dark'
                    : 'border-cyber-border text-gray-400 hover:border-gray-500'
                )}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-70">{option.resolution}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 生成按钮 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className={cn(
            'w-full py-3 rounded-lg font-medium',
            'flex items-center justify-center gap-2',
            'bg-gradient-to-r from-cyber-cyan to-cyber-purple',
            'text-white',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all'
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              生成图片
            </>
          )}
        </motion.button>
      </div>

      {/* 生成历史 */}
      {generatedImages.length > 0 && (
        <div className="bg-cyber-card border-2 border-cyber-border rounded-lg p-6">
          <h3 className={cn('font-display font-bold text-lg mb-4', theme)}>
            生成历史
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {generatedImages.map((image) => (
              <motion.div
                key={image.id}
                whileHover={{ scale: 1.05 }}
                className={cn(
                  'relative group cursor-pointer rounded-lg overflow-hidden border-2',
                  selectedImage?.id === image.id
                    ? `${theme} border-current`
                    : 'border-cyber-border hover:border-gray-500'
                )}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-xs text-white line-clamp-2 mb-2">
                      {image.prompt}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(image);
                        }}
                        className="p-1.5 rounded bg-cyber-cyan/20 hover:bg-cyber-cyan/40 text-cyber-cyan"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPrompt(image);
                        }}
                        className="p-1.5 rounded bg-cyber-purple/20 hover:bg-cyber-purple/40 text-cyber-purple"
                      >
                        {copiedId === image.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 图片预览 */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="bg-cyber-card border-2 border-cyber-border rounded-lg p-6 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={cn('font-display font-bold text-xl', theme)}>
                    {selectedImage.config.style?.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {selectedImage.timestamp.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 rounded-lg bg-cyber-darker border border-cyber-border text-gray-400 hover:text-white hover:border-cyber-cyan transition-colors"
                >
                  ✕
                </button>
              </div>

              <img
                src={selectedImage.url}
                alt={selectedImage.prompt}
                className="w-full rounded-lg mb-4"
              />

              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  <span className="font-medium">提示词:</span> {selectedImage.prompt}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(selectedImage)}
                    className={cn(
                      'px-4 py-2 rounded-lg font-medium flex items-center gap-2',
                      'bg-cyber-cyan text-cyber-dark hover:shadow-glow-cyan transition-all'
                    )}
                  >
                    <Download className="w-4 h-4" />
                    下载图片
                  </button>
                  <button
                    onClick={() => handleCopyPrompt(selectedImage)}
                    className={cn(
                      'px-4 py-2 rounded-lg font-medium flex items-center gap-2',
                      'bg-cyber-purple text-white hover:shadow-glow-purple transition-all'
                    )}
                  >
                    {copiedId === selectedImage.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        复制提示词
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGenerator;
