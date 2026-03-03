'use client';

/**
 * Collaborative Editing Examples - 协作编辑组件示例
 */

import { CollaborativeEditing } from '@/components/collaborative';

const initialContent = `# 欢迎使用协作编辑器

这是一个支持多人实时协作的编辑器组件。

## 主要特性

- 实时协作编辑
- 在线用户显示
- 自动保存功能
- 导入/导出文档
- 端到端加密

## 如何使用

1. 点击"邀请"按钮邀请其他人
2. 在左侧编辑器中输入内容
3. 看到其他用户的光标移动
4. 使用保存按钮手动保存

## 技术栈

本组件使用以下技术构建：
- React 18
- Framer Motion
- TypeScript
- WebSocket（模拟）

开始编辑吧！

---

（这是一个演示页面，实际协作功能需要后端支持）`;

const mockCollaborators = [
  {
    id: '2',
    name: 'Alice',
    color: '#00f0ff',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Bob',
    color: '#9d00ff',
    isOnline: true,
  },
  {
    id: '4',
    name: 'Charlie',
    color: '#ff0080',
    isOnline: false,
  },
];

const currentUser = {
  id: '1',
  name: 'You',
  color: '#4ade80',
  isOnline: true,
};

export default function CollaborativeEditingExamples() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            协作编辑组件
          </h1>
          <p className="text-xl text-gray-400">
            支持多人实时协作的富文本编辑器
          </p>
        </div>

        {/* 协作编辑器 */}
        <div className="mb-12">
          <CollaborativeEditing
            content={initialContent}
            currentUser={currentUser}
            collaborators={mockCollaborators}
            readOnly={false}
            autoSaveInterval={30000}
            onChange={(content) => {
              console.log('Content changed:', content);
            }}
          />
        </div>

        {/* 只读模式示例 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">
            只读模式
          </h2>
          <CollaborativeEditing
            content="这是只读模式的示例。在这种模式下，用户无法编辑内容，只能查看。"
            currentUser={currentUser}
            collaborators={mockCollaborators}
            readOnly={true}
          />
        </div>

        {/* 功能特性 */}
        <div className="cyber-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">功能特性</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-cyber-purple mb-3">
                编辑功能
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">✓</span>
                  <span>实时多人协作</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">✓</span>
                  <span>光标位置同步</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">✓</span>
                  <span>自动保存</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-cyan">✓</span>
                  <span>文档导入/导出</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyber-pink mb-3">
                用户管理
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyber-purple">✓</span>
                  <span>在线用户显示</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-purple">✓</span>
                  <span>用户颜色标识</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-purple">✓</span>
                  <span>邀请协作者</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-purple">✓</span>
                  <span>权限控制</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">使用方法</h3>
            <pre className="bg-cyber-dark/50 p-4 rounded-lg overflow-x-auto text-sm text-gray-300">
{`import { CollaborativeEditing } from '@/components/collaborative';

<CollaborativeEditing
  content={documentContent}
  currentUser={currentUser}
  collaborators={users}
  readOnly={false}
  autoSaveInterval={30000}
  onChange={(content) => console.log(content)}
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
