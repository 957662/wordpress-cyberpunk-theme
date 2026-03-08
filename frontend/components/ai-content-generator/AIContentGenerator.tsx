'use client';

/**
 * AIContentGenerator - AI内容生成器组件
 * 使用AI自动生成博客文章内容
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Send,
  Copy,
  Download,
  RefreshCw,
  Wand2,
  FileText,
  Image as ImageIcon,
  Code,
  Check,
  X,
} from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

type GenerationType = 'article' | 'summary' | 'title' | 'tags' | 'image';

interface GenerationConfig {
  type: GenerationType;
  topic: string;
  keywords?: string[];
  tone?: 'professional' | 'casual' | 'creative' | 'technical';
  length?: 'short' | 'medium' | 'long';
  language?: 'zh' | 'en';
}

interface GeneratedContent {
  id: string;
  type: GenerationType;
  content: string;
  metadata?: {
    wordCount?: number;
    readingTime?: number;
    suggestions?: string[];
  };
}

export function AIContentGenerator() {
  const [config, setConfig] = useState<GenerationConfig>({
    type: 'article',
    topic: '',
    keywords: [],
    tone: 'professional',
    length: 'medium',
    language: 'zh',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [copied, setCopied] = useState(false);

  // 添加关键词
  const addKeyword = useCallback(() => {
    if (keywordInput.trim() && !config.keywords?.includes(keywordInput.trim())) {
      setConfig((prev) => ({
        ...prev,
        keywords: [...(prev.keywords || []), keywordInput.trim()],
      }));
      setKeywordInput('');
    }
  }, [keywordInput, config.keywords]);

  // 删除关键词
  const removeKeyword = useCallback((keyword: string) => {
    setConfig((prev) => ({
      ...prev,
      keywords: prev.keywords?.filter((k) => k !== keyword),
    }));
  }, []);

  // 生成内容
  const generateContent = useCallback(async () => {
    if (!config.topic.trim()) {
      return;
    }

    setIsGenerating(true);
    try {
      // 调用AI生成API
      const response = await fetch('/api/v1/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('生成失败');
      }

      const data = await response.json();
      setGeneratedContent(data);
    } catch (error) {
      console.error('生成失败:', error);
      // 模拟生成内容（演示用）
      setTimeout(() => {
        setGeneratedContent({
          id: Date.now().toString(),
          type: config.type,
          content: `# ${config.topic}\n\n这是一篇关于"${config.topic}"的文章。\n\n## 引言\n\n${config.topic}是一个非常重要的话题，值得我们深入探讨。\n\n## 主要内容\n\n1. 第一点：${config.keywords?.[0] || '相关内容'}\n2. 第二点：相关分析\n3. 第三点：总结展望\n\n## 结论\n\n通过本文的探讨，我们对${config.topic}有了更深入的理解。`,
          metadata: {
            wordCount: 150,
            readingTime: 3,
            suggestions: [
              '可以添加更多实例',
              '建议增加数据支持',
              '可以扩展到更多维度',
            ],
          },
        });
        setIsGenerating(false);
      }, 2000);
    } finally {
      setIsGenerating(false);
    }
  }, [config]);

  // 复制内容
  const copyContent = useCallback(async () => {
    if (!generatedContent) return;

    try {
      await navigator.clipboard.writeText(generatedContent.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  }, [generatedContent]);

  // 重新生成
  const regenerate = useCallback(() => {
    generateContent();
  }, [generateContent]);

  // 下载内容
  const downloadContent = useCallback(() => {
    if (!generatedContent) return;

    const blob = new Blob([generatedContent.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.topic}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generatedContent, config.topic]);

  const generationTypes: Array<{
    value: GenerationType;
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      value: 'article',
      label: '文章',
      icon: <FileText className="w-5 h-5" />,
      description: '生成完整的博客文章',
    },
    {
      value: 'summary',
      label: '摘要',
      icon: <Sparkles className="w-5 h-5" />,
      description: '生成文章摘要',
    },
    {
      value: 'title',
      label: '标题',
      icon: <Wand2 className="w-5 h-5" />,
      description: '生成吸引人的标题',
    },
    {
      value: 'tags',
      label: '标签',
      icon: <Code className="w-5 h-5" />,
      description: '生成相关标签',
    },
    {
      value: 'image',
      label: '图片',
      icon: <ImageIcon className="w-5 h-5" />,
      description: '生成配图提示词',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
          AI 内容生成器
        </h1>
        <p className="text-gray-400">
          使用人工智能快速创建高质量内容
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 左侧：配置面板 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="cyber-card p-6">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-cyber-cyan" />
              生成配置
            </h2>

            <div className="space-y-4">
              {/* 生成类型选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  生成类型
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {generationTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setConfig((prev) => ({ ...prev, type: type.value }))}
                      className={cn(
                        'p-3 rounded-lg border-2 transition-all flex items-center gap-2',
                        config.type === type.value
                          ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
                          : 'border-cyber-border hover:border-cyber-cyan/50'
                      )}
                    >
                      {type.icon}
                      <div className="text-left">
                        <div className="font-semibold text-sm">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 主题输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  主题 *
                </label>
                <input
                  type="text"
                  value={config.topic}
                  onChange={(e) => setConfig((prev) => ({ ...prev, topic: e.target.value }))}
                  placeholder="输入文章主题..."
                  className="w-full px-4 py-2 bg-cyber-dark border-2 border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none"
                />
              </div>

              {/* 关键词 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  关键词
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    placeholder="输入关键词..."
                    className="flex-1 px-4 py-2 bg-cyber-dark border-2 border-cyber-border rounded-lg text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none"
                  />
                  <CyberButton size="sm" onClick={addKeyword}>
                    添加
                  </CyberButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.keywords?.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full text-sm text-cyber-cyan"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="hover:text-cyber-pink transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 语气 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  语气风格
                </label>
                <select
                  value={config.tone}
                  onChange={(e) => setConfig((prev) => ({ ...prev, tone: e.target.value as any }))}
                  className="w-full px-4 py-2 bg-cyber-dark border-2 border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none"
                >
                  <option value="professional">专业</option>
                  <option value="casual">轻松</option>
                  <option value="creative">创意</option>
                  <option value="technical">技术</option>
                </select>
              </div>

              {/* 长度 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  内容长度
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['short', 'medium', 'long'] as const).map((length) => (
                    <button
                      key={length}
                      onClick={() => setConfig((prev) => ({ ...prev, length }))}
                      className={cn(
                        'py-2 rounded-lg border-2 transition-all capitalize',
                        config.length === length
                          ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
                          : 'border-cyber-border hover:border-cyber-cyan/50'
                      )}
                    >
                      {length === 'short' ? '简短' : length === 'medium' ? '中等' : '长篇'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 生成按钮 */}
              <CyberButton
                variant="primary"
                size="lg"
                fullWidth
                icon={<Sparkles className="w-5 h-5" />}
                loading={isGenerating}
                onClick={generateContent}
                disabled={!config.topic.trim() || isGenerating}
              >
                {isGenerating ? '生成中...' : '开始生成'}
              </CyberButton>
            </div>
          </Card>
        </motion.div>

        {/* 右侧：生成结果 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="cyber-card p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyber-purple" />
                生成结果
              </h2>
              {generatedContent && (
                <div className="flex gap-2">
                  <CyberButton
                    size="sm"
                    variant="ghost"
                    icon={<Copy className="w-4 h-4" />}
                    onClick={copyContent}
                  >
                    {copied ? '已复制' : '复制'}
                  </CyberButton>
                  <CyberButton
                    size="sm"
                    variant="ghost"
                    icon={<Download className="w-4 h-4" />}
                    onClick={downloadContent}
                  >
                    下载
                  </CyberButton>
                  <CyberButton
                    size="sm"
                    variant="ghost"
                    icon={<RefreshCw className="w-4 h-4" />}
                    onClick={regenerate}
                    disabled={isGenerating}
                  >
                    重新生成
                  </CyberButton>
                </div>
              )}
            </div>

            {/* 生成内容显示区 */}
            <div className="bg-cyber-dark/50 rounded-lg p-4 min-h-[500px] max-h-[600px] overflow-y-auto">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-cyber-cyan border-t-transparent rounded-full mb-4"
                  />
                  <p className="text-gray-400">AI 正在创作中...</p>
                  <p className="text-sm text-gray-500 mt-2">这可能需要几秒钟</p>
                </div>
              ) : generatedContent ? (
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">
                    {generatedContent.content}
                  </pre>
                  {generatedContent.metadata && (
                    <div className="mt-4 pt-4 border-t border-cyber-border">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {generatedContent.metadata.wordCount && (
                          <div>
                            <span className="text-gray-500">字数：</span>
                            <span className="text-cyber-cyan">{generatedContent.metadata.wordCount}</span>
                          </div>
                        )}
                        {generatedContent.metadata.readingTime && (
                          <div>
                            <span className="text-gray-500">阅读时间：</span>
                            <span className="text-cyber-cyan">{generatedContent.metadata.readingTime} 分钟</span>
                          </div>
                        )}
                      </div>
                      {generatedContent.metadata.suggestions && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">建议：</h4>
                          <ul className="space-y-1">
                            {generatedContent.metadata.suggestions.map((suggestion, index) => (
                              <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                                <Check className="w-4 h-4 text-cyber-green flex-shrink-0 mt-0.5" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="w-16 h-16 text-gray-600 mb-4" />
                  <p className="text-gray-400">配置左侧选项后点击"开始生成"</p>
                  <p className="text-sm text-gray-500 mt-2">
                    AI 将根据您的配置创建内容
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default AIContentGenerator;
