'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ContextMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  children: ReactNode;
  className?: string;
}

export function ContextMenu({ items, children, className = '' }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
    <>
      <div onContextMenu={handleContextMenu} onClick={handleClick} className={className}>
        {children}
      </div>
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-50 min-w-[200px] bg-gray-900 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/20 overflow-hidden"
            style={{
              left: `${Math.min(position.x, window.innerWidth - 220)}px`,
              top: `${Math.min(position.y, window.innerHeight - 200)}px`,
            }}
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    setIsOpen(false);
                  }
                }}
                disabled={item.disabled}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-all ${
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : item.danger
                    ? 'hover:bg-red-500/20 text-red-400'
                    : 'hover:bg-cyan-500/10 text-cyan-400'
                }`}
              >
                {item.icon && <span className="text-lg">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
