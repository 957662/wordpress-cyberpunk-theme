'use client';

/**
 * Components Usage Guide
 * 组件使用指南页面
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, Check } from 'lucide-react';
import { CyberCard } from '@/components/cyber/CyberCard';
import { CyberButton } from '@/components/ui/CyberButton';

export default function ComponentsUsagePage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const examples = [
    {
      title: '按钮组件',
      description: '多种变体的按钮组件',
      code: `import { CyberButton } from '@/components/ui/CyberButton';

// Primary Button
<CyberButton variant="primary">
  点击我
</CyberButton>

// Outline Button
<CyberButton variant="outline">
  取消
</CyberButton>

// With Icon
<CyberButton 
  variant="primary" 
  icon={<ArrowRight className="w-4 h-4" />}
>
  继续
</CyberButton>`,
    },
    {
      title: '卡片组件',
      description: '赛博朋克风格的卡片容器',
      code: `import { CyberCard } from '@/components/cyber/CyberCard';

<CyberCard className="p-6 border border-cyber-cyan/30">
  <h3 className="text-xl font-bold text-white mb-2">
    标题
  </h3>
  <p className="text-gray-400">
    卡片内容
  </p>
</CyberCard>`,
    },
    {
      title: 'Toast 通知',
      description: '显示临时通知消息',
      code: `import { useToast } from '@/components/toast';

function MyComponent() {
  const toast = useToast();

  const handleClick = () => {
    toast.success('操作成功!');
  };

  return (
    <button onClick={handleClick}>
      显示通知
    </button>
  );
}`,
    },
    {
      title: '数据表格',
      description: '功能完善的数据表格',
      code: `import { DataTable } from '@/components/table/DataTable';

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' },
  { key: 'email', title: '邮箱' },
];

const data = [
  { name: '张三', age: 25, email: 'zhang@example.com' },
  { name: '李四', age: 30, email: 'li@example.com' },
];

<DataTable columns={columns} data={data} />`,
    },
  ];

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(String(index));
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <section className="py-16 px-4 border-b border-cyber-border">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            组件使用指南
          </h1>
          <p className="text-xl text-gray-400">
            快速上手,轻松使用我们的组件库
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <CyberCard className="overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-cyber-border">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {example.title}
                  </h2>
                  <p className="text-gray-400">{example.description}</p>
                </div>

                {/* Code Block */}
                <div className="relative">
                  <div className="absolute top-4 right-4 z-10">
                    <CyberButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(example.code, index)}
                      icon={
                        copiedCode === String(index) ? (
                          <Check className="w-4 h-4 text-cyber-green" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )
                      }
                    >
                      {copiedCode === String(index) ? '已复制' : '复制'}
                    </CyberButton>
                  </div>
                  <pre className="p-6 bg-cyber-darker overflow-x-auto">
                    <code className="text-sm text-gray-300">
                      {example.code}
                    </code>
                  </pre>
                </div>
              </CyberCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 px-4 bg-cyber-dark/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            使用提示
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <CyberCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-cyber-cyan/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-cyber-cyan" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    导入路径
                  </h3>
                  <p className="text-gray-400 text-sm">
                    使用 @ 别名导入组件,确保路径正确
                  </p>
                </div>
              </div>
            </CyberCard>

            <CyberCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-cyber-purple/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-cyber-purple" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    TypeScript
                  </h3>
                  <p className="text-gray-400 text-sm">
                    所有组件都有完整的类型定义
                  </p>
                </div>
              </div>
            </CyberCard>

            <CyberCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-cyber-pink/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-cyber-pink" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    自定义样式
                  </h3>
                  <p className="text-gray-400 text-sm">
                    使用 className 属性自定义样式
                  </p>
                </div>
              </div>
            </CyberCard>

            <CyberCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-cyber-green/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-cyber-green" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    响应式设计
                  </h3>
                  <p className="text-gray-400 text-sm">
                    所有组件都支持响应式布局
                  </p>
                </div>
              </div>
            </CyberCard>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <CyberCard className="p-8 md:p-12 text-center border border-cyber-cyan/30">
            <h2 className="text-3xl font-bold text-white mb-4">
              准备好开始了吗?
            </h2>
            <p className="text-gray-400 mb-8">
              查看完整文档,探索更多组件
            </p>
            <CyberButton
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '/showcase'}
            >
              浏览所有组件
            </CyberButton>
          </CyberCard>
        </div>
      </section>
    </div>
  );
}
