/**
 * Sitemap Page - 站点地图页面
 */

import React from 'react';
import { Map, File, Folder, Home } from 'lucide-react';

export default function SitemapPage() {
  const sections = [
    {
      title: 'Main Pages',
      icon: <Home className="w-5 h-5" />,
      items: [
        { name: 'Home', url: '/' },
        { name: 'About', url: '/about' },
        { name: 'Contact', url: '/contact' },
      ],
    },
    {
      title: 'Blog',
      icon: <File className="w-5 h-5" />,
      items: [
        { name: 'Blog Home', url: '/blog' },
        { name: 'Categories', url: '/blog/categories' },
        { name: 'Tags', url: '/blog/tags' },
      ],
    },
    {
      title: 'Portfolio',
      icon: <Folder className="w-5 h-5" />,
      items: [
        { name: 'All Projects', url: '/portfolio' },
        { name: 'Web Development', url: '/portfolio/web' },
        { name: 'Mobile Apps', url: '/portfolio/mobile' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Map className="w-12 h-12 text-cyber-cyan" />
            <h1 className="text-4xl font-bold text-white">Sitemap</h1>
          </div>
          <p className="text-gray-400">Navigate through all pages of the website</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <div
              key={index}
              className="p-6 border border-cyber-cyan/30 rounded-lg bg-[#0a0a0f] hover:border-cyber-cyan/60 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a
                      href={item.url}
                      className="text-gray-400 hover:text-cyber-cyan transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 border border-cyber-purple/30 rounded-lg bg-[#0a0a0f]">
          <h2 className="text-xl font-bold text-white mb-4">XML Sitemap</h2>
          <p className="text-gray-400 mb-4">
            For search engines, we also provide an XML sitemap:
          </p>
          <a
            href="/sitemap.xml"
            className="inline-block px-4 py-2 bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/50 rounded-lg hover:bg-cyber-purple/30 transition-colors"
          >
            View XML Sitemap
          </a>
        </div>
      </div>
    </div>
  );
}
