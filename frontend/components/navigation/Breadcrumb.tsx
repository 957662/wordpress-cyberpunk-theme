'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  separator = <ChevronRight className="h-4 w-4" />,
}) => {
  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)} aria-label="面包屑导航">
      {/* 首页链接 */}
      <Link
        href="/"
        className="flex items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {/* 分隔符 */}
      <span className="text-gray-600">{separator}</span>

      {/* 面包屑项 */}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-300 font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className="text-gray-600">{separator}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
