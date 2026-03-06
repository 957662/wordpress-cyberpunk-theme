/**
 * CyberPress Platform - Enhanced Service Worker
 * PWA支持、离线缓存、推送通知
 */

const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `cyberpress-${CACHE_VERSION}`;

// 静态资源缓存列表
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// API缓存配置
const API_CACHE_CONFIG = {
  timeout: 5 * 60 * 1000, // 5分钟
  maxEntries: 100, // 最多缓存100个API响应
};

// 安装事件
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing ${CACHE_VERSION}...`);

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );

  // 立即激活新的Service Worker
  self.skipWaiting();
});

// 激活事件
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating ${CACHE_VERSION}...`);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('cyberpress-')) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // 立即控制所有客户端
  return self.clients.claim();
});

// 请求拦截
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非HTTP请求
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API请求 - 网络优先
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // 静态资源 - 缓存优先
  if (request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'image') {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // 导航请求 - 网络优先
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // 默认 - 网络优先
  event.respondWith(handleDefaultRequest(request));
});

// API请求处理
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      // 添加缓存时间戳
      const responseWithTimestamp = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...response.headers,
          'sw-cache-time': Date.now().toString(),
        },
      });
      cache.put(request, responseWithTimestamp.clone());
    }

    return response;
  } catch (error) {
    console.log('[SW] API request failed, trying cache:', request.url);

    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response(JSON.stringify({
      error: 'Offline',
      message: '无法连接到服务器',
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// 静态资源处理
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // 后台更新
    fetch(request).then((response) => {
      if (response.ok) {
        const cache = caches.open(CACHE_NAME);
        cache.put(request, response);
      }
    });

    return cachedResponse;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[SW] Static request failed:', request.url);
    throw error;
  }
}

// 导航请求处理
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[SW] Navigation request failed, trying cache');

    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const offlineResponse = await caches.match('/offline');

    if (offlineResponse) {
      return offlineResponse;
    }

    return new Response('离线页面不可用', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// 默认请求处理
async function handleDefaultRequest(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// 推送通知
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');

  let data = {
    title: '新通知',
    body: '您有新的消息',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (error) {
      console.error('[SW] Failed to parse push data');
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
      timestamp: Date.now(),
    },
    actions: [
      { action: 'view', title: '查看', icon: '/icons/view.png' },
      { action: 'close', title: '关闭', icon: '/icons/close.png' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 通知点击
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// 后台同步
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }

  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncPosts() {
  try {
    console.log('[SW] Syncing posts...');
    // 实现数据同步逻辑
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

async function syncAnalytics() {
  try {
    console.log('[SW] Syncing analytics...');
    // 实现分析数据同步
  } catch (error) {
    console.error('[SW] Analytics sync failed:', error);
  }
}

// 消息处理
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data?.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }

  if (event.data?.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('[SW] Cache cleared');
        event.ports[0].postMessage({ success: true });
      })
    );
  }

  if (event.data?.type === 'GET_CACHE_SIZE') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.keys().then((keys) => {
          event.ports[0].postMessage({ size: keys.length });
        });
      })
    );
  }
});

// 定期清理缓存
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync:', event.tag);

  if (event.tag === 'cleanup-cache') {
    event.waitUntil(cleanupCache());
  }
});

async function cleanupCache() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    const now = Date.now();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30天

    for (const request of requests) {
      const response = await cache.match(request);
      const cacheTime = parseInt(response.headers.get('sw-cache-time') || '0');

      if (now - cacheTime > maxAge) {
        await cache.delete(request);
        console.log('[SW] Deleted expired cache:', request.url);
      }
    }
  } catch (error) {
    console.error('[SW] Cache cleanup failed:', error);
  }
}

console.log(`[SW] Service Worker ${CACHE_VERSION} loaded`);
