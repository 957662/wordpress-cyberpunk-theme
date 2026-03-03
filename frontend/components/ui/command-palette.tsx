/**
 * CommandPalette Component
 * 命令面板组件 - 快速命令执行和导航
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, FileText, Users, Settings, Home } from 'lucide-react';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category?: 'navigation' | 'actions' | 'settings' | 'search';
}

interface CommandPaletteProps {
  commands: Command[];
  trigger?: React.ReactNode;
  placeholder?: string;
  openKey?: string;
  className?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  commands,
  trigger,
  placeholder = 'Type a command or search...',
  openKey = 'k',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter commands based on query
  const filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(query.toLowerCase()) ||
    command.description?.toLowerCase().includes(query.toLowerCase())
  );

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    const category = command.category || 'actions';
    if (!acc[category]) acc[category] = [];
    acc[category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open/close with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === openKey) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }

      // Navigate with arrow keys
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            setIsOpen(false);
            setQuery('');
          }
        } else if (e.key === 'Escape') {
          setIsOpen(false);
          setQuery('');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, openKey]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation':
        return <Home size={16} />;
      case 'actions':
        return <FileText size={16} />;
      case 'settings':
        return <Settings size={16} />;
      case 'search':
        return <Search size={16} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Trigger Button */}
      {trigger || (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyber-dark border border-cyber-cyan/30 rounded-lg text-gray-400 hover:text-cyber-cyan hover:border-cyber-cyan/50 transition-all"
        >
          <Search size={18} />
          <span>Search...</span>
          <kbd className="ml-auto flex items-center gap-1 px-2 py-1 text-xs bg-cyber-muted rounded border border-cyber-cyan/20">
            <Command size={12} /> K
          </kbd>
        </button>
      )}

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className={`fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-2xl bg-cyber-dark border border-cyber-cyan/30 rounded-lg shadow-2xl shadow-cyber-cyan/20 z-50 overflow-hidden ${className}`}
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-cyber-cyan/20">
                <Search className="text-gray-400" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                />
                <kbd className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 bg-cyber-muted rounded">
                  ESC
                </kbd>
              </div>

              {/* Command List */}
              <div
                ref={listRef}
                className="max-h-[400px] overflow-y-auto p-2"
              >
                {Object.entries(groupedCommands).map(([category, cmds]) => (
                  <div key={category} className="mb-4">
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {getCategoryIcon(category)}
                      {category}
                    </div>
                    {cmds.map((command) => {
                      const globalIndex = filteredCommands.indexOf(command);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <motion.button
                          key={command.id}
                          onClick={() => {
                            command.action();
                            setIsOpen(false);
                            setQuery('');
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                            isSelected
                              ? 'bg-cyber-cyan/10 text-cyber-cyan'
                              : 'text-gray-300 hover:bg-cyber-muted/50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {command.icon && (
                            <span className="flex-shrink-0">{command.icon}</span>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{command.label}</div>
                            {command.description && (
                              <div className="text-xs text-gray-500 truncate">
                                {command.description}
                              </div>
                            )}
                          </div>
                          {command.shortcut && (
                            <kbd className="flex-shrink-0 px-2 py-1 text-xs bg-cyber-muted rounded border border-cyber-cyan/20">
                              {command.shortcut}
                            </kbd>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ))}

                {filteredCommands.length === 0 && (
                  <div className="px-3 py-8 text-center text-gray-500">
                    No commands found
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-cyber-cyan/20 text-xs text-gray-500 bg-cyber-muted/30">
                <div className="flex items-center gap-4">
                  <span>↑↓ to navigate</span>
                  <span>↵ to select</span>
                </div>
                <span>{filteredCommands.length} commands</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommandPalette;
