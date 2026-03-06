import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: number | string;
  children?: NavItem[];
  disabled?: boolean;
}

interface SideNavProps {
  items: NavItem[];
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

interface NavItemComponentProps {
  item: NavItem;
  level?: number;
  collapsible?: boolean;
}

const NavItemComponent: React.FC<NavItemComponentProps> = ({
  item,
  level = 0,
  collapsible = false,
}) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(collapsible ? false : true);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href === pathname;

  const handleClick = () => {
    if (hasChildren && collapsible) {
      setIsOpen(!isOpen);
    }
  };

  const paddingLeft = level * 16 + 16;

  return (
    <div>
      <div
        className={cn(
          'flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
          'hover:bg-gray-800/50',
          isActive && 'bg-cyan-500/10 text-cyan-500',
          item.disabled && 'opacity-50 cursor-not-allowed',
          hasChildren && collapsible && 'cursor-pointer',
          !item.href && !hasChildren && 'cursor-default'
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {item.icon && (
            <span className="flex-shrink-0">{item.icon}</span>
          )}

          {item.href ? (
            <Link
              href={item.disabled ? '#' : item.href}
              className={cn(
                'flex-1 truncate',
                item.disabled && 'pointer-events-none'
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span className="flex-1 truncate">{item.label}</span>
          )}

          {item.badge && (
            <span className="flex-shrink-0 px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-500 rounded-full">
              {item.badge}
            </span>
          )}
        </div>

        {hasChildren && collapsible && (
          <button className="flex-shrink-0 ml-2">
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="mt-1">
          {item.children!.map((child, index) => (
            <NavItemComponent
              key={index}
              item={child}
              level={level + 1}
              collapsible={collapsible}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * SideNav - 侧边导航组件
 * 用于显示侧边栏导航菜单
 */
export const SideNav: React.FC<SideNavProps> = ({
  items,
  className,
  collapsible = false,
  defaultOpen = true,
}) => {
  return (
    <nav className={cn('space-y-1', className)}>
      {items.map((item, index) => (
        <NavItemComponent
          key={index}
          item={item}
          collapsible={collapsible}
        />
      ))}
    </nav>
  );
};

export default SideNav;
