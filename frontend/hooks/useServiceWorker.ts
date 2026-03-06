'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export interface ServiceWorkerStatus {
  supported: boolean;
  enabled: boolean;
  registered: boolean;
  activated: boolean;
  installing: boolean;
  waiting: boolean;
  controller: boolean;
  error: Error | null;
}

export interface ServiceWorkerUpdateOptions {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onWaiting?: (registration: ServiceWorkerRegistration) => void;
  onActive?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export function useServiceWorker(
  swUrl: string = '/sw.js',
  options: ServiceWorkerUpdateOptions = {}
): ServiceWorkerStatus & {
  update: () => Promise<void>;
  skipWaiting: () => Promise<void>;
  unregister: () => Promise<boolean>;
} {
  const { onUpdate, onWaiting, onActive, onSuccess, onError } = options;

  const [status, setStatus] = useState<ServiceWorkerStatus>({
    supported: false,
    enabled: false,
    registered: false,
    activated: false,
    installing: false,
    waiting: false,
    controller: false,
    error: null,
  });

  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const updateListenerRef = useRef<((e: Event) => void) | null>(null);
  const controllerListenerRef = useRef<((e: Event) => void) | null>(null);

  // Check support
  useEffect(() => {
    setStatus((prev) => ({
      ...prev,
      supported: 'serviceWorker' in navigator,
    }));
  }, []);

  // Register service worker
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    let mounted = true;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register(swUrl, {
          updateViaCache: 'all',
        });

        if (!mounted) return;

        registrationRef.current = registration;
        setStatus({
          supported: true,
          enabled: true,
          registered: true,
          activated: registration.active !== undefined,
          installing: registration.installing !== undefined,
          waiting: registration.waiting !== undefined,
          controller: navigator.serviceWorker.controller !== undefined,
          error: null,
        });

        onSuccess?.(registration);

        // Listen for updates
        if (registration.waiting) {
          onWaiting?.(registration);
        }

        updateListenerRef.current = (e: Event) => {
          const registration = e.target as ServiceWorkerRegistration;
          if (registration.waiting) {
            onWaiting?.(registration);
          }
          onUpdate?.(registration);
        };

        registration.addEventListener('updatefound', updateListenerRef.current);

        // Listen for controller changes
        controllerListenerRef.current = () => {
          setStatus((prev) => ({
            ...prev,
            controller: navigator.serviceWorker.controller !== undefined,
          }));
          onActive?.(registration);
        };

        navigator.serviceWorker.addEventListener('controllerchange', controllerListenerRef.current);
      } catch (error) {
        if (!mounted) return;

        const err = error as Error;
        setStatus((prev) => ({
          ...prev,
          error: err,
        }));
        onError?.(err);
      }
    };

    registerSW();

    return () => {
      mounted = false;

      if (updateListenerRef.current && registrationRef.current) {
        registrationRef.current.removeEventListener('updatefound', updateListenerRef.current);
      }

      if (controllerListenerRef.current) {
        navigator.serviceWorker.removeEventListener('controllerchange', controllerListenerRef.current);
      }
    };
  }, [swUrl, onUpdate, onWaiting, onActive, onSuccess, onError]);

  // Update service worker
  const update = useCallback(async () => {
    if (!registrationRef.current) {
      throw new Error('Service worker not registered');
    }

    await registrationRef.current.update();
  }, []);

  // Skip waiting
  const skipWaiting = useCallback(async () => {
    const registration = registrationRef.current;
    if (!registration || !registration.waiting) {
      throw new Error('No waiting service worker');
    }

    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    return new Promise<void>((resolve) => {
      const listener = () => {
        navigator.serviceWorker.removeEventListener('controllerchange', listener);
        resolve();
      };
      navigator.serviceWorker.addEventListener('controllerchange', listener);
    });
  }, []);

  // Unregister service worker
  const unregister = useCallback(async () => {
    const registration = registrationRef.current;
    if (!registration) {
      return false;
    }

    const unregistered = await registration.unregister();
    if (unregistered) {
      registrationRef.current = null;
      setStatus((prev) => ({
        ...prev,
        registered: false,
        activated: false,
      }));
    }

    return unregistered;
  }, []);

  return {
    ...status,
    update,
    skipWaiting,
    unregister,
  };
}

export interface ServiceWorkerMessage {
  type: string;
  data?: any;
}

export function useServiceWorkerMessage() {
  const [message, setMessage] = useState<ServiceWorkerMessage | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from same origin
      if (event.origin !== window.location.origin) {
        return;
      }

      setMessage(event.data);
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);

  const sendMessage = useCallback((message: ServiceWorkerMessage) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message);
    }
  }, []);

  return {
    message,
    sendMessage,
  };
}

export default useServiceWorker;
