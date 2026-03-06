/**
 * 赛博朋克风格导航菜单
 * CyberPress Navigation Menu
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuIcon, CloseIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

/**
 * 导航菜单项
 */
export interface NavMenuItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavMenuItem[];
  disabled?: boolean;
}

/**
 * 导航菜单属性
 */
export interface CyberNavMenuProps {
  items: NavMenuItem[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'minimal' | 'glow';
  className?: string;
}

/**
 * 单个菜单项组件
 */
interface MenuItemProps {
  item: NavMenuItem;
  isActive: boolean;
  orientation: 'horizontal' | 'vertical';
  variant: 'default' | 'minimal' | 'glow';
  depth?: number;
}

function MenuItem({ item, isActive, orientation, variant, depth = 0 }: MenuItemProps) {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const pathname = usePathname();

  // 检查子菜单是否有激活项
  const hasActiveChild = hasChildren
    ? item.children!.some(child => child.href === pathname)
    : false;

  const baseStyles = cn(
    'relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
    'group',
    orientation === 'horizontal' && 'whitespace-nowrap',
    item.disabled && 'opacity-50 cursor-not-allowed'
  );

  const variantStyles = {
    default: cn(
      isActive
        ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan'
        : 'text-gray-300 hover:text-cyber-cyan hover:bg-cyber-muted/50'
    ),
    minimal: cn(
      isActive
        ? 'text-cyber-cyan'
        : 'text-gray-300 hover:text-cyber-cyan'
    ),
    glow: cn(
      isActive
        ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan shadow-neon-cyan'
        : 'text-gray-300 hover:text-cyber-cyan hover:bg-cyber-muted/50 hover:shadow-neon-cyan'
    ),
  };

  const renderLink = (href: string, content: React.ReactNode) => {
    if (item.disabled) {
      return <span className={cn(baseStyles, variantStyles[variant])}>{content}</span>;
    }
    return (
      <Link href={href} className={cn(baseStyles, variantStyles[variant])}>
        {content}
      </Link>
    );
  };

  return (
    <div
      className={cn('relative', depth > 0 && 'ml-4')}
      onMouseEnter={() => hasChildren && setIsSubmenuOpen(true)}
      onMouseLeave={() => hasChildren && setIsSubmenuOpen(false)}
    >
      {renderLink(item.href, (
        <>
          {/* 图标 */}
          {item.icon && (
            <motion.span
              className="flex-shrink-0"
              whileHover={{ rotate: isActive ? 0 : [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.3 }}
            >
              {item.icon}
            </motion.span>
          )}

          {/* 文本 */}
          <span className="font-medium">{item.name}</span>

          {/* 徽章 */}
          {item.badge && (
            <span className={cn(
              'ml-auto px-2 py-0.5 text-xs font-bold rounded',
              isActive
                ? 'bg-cyber-cyan text-cyber-dark'
                : 'bg-cyber-pink text-white'
            )}>
              {item.badge}
            </span>
          )}

          {/* 子菜单指示器 */}
          {hasChildren && (
            <motion.span
              className="ml-auto"
              animate={{ rotate: isSubmenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.span>
          )}

          {/* 激活指示条 */}
          {isActive && variant !== 'minimal' && (
            <motion.div
              className={cn(
                'absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-cyan',
                orientation === 'vertical' && 'left-0 top-0 bottom-0 w-0.5 h-auto'
              )}
              layoutId="activeNav"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </>
      ))}

      {/* 子菜单 */}
      {hasChildren && (
        <AnimatePresence>
          {isSubmenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'absolute z-50 mt-2 w-56 bg-cyber-card border border-cyber-border rounded-lg shadow-xl',
                orientation === 'vertical' && 'left-full top-0 ml-2'
              )}
            >
              <div className="py-2">
                {item.children!.map((child, index) => (
                  <MenuItem
                    key={index}
                    item={child}
                    isActive={child.href === pathname}
                    orientation="vertical"
                    variant={variant}
                    depth={depth + 1}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

/**
 * CyberNavMenu 组件
 */
export function CyberNavMenu({
  items,
  orientation = 'horizontal',
  variant = 'default',
  className,
}: CyberNavMenuProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const containerStyles = cn(
    'relative',
    orientation === 'horizontal'
      ? 'flex items-center gap-2'
      : 'flex flex-col gap-2',
    className
  );

  // 桌面导航
  const desktopNav = (
    <nav ref={containerRef} className={containerStyles}>
      {items.map((item, index) => (
        <MenuItem
          key={index}
          item={item}
          isActive={item.href === pathname}
          orientation={orientation}
          variant={variant}
        />
      ))}
    </nav>
  );

  // 移动端导航
  const mobileNav = (
    <>
      {/* 汉堡菜单按钮 */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden p-2 text-cyber-cyan hover:bg-cyber-muted/50 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <CloseIcon className="w-6 h-6" />
        ) : (
          <MenuIcon className="w-6 h-6" />
        )}
      </motion.button>

      {/* 移动端菜单覆盖层 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* 菜单面板 */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-full bg-cyber-dark border-l border-cyber-border z-50 lg:hidden overflow-y-auto"
            >
              {/* 菜单头部 */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-cyber-border bg-cyber-dark/95 backdrop-blur">
                <h2 className="text-lg font-display font-bold text-cyber-cyan">
                  MENU
                </h2>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-cyber-cyan hover:bg-cyber-muted/50 rounded-lg transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </motion.button>
              </div>

              {/* 菜单项列表 */}
              <nav className="p-4 space-y-2">
                {items.map((item, index) => (
                  <div key={index}>
                    {item.disabled ? (
                      <span className="flex items-center gap-3 px-4 py-3 text-gray-500 opacity-50">
                        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                        <span className="font-medium">{item.name}</span>
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
                          item.href === pathname
                            ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan'
                            : 'text-gray-300 hover:text-cyber-cyan hover:bg-cyber-muted/50'
                        )}
                      >
                        {item.icon && (
                          <motion.span
                            className="flex-shrink-0"
                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.3 }}
                          >
                            {item.icon}
                          </motion.span>
                        )}
                        <span className="font-medium flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs font-bold rounded bg-cyber-pink text-white">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}

                    {/* 子菜单 */}
                    {item.children && item.children.length > 0 && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={child.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
                              child.disabled && 'opacity-50 cursor-not-allowed',
                              !child.disabled && child.href === pathname
                                ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan'
                                : !child.disabled && 'text-gray-400 hover:text-cyber-cyan hover:bg-cyber-muted/30'
                            )}
                          >
                            <span className="font-medium">{child.name}</span>
                            {child.badge && (
                              <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded bg-cyber-pink/20 text-cyber-pink">
                                {child.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* 菜单底部装饰 */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      {desktopNav}
      {mobileNav}
    </>
  );
}

/**
 * 导出便捷组件
 */
export function CyberNavMenuHorizontal(props: Omit<CyberNavMenuProps, 'orientation'>) {
  return <CyberNavMenu {...props} orientation="horizontal" />;
}

export function CyberNavMenuVertical(props: Omit<CyberNavMenuProps, 'orientation'>) {
  return <CyberNavMenu {...props} orientation="vertical" />;
}

export default CyberNavMenu;
