'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Languages, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}

export interface LanguageSwitcherProps {
  languages: Language[];
  currentLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  variant?: 'neon' | 'holographic' | 'minimal';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  displayType?: 'dropdown' | 'buttons' | 'list';
  showFlags?: boolean;
  showNativeNames?: boolean;
  className?: string;
}

const colorStyles = {
  cyan: {
    border: 'border-cyber-cyan/50',
    text: 'text-cyber-cyan',
    bg: 'bg-cyber-cyan/20',
    hover: 'hover:bg-cyber-cyan/30',
    glow: 'shadow-lg shadow-cyber-cyan/20',
  },
  purple: {
    border: 'border-cyber-purple/50',
    text: 'text-cyber-purple',
    bg: 'bg-cyber-purple/20',
    hover: 'hover:bg-cyber-purple/30',
    glow: 'shadow-lg shadow-cyber-purple/20',
  },
  pink: {
    border: 'border-cyber-pink/50',
    text: 'text-cyber-pink',
    bg: 'bg-cyber-pink/20',
    hover: 'hover:bg-cyber-pink/30',
    glow: 'shadow-lg shadow-cyber-pink/20',
  },
  green: {
    border: 'border-cyber-green/50',
    text: 'text-cyber-green',
    bg: 'bg-cyber-green/20',
    hover: 'hover:bg-cyber-green/30',
    glow: 'shadow-lg shadow-cyber-green/20',
  },
};

const variantStyles = {
  neon: 'border-2 bg-cyber-dark/80 backdrop-blur-sm',
  holographic: 'border border-white/20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md',
  minimal: 'border border-gray-700 bg-gray-900/50',
};

export function LanguageSwitcher({
  languages,
  currentLanguage,
  onLanguageChange,
  variant = 'neon',
  color = 'cyan',
  displayType = 'dropdown',
  showFlags = true,
  showNativeNames = false,
  className,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const styles = colorStyles[color];
  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0];

  if (displayType === 'buttons') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {languages.map((language) => {
          const isActive = language.code === currentLanguage;
          return (
            <motion.button
              key={language.code}
              onClick={() => onLanguageChange(language.code)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2',
                isActive
                  ? `${styles.bg} ${styles.text} ${styles.glow} ${styles.border} border-2`
                  : 'bg-cyber-dark/50 text-gray-400 hover:text-white hover:bg-cyber-dark/80 border border-gray-700'
              )}
            >
              {showFlags && language.flag && <span>{language.flag}</span>}
              <span>{language.name}</span>
              {isActive && <Check className="w-4 h-4" />}
            </motion.button>
          );
        })}
      </div>
    );
  }

  if (displayType === 'list') {
    return (
      <div className={cn('space-y-2', className)}>
        {languages.map((language) => {
          const isActive = language.code === currentLanguage;
          return (
            <motion.button
              key={language.code}
              onClick={() => onLanguageChange(language.code)}
              whileHover={{ x: 5 }}
              className={cn(
                'w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-between',
                'border-2',
                isActive
                  ? `${styles.bg} ${styles.text} ${styles.glow} ${styles.border}`
                  : 'bg-cyber-dark/50 text-gray-400 hover:text-white hover:bg-cyber-dark/80 border-gray-700'
              )}
            >
              <div className="flex items-center gap-2">
                {showFlags && language.flag && <span className="text-xl">{language.flag}</span>}
                <div className="text-left">
                  <div>{language.name}</div>
                  {showNativeNames && (
                    <div className="text-xs opacity-70">{language.nativeName}</div>
                  )}
                </div>
              </div>
              {isActive && <Check className="w-4 h-4" />}
            </motion.button>
          );
        })}
      </div>
    );
  }

  // Dropdown (default)
  return (
    <div className={cn('relative', className)}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300',
          variantStyles[variant],
          styles.border,
          styles.text,
          isOpen && styles.glow
        )}
      >
        <Languages className="w-4 h-4" />
        {showFlags && currentLang.flag && (
          <motion.span
            key={currentLang.flag}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-lg"
          >
            {currentLang.flag}
          </motion.span>
        )}
        <span>{currentLang.name}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'absolute z-20 mt-2 py-2 rounded-lg border-2 min-w-[200px]',
                variantStyles[variant],
                styles.border,
                styles.glow
              )}
            >
              {languages.map((language) => {
                const isActive = language.code === currentLanguage;
                return (
                  <motion.button
                    key={language.code}
                    onClick={() => {
                      onLanguageChange(language.code);
                      setIsOpen(false);
                    }}
                    whileHover={{ x: 5 }}
                    className={cn(
                      'w-full px-4 py-2 flex items-center gap-2 transition-colors duration-200',
                      isActive ? styles.text : 'text-gray-400 hover:text-white'
                    )}
                  >
                    {showFlags && language.flag && <span className="text-lg">{language.flag}</span>}
                    <div className="text-left flex-1">
                      <div>{language.name}</div>
                      {showNativeNames && (
                        <div className="text-xs opacity-70">{language.nativeName}</div>
                      )}
                    </div>
                    {isActive && <Check className="w-4 h-4" />}
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// 紧凑型语言切换器（只显示图标）
export interface CompactLanguageSwitcherProps {
  languages: Language[];
  currentLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
}

export function CompactLanguageSwitcher({
  languages,
  currentLanguage,
  onLanguageChange,
  color = 'cyan',
  className,
}: CompactLanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const styles = colorStyles[color];
  const currentIndex = languages.findIndex((lang) => lang.code === currentLanguage);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % languages.length;
    onLanguageChange(languages[nextIndex].code);
  };

  return (
    <div className={cn('relative', className)}>
      <motion.button
        onClick={handleNext}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300',
          variantStyles.neon,
          styles.border,
          styles.text,
          styles.glow
        )}
        title="Switch Language"
      >
        <Globe className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

// 默认语言列表
export const defaultLanguages: Language[] = [
  { code: 'zh-CN', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

export default LanguageSwitcher;
