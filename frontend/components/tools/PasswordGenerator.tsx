/**
 * PasswordGenerator - 密码生成器和强度检测器
 * 生成安全密码并实时检测密码强度
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Copy, RefreshCw, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface PasswordGeneratorProps {
  className?: string;
  defaultLength?: number;
}

export function PasswordGenerator({ className, defaultLength = 16 }: PasswordGeneratorProps) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(defaultLength);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (chars === '') {
      setPassword('');
      setStrength(0);
      return;
    }

    let generatedPassword = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      generatedPassword += chars[array[i] % chars.length];
    }

    setPassword(generatedPassword);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const calculateStrength = useCallback((pwd: string) => {
    if (!pwd) {
      setStrength(0);
      return;
    }

    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;
    if (pwd.length >= 20) score += 1;
    if (new Set(pwd).size >= pwd.length * 0.7) score += 1;

    setStrength(Math.min(score, 5));
  }, []);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  useEffect(() => {
    calculateStrength(password);
  }, [password, calculateStrength]);

  const strengthConfig = [
    { label: '非常弱', color: 'bg-red-500', textColor: 'text-red-400', percentage: 20 },
    { label: '弱', color: 'bg-orange-500', textColor: 'text-orange-400', percentage: 40 },
    { label: '一般', color: 'bg-yellow-500', textColor: 'text-yellow-400', percentage: 60 },
    { label: '强', color: 'bg-green-400', textColor: 'text-green-400', percentage: 80 },
    { label: '非常强', color: 'bg-green-500', textColor: 'text-green-400', percentage: 100 }
  ];

  const currentStrength = strengthConfig[strength] || strengthConfig[0];

  return (
    <div className={cn('cyber-card p-6 rounded-xl space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyber-cyan" />
          密码生成器
        </h2>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={generatePassword}
          className="p-2 bg-cyber-cyan/10 text-cyber-cyan rounded-lg hover:bg-cyber-cyan/20 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 p-4 bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg">
          <span className="flex-1 font-mono text-lg text-white break-all">
            {isVisible ? password : '•'.repeat(password.length)}
          </span>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVisible(!isVisible)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyToClipboard}
              disabled={!password}
              className={cn(
                'p-2 rounded-lg transition-all',
                password ? 'text-cyber-cyan hover:bg-cyber-cyan/10' : 'text-gray-600 cursor-not-allowed'
              )}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Copy className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">密码强度</span>
            <span className={cn('text-sm font-medium', currentStrength.textColor)}>
              {currentStrength.label}
            </span>
          </div>
          <div className="h-2 bg-cyber-dark/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentStrength.percentage}%` }}
              transition={{ duration: 0.5 }}
              className={cn('h-full rounded-full', currentStrength.color)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-400">密码长度</label>
            <span className="text-sm font-bold text-cyber-cyan">{length}</span>
          </div>
          <input
            type="range"
            min={8}
            max={32}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-cyber-dark/50 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">8</span>
            <span className="text-xs text-gray-500">32</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-400">字符类型</label>

          {[
            { key: 'uppercase', label: '大写字母 (A-Z)', state: includeUppercase, setter: setIncludeUppercase },
            { key: 'lowercase', label: '小写字母 (a-z)', state: includeLowercase, setter: setIncludeLowercase },
            { key: 'numbers', label: '数字 (0-9)', state: includeNumbers, setter: setIncludeNumbers },
            { key: 'symbols', label: '特殊符号 (!@#$%)', state: includeSymbols, setter: setIncludeSymbols }
          ].map((option) => (
            <label
              key={option.key}
              className="flex items-center justify-between p-3 bg-cyber-dark/30 border border-cyber-cyan/10 rounded-lg cursor-pointer hover:bg-cyber-dark/50 transition-colors"
            >
              <span className="text-sm text-gray-300">{option.label}</span>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.preventDefault(); option.setter(!option.state); }}
                className={cn('w-12 h-6 rounded-full transition-colors', option.state ? 'bg-cyber-cyan' : 'bg-gray-700')}
              >
                <motion.div animate={{ x: option.state ? 24 : 0 }} className="w-5 h-5 bg-white rounded-full shadow" />
              </motion.button>
            </label>
          ))}
        </div>
      </div>

      {password.length === 0 && (
        <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          <p className="text-sm text-yellow-400">请至少选择一种字符类型</p>
        </div>
      )}

      <div className="p-4 bg-cyber-cyan/5 border border-cyber-cyan/10 rounded-lg">
        <p className="text-xs text-gray-400 leading-relaxed">
          <strong className="text-cyber-cyan">提示：</strong>
          强密码应至少包含 12 个字符，并混合大小写字母、数字和特殊符号。请妥善保管您的密码。
        </p>
      </div>
    </div>
  );
}

export default PasswordGenerator;
