'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink, Github, FileText, Award } from 'lucide-react';

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  icon?: React.ReactNode;
  tags?: string[];
  links?: { title: string; url: string; icon?: React.ReactNode }[];
  status?: 'completed' | 'ongoing' | 'planned';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'red';
}

interface TimelineProps {
  items: TimelineItem[];
  variant?: 'vertical' | 'horizontal';
  align?: 'left' | 'center' | 'right';
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

export function Timeline({
  items,
  variant = 'vertical',
  align = 'left',
  showIcon = true,
  animated = true,
  className = ''
}: TimelineProps) {
  const getColorClasses = (color?: string, status?: string) => {
    if (status === 'completed') return 'from-green-500 to-green-600';
    if (status === 'ongoing') return 'from-cyan-500 to-cyan-600';
    if (status === 'planned') return 'from-gray-500 to-gray-600';
    if (color === 'cyan') return 'from-cyan-500 to-cyan-600';
    if (color === 'purple') return 'from-purple-500 to-purple-600';
    if (color === 'pink') return 'from-pink-500 to-pink-600';
    if (color === 'green') return 'from-green-500 to-green-600';
    if (color === 'yellow') return 'from-yellow-500 to-yellow-600';
    if (color === 'red') return 'from-red-500 to-red-600';
    return 'from-cyan-500 to-purple-600';
  };

  const getBorderClasses = (color?: string, status?: string) => {
    if (status === 'completed') return 'border-green-500';
    if (status === 'ongoing') return 'border-cyan-500';
    if (status === 'planned') return 'border-gray-600';
    if (color) return \`border-\${color}-500\`;
    return 'border-cyan-500';
  };

  const renderIcon = (item: TimelineItem) => {
    if (item.icon) return item.icon;
    
    switch (item.status) {
      case 'completed':
        return <Award className="w-4 h-4" />;
      case 'ongoing':
        return <Clock className="w-4 h-4 animate-spin" />;
      case 'planned':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  if (variant === 'horizontal') {
    return (
      <div className={\`relative w-full overflow-x-auto \${className}\`}>
        <div className="flex items-center min-w-max px-4 py-8">
          {/* 时间轴线 */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transform -translate-y-1/2" />

          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={animated ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="relative flex-shrink-0 w-72 mx-4"
            >
              {/* 时间点 */}
              <div className={\`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-gradient-to-r \${getColorClasses(item.color, item.status)} border-4 border-gray-900\`} />

              {/* 内容卡片 */}
              <div className={\`bg-gray-900/80 backdrop-blur-sm border \${getBorderClasses(item.color, item.status)} rounded-lg p-4 \${index % 2 === 0 ? 'mt-8' : 'mb-8'}\`}>
                <div className="flex items-start gap-3">
                  {showIcon && (
                    <div className={\`p-2 bg-gradient-to-br \${getColorClasses(item.color, item.status)} rounded-lg flex-shrink-0\`}>
                      <div className="text-white">
                        {renderIcon(item)}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                      {item.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </span>
                      )}
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.location}
                        </span>
                      )}
                    </div>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-800 text-gray-300 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // 垂直时间轴
  return (
    <div className={\`relative \${className}\`}>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: align === 'right' ? 20 : align === 'left' ? -20 : 0 }}
          animate={animated ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: index * 0.1 }}
          className={\`relative pb-8 last:pb-0 \${align === 'center' ? 'flex items-center' : ''}\`}
        >
          {/* 时间点 */}
          <div className={\`absolute \${align === 'right' ? 'right-0' : align === 'left' ? 'left-0' : 'left-1/2 -translate-x-1/2'} top-0 z-10 p-1 bg-gray-900 rounded-full\`}>
            <div className={\`w-4 h-4 rounded-full bg-gradient-to-r \${getColorClasses(item.color, item.status)} border-2 border-white\`} />
          </div>

          {/* 内容卡片 */}
          <div className={\`\${align === 'right' ? 'pr-8' : align === 'left' ? 'pl-8' : align === 'center' ? (index % 2 === 0 ? 'pr-8 mr-auto' : 'pl-8 ml-auto') : ''}\`}>
            <div className={\`bg-gray-900/80 backdrop-blur-sm border \${getBorderClasses(item.color, item.status)} rounded-lg p-5 hover:border-opacity-50 transition-all\`}>
              <div className="flex items-start gap-3">
                {showIcon && (
                  <div className={\`p-2 bg-gradient-to-br \${getColorClasses(item.color, item.status)} rounded-lg flex-shrink-0\`}>
                    <div className="text-white">
                      {renderIcon(item)}
                    </div>
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                    <span className="text-xs text-cyan-400 flex-shrink-0 ml-2">{item.date}</span>
                  </div>
                  
                  <p className="text-gray-400 mb-3">{item.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                    {item.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.time}
                      </span>
                    )}
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {item.location}
                      </span>
                    )}
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.links && item.links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-cyan-400 text-xs rounded transition-colors"
                        >
                          {link.icon || <ExternalLink className="w-3 h-3" />}
                          <span>{link.title}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// 默认导出
export default Timeline;
