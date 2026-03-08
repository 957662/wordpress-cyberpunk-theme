'use client';

/**
 * AI Content Generator
 * AI 内容生成器组件
 * 使用 AI 技术辅助生成博客内容
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Download,
  Save,
  Trash2,
  Settings,
  Lightbulb,
  PenLine,
  FileText,
  Image,
  Code,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export type ContentType = 'blog' | 'title' | 'summary' | 'outline' | 'seo' | 'image-prompt' | 'code';

interface ContentTemplate {
  type: ContentType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const contentTemplates: ContentTemplate[] = [
  {
    type: 'blog',
    label: '博客文章',
    icon: FileText,
    description: '生成完整的博客文章内容',
  },
  {
    type: 'title',
    label: '标题建议',
    icon: PenLine,
    description: '生成吸引人的文章标题',
  },
  {
    type: 'summary',
    label: '内容摘要',
    icon: Sparkles,
    description: '生成文章摘要和简介',
  },
  {
    type: 'outline',
    label: '文章大纲',
    icon: Lightbulb,
    description: '生成文章结构大纲',
  },
  {
    type: 'seo',
    label: 'SEO 优化',
    icon: FileText,
    description: '生成 SEO 关键词和描述',
  },
  {
    type: 'image-prompt',
    label: '图片提示',
    icon: Image,
    description: '生成 AI 绘图提示词',
  },
  {
    type: 'code',
    label: '代码示例',
    icon: Code,
    description: '生成代码示例和解释',
  },
];

interface GenerationParams {
  topic: string;
  keywords: string[];
  tone: 'professional' | 'casual' | 'friendly' | 'formal';
  length: 'short' | 'medium' | 'long';
  language: string;
}

export function AIContentGenerator() {
  const [selectedType, setSelectedType] = useState<ContentType>('blog');
  const [params, setParams] = useState<Partial<GenerationParams>>({
    tone: 'professional',
    length: 'medium',
    language: 'zh-CN',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [savedContents, setSavedContents] = useState<Array<{ id: string; content: string; type: ContentType; timestamp: number }>>([]);

  const handleGenerate = async () => {
    if (!params.topic) {
      return;
    }

    setIsGenerating(true);

    // 模拟 AI 生成
    setTimeout(() => {
      const mockContent = generateMockContent(selectedType, params);
      setGeneratedContent(mockContent);
      setIsGenerating(false);
    }, 2000);
  };

  const generateMockContent = (type: ContentType, p: Partial<GenerationParams>): string => {
    const topic = p.topic || '未命名主题';
    const keywords = p.keywords?.join(', ') || '';

    switch (type) {
      case 'blog':
        return `# ${topic}

## 简介
${topic} 是一个非常重要的话题，本文将深入探讨相关概念和实践。

## 主要内容

### 1. 背景介绍
${topic} 的发展历史和背景可以追溯到...

### 2. 核心概念
在深入了解 ${topic} 之前，我们需要先掌握一些核心概念...

### 3. 实践应用
${topic} 在实际应用中有很多场景...

### 4. 最佳实践
根据经验，以下是使用 ${topic} 的最佳实践...

## 总结
${topic} 是一个值得深入研究的领域，希望本文能够帮助您更好地理解和应用它。

## 参考资料
- 相关文献 1
- 相关文献 2
- 相关文献 3

---

**关键词**: ${keywords}
**预计阅读时间**: 5-8 分钟
`;

      case 'title':
        return `标题建议：

1. ${topic}：完全指南
2. 深入理解 ${topic}：从入门到精通
3. ${topic} 实战：10个实用技巧
4. 为什么 ${topic} 如此重要？
5. ${topic} 的未来发展趋势
6. ${topic}：新手必知的5个要点
7. ${topic} 进阶：高级技巧与优化
8. ${topic} 剖析：原理与实践
9. ${topic} 指南：循序渐进学习
10. ${topic} 解密：专家经验分享
`;

      case 'summary':
        return `## 文章摘要

本文详细介绍了 ${topic} 的相关内容，包括其核心概念、实际应用和最佳实践。通过本文，读者可以全面了解 ${topic} 的原理和使用方法。

## 关键要点

- ${topic} 的基本概念和特点
- ${topic} 的实际应用场景
- ${topic} 的最佳实践建议
- ${topic} 的发展趋势

## 适合人群

本文适合对 ${topic} 感兴趣的初学者和进阶学习者阅读。
`;

      case 'outline':
        return `# ${topic} - 文章大纲

## I. 引言
   A. ${topic} 的定义
   B. 为什么 ${topic} 很重要
   C. 本文的主要内容

## II. 基础知识
   A. ${topic} 的核心概念
   B. 相关术语解释
   C. ${topic} 的发展历史

## III. 主要内容
   A. ${topic} 的原理
   B. ${topic} 的应用场景
   C. ${topic} 的实现方法

## IV. 实践案例
   A. 案例 1: ${topic} 的实际应用
   B. 案例 2: ${topic} 的最佳实践
   C. 案例 3: ${topic} 的常见问题

## V. 进阶话题
   A. ${topic} 的高级技巧
   B. ${topic} 的性能优化
   C. ${topic} 的未来展望

## VI. 总结
   A. 要点回顾
   B. 学习建议
   C. 相关资源
`;

      case 'seo':
        return `# SEO 优化建议

## 关键词建议

**主要关键词**: ${topic}

**长尾关键词**:
- ${topic} 教程
- ${topic} 指南
- ${topic} 最佳实践
- 如何学习 ${topic}
- ${topic} 入门

## Meta 标题
${topic} - 完整指南与实战教程 | CyberPress Blog

## Meta 描述
深入了解 ${topic}，从基础概念到高级应用。本文提供详细的 ${topic} 教程、实践案例和最佳实践，帮助您快速掌握 ${topic}。

## URL 建议
/blog/${topic.toLowerCase().replace(/\s+/g, '-')}

## 标签建议
- ${topic}
- 教程
- 指南
- 最佳实践
`;

      case 'image-prompt':
        return `# AI 绘图提示词

## 主图提示词
Professional blog header illustration for "${topic}", modern cyberpunk style, neon colors, futuristic city background, high quality, 4k, detailed

## 配图提示词 1
Infographic diagram explaining ${topic} concepts, clean design, tech illustration, blue and purple color scheme

## 配图提示词 2
Abstract representation of ${topic}, geometric shapes, digital art, minimalist, gradient background

## 配图提示词 3
Professional workspace setup for ${topic}, modern computer, multiple screens, ambient lighting, photorealistic

## 风格建议
- 色调: 霓虹青 (#00f0ff)、赛博紫 (#9d00ff)
- 风格: 赛博朋克、科技感、未来感
- 构图: 居中、留白、清晰
- 质量: 高清、4K、专业级
`;

      case 'code':
        return `# ${topic} - 代码示例

## 示例 1: 基础实现

\`\`\`typescript
// ${topic} 的基础实现示例
function example${topic.replace(/\s+/g, '')}() {
  // 初始化配置
  const config = {
    option1: 'value1',
    option2: 'value2',
  };

  // 执行逻辑
  const result = process${topic.replace(/\s+/g, '')}(config);

  return result;
}

// 使用示例
const result = example${topic.replace(/\s+/g, '')}();
console.log(result);
\`\`\`

## 示例 2: 高级用法

\`\`\`typescript
// ${topic} 的高级实现
class Advanced${topic.replace(/\s+/g, '')} {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async execute(): Promise<Result> {
    // 异步处理逻辑
    const data = await this.fetchData();
    const processed = this.process(data);
    return processed;
  }

  private async fetchData(): Promise<Data> {
    // 数据获取逻辑
  }

  private process(data: Data): Result {
    // 数据处理逻辑
  }
}
\`\`\`

## 说明

以上代码展示了 ${topic} 的两种实现方式：
1. 基础实现：简单的函数式实现
2. 高级实现：面向对象的异步实现

根据实际需求选择合适的实现方式。
`;

      default:
        return '生成的内容将在这里显示...';
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-generated-${selectedType}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const newSaved = {
      id: Date.now().toString(),
      content: generatedContent,
      type: selectedType,
      timestamp: Date.now(),
    };
    setSavedContents([newSaved, ...savedContents]);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedContents(savedContents.filter((item) => item.id !== id));
  };

  return (
    <div className="cyber-card">
      {/* Header */}
      <div className="border-b border-cyber-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-lg">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI 内容生成器</h2>
              <p className="text-sm text-gray-400">使用 AI 技术快速创建优质内容</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Left Panel - Settings */}
        <div className="w-80 border-r border-cyber-border p-6 space-y-6">
          {/* Content Type Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">内容类型</h3>
            <div className="grid grid-cols-2 gap-2">
              {contentTemplates.map((template) => (
                <button
                  key={template.type}
                  onClick={() => setSelectedType(template.type)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedType === template.type
                      ? 'border-cyber-cyan bg-cyber-cyan/10'
                      : 'border-cyber-border hover:border-cyber-cyan/50'
                  }`}
                >
                  <template.icon className={`w-5 h-5 mb-1 ${selectedType === template.type ? 'text-cyber-cyan' : 'text-gray-400'}`} />
                  <div className="text-xs font-medium text-gray-300">{template.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-300">生成参数</h3>

            <div>
              <label className="block text-xs text-gray-400 mb-1">主题 *</label>
              <input
                type="text"
                value={params.topic || ''}
                onChange={(e) => setParams({ ...params, topic: e.target.value })}
                placeholder="输入内容主题..."
                className="w-full px-3 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white text-sm focus:border-cyber-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">关键词（逗号分隔）</label>
              <input
                type="text"
                value={params.keywords?.join(', ') || ''}
                onChange={(e) => setParams({ ...params, keywords: e.target.value.split(',').map(k => k.trim()) })}
                placeholder="关键词1, 关键词2, ..."
                className="w-full px-3 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white text-sm focus:border-cyber-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">语调</label>
              <select
                value={params.tone}
                onChange={(e) => setParams({ ...params, tone: e.target.value as any })}
                className="w-full px-3 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white text-sm focus:border-cyber-cyan focus:outline-none"
              >
                <option value="professional">专业</option>
                <option value="casual">轻松</option>
                <option value="friendly">友好</option>
                <option value="formal">正式</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">长度</label>
              <select
                value={params.length}
                onChange={(e) => setParams({ ...params, length: e.target.value as any })}
                className="w-full px-3 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white text-sm focus:border-cyber-cyan focus:outline-none"
              >
                <option value="short">短</option>
                <option value="medium">中</option>
                <option value="long">长</option>
              </select>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={handleGenerate}
              disabled={!params.topic || isGenerating}
              isLoading={isGenerating}
              loadingText="生成中..."
            >
              <Wand2 className="w-4 h-4 mr-2" />
              生成内容
            </Button>
          </div>

          {/* Saved Contents */}
          {savedContents.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">已保存的内容</h3>
              <div className="space-y-2">
                {savedContents.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="p-2 bg-cyber-dark/50 rounded-lg border border-cyber-border"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-cyber-cyan">{contentTemplates.find(t => t.type === item.type)?.label}</span>
                      <button
                        onClick={() => handleDeleteSaved(item.id)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Generated Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-cyber-border bg-cyber-dark/30">
            <div className="text-sm text-gray-400">
              {contentTemplates.find((t) => t.type === selectedType)?.description}
            </div>
            <div className="flex items-center gap-2">
              {generatedContent && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    title={isCopied ? '已复制!' : '复制'}
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    title="下载"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    title="保存"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGeneratedContent('')}
                title="清空"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content Display */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-cyber-cyan/20 border-t-cyber-cyan rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-cyber-cyan animate-pulse" />
                  </div>
                  <p className="mt-4 text-gray-400">AI 正在生成内容...</p>
                  <p className="mt-2 text-sm text-gray-500">这可能需要几秒钟</p>
                </motion.div>
              ) : generatedContent ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="prose prose-invert max-w-none"
                >
                  <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm leading-relaxed">
                    {generatedContent}
                  </pre>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-cyber-cyan/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-10 h-10 text-cyber-cyan" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">开始生成内容</h3>
                  <p className="text-gray-400 max-w-md">
                    在左侧选择内容类型，输入主题和参数，然后点击"生成内容"按钮。
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIContentGenerator;
