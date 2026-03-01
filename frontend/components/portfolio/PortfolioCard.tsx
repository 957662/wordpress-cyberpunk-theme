/**
 * 作品集卡片组件
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowIcon, StarIcon, TagIcon } from '@/components/icons';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  technologies: string[];
  github_url?: string;
  demo_url?: string;
  featured: boolean;
  date: string;
}

export interface PortfolioCardProps {
  item: PortfolioItem;
  variant?: 'default' | 'compact';
  index?: number;
}

export function PortfolioCard({ item, variant = 'default', index = 0 }: PortfolioCardProps) {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link href={`/portfolio/${item.slug}`}>
          <Card hover className="p-4 h-full">
            <div className="flex items-center gap-4">
              {item.featured_image && (
                <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                  <Image
                    src={item.featured_image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-bold text-white truncate">
                    {item.title}
                  </h3>
                  {item.featured && <StarIcon className="w-4 h-4 text-cyber-yellow flex-shrink-0" />}
                </div>
                <p className="text-sm text-gray-400 line-clamp-1">{item.excerpt}</p>
              </div>
              <ArrowIcon className="w-5 h-5 text-cyber-cyan flex-shrink-0" />
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/portfolio/${item.slug}`}>
        <Card hover variant="hologram" className="h-full overflow-hidden group">
          {/* Image */}
          {item.featured_image && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={item.featured_image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark to-transparent opacity-60" />

              {/* Featured Badge */}
              {item.featured && (
                <div className="absolute top-4 left-4">
                  <Badge variant="warning" size="sm" glow>
                    <StarIcon className="w-3 h-3 mr-1" />
                    精选
                  </Badge>
                </div>
              )}

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-cyber-dark/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                {item.github_url && (
                  <a
                    href={item.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-cyber-muted rounded-full hover:bg-cyber-cyan hover:text-cyber-dark transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                {item.demo_url && (
                  <a
                    href={item.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-cyber-muted rounded-full hover:bg-cyber-purple hover:text-white transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Title */}
            <h3 className="font-display font-bold text-xl mb-3 group-hover:text-cyber-cyan transition-colors">
              {item.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
              {item.excerpt}
            </p>

            {/* Technologies */}
            <div className="flex items-start gap-2 mb-4">
              <TagIcon className="w-4 h-4 text-cyber-purple flex-shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-2">
                {item.technologies.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="primary" size="sm">
                    {tech}
                  </Badge>
                ))}
                {item.technologies.length > 3 && (
                  <Badge variant="secondary" size="sm">
                    +{item.technologies.length - 3}
                  </Badge>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-3 text-sm">
              {item.github_url && (
                <span className="flex items-center text-gray-400">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </span>
              )}
              {item.demo_url && (
                <span className="flex items-center text-gray-400">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </span>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
