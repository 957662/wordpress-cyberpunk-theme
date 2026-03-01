'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Star, GitFork } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ProjectCardProps {
  id: string | number;
  slug: string;
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  links?: {
    demo?: string;
    github?: string;
  };
  stars?: number;
  forks?: number;
  featured?: boolean;
  status?: 'completed' | 'in-progress' | 'planned';
  className?: string;
}

const statusLabels = {
  completed: '已完成',
  'in-progress': '进行中',
  planned: '计划中',
};

const statusColors = {
  completed: 'bg-cyber-green/20 text-cyber-green border-cyber-green/30',
  'in-progress': 'bg-cyber-yellow/20 text-cyber-yellow border-cyber-yellow/30',
  planned: 'bg-cyber-purple/20 text-cyber-purple border-cyber-purple/30',
};

export function ProjectCard({
  slug,
  title,
  description,
  image,
  tags = [],
  links,
  stars,
  forks,
  featured = false,
  status = 'completed',
  className,
}: ProjectCardProps) {
  const cardClasses = cn(
    'group relative cyber-card',
    featured && 'featured col-span-full lg:col-span-2'
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cardClasses}
    >
      {/* Project Image */}
      {image && (
        <Link href={`/portfolio/${slug}`} className="block overflow-hidden rounded-lg mb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="aspect-video w-full bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20"
          >
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </Link>
      )}

      {/* Status Badge */}
      <div className="mb-3">
        <span className={cn(
          'inline-block px-2 py-1 text-xs font-mono rounded border',
          statusColors[status]
        )}>
          {statusLabels[status]}
        </span>
      </div>

      {/* Title */}
      <Link href={`/portfolio/${slug}`}>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">
          {title}
        </h3>
      </Link>

      {/* Description */}
      <p className="text-gray-400 mb-4 line-clamp-3">{description}</p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-cyber-muted border border-cyber-border rounded text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      {(stars !== undefined || forks !== undefined) && (
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          {stars !== undefined && (
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              {stars}
            </span>
          )}
          {forks !== undefined && (
            <span className="flex items-center gap-1">
              <GitFork className="w-4 h-4" />
              {forks}
            </span>
          )}
        </div>
      )}

      {/* Links */}
      {links && (links.demo || links.github) && (
        <div className="flex items-center gap-2">
          {links.demo && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyber-cyan text-cyber-dark rounded-lg font-medium text-sm hover:bg-cyber-cyan/90 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Demo</span>
            </motion.a>
          )}
          {links.github && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyber-muted text-gray-300 rounded-lg font-medium text-sm hover:bg-cyber-muted/80 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </motion.a>
          )}
        </div>
      )}
    </motion.article>
  );
}

export default ProjectCard;
