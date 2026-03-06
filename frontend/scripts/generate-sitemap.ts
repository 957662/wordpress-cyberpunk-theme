#!/usr/bin/env tsx

/**
 * Generate Sitemap Script
 * 生成网站地图脚本
 *
 * 用法:
 * npm run generate-sitemap
 */

import fs from 'fs';
import path from 'path';

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cyberpress.dev';

// 静态页面
const staticPages: SitemapEntry[] = [
  {
    url: baseUrl,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: `${baseUrl}/blog`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${baseUrl}/portfolio`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${baseUrl}/about`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${baseUrl}/contact`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${baseUrl}/search`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.5,
  },
  {
    url: `${baseUrl}/newsletter`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
];

// 生成 XML 格式的 sitemap
function generateSitemapXML(entries: SitemapEntry[]): string {
  const xmlEntries = entries
    .map(
      (entry) => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}

// 保存 sitemap 文件
function saveSitemap(xml: string) {
  const publicDir = path.join(process.cwd(), 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');

  // 确保 public 目录存在
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(sitemapPath, xml, 'utf-8');
  console.log(`✅ Sitemap generated successfully: ${sitemapPath}`);
}

// 主函数
async function main() {
  try {
    console.log('🚀 Generating sitemap...');

    // 这里可以添加从 API 获取动态页面的逻辑
    const allEntries = [...staticPages];

    const xml = generateSitemapXML(allEntries);
    saveSitemap(xml);

    console.log(`✅ Generated ${allEntries.length} URLs`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// 运行脚本
main();
