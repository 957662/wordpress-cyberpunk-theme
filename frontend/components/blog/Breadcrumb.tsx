'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, Home, ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
  /**
   * 显示文本
   */
  label: string;
  /**
   * 链接地址
   */
  href: string;
  /**
   * 是否为当前页
   */
  current?: boolean;
}

interface BreadcrumbProps {
  /**
   * 面包屑数据
   */
  items: BreadcrumbItem[];
  /**
   * 分隔符类型：arrow | slash | dot | none
   */
  separator?: 'arrow' | 'slash' | 'dot' | 'none';
  /**
   * 显示位置：top | bottom
   */
  position?: 'top' | 'bottom';
  /**
   * 是否显示返回按钮
   */
  showBack?: boolean;
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * Breadcrumb - 面包屑导航组件
 *
 * 功能特性：
 * - 显示当前页面位置
 * - 支持自定义分隔符
 * - 可选返回按钮
 * - 赛博朋克风格
 * - 响应式设计
 */
export function Breadcrumb({
  items,
  separator = 'arrow',
  position = 'top',
  showBack = false,
  className = '',
}: BreadcrumbProps) {
  const Separator = () => {
    switch (separator) {
      case 'slash':
        return <span className="text-cyber-muted">/</span>;
      case 'dot':
        return <span className="text-cyber-muted">•</span>;
      case 'none':
        return null;
      case 'arrow':
      default:
        return <ChevronRight className="w-4 h-4 text-cyber-muted" />;
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: position === 'top' ? -10 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${className} ${position === 'top' ? 'mb-6' : 'mt-6'}`}
      aria-label="面包屑导航"
    >
      <div className="flex items-center justify-between">
        {/* 返回按钮 */}
        {showBack && (
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-2 text-sm text-cyber-gray hover:text-cyber-cyan transition-colors"
            aria-label="返回上一页"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>返回</span>
          </motion.button>
        )}

        {/* 面包屑列表 */}
        <ol className="flex items-center gap-2 flex-wrap">
          {/* 首页 */}
          <li className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-cyber-gray hover:text-cyber-cyan transition-colors group"
              aria-label="返回首页"
            >
              <Home className="w-4 h-4 group-hover:animate-pulse" />
              <span className="hidden sm:inline">首页</span>
            </Link>
          </li>

          {/* 分隔符 */}
          {items.length > 0 && <Separator />}

          {/* 面包屑项 */}
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {item.current ? (
                <span className="text-sm text-cyber-cyan font-medium">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm text-cyber-gray hover:text-cyber-cyan transition-colors"
                >
                  {item.label}
                </Link>
              )}

              {/* 不是最后一项则显示分隔符 */}
              {index < items.length - 1 && <Separator />}
            </li>
          ))}
        </ol>

        {/* 占位元素，用于居中面包屑 */}
        {showBack && <div className="w-16" />}
      </div>
    </motion.nav>
  );
}

/**
 * BreadcrumbSchema - 结构化数据面包屑（SEO优化）
 */
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: typeof window !== 'undefined' ? window.location.origin : '',
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * useBreadcrumb - 生成面包屑数据的 Hook
 */
export function useBreadcrumb(
  pathname: string,
  additionalItems?: BreadcrumbItem[]
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];

  // 解析路径
  const segments = pathname.split('/').filter(Boolean);

  // 构建面包屑
  let href = '';
  segments.forEach((segment, index) => {
    href += `/${segment}`;
    const isLast = index === segments.length - 1;

    // 格式化标签
    const label = formatSegment(segment);

    items.push({
      label,
      href,
      current: isLast,
    });
  });

  // 添加额外项
  if (additionalItems) {
    items.push(...additionalItems);
  }

  return items;
}

/**
 * 格式化路径段
 */
function formatSegment(segment: string): string {
  // 移除文件扩展名
  const label = segment.replace(/\.[^.]+$/, '');

  // 转换为可读格式
  return label
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * BreadcrumbWithSchema - 包含结构化数据的面包屑
 */
export function BreadcrumbWithSchema(props: BreadcrumbProps) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { label: '首页', href: '/' },
          ...props.items,
        ]}
      />
      <Breadcrumb {...props} />
    </>
  );
}

export default Breadcrumb;
