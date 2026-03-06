import { ReactNode } from 'react'

export default function ShowcaseLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <header className="border-b border-cyber-border/50 bg-cyber-dark/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-white">
              <span className="text-cyber-cyan">CYBER</span>
              <span className="text-cyber-purple">PRESS</span>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-gray-400">Showcase</span>
            </h1>

            <nav className="flex items-center gap-6">
              <a href="/" className="text-sm text-gray-400 hover:text-cyber-cyan transition-colors">
                返回首页
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-cyber-border/50 py-8 mt-20">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          <p>© 2024 CyberPress. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
