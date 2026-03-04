'use client';

/**
 * Color Picker Component
 * Cyberpunk-styled color picker with preset colors and custom input
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Check } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  label?: string;
  className?: string;
}

const DEFAULT_PRESETS = [
  '#00f0ff', // Neon Cyan
  '#9d00ff', // Cyber Purple
  '#ff0080', // Laser Pink
  '#00ff88', // Cyber Green
  '#f0ff00', // Voltage Yellow
  '#ff4400', // Plasma Orange
  '#0a0a0f', // Deep Space
  '#ffffff', // White
  '#1a1a2e', // Muted
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
];

export function ColorPicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  label,
  className = '',
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  // Handle color selection
  const handleColorSelect = useCallback(
    (color: string) => {
      onChange(color);
      setCustomColor(color);
    },
    [onChange]
  );

  // Handle custom color input
  const handleCustomColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const color = e.target.value;
      setCustomColor(color);
      onChange(color);
    },
    [onChange]
  );

  // Validate hex color
  const isValidHex = useCallback((color: string) => {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
  }, []);

  // Format color for display
  const formatColor = useCallback((color: string) => {
    if (!isValidHex(color)) return '#000000';
    return color;
  }, [isValidHex]);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-[#0a0a0f] border border-cyber-cyan/30 rounded-lg hover:border-cyber-cyan/50 transition-all duration-200 w-full"
      >
        <div
          className="w-8 h-8 rounded border-2 border-white/20 shadow-inner"
          style={{ backgroundColor: formatColor(value) }}
        />
        <span className="text-white font-mono text-sm">{value}</span>
        <Palette className="w-5 h-5 text-cyber-cyan ml-auto" />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-2 p-4 bg-[#0a0a0f] border border-cyber-cyan/30 rounded-lg shadow-2xl w-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Palette className="w-5 h-5 text-cyber-cyan" />
                  Select Color
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-cyber-cyan/10 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Preset Colors */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Preset Colors</p>
                <div className="grid grid-cols-8 gap-2">
                  {presets.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                        value === color
                          ? 'border-cyber-cyan shadow-lg shadow-cyber-cyan/50'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {value === color && (
                        <Check className="w-5 h-5 mx-auto text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Input */}
              <div>
                <p className="text-sm text-gray-400 mb-2">Custom Color</p>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">#</span>
                    </div>
                    <input
                      type="text"
                      value={customColor.replace('#', '')}
                      onChange={(e) => {
                        const hex = e.target.value;
                        if (/^[0-9A-Fa-f]{0,6}$/.test(hex)) {
                          const fullHex = `#${hex}`;
                          setCustomColor(fullHex);
                          if (isValidHex(fullHex)) {
                            onChange(fullHex);
                          }
                        }
                      }}
                      className="w-full pl-7 pr-3 py-2 bg-[#16162a] border border-cyber-cyan/20 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyber-cyan/50 uppercase"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                  <div className="relative w-12 h-12">
                    <input
                      type="color"
                      value={formatColor(customColor)}
                      onChange={handleCustomColorChange}
                      className="absolute inset-0 w-12 h-12 opacity-0 cursor-pointer"
                    />
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-white/20"
                      style={{ backgroundColor: formatColor(customColor) }}
                    />
                  </div>
                </div>
                {!isValidHex(customColor) && (
                  <p className="text-red-400 text-xs mt-1">
                    Please enter a valid hex color (e.g., FF0000)
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
