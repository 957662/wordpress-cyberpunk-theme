'use client';

import React from 'react';
import TagBadge from './TagBadge';

interface Tag {
  id: number;
  name: string;
  slug: string;
  count?: number;
  weight?: number;
}

interface TagCloudProps {
  tags: Tag[];
  maxWeight?: number;
  variant?: 'default' | 'outline' | 'filled';
}

export const TagCloud: React.FC<TagCloudProps> = ({
  tags,
  maxWeight = 10,
  variant = 'default',
}) => {
  const getSize = (weight?: number) => {
    if (!weight) return 'md';
    if (weight <= 3) return 'sm';
    if (weight <= 7) return 'md';
    return 'lg';
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagBadge
          key={tag.id}
          tag={tag}
          size={getSize(tag.weight)}
          variant={variant}
        />
      ))}
    </div>
  );
};

export default TagCloud;
