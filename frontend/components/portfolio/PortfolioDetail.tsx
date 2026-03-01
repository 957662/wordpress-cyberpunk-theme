/**
 * 作品集详情组件
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowIcon, StarIcon, TagIcon, CalendarIcon, GitHubIcon } from '@/components/icons';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export interface PortfolioDetailProps {
  item: {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    featured_image?: string;
    images?: string[];
    technologies: string[];
    github_url?: string;
    demo_url?: string;
    featured: boolean;
    date: string;
    client?: string;
    role?: string;
    duration?: string;
  };
}

export function PortfolioDetail({ item }: PortfolioDetailProps) {
  return (
    <article className="max-w-6xl mx-auto">
      {/* Back Button */}
      <Link href="/portfolio">
        <motion.div
          whileHover={{ x: -4 }}
          className="inline-flex items-center text-cyber-cyan mb-8 cursor-pointer"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回作品集
        </motion.div>
      </Link>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display font-bold text-4xl md:text-5xl">{item.title}</h1>
              {item.featured && (
                <Badge variant="warning" glow>
                  <StarIcon className="w-3 h-3 mr-1" />
                  精选项目
                </Badge>
              )}
            </div>
            <p className="text-xl text-gray-400">{item.description}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {item.github_url && (
              <Button
                variant="outline"
                leftIcon={<GitHubIcon className="w-5 h-5" />}
                onClick={() => window.open(item.github_url, '_blank')}
              >
                GitHub
              </Button>
            )}
            {item.demo_url && (
              <Button
                variant="primary"
                onClick={() => window.open(item.demo_url, '_blank')}
              >
                查看演示
              </Button>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-gray-400">
          {item.client && (
            <div className="flex items-center">
              <span className="font-medium">客户:</span>
              <span className="ml-2">{item.client}</span>
            </div>
          )}
          {item.role && (
            <div className="flex items-center">
              <span className="font-medium">角色:</span>
              <span className="ml-2">{item.role}</span>
            </div>
          )}
          {item.duration && (
            <div className="flex items-center">
              <span className="font-medium">周期:</span>
              <span className="ml-2">{item.duration}</span>
            </div>
          )}
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-cyber-cyan" />
            <span>{formatDate(item.date)}</span>
          </div>
        </div>
      </motion.div>

      {/* Featured Image */}
      {item.featured_image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative h-[400px] rounded-lg overflow-hidden mb-8"
        >
          <Image
            src={item.featured_image}
            alt={item.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
        </motion.div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Description */}
          <Card variant="glass" className="p-6">
            <h2 className="font-display font-bold text-2xl mb-4">项目介绍</h2>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </Card>

          {/* Gallery */}
          {item.images && item.images.length > 0 && (
            <Card variant="glass" className="p-6">
              <h2 className="font-display font-bold text-2xl mb-4">项目截图</h2>
              <div className="grid grid-cols-2 gap-4">
                {item.images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-video rounded overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`${item.title} - ${index + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 40vw"
                    />
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Technologies */}
          <Card variant="glass" className="p-6">
            <h3 className="font-display font-bold text-xl mb-4">技术栈</h3>
            <div className="flex flex-wrap gap-2">
              {item.technologies.map((tech) => (
                <Badge key={tech} variant="primary">
                  {tech}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Quick Links */}
          <Card variant="glass" className="p-6">
            <h3 className="font-display font-bold text-xl mb-4">快速链接</h3>
            <div className="space-y-3">
              {item.github_url && (
                <a
                  href={item.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-cyber-muted rounded hover:bg-cyber-border transition-colors group"
                >
                  <span className="flex items-center text-gray-300">
                    <GitHubIcon className="w-5 h-5 mr-2" />
                    源代码
                  </span>
                  <ArrowIcon className="w-4 h-4 text-cyber-cyan group-hover:translate-x-1 transition-transform" />
                </a>
              )}
              {item.demo_url && (
                <a
                  href={item.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-cyber-muted rounded hover:bg-cyber-border transition-colors group"
                >
                  <span className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    在线演示
                  </span>
                  <ArrowIcon className="w-4 h-4 text-cyber-cyan group-hover:translate-x-1 transition-transform" />
                </a>
              )}
            </div>
          </Card>

          {/* Project Info */}
          <Card variant="glass" className="p-6">
            <h3 className="font-display font-bold text-xl mb-4">项目信息</h3>
            <dl className="space-y-3 text-sm">
              {item.client && (
                <>
                  <dt className="text-gray-400">客户</dt>
                  <dd className="text-white font-medium">{item.client}</dd>
                </>
              )}
              {item.role && (
                <>
                  <dt className="text-gray-400">角色</dt>
                  <dd className="text-white font-medium">{item.role}</dd>
                </>
              )}
              {item.duration && (
                <>
                  <dt className="text-gray-400">开发周期</dt>
                  <dd className="text-white font-medium">{item.duration}</dd>
                </>
              )}
              <dt className="text-gray-400">完成时间</dt>
              <dd className="text-white font-medium">{formatDate(item.date)}</dd>
            </dl>
          </Card>
        </motion.div>
      </div>
    </article>
  );
}
