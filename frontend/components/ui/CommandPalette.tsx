'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  commands: Command[];
  trigger?: string[];
  placeholder?: string;
  className?: string;
}

export function CommandPalette({
  commands,
  trigger = ['⌘K', 'Ctrl+K'],
  placeholder = 'Type a command or search...',
  className = '',
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredCommands = commands.filter((command) => {
    const search = query.toLowerCase();
    return (
      command.label.toLowerCase().includes(search) ||
      command.description?.toLowerCase().includes(search) ||
      command.keywords?.some((keyword) => keyword.toLowerCase().includes(search))
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      filteredCommands[selectedIndex].action();
      setIsOpen(false);
      setQuery('');
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            ref={paletteRef}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 ${className}`}
          >
            <div className="bg-gray-900 border border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-500/20 overflow-hidden">
              <div className="flex items-center px-4 border-b border-cyan-500/20">
                <svg
                  className="w-5 h-5 text-cyan-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent border-none outline-none text-cyan-100 placeholder-cyan-700 py-4"
                />
                <kbd className="px-2 py-1 text-xs text-cyan-600 bg-cyan-950/50 rounded">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="text-center py-8 text-cyan-700">
                    No commands found
                  </div>
                ) : (
                  filteredCommands.map((command, index) => (
                    <motion.button
                      key={command.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => {
                        command.action();
                        setIsOpen(false);
                        setQuery('');
                      }}
                      className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg transition-all ${
                        index === selectedIndex
                          ? 'bg-cyan-500/20 text-cyan-100'
                          : 'hover:bg-cyan-500/10 text-cyan-300'
                      }`}
                    >
                      {command.icon && (
                        <span className="text-xl mt-0.5">{command.icon}</span>
                      )}
                      <div className="flex-1 text-left">
                        <div className="font-medium">{command.label}</div>
                        {command.description && (
                          <div className="text-sm text-cyan-600">
                            {command.description}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  ))
                )}
              </div>

              <div className="px-4 py-3 border-t border-cyan-500/20 flex items-center justify-between text-xs text-cyan-700">
                <div className="flex gap-4">
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-cyan-950/50 rounded mr-1">↑↓</kbd>
                    Navigate
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-cyan-950/50 rounded mr-1">↵</kbd>
                    Select
                  </span>
                </div>
                <span>{trigger.join(' / ')}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
