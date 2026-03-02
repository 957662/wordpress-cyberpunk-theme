'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  toast('新版本可用，请刷新页面', {
                    icon: '🔄',
                    duration: 5000,
                    onClick: () => window.location.reload(),
                  });
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

export function useServiceWorker() {
  const [waitingServiceWorker, setWaitingServiceWorker] = useState<ServiceWorker | null>(null);
  const [showUpdateAvailable, setShowUpdateAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Listen for waiting service worker
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          setWaitingServiceWorker(registration.waiting);
          setShowUpdateAvailable(true);
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && registration.waiting) {
                setWaitingServiceWorker(registration.waiting);
                setShowUpdateAvailable(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const updateServiceWorker = () => {
    if (waitingServiceWorker) {
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    setShowUpdateAvailable(false);
  };

  return {
    showUpdateAvailable,
    updateServiceWorker,
  };
}

// Service Update Notification Component
export const ServiceWorkerUpdateNotification: React.FC = () => {
  const { showUpdateAvailable, updateServiceWorker } = useServiceWorker();

  if (!showUpdateAvailable) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-4 rounded-lg shadow-lg border border-cyan-400">
        <div className="flex items-center gap-4">
          <div>
            <p className="font-bold">新版本可用</p>
            <p className="text-sm opacity-90">点击更新以获得最新功能</p>
          </div>
          <button
            onClick={updateServiceWorker}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            更新
          </button>
        </div>
      </div>
    </div>
  );
};
