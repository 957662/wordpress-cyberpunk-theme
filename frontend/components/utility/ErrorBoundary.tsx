'use client';

import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to error reporting service
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-cyber-dark p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
          >
            <div className="bg-gray-900 border border-cyber-pink/30 rounded-xl p-8 shadow-[0_0_40px_rgba(255,0,128,0.2)]">
              {/* Error icon */}
              <div className="w-16 h-16 rounded-full bg-cyber-pink/20 flex items-center justify-center mx-auto mb-6">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-cyber-pink"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-400 text-center mb-6">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>

              {/* Error details (in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-black/50 rounded-lg">
                  <p className="text-xs font-mono text-cyber-pink mb-2">
                    {this.state.error.toString()}
                  </p>
                  <pre className="text-xs font-mono text-gray-500 overflow-auto max-h-32">
                    {this.state.error.stack}
                  </pre>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.reload()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-bold rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all"
                >
                  Reload Page
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => (window.location.href = '/')}
                  className="w-full px-6 py-3 bg-gray-800 text-gray-300 font-bold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Go Home
                </motion.button>
              </div>

              {/* Support info */}
              <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                <p className="text-sm text-gray-500">
                  Need help?{' '}
                  <a href="mailto:support@cyberpress.com" className="text-cyber-cyan hover:text-cyber-cyan/80">
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for error handling
export function useErrorHandler() {
  return React.useCallback((error: Error) => {
    console.error('Error handled:', error);
    
    // Log to error reporting service
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error);
    }

    // Show error toast
    if (typeof window !== 'undefined' && (window as any).toast) {
      (window as any).toast.error(error.message);
    }
  }, []);
}
