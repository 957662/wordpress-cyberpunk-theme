'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  acf?: {
    project_url?: string;
    github_url?: string;
    technologies?: string[];
    featured?: boolean;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

interface PortfolioGridProps {
  projects: Project[];
  className?: string;
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  projects,
  className,
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}
    >
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Link href={`/portfolio/${project.slug}`}>
            <div
              className={cn(
                'group relative overflow-hidden rounded-lg',
                'border border-cyber-purple/30 bg-deep-black/80 backdrop-blur-sm',
                'hover:border-cyber-purple transition-all duration-300',
                project.acf?.featured && 'border-cyber-pink/50'
              )}
            >
              {/* 特色图片 */}
              {project._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                <div className="relative aspect-video overflow-hidden">
                  <motion.img
                    src={
                      project._embedded['wp:featuredmedia'][0].source_url
                    }
                    alt={project.title.rendered}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-80" />
                  
                  {/* Featured 标签 */}
                  {project.acf?.featured && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-cyber-pink text-white text-xs font-bold rounded-full">
                      精选
                    </div>
                  )}
                </div>
              )}

              {/* 内容 */}
              <div className="p-6">
                {/* 标题 */}
                <h3
                  className="text-xl font-bold mb-2 text-white group-hover:text-cyber-purple transition-colors"
                  dangerouslySetInnerHTML={{ __html: project.title.rendered }}
                />

                {/* 摘要 */}
                <p
                  className="text-gray-400 text-sm mb-4 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: project.excerpt.rendered }}
                />

                {/* 技术栈 */}
                {project.acf?.technologies && project.acf.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.acf.technologies.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs font-mono px-2 py-1 rounded bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* 链接 */}
                <div className="flex items-center gap-3">
                  {project.acf?.project_url && (
                    <a
                      href={project.acf.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>预览</span>
                    </a>
                  )}
                  {project.acf?.github_url && (
                    <a
                      href={project.acf.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Github className="w-4 h-4" />
                      <span>代码</span>
                    </a>
                  )}
                </div>
              </div>

              {/* 装饰线 */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyber-purple to-cyber-pink group-hover:w-full transition-all duration-500" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default PortfolioGrid;
