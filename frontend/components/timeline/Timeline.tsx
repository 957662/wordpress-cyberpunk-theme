'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink, Github, Globe } from 'lucide-react';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: Date;
  endDate?: Date;
  location?: string;
  icon?: React.ReactNode;
  tags?: string[];
  links?: Array<{ label: string; url: string; icon?: 'github' | 'globe' | 'external' }>;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
}

export interface TimelineProps {
  items: TimelineItem[];
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
  showYear?: boolean;
  animate?: boolean;
  sortOrder?: 'asc' | 'desc';
  onItemClick?: (item: TimelineItem) => void;
}

const colorSchemes = {
  cyan: {
    primary: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/20',
    line: 'bg-cyan-500/30',
  },
  purple: {
    primary: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/20',
    line: 'bg-purple-500/30',
  },
  pink: {
    primary: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/20',
    line: 'bg-pink-500/30',
  },
  green: {
    primary: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/20',
    line: 'bg-green-500/30',
  },
  orange: {
    primary: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/20',
    line: 'bg-orange-500/30',
  },
  blue: {
    primary: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20',
    line: 'bg-blue-500/30',
  },
};

const linkIcons = {
  github: Github,
  globe: Globe,
  external: ExternalLink,
};

export function Timeline({
  items,
  colorScheme = 'cyan',
  showYear = true,
  animate = true,
  sortOrder = 'desc',
  onItemClick,
}: TimelineProps) {
  const colors = colorSchemes[colorScheme];

  // Sort items by date
  const sortedItems = [...items].sort((a, b) => {
    const diff = a.date.getTime() - b.date.getTime();
    return sortOrder === 'asc' ? diff : -diff;
  });

  // Group items by year
  const groupedItems = sortedItems.reduce<Record<number, TimelineItem[]>>((acc, item) => {
    const year = item.date.getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(item);
    return acc;
  }, {});

  const years = Object.keys(groupedItems)
    .map(Number)
    .sort((a, b) => (sortOrder === 'asc' ? a - b : b - a));

  const formatDate = (date: Date, endDate?: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
    };
    const formatted = date.toLocaleDateString('en-US', options);
    if (endDate) {
      const endFormatted = endDate.toLocaleDateString('en-US', options);
      return `${formatted} - ${endFormatted}`;
    }
    return formatted;
  };

  const TimelineCard = ({ item, index }: { item: TimelineItem; index: number }) => {
    const itemColors = item.color ? colorSchemes[item.color] : colors;

    return (
      <motion.div
        initial={animate ? { opacity: 0, x: -20 } : false}
        whileInView={animate ? { opacity: 1, x: 0 } : false}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative pl-8 pb-8 last:pb-0"
      >
        {/* Timeline dot */}
        <div className="absolute left-0 top-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.2 }}
            className={`
              w-4 h-4 rounded-full border-2 ${itemColors.border}
              ${itemColors.bg} ${itemColors.glow}
              cursor-pointer transition-shadow hover:shadow-lg
            `}
          />
        </div>

        {/* Timeline line */}
        <div className={`absolute left-[7px] top-4 w-0.5 h-full ${itemColors.line}`} />

        {/* Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          onClick={() => onItemClick?.(item)}
          className={`
            relative p-5 rounded-lg border-2 backdrop-blur-sm
            ${itemColors.bg} ${itemColors.border} ${itemColors.glow}
            transition-all duration-300 cursor-pointer
            hover:shadow-xl
          `}
        >
          {/* Date */}
          <div className="flex items-center gap-2 mb-3">
            <Calendar className={`w-4 h-4 ${itemColors.primary}`} />
            <span className={`text-sm font-semibold ${itemColors.primary}`}>
              {formatDate(item.date, item.endDate)}
            </span>
          </div>

          {/* Title */}
          <h3 className={`text-xl font-bold text-gray-100 mb-2 ${!item.description ? 'mb-0' : ''}`}>
            {item.title}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-gray-400 mb-3 leading-relaxed">{item.description}</p>
          )}

          {/* Location */}
          {item.location && (
            <div className="flex items-center gap-2 mb-3">
              <MapPin className={`w-4 h-4 ${itemColors.primary}`} />
              <span className="text-sm text-gray-400">{item.location}</span>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {item.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className={`
                    px-2 py-1 rounded-md text-xs font-semibold
                    ${itemColors.bg} ${itemColors.primary} ${itemColors.border}
                    border
                  `}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Links */}
          {item.links && item.links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {item.links.map((link, linkIndex) => {
                const LinkIcon = linkIcons[link.icon || 'external'];
                return (
                  <motion.a
                    key={linkIndex}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`
                      inline-flex items-center gap-1 px-3 py-1.5 rounded-lg
                      text-sm font-semibold ${itemColors.primary}
                      ${itemColors.bg} ${itemColors.border} border
                      hover:shadow-md transition-all
                    `}
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </motion.a>
                );
              })}
            </div>
          )}

          {/* Custom Icon */}
          {item.icon && (
            <div className={`absolute top-4 right-4 ${itemColors.primary}`}>
              {item.icon}
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="relative">
      {/* Main vertical line */}
      <div className={`absolute left-[7px] top-0 w-0.5 h-full ${colors.line}`} />

      {/* Timeline items */}
      <div className="relative">
        {years.map((year, yearIndex) => (
          <div key={year} className="mb-12 last:mb-0">
            {/* Year header */}
            {showYear && (
              <motion.div
                initial={animate ? { opacity: 0, y: -20 } : false}
                whileInView={animate ? { opacity: 1, y: 0 } : false}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: yearIndex * 0.1 }}
                className={`
                  sticky top-4 z-10 mb-6 px-4 py-2 rounded-lg
                  inline-block ${colors.bg} ${colors.border} border-2
                  backdrop-blur-md ${colors.glow}
                `}
              >
                <span className={`text-2xl font-bold ${colors.primary} text-glow`}>
                  {year}
                </span>
              </motion.div>
            )}

            {/* Year items */}
            <div className="space-y-6">
              {groupedItems[year].map((item, itemIndex) => (
                <TimelineCard key={item.id} item={item} index={itemIndex} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Preset timeline generators
export const createWorkExperience = (): TimelineItem[] => [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    description: 'Leading development of cloud-native applications using React, Node.js, and AWS.',
    date: new Date('2022-01-01'),
    location: 'San Francisco, CA',
    tags: ['React', 'Node.js', 'AWS', 'TypeScript'],
    color: 'cyan',
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    description: 'Developed and maintained multiple web applications serving millions of users.',
    date: new Date('2019-06-01'),
    endDate: new Date('2021-12-31'),
    location: 'New York, NY',
    tags: ['JavaScript', 'Python', 'PostgreSQL'],
    color: 'purple',
  },
];

export const createEducation = (): TimelineItem[] => [
  {
    id: '1',
    title: 'Master of Science in Computer Science',
    description: 'Specialized in Machine Learning and Distributed Systems.',
    date: new Date('2017-09-01'),
    endDate: new Date('2019-05-31'),
    location: 'Stanford University',
    color: 'green',
  },
  {
    id: '2',
    title: 'Bachelor of Science in Computer Science',
    description: 'Graduated with honors. Focus on Software Engineering.',
    date: new Date('2013-09-01'),
    endDate: new Date('2017-05-31'),
    location: 'MIT',
    color: 'blue',
  },
];

export const createProjects = (): TimelineItem[] => [
  {
    id: '1',
    title: 'CyberPress Platform',
    description: 'A modern blog platform with cyberpunk aesthetics built with Next.js and WordPress.',
    date: new Date('2024-01-01'),
    tags: ['Next.js', 'WordPress', 'Tailwind CSS'],
    links: [
      { label: 'GitHub', url: 'https://github.com/cyberpress', icon: 'github' },
      { label: 'Live Demo', url: 'https://cyberpress.dev', icon: 'globe' },
    ],
    color: 'cyan',
  },
];
