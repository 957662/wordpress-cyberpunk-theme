'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (typeof window !== 'undefined' && 'navigator' in window) {
      const checkInstalled = () => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isInStandaloneMode = (window as any).navigator.standalone === true;
        const isInDisplayMode = window.matchMedia('(display-mode: standalone)').matches;
        
        return isInStandaloneMode || isInDisplayMode;
      };

      setIsInstalled(checkInstalled());

      // Listen for display mode changes
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      const handleDisplayModeChange = () => setIsInstalled(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleDisplayModeChange);

      return () => {
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      };
    }
  }, []);

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowPrompt(false);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Check if prompt was dismissed
  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
    if (dismissed && deferredPrompt) {
      setShowPrompt(false);
    }
  }, [deferredPrompt]);

  if (isInstalled || !deferredPrompt || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-cyber-dark/95 backdrop-blur-sm border border-cyber-cyan/30 rounded-lg p-4 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <div className="flex items-start gap-3">
              {/* App icon */}
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">CP</span>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white mb-1">Install CyberPress</h3>
                <p className="text-xs text-gray-400 mb-3">
                  Install our app for the best experience with offline access and push notifications.
                </p>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInstall}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white text-xs font-bold rounded-lg shadow-[0_0_10px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all"
                  >
                    Install Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDismiss}
                    className="px-4 py-2 bg-gray-800 text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Later
                  </motion.button>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// IOS Install instructions
export function IOSInstallInstructions() {
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = (window as any).navigator.standalone === true;
    const wasShown = localStorage.getItem('ios-install-instructions-shown');

    if (isIOS && !isStandalone && !wasShown) {
      // Show after 5 seconds
      const timer = setTimeout(() => {
        setShowInstructions(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowInstructions(false);
    localStorage.setItem('ios-install-instructions-shown', 'true');
  };

  if (!showInstructions) return null;

  return (
    <AnimatePresence>
      {showInstructions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-cyber-dark border border-cyber-cyan/30 rounded-2xl p-6 max-w-md w-full shadow-[0_0_40px_rgba(0,240,255,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-white">CP</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Install CyberPress</h3>
              <p className="text-sm text-gray-400">
                Install this app on your iPhone for the best experience
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyber-cyan/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyber-cyan text-sm font-bold">1</span>
                </div>
                <p className="text-sm text-gray-300">
                  Tap the <span className="text-cyber-cyan font-bold">Share</span> button
                  <svg className="inline-block w-5 h-5 mx-1 text-cyber-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  in Safari's toolbar
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyber-purple/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyber-purple text-sm font-bold">2</span>
                </div>
                <p className="text-sm text-gray-300">
                  Scroll down and tap <span className="text-cyber-purple font-bold">"Add to Home Screen"</span>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyber-pink/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyber-pink text-sm font-bold">3</span>
                </div>
                <p className="text-sm text-gray-300">
                  Tap <span className="text-cyber-pink font-bold">"Add"</span> to install the app
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDismiss}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-bold rounded-lg shadow-[0_0_10px_rgba(0,240,255,0.3)]"
            >
              Got it!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
