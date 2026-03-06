'use client';

import { useEffect, useState } from 'react';

interface ServiceWorkerProps {
  scriptUrl?: string;
  enableInDev?: boolean;
}

export function ServiceWorkerRegister({
  scriptUrl = '/sw.js',
  enableInDev = false,
}: ServiceWorkerProps) {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const isDev = process.env.NODE_ENV === 'development';
    if (isDev && !enableInDev) {
      return;
    }

    registerServiceWorker();

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [scriptUrl, enableInDev]);

  const registerServiceWorker = async () => {
    try {
      const reg = await navigator.serviceWorker.register(scriptUrl);
      console.log('[SW] Service Worker registered:', reg);
      setRegistration(reg);

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        }
      });
    } catch (error) {
      console.error('[SW] Registration failed:', error);
    }
  };

  const updateServiceWorker = () => {
    if (!registration) return;
    registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  };

  return (
    <>
      {updateAvailable && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          <div className="bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-lg shadow-2xl p-4 border-2 border-cyber-pink">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="text-white font-bold mb-1">New Version Available</h4>
                <p className="text-cyber-dark text-sm mb-3">
                  A new version of CyberPress is ready.
                </p>
                <button
                  onClick={updateServiceWorker}
                  className="bg-white text-cyber-purple px-4 py-2 rounded-lg font-semibold"
                >
                  Update Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOffline && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <span className="font-semibold">You are currently offline</span>
          </div>
        </div>
      )}
    </>
  );
}

export default ServiceWorkerRegister;
