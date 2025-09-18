// public/sw.js
const CACHE_NAME = 'studentpay-static-v1';

// Only cache static assets - no pages or API routes
const STATIC_ASSETS = [
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/apple-touch-icon_120.png',
    '/icons/apple-touch-icon_180.png',
    '/student-pay-logo.jpg'
];

// Critical routes that should NEVER be cached or intercepted
const PAYMENT_ROUTES = [
    '/payment/pay/success',
    '/payment/pay/callback',
    '/verify-receipt'
];

// Query parameters that indicate payment callbacks
const PAYMENT_PARAMS = ['trxref', 'reference', 'status'];

// Install event - cache only static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static assets');
                // Only cache assets that exist
                return Promise.allSettled(
                    STATIC_ASSETS.map(asset => cache.add(asset))
                );
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
                        if (cacheName !== CACHE_NAME) {
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

// Fetch event - minimal interception
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests entirely
    if (request.method !== 'GET') {
        return;
    }

    // NEVER intercept payment-related routes
    if (isPaymentRelatedRequest(url, request)) {
        console.log('Skipping payment route:', url.pathname);
        return; // Let the browser handle it normally
    }

    // NEVER intercept API calls
    if (url.pathname.startsWith('/api/') || url.pathname.includes('api')) {
        console.log('Skipping API route:', url.pathname);
        return;
    }

    // NEVER intercept navigation requests (pages)
    if (request.mode === 'navigate') {
        console.log('Skipping navigation request:', url.pathname);
        return;
    }

    // Only handle static assets
    if (isStaticAsset(url.pathname)) {
        event.respondWith(handleStaticAsset(request));
    }
});

// Check if request is payment-related
function isPaymentRelatedRequest(url, request) {
    // Check pathname
    for (const route of PAYMENT_ROUTES) {
        if (url.pathname.includes(route)) {
            return true;
        }
    }

    // Check query parameters
    for (const param of PAYMENT_PARAMS) {
        if (url.searchParams.has(param)) {
            return true;
        }
    }

    // Check if it's from Paystack domain or external redirect
    if (request.referrer && request.referrer.includes('paystack')) {
        return true;
    }

    return false;
}

// Check if it's a static asset we want to cache
function isStaticAsset(pathname) {
    const extensions = ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.webp'];
    return extensions.some(ext => pathname.endsWith(ext)) ||
        pathname === '/manifest.json';
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('Serving from cache:', request.url);
            return cachedResponse;
        }

        // If not in cache, fetch from network
        console.log('Fetching from network:', request.url);
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('Failed to fetch static asset:', request.url, error);
        // Return empty response instead of throwing
        return new Response('', { status: 404 });
    }
}