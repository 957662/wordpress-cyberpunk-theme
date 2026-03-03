import { Metadata } from 'next';
import { AIChat } from '@/components/ai/ai-chat';
import { CollaborativeWhiteboard } from '@/components/whiteboard/collaborative-whiteboard';
import { CodeSnippetCard } from '@/components/code-share/code-snippet-card';
import { ArticleSummaryGenerator } from '@/components/article-summary/article-summary-generator';
import { AdvancedSearch } from '@/components/search-advanced/advanced-search';
import { ReadingProgressTracker, ChapterProgress } from '@/components/reading-progress/reading-progress-tracker';
import { CollaborativeEditor } from '@/components/collaborative/collaborative-editor';
import { TaskBoard } from '@/components/tasks/task-board';

export const metadata: Metadata = {
  title: 'AI 协作套件 | CyberPress Platform',
  description: '最新的 AI 驱动功能和协作工具'
};

export default function AICollaborationSuitePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Reading Progress Tracker */}
      <ReadingProgressTracker
        onStartReading={() => console.log('开始阅读')}
        onCompleteReading={() => console.log('阅读完成')}
        onProgressChange={(progress) => console.log(`进度: ${progress}%`)}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-purple-950/20 to-black" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            AI 协作套件
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            探索我们最新的 AI 驱动功能和实时协作工具
          </p>
        </div>
      </section>

      {/* AI Chat Section */}
      <section id="ai-chat" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">AI 聊天助手</h2>
            <p className="text-gray-400">
              智能对话助手，支持自然语言交互和上下文理解
            </p>
          </div>
          <div className="h-[600px]">
            <AIChat
              placeholder="问我任何问题..."
              title="AI 助手"
              onSendMessage={async (message) => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return `这是对"${message}"的模拟响应。在实际使用中，这将连接到 AI API。`;
              }}
            />
          </div>
        </div>
      </section>

      {/* Collaborative Whiteboard Section */}
      <section id="whiteboard" className="py-16 px-4 bg-gradient-to-b from-cyan-950/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">实时协作白板</h2>
            <p className="text-gray-400">
              多用户实时协作绘图，支持丰富的绘图工具和颜色选择
            </p>
          </div>
          <CollaborativeWhiteboard
            width={1200}
            height={700}
            currentUser={{
              id: 'user1',
              name: 'You',
              color: '#00f0ff'
            }}
            collaborators={[
              {
                id: 'user2',
                name: 'Alice',
                color: '#9d00ff',
                cursor: { x: 400, y: 300 }
              },
              {
                id: 'user3',
                name: 'Bob',
                color: '#ff0080',
                cursor: { x: 600, y: 400 }
              }
            ]}
            onStrokesChange={(strokes) => console.log('白板更新:', strokes.length)}
          />
        </div>
      </section>

      {/* Code Snippet Section */}
      <section id="code-share" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">代码分享平台</h2>
            <p className="text-gray-400">
              展示和分享代码片段，支持多种语言的语法高亮
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CodeSnippetCard
              snippet={{
                id: '1',
                title: 'React Server Component',
                description: 'Next.js 14 App Router 示例',
                code: `export default async function ServerComponent() {
  const data = await fetch('https://api.example.com/data')
    .then(res => res.json());

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <p className="text-gray-600">{data.description}</p>
    </div>
  );
}`,
                language: 'typescript',
                author: {
                  name: 'CyberPress'
                },
                createdAt: new Date(),
                likes: 42,
                isLiked: false,
                tags: ['React', 'Next.js', 'TypeScript']
              }}
              onLike={(id) => console.log('点赞:', id)}
              onBookmark={(id) => console.log('收藏:', id)}
              onShare={(snippet) => console.log('分享:', snippet.title)}
            />
            <CodeSnippetCard
              snippet={{
                id: '2',
                title: 'Python 数据处理',
                description: '使用 pandas 处理 CSV 数据',
                code: `import pandas as pd
import numpy as np

# 读取 CSV 文件
df = pd.read_csv('data.csv')

# 数据清洗
df = df.dropna()
df['date'] = pd.to_datetime(df['date'])

# 数据分析
summary = df.describe()
print(summary)

# 数据可视化
df.plot(kind='line')`,
                language: 'python',
                author: {
                  name: 'DataScientist'
                },
                createdAt: new Date(),
                likes: 28,
                isLiked: true,
                tags: ['Python', 'Pandas', 'Data Science']
              }}
            />
            <CodeSnippetCard
              snippet={{
                id: '3',
                title: 'Rust 异步运行时',
                description: '使用 tokio 构建异步应用',
                code: `use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    println!("Hello from async Rust!");

    // 并发执行多个任务
    let task1 = tokio::spawn(async {
        sleep(Duration::from_secs(1)).await;
        "Task 1 completed"
    });

    let task2 = tokio::spawn(async {
        sleep(Duration::from_secs(2)).await;
        "Task 2 completed"
    });

    let result1 = task1.await.unwrap();
    let result2 = task2.await.unwrap();

    println!("{}, {}", result1, result2);
}`,
                language: 'rust',
                author: {
                  name: 'Rustacean'
                },
                createdAt: new Date(),
                likes: 56,
                tags: ['Rust', 'Async', 'Tokio']
              }}
            />
            <CodeSnippetCard
              snippet={{
                id: '4',
                title: 'Go 并发模式',
                description: '使用 goroutines 和 channels',
                code: `package main

import (
    "fmt"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("Worker %d started job %d\\n", id, j)
        time.Sleep(time.Second)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // 启动 3 个 worker
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    // 发送 5 个任务
    for j := 1; j <= 5; j++ {
        jobs <- j
    }
    close(jobs)

    // 收集结果
    for a := 1; a <= 5; a++ {
        <-results
    }
}`,
                language: 'go',
                author: {
                  name: 'Gopher'
                },
                createdAt: new Date(),
                likes: 34,
                tags: ['Go', 'Concurrency', 'Channels']
              }}
            />
          </div>
        </div>
      </section>

      {/* Article Summary Section */}
      <section id="ai-summary" className="py-16 px-4 bg-gradient-to-b from-purple-950/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">AI 文章摘要生成器</h2>
            <p className="text-gray-400">
              使用 AI 自动生成文章摘要，支持多种格式和长度
            </p>
          </div>
          <ArticleSummaryGenerator
            articleTitle="人工智能的未来发展趋势"
            articleContent="人工智能正在快速发展，从机器学习到深度学习，再到生成式 AI。在未来的十年里，我们预计会看到更加智能的 AI 系统，它们能够更好地理解和生成自然语言，处理复杂的推理任务，并在各个行业中发挥重要作用。医疗、教育、金融等领域都将受益于 AI 技术的进步。同时，我们也需要关注 AI 的伦理和安全问题，确保技术的发展能够造福人类。"
            onGenerate={async (content, options) => {
              await new Promise(resolve => setTimeout(resolve, 2000));
              return `这是根据您的选择生成的摘要：

${options.style === 'bullet' ? '• 核心观点 1\n• 核心观点 2\n• 核心观点 3' : '本文主要讨论了人工智能的未来发展趋势，包括技术进步、行业应用和伦理考量等关键方面。'}
`;
            }}
          />
        </div>
      </section>

      {/* Advanced Search Section */}
      <section id="search" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">高级搜索</h2>
            <p className="text-gray-400">
              强大的全文搜索功能，支持多维度筛选和智能建议
            </p>
          </div>
          <AdvancedSearch
            placeholder="搜索文章、作品集、页面..."
            suggestions={['React 教程', 'Python 入门', 'AI 应用', 'Web3 开发', '数据库设计']}
            onSearch={async (query, filters) => {
              await new Promise(resolve => setTimeout(resolve, 500));
              return [
                {
                  id: '1',
                  title: `${query} - 搜索结果 1`,
                  excerpt: `这是关于 "${query}" 的搜索结果摘要...`,
                  category: 'blog',
                  author: 'CyberPress',
                  date: new Date(),
                  readTime: 5,
                  tags: ['Tech', 'Tutorial'],
                  url: '#'
                }
              ];
            }}
          />
        </div>
      </section>

      {/* Task Board Section */}
      <section id="tasks" className="py-16 px-4 bg-gradient-to-b from-cyan-950/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">任务看板</h2>
            <p className="text-gray-400">
              可视化项目管理工具，支持拖拽和实时协作
            </p>
          </div>
          <div className="h-[700px]">
            <TaskBoard
              initialTasks={[
                {
                  id: '1',
                  title: '设计新的登录页面',
                  description: '创建一个现代化的登录界面，支持多种认证方式',
                  status: 'todo',
                  priority: 'high',
                  assignee: 'Alice',
                  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                  tags: ['Design', 'UI'],
                  createdAt: new Date()
                },
                {
                  id: '2',
                  title: '实现 API 集成',
                  description: '连接后端 REST API，实现数据同步',
                  status: 'in-progress',
                  priority: 'urgent',
                  assignee: 'Bob',
                  dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                  tags: ['Backend', 'API'],
                  createdAt: new Date()
                },
                {
                  id: '3',
                  title: '编写单元测试',
                  description: '为核心功能添加测试覆盖，确保代码质量',
                  status: 'review',
                  priority: 'medium',
                  assignee: 'Charlie',
                  tags: ['Testing', 'Quality'],
                  createdAt: new Date()
                },
                {
                  id: '4',
                  title: '部署到生产环境',
                  description: '配置 CI/CD 流程，自动化部署',
                  status: 'done',
                  priority: 'high',
                  assignee: 'Dave',
                  tags: ['DevOps', 'Deployment'],
                  createdAt: new Date()
                }
              ]}
              onTaskUpdate={(id, updates) => console.log('任务更新:', id, updates)}
              onTaskDelete={(id) => console.log('任务删除:', id)}
            />
          </div>
        </div>
      </section>

      {/* Collaborative Editor Section */}
      <section id="editor" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">协作编辑器</h2>
            <p className="text-gray-400">
              实时协作编辑 Markdown 文档，支持版本控制和多人同时编辑
            </p>
          </div>
          <CollaborativeEditor
            initialContent={`# 欢迎使用协作编辑器

这是一个支持多人实时协作的 Markdown 编辑器。

## 功能特点

- 🔄 **实时同步** - 多人同时编辑，实时看到对方的变化
- 📝 **Markdown 支持** - 完整的 Markdown 语法支持
- 🔙 **版本控制** - 撤销/重做功能
- 💾 **自动保存** - 防止数据丢失
- 👥 **协作者可见** - 看到谁在线编辑

## 快捷键

- \`Ctrl/Cmd + S\` - 保存
- \`Ctrl/Cmd + Z\` - 撤销
- \`Ctrl/Cmd + Shift + Z\` - 重做

## 开始使用

直接开始输入即可！
`}
            collaborators={[
              {
                id: 'user2',
                name: 'Alice',
                color: '#9d00ff'
              },
              {
                id: 'user3',
                name: 'Bob',
                color: '#ff0080'
              }
            ]}
            onSave={async (content) => {
              console.log('保存内容:', content.length, '字符');
            }}
            autoSave
            autoSaveInterval={30000}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-cyan-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            AI 协作套件 - 由 CyberPress Platform 提供支持
          </p>
          <p className="text-sm text-gray-500 mt-2">
            © 2026 CyberPress. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
