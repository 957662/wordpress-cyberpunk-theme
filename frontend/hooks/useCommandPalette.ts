/**
 * useCommandPalette Hook
 * 命令面板钩子 - 管理命令面板的状态和行为
 */

'use client';

import { useState, useCallback, useEffect } from 'react';

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category?: 'navigation' | 'actions' | 'settings' | 'search';
}

export function useCommandPalette(initialCommands: Command[] = []) {
  const [isOpen, setIsOpen] = useState(false);
  const [commands, setCommands] = useState<Command[]>(initialCommands);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter commands based on query
  const filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(query.toLowerCase()) ||
    command.description?.toLowerCase().includes(query.toLowerCase())
  );

  // Open command palette
  const open = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  // Close command palette
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  // Toggle command palette
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Execute command
  const executeCommand = useCallback((commandId: string) => {
    const command = commands.find((cmd) => cmd.id === commandId);
    if (command) {
      command.action();
      close();
    }
  }, [commands, close]);

  // Register a new command
  const registerCommand = useCallback((command: Command) => {
    setCommands((prev) => [...prev, command]);
  }, []);

  // Unregister a command
  const unregisterCommand = useCallback((commandId: string) => {
    setCommands((prev) => prev.filter((cmd) => cmd.id !== commandId));
  }, []);

  // Update a command
  const updateCommand = useCallback((commandId: string, updates: Partial<Command>) => {
    setCommands((prev) =>
      prev.map((cmd) =>
        cmd.id === commandId ? { ...cmd, ...updates } : cmd
      )
    );
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open/close with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }

      // Navigate with arrow keys when open
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
            close();
          }
        } else if (e.key === 'Escape') {
          close();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, toggle, close]);

  return {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    selectedIndex,
    setSelectedIndex,
    filteredCommands,
    commands,
    setCommands,
    open,
    close,
    toggle,
    executeCommand,
    registerCommand,
    unregisterCommand,
    updateCommand,
  };
}

export default useCommandPalette;
