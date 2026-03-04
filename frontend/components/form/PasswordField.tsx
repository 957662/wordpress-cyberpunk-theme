import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { getPasswordStrength } from '@/lib/validation';

export interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  showStrength?: boolean;
  error?: string;
  required?: boolean;
  className?: string;
}

export function PasswordField({
  value,
  onChange,
  label = 'Password',
  placeholder = 'Enter your password',
  showStrength = true,
  error,
  required = false,
  className,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const strength = getPasswordStrength(value);

  const strengthColors = {
    Weak: 'bg-red-500',
    Fair: 'bg-yellow-500',
    Good: 'bg-blue-500',
    Strong: 'bg-green-500',
  };

  return (
    <div className={className}>
      <div className="relative">
        <Input
          type={isVisible ? 'text' : 'password'}
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          error={error}
          required={required}
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {isVisible ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          )}
        </button>
      </div>
      {showStrength && value && (
        <div className="mt-2">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Password strength</span>
            <span className={`font-medium ${
              strength.message === 'Weak' ? 'text-red-600' :
              strength.message === 'Fair' ? 'text-yellow-600' :
              strength.message === 'Good' ? 'text-blue-600' :
              'text-green-600'
            }`}>
              {strength.message}
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full rounded-full transition-all ${strengthColors[strength.message as keyof typeof strengthColors]}`}
              style={{ width: `${(strength.score / 6) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
