'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsletterWidgetProps {
  className?: string;
  compact?: boolean;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function NewsletterWidget({
  className,
  compact = false,
  title = 'Newsletter',
  description = 'Get updates delivered to your inbox',
  placeholder = 'Your email',
  buttonText = 'Subscribe',
  orientation = 'vertical',
}: NewsletterWidgetProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    setStatus('loading');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Here you would make an actual API call
      // await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      setStatus('success');
      setEmail('');

      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('idle');
    }
  };

  if (compact) {
    return (
      <div className={cn('relative', className)}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 text-sm transition-colors"
              disabled={status === 'loading' || status === 'success'}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm',
              'bg-gradient-to-r from-cyan-500 to-purple-500',
              'text-white',
              'hover:opacity-90',
              'disabled:opacity-50',
              'transition-all',
              'flex items-center gap-2'
            )}
          >
            {status === 'loading' ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : status === 'success' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900 to-purple-900/10 p-6',
        className
      )}
    >
      <div className={cn(
        'flex gap-4',
        orientation === 'horizontal' && 'flex-col md:flex-row'
      )}>
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="flex-shrink-0"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
        </motion.div>

        {/* Content */}
        <div className={cn(
          'flex-1',
          orientation === 'horizontal' && 'flex-1'
        )}>
          <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-400 mb-4">{description}</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 text-sm transition-colors"
              disabled={status === 'loading' || status === 'success'}
            />

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={cn(
                'w-full py-2 px-4 rounded-lg font-medium text-sm',
                'bg-gradient-to-r from-cyan-500 to-purple-500',
                'text-white',
                'hover:opacity-90',
                'disabled:opacity-50',
                'transition-all',
                'flex items-center justify-center gap-2'
              )}
            >
              {status === 'loading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Subscribing...
                </>
              ) : status === 'success' ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Subscribed!
                </>
              ) : (
                buttonText
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-3">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewsletterWidget;
