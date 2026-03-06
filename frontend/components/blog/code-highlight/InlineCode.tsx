'use client';

import React from 'react';

interface InlineCodeProps {
  children: React.ReactNode;
  className?: string;
}

const InlineCode: React.FC<InlineCodeProps> = ({ children, className = '' }) => {
  return (
    <code
      className={`px-2 py-1 text-sm font-mono bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded ${className}`}
    >
      {children}
    </code>
  );
};

export default InlineCode;
