# 🚀 CyberPress - 新功能快速开始

## 📦 快速导航

本指南将帮助你快速使用 CyberPress 平台的新功能。

---

## 1. 关注系统 (Follow System)

### 基础使用

#### 关注按钮

\`\`\`tsx
import { FollowButton } from '@/components/follow';

function UserProfile() {
  return (
    <FollowButton
      userId={123}
      variant="primary"      // primary | secondary | ghost
      size="md"             // sm | md | lg
      showIcon={true}
      onFollowChange={(isFollowing) => {
        console.log('关注状态:', isFollowing);
      }}
    />
  );
}
\`\`\`

#### 关注统计

\`\`\`tsx
import { FollowStats } from '@/components/follow';

function UserCard() {
  return (
    <FollowStats
      userId={123}
      showLabels={true}
      variant="default"      // default | compact | minimal
      orientation="horizontal" // horizontal | vertical
      onStatsClick={(type) => {
        if (type === 'followers') {
          router.push(\`/users/123/followers\`);
        } else {
          router.push(\`/users/123/following\`);
        }
      }}
    />
  );
}
\`\`\`

---

## 2. 通知系统 (Notification System)

### 通知中心

\`\`\`tsx
import { NotificationCenter } from '@/components/notifications';

function Header() {
  return (
    <NotificationCenter
      onMarkAllRead={() => {
        console.log('全部标记为已读');
      }}
      onClearAll={() => {
        console.log('清空所有通知');
      }}
    />
  );
}
\`\`\`

---

## 3. Markdown 编辑器

### 基础使用

\`\`\`tsx
import { MarkdownEditor } from '@/components/editor';

function ArticleEditor() {
  const [content, setContent] = useState('');

  return (
    <MarkdownEditor
      value={content}
      onChange={setContent}
      onSave={async (value) => {
        await saveArticle(value);
      }}
      placeholder="开始写作..."
      height="600px"
      showPreview={true}
    />
  );
}
\`\`\`

---

## 4. 图片上传

### 基础使用

\`\`\`tsx
import { ImageUploader } from '@/components/editor';

function ImageUpload() {
  return (
    <ImageUploader
      onUpload={(urls) => console.log(urls)}
      maxFiles={10}
      maxFileSize={5}
    />
  );
}
\`\`\`

---

## 📝 页面路由

- \`/[username]/followers\` - 粉丝列表
- \`/[username]/following\` - 关注列表
- \`/notifications\` - 通知中心
- \`/settings/notifications\` - 通知设置
- \`/editor/demo\` - 编辑器演示

---

**最后更新**: 2026-03-03
**版本**: v1.0.0
