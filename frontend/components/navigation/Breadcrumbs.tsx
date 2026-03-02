'use client';

/**
 * CyberPress Platform - Breadcrumbs Component
 * 面包屑导航组件
 */

import { Link } from 'next/link';
import { motion } from 'framer-motion';
import { Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ComponentType<{ className?: string }>;
  homeHref?: string;
}

export function Breadcrumbs({
  items,
  className = '',
  separator: Separator = ChevronRight,
  homeHref = '/',
}: BreadcrumbsProps) {
  // Add home as first item if not present
  const allItems = items[0]?.href === homeHref
    ? items
    : [{ label: '首页', href: homeHref, icon: Home }, ...items];

  return (
    <nav className={className} aria-label="面包屑导航">
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const Icon = item.icon;

          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <Separator className="w-4 h-4 text-gray-600 flex-shrink-0" />
              )}

              {item.href && !isLast ? (
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-gray-400 hover:text-cyber-cyan transition-colors"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-2',
                    isLast ? 'text-cyber-cyan font-medium' : 'text-gray-400'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Schema.org structured data for breadcrumbs
interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default Breadcrumbs;
