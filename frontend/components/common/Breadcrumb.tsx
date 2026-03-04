'use client';

import { Link } from '@/i18n/routing';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  homeHref?: string;
  className?: string;
}

export function Breadcrumb({ items, homeHref = '/', className = '' }: BreadcrumbProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 text-sm ${className}`}
      aria-label="面包屑导航"
    >
      {/* 首页链接 */}
      <Link
        href={homeHref}
        className="flex items-center gap-1 text-gray-400 hover:text-cyber-cyan transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {/* 分隔符和链接 */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-600" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-400 hover:text-cyber-cyan transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-300">{item.label}</span>
          )}
        </div>
      ))}
    </motion.nav>
  );
}

// 带结构化数据的面包屑
interface StructuredBreadcrumbProps extends BreadcrumbProps {
  baseUrl: string;
}

export function StructuredBreadcrumb({ items, baseUrl, homeHref = '/', className = '' }: StructuredBreadcrumbProps) {
  // 生成结构化数据
  const breadcrumbItems = [
    { name: '首页', url: baseUrl },
    ...items.map((item) => ({
      name: item.label,
      url: item.href ? `${baseUrl}${item.href}` : undefined,
    })),
  ].filter((item) => item.url);

  return (
    <>
      <Breadcrumb items={items} homeHref={homeHref} className={className} />
      
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbItems.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              item: item.url,
            })),
          }),
        }}
      />
    </>
  );
}
