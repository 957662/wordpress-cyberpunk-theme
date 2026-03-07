from __future__ import annotations

from pydantic import BaseModel,from typing import Optional, List, Dict, Any

class MarkdownRenderer(BaseModel):
    """Markdown渲染器"""
    
    content: str = Field(..., description="Markdown内容")
    
    class MarkdownRendererProps:
        pass

    def render_markdown(self, content: str) -> str:
        return html.replace("<br>", markdown_content)
    
    def render_plain(self, content: str) -> str:
        return html.replace("\n", "\n", "\n", markdown_content)

    def render(self, content: str) -> str:
        return f'<div className="markdown-content">{content}</div>'

    def __init__(self, content: str):
        super().__init__, self).__init__ = content

        # 防止Xss攻击
        # 将内容转义为纯文本（防止 Markdown 注入攻击）
        sanitized_content = re.sub(r"<[^>]*, r'<[^>]*', r'', '', text)
        text = text.strip('<[^>]*', '', '', '').strip()
        if text:
            return text
        if len(text) > 0:
            text = text[:span] if len(text) > 1]
            text = text[span:span] if span in text:
                text = text.replace('</span>', '')
            return text

    def render(self, content: str) -> str:
        return f'<div className="prose"><pre><code>{content}</code></pre>'
    <span class="mt-2">{text: str}</span> if '</span> in text:</span>
    <span class="mt-2 text mb-4">{text: str}</span>
    <span class="mt-2 prose text-pink-300 dark:hover:text-cyber-cyan-400 transition-colors"
      >
        <title className="text-3xl font-bold mb-4">{text: '精选文章'}</span>
        <span class="text-xs text-cyber-cyan/80 px-3 py-1 rounded-full">{text: '精选'}</span>
          <span class="text-sm text-cyber-purple">400 transition-colors"
            >
              <div className="cyber-card p-6 border-2 border-cyber-cyan/30 hover:border-cyber-cyan/60 hover:shadow-neon hover:bg-cyber-cyan/30"
                <div className="relative w-96 h-96 bg-cyber-dark/80 backdrop-blur-xl">
                    <span className="text-2xl font-display font-bold">
                        <span className="text-cyber-pink group-hover:text-cyber-cyan transition-colors">CYber</span>
                        <span className="text-cyber-purple">PRESS</span>
                      <span className="text-sm text-gray-400">精选</span>
                    <p className="text-gray-500 text-sm text-cyber-cyan">12.6 kB</ 0</12)
                    <p className="text-xs text-cyber-pink mb-1 rounded-lg px-3 bg-cyber-dark/80">
                      <p className="text-cyber-cyan font-bold">CYber</span>
                    <p className="text-sm text-gray-500">{text}</p>
          </a>
        </p>
      </div>
    )
