import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  homeHref?: string;
  className?: string;
  showHome?: boolean;
}

/**
 * BreadcrumbNav - 面包屑导航组件
 * 用于显示页面层级路径
 */
export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items,
  separator = <ChevronRight className="w-4 h-4" />,
  homeHref = '/',
  className,
  showHome = true,
}) => {
  const allItems = showHome
    ? [{ label: 'Home', href: homeHref, icon: <Home className="w-4 h-4" /> }, ...items]
    : items;

  return (
    <nav className={cn('flex items-center space-x-1 text-sm', className)}>
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        const isFirst = index === 0;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-gray-600">{separator}</span>
            )}

            <div className="flex items-center space-x-1">
              {item.icon && (
                <span className={cn(
                  'flex-shrink-0',
                  isLast ? 'text-cyan-500' : 'text-gray-500'
                )}>
                  {item.icon}
                </span>
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-400 hover:text-cyan-500 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={cn(
                  'font-medium',
                  isLast ? 'text-cyan-500' : 'text-gray-500'
                )}>
                  {item.label}
                </span>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default BreadcrumbNav;
