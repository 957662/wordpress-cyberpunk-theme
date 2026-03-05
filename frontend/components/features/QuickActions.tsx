'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export function QuickActions({ actions, position = 'bottom-right', className }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div className={cn('fixed z-50', positionClasses[position], className)}>
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-0 right-0 space-y-2 mb-2">
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                disabled={action.disabled}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg bg-cyber-dark/95 backdrop-blur-sm border shadow-lg transition-all',
                  'border-cyber-cyan/30 hover:border-cyber-cyan/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  action.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <span className="text-cyber-cyan">{action.icon}</span>
                <span className="flex-1 text-left text-sm font-medium text-white">
                  {action.label}
                </span>
                {action.shortcut && (
                  <span className="text-xs text-gray-500 font-mono">{action.shortcut}</span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative w-14 h-14 rounded-full border-2 shadow-lg flex items-center justify-center transition-all',
          isOpen
            ? 'bg-cyber-pink border-cyber-pink shadow-[0_0_30px_rgba(255,0,128,0.5)]'
            : 'bg-cyber-dark border-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]'
        )}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={isOpen ? 'text-white' : 'text-cyber-cyan'}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </motion.div>
      </motion.button>
    </div>
  );
}

// Command palette component
export function CommandPalette({ actions }: { actions: QuickAction[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredActions = actions.filter((action) =>
    action.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === 'Enter' && filteredActions[selectedIndex]) {
      filteredActions[selectedIndex].onClick();
      setIsOpen(false);
      setSearch('');
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
    }
  };

  return (
    <>
      {/* Trigger button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-lg border border-cyber-cyan/30 text-gray-400 text-sm flex items-center gap-2 hover:border-cyber-cyan/50 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span>Search...</span>
        <kbd className="ml-auto px-2 py-0.5 text-xs bg-gray-800 rounded">⌘K</kbd>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
            >
              <div
                className="w-full max-w-2xl bg-cyber-dark/98 backdrop-blur-sm border border-cyber-cyan/30 rounded-xl shadow-[0_0_40px_rgba(0,240,255,0.3)] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Search input */}
                <div className="flex items-center gap-3 p-4 border-b border-cyber-cyan/20">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-400"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a command or search..."
                    autoFocus
                    className="flex-1 bg-transparent border-0 outline-none text-white text-lg"
                  />
                  <kbd className="px-2 py-1 text-xs bg-gray-800 rounded text-gray-400">ESC</kbd>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                  {filteredActions.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">
                      No results found
                    </div>
                  ) : (
                    filteredActions.map((action, index) => (
                      <motion.button
                        key={action.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          action.onClick();
                          setIsOpen(false);
                          setSearch('');
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                          index === selectedIndex
                            ? 'bg-cyber-cyan/20 text-white'
                            : 'hover:bg-gray-800/50 text-gray-300'
                        )}
                      >
                        <span className="text-cyber-cyan">{action.icon}</span>
                        <span className="flex-1 text-left font-medium">{action.label}</span>
                        {action.shortcut && (
                          <kbd className="px-2 py-1 text-xs bg-gray-800 rounded">{action.shortcut}</kbd>
                        )}
                      </motion.button>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-cyber-cyan/20 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span><kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↑↓</kbd> Navigate</span>
                    <span><kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↵</kbd> Select</span>
                  </div>
                  <span>{selectedIndex + 1} / {filteredActions.length}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
