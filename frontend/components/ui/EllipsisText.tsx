'use client';

import React from 'react';

interface EllipsisTextProps {
  text: string;
  maxLines?: number;
  className?: string;
}

export function EllipsisText({
  text,
  maxLines = 2,
  className = '',
}: EllipsisTextProps) {
  return (
    <p
      className={className}
      style={{
        display: '-webkit-box',
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {text}
    </p>
  );
}
