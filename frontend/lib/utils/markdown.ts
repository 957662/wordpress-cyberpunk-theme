import React from 'react';

export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';
  let html = markdown;

  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
  });

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto" />');
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^---$/gm, '<hr />');
  html = html.replace(/\n\n/g, '</p><p>');
  html = `<p>${html}</p>`;
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');

  return html;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function extractExcerptFromMarkdown(markdown: string, maxLength = 200): string {
  if (!markdown) return '';
  let text = markdown;
  text = text.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/`[^`]+`/g, '');
  text = text.replace(/^#+\s+/gm, '');
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  text = text.replace(/\*\*\*/g, '');
  text = text.replace(/\*\*/g, '');
  text = text.replace(/\*/g, '');
  text = text.replace(/^> /gm, '');
  text = text.replace(/^[\*\-+] /gm, '');
  text = text.replace(/^\d+\. /gm, '');
  text = text.replace(/[#*_~`]/g, '');
  text = text.replace(/\s+/g, ' ').trim();

  if (text.length > maxLength) {
    text = text.substring(0, maxLength);
    const lastSpace = text.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      text = text.substring(0, lastSpace);
    }
    text += '...';
  }

  return text;
}

export function calculateReadingTime(markdown: string, wordsPerMinute = 200): number {
  if (!markdown) return 0;
  let text = markdown.replace(/```[\s\S]*?```/g, '');
  text = text.replace(/`[^`]+`/g, '');
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  const totalWords = chineseChars + englishWords;
  const readingTime = Math.ceil(totalWords / wordsPerMinute);

  return Math.max(1, readingTime);
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children?: TableOfContentsItem[];
}

export function extractTableOfContents(markdown: string): TableOfContentsItem[] {
  if (!markdown) return [];
  const headings = markdown.match(/^#{1,3}\s+.+$/gm) || [];
  const toc: TableOfContentsItem[] = [];

  headings.forEach((heading) => {
    const level = heading.match(/^#+/)?.[0].length || 1;
    const title = heading.replace(/^#+\s+/, '').trim();
    const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    const item: TableOfContentsItem = { id, title, level };

    if (level === 1) {
      toc.push(item);
    } else if (level === 2 && toc.length > 0) {
      if (!toc[toc.length - 1].children) {
        toc[toc.length - 1].children = [];
      }
      toc[toc.length - 1].children!.push(item);
    } else if (level === 3 && toc.length > 0) {
      const parent = toc[toc.length - 1];
      if (parent.children && parent.children.length > 0) {
        if (!parent.children[parent.children.length - 1].children) {
          parent.children[parent.children.length - 1].children = [];
        }
        parent.children[parent.children.length - 1].children!.push(item);
      }
    }
  });

  return toc;
}
