'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ThemePreset {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

const presets: ThemePreset[] = [
  {
    name: 'Cyberpunk',
    colors: {
      primary: '#00f0ff',
      secondary: '#9d00ff',
      accent: '#ff0080',
      background: '#0a0a0f',
      text: '#ffffff',
    },
  },
  {
    name: 'Neon Nights',
    colors: {
      primary: '#ff006e',
      secondary: '#8338ec',
      accent: '#3a86ff',
      background: '#0a0a0f',
      text: '#ffffff',
    },
  },
  {
    name: 'Matrix',
    colors: {
      primary: '#00ff00',
      secondary: '#008000',
      accent: '#00ff00',
      background: '#000000',
      text: '#00ff00',
    },
  },
  {
    name: 'Sunset',
    colors: {
      primary: '#ffbe0b',
      secondary: '#fb5607',
      accent: '#ff006e',
      background: '#0a0a0f',
      text: '#ffffff',
    },
  },
];

export function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPreset, setCurrentPreset] = useState(0);
  const [customColors, setCustomColors] = useState(presets[0].colors);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme-preset');
    const savedColors = localStorage.getItem('theme-colors');
    
    if (savedTheme) {
      setCurrentPreset(parseInt(savedTheme));
    }
    if (savedColors) {
      setCustomColors(JSON.parse(savedColors));
    }
  }, []);

  useEffect(() => {
    // Apply colors to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--color-primary', customColors.primary);
    root.style.setProperty('--color-secondary', customColors.secondary);
    root.style.setProperty('--color-accent', customColors.accent);
    root.style.setProperty('--color-background', customColors.background);
    root.style.setProperty('--color-text', customColors.text);

    // Save to localStorage
    localStorage.setItem('theme-preset', currentPreset.toString());
    localStorage.setItem('theme-colors', JSON.stringify(customColors));
  }, [customColors, currentPreset]);

  const handlePresetChange = (index: number) => {
    setCurrentPreset(index);
    setCustomColors(presets[index].colors);
  };

  const handleColorChange = (colorKey: keyof ThemePreset['colors'], value: string) => {
    setCustomColors((prev) => ({
      ...prev,
      [colorKey]: value,
    }));
    setCurrentPreset(-1); // Switch to custom
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed top-1/2 right-4 -translate-y-1/2 z-40 p-3 rounded-lg border shadow-lg transition-all',
          'bg-cyber-dark/95 backdrop-blur-sm',
          'border-cyber-cyan/30 text-cyber-cyan',
          'hover:border-cyber-cyan/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a10 10 0 0 1 10 10" />
          <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        </svg>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 overflow-y-auto"
            >
              <div className="h-full bg-cyber-dark/98 backdrop-blur-sm border-l border-cyber-cyan/30 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Theme Customizer</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-cyber-cyan/20 rounded-lg transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Presets */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-400 mb-3">PRESETS</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {presets.map((preset, index) => (
                      <motion.button
                        key={preset.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePresetChange(index)}
                        className={cn(
                          'p-3 rounded-lg border-2 transition-all',
                          currentPreset === index
                            ? 'border-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                            : 'border-gray-700 hover:border-gray-600'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {Object.values(preset.colors).slice(0, 4).map((color, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-white">{preset.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 mb-3">CUSTOM COLORS</h3>
                  <div className="space-y-3">
                    {Object.entries(customColors).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={value}
                              onChange={(e) => handleColorChange(key as keyof ThemePreset['colors'], e.target.value)}
                              className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                            />
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => handleColorChange(key as keyof ThemePreset['colors'], e.target.value)}
                              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-cyber-cyan"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reset button */}
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setCurrentPreset(0);
                      setCustomColors(presets[0].colors);
                    }}
                    className="w-full px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Reset to Default
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Hook for using custom theme
export function useCustomTheme() {
  const [colors, setColors] = useState(presets[0].colors);

  useEffect(() => {
    const savedColors = localStorage.getItem('theme-colors');
    if (savedColors) {
      setColors(JSON.parse(savedColors));
    }
  }, []);

  return colors;
}
