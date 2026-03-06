/**
 * 赛博朋克风格菜单组件
 */

'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronRight, Check, Dot } from 'lucide-react';

interface MenuContextValue {
  closeMenu: () => void;
}

const MenuContext = React.createContext<MenuContextValue | undefined>(undefined);

function useMenuContext() {
  const context = React.useContext(MenuContext);
  if (!context) {
    throw new Error('Menu components must be used within a Menu component');
  }
  return context;
}

export interface MenuProps {
  children: React.ReactNode;
  className?: string;
}

export function Menu({ children, className }: MenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const closeMenu = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <MenuContext.Provider value={{ closeMenu }}>
      <div className={cn('relative', className)}>{children}</div>
    </MenuContext.Provider>
  );
}

export interface MenuTriggerProps {
  children: React.ReactElement;
  disabled?: boolean;
}

export function MenuTrigger({ children, disabled = false }: MenuTriggerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const { closeMenu } = useMenuContext();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={triggerRef} className="relative">
      {React.cloneElement(children, {
        onClick: () => !disabled && setIsOpen(!isOpen),
        'aria-expanded': isOpen,
        'aria-haspopup': true,
      })}
      <AnimatePresence>
        {isOpen && React.Children.map(children, (child: any) => {
          if (child?.type === MenuContent) {
            return React.cloneElement(child, { onClose: () => setIsOpen(false) });
          }
          return null;
        })}
      </AnimatePresence>
    </div>
  );
}

export interface MenuContentProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  onClose?: () => void;
}

export function MenuContent({
  children,
  align = 'start',
  side = 'bottom',
  className,
  onClose,
}: MenuContentProps) {
  const alignStyles = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  const sideStyles = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: side === 'bottom' ? -10 : 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: side === 'bottom' ? -10 : 10 }}
        transition={{ duration: 0.15 }}
        className={cn(
          'absolute z-50 min-w-[160px] max-w-xs',
          'bg-cyber-card border border-cyber-border rounded-lg',
          'shadow-neon-cyan/20 overflow-hidden',
          alignStyles[align],
          sideStyles[side],
          className
        )}
      >
        <div className="py-1">{children}</div>
      </motion.div>
    </AnimatePresence>
  );
}

export interface MenuItemProps {
  children: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  icon?: React.ReactNode;
  shortcut?: string;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
}

export function MenuItem({
  children,
  disabled = false,
  selected = false,
  icon,
  shortcut,
  className,
  onClick,
}: MenuItemProps) {
  const { closeMenu } = useMenuContext();

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    onClick?.(e);
    closeMenu();
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { x: 4 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 text-sm',
        'transition-colors',
        'focus:outline-none focus:bg-cyber-muted/50',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer hover:bg-cyber-muted/30',
        selected && 'bg-cyber-cyan/20 text-cyber-cyan',
        !selected && 'text-gray-300',
        className
      )}
    >
      {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
      <span className="flex-1 text-left">{children}</span>
      {shortcut && (
        <span className="text-xs text-gray-500 font-mono">{shortcut}</span>
      )}
      {selected && <Check className="w-4 h-4 text-cyber-cyan" />}
    </motion.button>
  );
}

// 菜单标签
export interface MenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function MenuLabel({ children, className }: MenuLabelProps) {
  return (
    <div
      className={cn(
        'px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider',
        className
      )}
    >
      {children}
    </div>
  );
}

// 菜单分隔线
export function MenuSeparator({ className }: { className?: string }) {
  return (
    <div className={cn('my-1 h-px bg-cyber-border', className)} />
  );
}

// 子菜单
export interface MenuSubMenuProps {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function MenuSubMenu({ label, children, icon }: MenuSubMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <MenuItem
        icon={icon}
        onClick={() => setIsOpen(!isOpen)}
        className="justify-between"
      >
        <span>{label}</span>
        <ChevronRight
          className={cn(
            'w-4 h-4 transition-transform',
            isOpen && 'rotate-90'
          )}
        />
      </MenuItem>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-0 ml-1 min-w-[160px] bg-cyber-card border border-cyber-border rounded-lg shadow-lg overflow-hidden"
          >
            <div className="py-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 复选框菜单项
export interface MenuCheckboxItemProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function MenuCheckboxItem({
  checked,
  onChange,
  children,
  disabled = false,
}: MenuCheckboxItemProps) {
  const { closeMenu } = useMenuContext();

  return (
    <MenuItem
      disabled={disabled}
      selected={checked}
      onClick={() => onChange(!checked)}
    >
      <span className="flex-1 text-left">{children}</span>
      {checked && <Check className="w-4 h-4 text-cyber-cyan" />}
    </MenuItem>
  );
}

// 单选菜单组
export interface MenuRadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

export function MenuRadioGroup({
  value,
  onChange,
  children,
}: MenuRadioGroupProps) {
  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            selected: child.props.itemValue === value,
            onClick: () => onChange(child.props.itemValue),
          });
        }
        return child;
      })}
    </div>
  );
}

export interface MenuRadioItemProps {
  itemValue: string;
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

export function MenuRadioItem({
  children,
  selected,
}: MenuRadioItemProps) {
  return (
    <MenuItem selected={selected}>
      <span className="flex-1 text-left">{children}</span>
      {selected && <Dot className="w-4 h-4 text-cyber-cyan fill-current" />}
    </MenuItem>
  );
}
