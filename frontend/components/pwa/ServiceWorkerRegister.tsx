'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export function ServiceWorkerRegister() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // 注册 Service Worker
      navigator.serviceWorker
        .register('/sw.js', {
          updateViaCache: 'none',
        })
        .then((reg) => {
          console.log('[SW] Service Worker registered:', reg);
          setRegistration(reg);

          // 检查更新
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // 有新版本可用
                  setUpdateAvailable(true);
                  setWaitingWorker(newWorker);
                  toast.success('发现新版本，点击更新！', {
                    duration: 5000,
                    icon: '🚀',
                  });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[SW] Service Worker registration failed:', error);
        });

      // 监听 Service Worker 控制变化
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      return () => {
        // 清理
      };
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return (
    <>
      {updateAvailable && (
        <div className="fixed bottom-20 right-4 z-50">
          <button
            onClick={handleUpdate}
            className="px-4 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-medium rounded-lg shadow-lg hover:opacity-90 transition-opacity"
          >
            🚀 更新应用
          </button>
        </div>
      )}
    </>
  );
}

// Service Worker 更新 Hook
export function useServiceWorkerUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
                setWaitingWorker(newWorker);
              }
            });
          }
        });
      });
    }
  }, []);

  const update = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return { updateAvailable, update };
}
