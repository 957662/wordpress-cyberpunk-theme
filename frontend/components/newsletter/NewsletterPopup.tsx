'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsletterPopupProps {
  delay?: number; // Delay in milliseconds before showing
  showAgainAfter?: number; // Days before showing again
  className?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
}

export function NewsletterPopup({
  delay = 5000,
  showAgainAfter = 7,
  className,
  title = 'Join Our Newsletter',
  description = 'Subscribe to get the latest news and updates.',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
}: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    // Check if user already submitted or dismissed
    const lastShown = localStorage.getItem('newsletterPopupLastShown');
    const hasSubscribed = localStorage.getItem('newsletterPopupSubscribed');

    if (hasSubscribed === 'true') {
      return; // Don't show if already subscribed
    }

    if (lastShown) {
      const daysSinceLastShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
      if (daysSinceLastShown < showAgainAfter) {
        return; // Don't show if shown recently
      }
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, showAgainAfter]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('newsletterPopupLastShown', Date.now().toString());
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Here you would make an actual API call
      // await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      setStatus('success');
      setHasSubmitted(true);
      localStorage.setItem('newsletterPopupSubscribed', 'true');

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Popup */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              className={cn(
                'relative w-full max-w-md',
                'bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20',
                'border border-cyan-500/30 rounded-2xl shadow-2xl',
                'overflow-hidden',
                className
              )}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />

              <div className="relative p-8">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', duration: 0.5 }}
                  className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 shadow-lg shadow-cyan-500/50"
                >
                  <Mail className="w-8 h-8 text-white" />
                </motion.div>

                {/* Sparkles */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute top-8 right-12"
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {title}
                  </h3>
                  <p className="text-gray-300 mb-6">{description}</p>
                </motion.div>

                {/* Form */}
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={placeholder}
                      className={cn(
                        'w-full px-4 py-3 rounded-lg',
                        'bg-gray-900/50 border border-gray-700',
                        'focus:outline-none focus:border-cyan-500',
                        'text-white placeholder-gray-500',
                        'transition-colors',
                        status === 'error' && 'border-red-500'
                      )}
                      disabled={status === 'loading' || hasSubmitted}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading' || hasSubmitted}
                    className={cn(
                      'w-full py-3 px-6 rounded-lg font-medium',
                      'bg-gradient-to-r from-cyan-500 to-purple-500',
                      'text-white',
                      'hover:opacity-90',
                      'disabled:opacity-50',
                      'transition-all',
                      'shadow-lg shadow-cyan-500/50',
                      'flex items-center justify-center gap-2'
                    )}
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Subscribing...
                      </>
                    ) : status === 'success' ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Subscribed!
                      </>
                    ) : (
                      buttonText
                    )}
                  </button>

                  {status === 'error' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm text-center"
                    >
                      Please enter a valid email address
                    </motion.p>
                  )}

                  <p className="text-xs text-gray-500 text-center">
                    No spam, unsubscribe anytime.
                  </p>
                </motion.form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default NewsletterPopup;
