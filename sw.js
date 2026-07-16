// ============================================================
// Service Worker — 西藏支教 · 行李准备助手
// 基础离线缓存策略：Cache First（缓存优先）
// ============================================================

const CACHE_NAME = 'zjwzzb-v1';
const CACHE_URLS = [
  '.',
  'index.html',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
  'favicon.png',
  'manifest.webmanifest',
];

// ============================================================
// INSTALL — 预缓存核心资源
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing…');
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching core assets');
        return cache.addAll(CACHE_URLS).catch((err) => {
          // 单个资源失败不影响整体安装
          console.warn('[SW] Cache addAll partial failure:', err);
        });
      })
      .then(() => {
        console.log('[SW] Install complete — skipWaiting');
        return self.skipWaiting();
      })
  );
});

// ============================================================
// ACTIVATE — 清理旧缓存
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating…');
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => {
              console.log('[SW] Deleting old cache:', key);
              return caches.delete(key);
            })
        )
      )
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// ============================================================
// FETCH — 缓存优先，网络回退
// ============================================================
self.addEventListener('fetch', (event) => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  // 跳过 chrome-extension:// 等非 http(s) 请求
  const { protocol } = new URL(event.request.url);
  if (protocol !== 'http:' && protocol !== 'https:') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // 缓存命中 → 直接返回
      if (cached) return cached;

      // 缓存未命中 → 请求网络，成功后写入缓存
      return fetch(event.request)
        .then((response) => {
          // 只缓存成功的响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 克隆响应（body 只能读一次）
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });

          return response;
        })
        .catch(() => {
          // 网络失败 → 对于导航请求返回离线页面
          if (event.request.mode === 'navigate') {
            return caches.match('index.html');
          }
          // 对其他请求静默失败
          return new Response('', { status: 408 });
        });
    })
  );
});
