// CyberPress Service Worker
// Version: 1.0.0
// Description: PWA Service Worker for offline functionality and caching

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `cyberpress-${CACHE_VERSION}`;

// 需要缓存的静态资源
const STATIC_CACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
];

// 需要缓存的 API 路由
const API_CACHE_URLS = [
  '/api/posts',
  '/api/categories',
  '/api/tags',
];

// 缓存策略
const CACHE_STRATEGIES = {
  // 网络优先，失败则使用缓存
  networkFirst: async (request, cache) => {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  },

  // 缓存优先，失败则请求网络
  cacheFirst: async (request, cache) => {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  },

  // 仅网络
  networkOnly: async (request) => {
    return await fetch(request);
  },

  // 仅缓存
  cacheOnly: async (request, cache) => {
    const cachedResponse = await cache.match(request);
    if (!cachedResponse) {
      throw new Error('No cached response available');
    }
    return cachedResponse;
  },

  // 网络优先，同时更新缓存（Stale While Revalidate）
  staleWhileRevalidate: async (request, cache) => {
    const cachedResponse = await cache.match(request);
    const fetchPromise = fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    });
    return cachedResponse || fetchPromise;
  },
};

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...', event);

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[SW] Caching static assets...');
      await cache.addAll(STATIC_CACHE_URLS);
      console.log('[SW] Static assets cached');

      // 立即激活新的 service worker
      await self.skipWaiting();
    })()
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...', event);

  event.waitUntil(
    (async () => {
      // 清理旧版本缓存
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith('cyberpress-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );

      // 立即控制所有客户端
      await self.clients.claim();
      console.log('[SW] Service worker activated');
    })()
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 只处理同源请求
  if (url.origin !== self.location.origin) {
    return;
  }

  // 跳过 Chrome 扩展和其他非 http(s) 协议
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // 静态资源 - 缓存优先
      if (
        request.destination === 'image' ||
        request.destination === 'font' ||
        request.destination === 'style' ||
        request.destination === 'script' ||
        url.pathname.startsWith('/static/')
      ) {
        return CACHE_STRATEGIES.cacheFirst(request, cache);
      }

      // API 路由 - 网络优先
      if (url.pathname.startsWith('/api/')) {
        return CACHE_STRATEGIES.networkFirst(request, cache);
      }

      // 页面导航 - 网络优先，失败则返回离线页面
      if (request.mode === 'navigate') {
        try {
          return await CACHE_STRATEGIES.networkFirst(request, cache);
        } catch (error) {
          console.log('[SW] Network failed, returning offline page');
          return await cache.match('/offline');
        }
      }

      // 其他请求 - 网络优先
      return CACHE_STRATEGIES.staleWhileRevalidate(request, cache);
    })()
  );
});

// 消息处理
self.addEventListener('message', (event) => {
  const { data } = event;

  switch (data.type) {
    case 'SKIP_WAITING':
      console.log('[SW] Skip waiting requested');
      self.skipWaiting();
      break;

    case 'CACHE_URLS':
      console.log('[SW] Cache URLs requested:', data.urls);
      event.waitUntil(
        (async () => {
          const cache = await caches.open(CACHE_NAME);
          await cache.addAll(data.urls);
          event.ports[0].postMessage({ success: true });
        })()
      );
      break;

    case 'CLEAR_CACHE':
      console.log('[SW] Clear cache requested');
      event.waitUntil(
        (async () => {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map((name) => caches.delete(name)));
          event.ports[0].postMessage({ success: true });
        })()
      );
      break;

    case 'GET_CACHE_SIZE':
      event.waitUntil(
        (async () => {
          const cache = await caches.open(CACHE_NAME);
          const keys = await cache.keys();
          let size = 0;
          for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
              const blob = await response.blob();
              size += blob.size;
            }
          }
          event.ports[0].postMessage({ size });
        })()
      );
      break;

    default:
      console.warn('[SW] Unknown message type:', data.type);
  }
});

// 后台同步（可选）
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-posts') {
    event.waitUntil(
      (async () => {
        try {
          // 同步文章数据
          await fetch('/api/sync/posts', { method: 'POST' });
          console.log('[SW] Posts synced successfully');
        } catch (error) {
          console.error('[SW] Sync failed:', error);
        }
      })()
    );
  }
});

// 推送通知（可选）
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  let data = {
    title: 'CyberPress',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (error) {
      console.error('[SW] Failed to parse push data:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/',
      },
    })
  );
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// 定期清理缓存（每24小时）
setInterval(async () => {
  try {
    const cacheNames = await caches.keys();
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const cacheTime = parseInt(response.headers.get('sw-cache-time') || '0');
          if (now - cacheTime > maxAge) {
            await cache.delete(request);
            console.log('[SW] Expired cache deleted:', request.url);
          }
        }
      }
    }
  } catch (error) {
    console.error('[SW] Cache cleanup failed:', error);
  }
}, 60 * 60 * 1000); // Run every hour

console.log('[SW] Service worker script loaded');
