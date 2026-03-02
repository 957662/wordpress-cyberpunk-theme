'use client';

/**
 * 密码强度检测组件
 * 实时检测密码强度并显示建议
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Shield, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PasswordStrengthProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minLength?: number;
  showRequirements?: boolean;
  showToggle?: boolean;
  className?: string;
}

interface Requirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
  icon: React.ReactNode;
}

export function PasswordStrength({
  value,
  onChange,
  placeholder = '请输入密码',
  minLength = 8,
  showRequirements = true,
  showToggle = true,
  className,
}: PasswordStrengthProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const requirements: Requirement[] = useMemo(
    () => [
      {
        id: 'length',
        label: `至少 ${minLength} 个字符`,
        test: (pwd) => pwd.length >= minLength,
        icon: <AlertTriangle className="w-4 h-4" />,
      },
      {
        id: 'uppercase',
        label: '包含大写字母',
        test: (pwd) => /[A-Z]/.test(pwd),
        icon: <AlertTriangle className="w-4 h-4" />,
      },
      {
        id: 'lowercase',
        label: '包含小写字母',
        test: (pwd) => /[a-z]/.test(pwd),
        icon: <AlertTriangle className="w-4 h-4" />,
      },
      {
        id: 'number',
        label: '包含数字',
        test: (pwd) => /\d/.test(pwd),
        icon: <AlertTriangle className="w-4 h-4" />,
      },
      {
        id: 'special',
        label: '包含特殊字符',
        test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
        icon: <AlertTriangle className="w-4 h-4" />,
      },
    ],
    [minLength]
  );

  const strength = useMemo(() => {
    if (!value) return 0;
    const score = requirements.filter((req) => req.test(value)).length;
    return Math.round((score / requirements.length) * 100);
  }, [value, requirements]);

  const strengthLabel = useMemo(() => {
    if (!value) return '';
    if (strength < 40) return '弱';
    if (strength < 80) return '中等';
    return '强';
  }, [value, strength]);

  const strengthColor = useMemo(() => {
    if (!value) return 'bg-gray-700';
    if (strength < 40) return 'bg-cyber-pink';
    if (strength < 80) return 'bg-cyber-yellow';
    return 'bg-cyber-green';
  }, [value, strength]);

  const passedRequirements = useMemo(
    () => requirements.filter((req) => req.test(value)),
    [value, requirements]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Password Input */}
      <div className="relative">
        <motion.div
          animate={{
            borderColor: isFocused
              ? strength < 40
                ? '#ff0080'
                : strength < 80
                ? '#f0ff00'
                : '#00ff88'
              : '#2a2a4a',
          }}
          className="relative flex items-center border-2 rounded-lg overflow-hidden bg-cyber-dark"
        >
          <input
            type={isVisible ? 'text' : 'password'}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none font-mono"
          />

          {/* Strength Indicator */}
          <motion.div
            className="h-full"
            initial={{ width: 0 }}
            animate={{ width: `${strength}%` }}
            transition={{ duration: 0.3 }}
            style={{ backgroundColor: strength < 40 ? '#ff0080' : strength < 80 ? '#f0ff00' : '#00ff88' }}
          />

          {/* Toggle Visibility */}
          {showToggle && (
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="absolute right-2 px-2 py-1 text-gray-400 hover:text-white transition-colors"
            >
              {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </motion.div>

        {/* Strength Label */}
        <AnimatePresence>
          {value && isFocused && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2"
            >
              <Shield
                className={cn(
                  'w-5 h-5',
                  strength < 40 && 'text-cyber-pink',
                  strength >= 40 && strength < 80 && 'text-cyber-yellow',
                  strength >= 80 && 'text-cyber-green'
                )}
              />
              <span
                className={cn(
                  'text-sm font-semibold',
                  strength < 40 && 'text-cyber-pink',
                  strength >= 40 && strength < 80 && 'text-cyber-yellow',
                  strength >= 80 && 'text-cyber-green'
                )}
              >
                {strengthLabel}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Strength Bar */}
      {value && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-2 bg-gray-800 rounded-full overflow-hidden"
        >
          <motion.div
            className={cn('h-full transition-colors duration-300', strengthColor)}
            initial={{ width: 0 }}
            animate={{ width: `${strength}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}

      {/* Requirements List */}
      {showRequirements && isFocused && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2 p-4 bg-cyber-card border border-cyber-border rounded-lg"
        >
          <h4 className="text-sm font-semibold text-gray-400 mb-3">密码要求：</h4>
          <div className="space-y-2">
            {requirements.map((requirement) => {
              const passed = requirement.test(value);
              return (
                <motion.div
                  key={requirement.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    'flex items-center gap-2 text-sm transition-colors',
                    passed ? 'text-cyber-green' : 'text-gray-500'
                  )}
                >
                  {passed ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{requirement.label}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Progress Summary */}
          <div className="mt-4 pt-4 border-t border-cyber-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">完成度</span>
              <span className={cn('font-semibold', passedRequirements.length === requirements.length ? 'text-cyber-green' : 'text-gray-400')}>
                {passedRequirements.length} / {requirements.length}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default PasswordStrength;
