// CyberPress PWA Service Worker
// 版本: 1.0.0
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `cyberpress-${CACHE_VERSION}`;

// 需要缓存的静态资源
const STATIC_CACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// 需要缓存的路由
const ROUTE_CACHE_URLS = [
  '/blog',
  '/about',
  '/portfolio',
  '/contact',
];

// API 缓存策略配置
const API_CACHE_CONFIG = {
  maxEntries: 50,
  maxAgeSeconds: 300, // 5分钟
};

// 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );
  self.skipWaiting();
});

// 网络请求拦截
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非 HTTP(S) 请求
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 跳过 chrome-extension 等协议
  if (url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // API 请求 - Network First 策略
  if (url.pathname.startsWith('/api')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // 静态资源 - Cache First 策略
  if (/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/.test(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // 页面请求 - Network First 策略，失败则返回离线页面
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirstStrategy(request).catch(() => {
        return caches.match('/offline');
      })
    );
    return;
  }

  // 其他请求 - Network First 策略
  event.respondWith(networkFirstStrategy(request));
});

// Cache First 策略
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache First error:', error);
    throw error;
  }
}

// Network First 策略
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('[SW] Network First error:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate 策略
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// 消息监听
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        return self.clients.matchAll();
      }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'CACHE_CLEARED',
          });
        });
      })
    );
  }

  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then((size) => {
      event.ports[0].postMessage({ size });
    });
  }
});

// 获取缓存大小
async function getCacheSize() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  let totalSize = 0;

  for (const request of keys) {
    const response = await cache.match(request);
    if (response) {
      const blob = await response.blob();
      totalSize += blob.size;
    }
  }

  return totalSize;
}

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
});

// 同步文章
async function syncPosts() {
  // 从 IndexedDB 获取离线时保存的文章
  // 然后在有网络时发送到服务器
  try {
    const db = await openDB();
    const posts = await db.getAll('offline-posts');

    for (const post of posts) {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      await db.delete('offline-posts', post.id);
    }
  } catch (error) {
    console.error('[SW] Sync error:', error);
  }
}

// 推送通知
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '您有新的通知',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: '查看详情',
        icon: '/icons/action-explore.png',
      },
      {
        action: 'close',
        title: '关闭',
        icon: '/icons/action-close.png',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('CyberPress', options)
  );
});

// 通知点击处理
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// IndexedDB 辅助函数
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('cyberpress-offline', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offline-posts')) {
        db.createObjectStore('offline-posts', { keyPath: 'id' });
      }
    };
  });
}

console.log('[SW] CyberPress Service Worker initialized');
