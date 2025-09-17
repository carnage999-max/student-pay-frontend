// public/sw.js
const CACHE_NAME = 'studentpay-v1';
const STATIC_CACHE = 'studentpay-static-v1';
const DYNAMIC_CACHE = 'studentpay-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/icons/icon-512.png',
    '/offline',
    // Add your main CSS and JS bundles here
    '/_next/static/css/app.css', // Adjust path as needed
    '/_next/static/chunks/main.js' // Adjust path as needed
];

// Routes that should work offline
const CACHED_ROUTES = [
    '/',
    '/department/login',
    '/department/signup',
    '/department/verification-pending',
    '/verify-receipt',
    '/payment'
];

// API endpoints to cache with different strategies
const API_CACHE_ROUTES = {
    // Cache for 5 minutes
    short: ['/api/dashboard-stats', '/api/recent-payments'],
    // Cache for 1 hour
    medium: ['/api/banks', '/api/department-info'],
    // Cache for 24 hours
    long: ['/api/static-data']
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Failed to cache static assets:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle different types of requests
    if (url.pathname.startsWith('/api/')) {
        // API requests - use network first with cache fallback
        event.respondWith(handleApiRequest(request));
    } else if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico)$/)) {
        // Static assets - cache first
        event.respondWith(handleStaticAssets(request));
    } else {
        // Pages - network first with offline fallback
        event.respondWith(handlePageRequest(request));
    }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
    const url = new URL(request.url);
    const cacheName = DYNAMIC_CACHE;

    try {
        // Try network first
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        // Network failed, try cache
        console.log('Network failed, trying cache for:', url.pathname);
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline API response
        return new Response(
            JSON.stringify({
                error: 'Offline',
                message: 'This feature requires an internet connection'
            }),
            {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Handle static assets with cache-first strategy
async function handleStaticAssets(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('Failed to fetch static asset:', request.url);
        return new Response('', { status: 404 });
    }
}

// Handle page requests with network-first strategy
async function handlePageRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            // Cache successful page responses
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }
    } catch (error) {
        console.log('Network failed for page:', request.url);
    }

    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
        const offlinePage = await caches.match('/offline');
        if (offlinePage) {
            return offlinePage;
        }

        // Fallback offline response
        return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>StudentPay - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              text-align: center; 
              padding: 2rem;
              background: #f0fdf4;
              color: #065f46;
            }
            .container { max-width: 400px; margin: 0 auto; }
            .icon { font-size: 4rem; margin-bottom: 1rem; }
            h1 { color: #059669; margin-bottom: 1rem; }
            button {
              background: #059669;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              font-size: 1rem;
              cursor: pointer;
              margin-top: 1rem;
            }
            button:hover { background: #047857; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">📱</div>
            <h1>You're Offline</h1>
            <p>StudentPay requires an internet connection for this feature.</p>
            <p>Please check your connection and try again.</p>
            <button onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>
    `, {
            headers: { 'Content-Type': 'text/html' }
        });
    }

    return new Response('', { status: 404 });
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(processOfflineActions());
    }
});

// Process offline actions when connection is restored
async function processOfflineActions() {
    // Handle offline form submissions stored in IndexedDB
    console.log('Processing offline actions...');
    // Implementation depends on your offline storage strategy
}

// Push notifications (for future payment confirmations)
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/'
        },
        actions: [
            {
                action: 'view',
                title: 'View Details'
            },
            {
                action: 'dismiss',
                title: 'Dismiss'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'view') {
        const url = event.notification.data?.url || '/';
        event.waitUntil(
            clients.openWindow(url)
        );
    }
});