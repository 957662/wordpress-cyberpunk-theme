'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: 'chevron' | 'slash' | 'dot';
  homeHref?: string;
  showHome?: boolean;
  className?: string;
}

const separators = {
  chevron: <ChevronRight className="w-4 h-4" />,
  slash: <span className="text-gray-600">/</span>,
  dot: <span className="text-gray-600">.</span>,
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = 'chevron',
  homeHref = '/',
  showHome = true,
  className,
}) => {
  const allItems = showHome
    ? [{ label: 'Home', href: homeHref, icon: <Home className="w-4 h-4" /> }, ...items]
    : items;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-center gap-2 text-sm', className)}
      aria-label="Breadcrumb"
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {/* Item */}
            <div className="flex items-center gap-1.5">
              {item.icon && (
                <span className="text-gray-500">{item.icon}</span>
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    'hover:text-cyan-400 transition-colors duration-200',
                    isLast ? 'text-white font-medium' : 'text-gray-400'
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    isLast ? 'text-white font-medium' : 'text-gray-400'
                  )}
                >
                  {item.label}
                </span>
              )}
            </div>

            {/* Separator */}
            {!isLast && (
              <span className="text-gray-600">{separators[separator]}</span>
            )}
          </div>
        );
      })}
    </motion.nav>
  );
};

// Hook for generating breadcrumbs from pathname
export const useBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      label,
      href,
    };
  });

  return breadcrumbs;
};

export default Breadcrumb;
