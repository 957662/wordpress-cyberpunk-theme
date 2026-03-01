/**
 * 管理后台布局
 */

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 w-full border-b border-cyber-cyan/30 bg-cyber-dark/80 backdrop-blur-lg">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-cyber-cyan">CyberPress Admin</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="px-4 py-2 rounded-lg border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 transition-all">
              查看网站
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple" />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 侧边栏 */}
        <aside className="w-64 border-r border-cyber-cyan/30 min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-1">
            {[
              { name: '仪表盘', href: '/admin', icon: '📊' },
              { name: '文章', href: '/admin/posts', icon: '📝' },
              { name: '页面', href: '/admin/pages', icon: '📄' },
              { name: '媒体', href: '/admin/media', icon: '🖼️' },
              { name: '评论', href: '/admin/comments', icon: '💬' },
              { name: '分类', href: '/admin/categories', icon: '🏷️' },
              { name: '标签', href: '/admin/tags', icon: '🔖' },
              { name: '用户', href: '/admin/users', icon: '👥' },
              { name: '设置', href: '/admin/settings', icon: '⚙️' },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-all"
              >
                <span>{item.icon}</span>
                {item.name}
              </a>
            ))}
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
