'use client';

import React from 'react';
import { ProjectCard, ProjectCardProps } from './ProjectCard';
import { cn } from '@/lib/utils/cn';

export interface ProjectGridProps {
  projects: ProjectCardProps[];
  layout?: 'grid' | 'masonry';
  columns?: 1 | 2 | 3 | 4;
  featured?: boolean;
  filter?: string;
  className?: string;
}

export function ProjectGrid({
  projects,
  layout = 'grid',
  columns = 3,
  featured = false,
  filter,
  className,
}: ProjectGridProps) {
  // Filter projects if filter is provided
  const filteredProjects = filter
    ? projects.filter((project) =>
        project.tags?.some((tag) => tag.toLowerCase().includes(filter.toLowerCase()))
      )
    : projects;

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">没有找到匹配的项目</p>
      </div>
    );
  }

  const gridClasses = {
    grid: 'grid',
    masonry: 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6',
  };

  const columnsStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const layoutClass =
    layout === 'masonry' ? gridClasses.masonry : cn('grid', columnsStyles[columns]);

  return (
    <div className={cn(layoutClass, className)}>
      {filteredProjects.map((project, index) => {
        const isFeatured = featured && index === 0;

        return (
          <div
            key={project.id}
            className={layout === 'masonry' ? 'break-inside-avoid mb-6' : ''}
          >
            <ProjectCard {...project} featured={isFeatured} />
          </div>
        );
      })}
    </div>
  );
}

export default ProjectGrid;
