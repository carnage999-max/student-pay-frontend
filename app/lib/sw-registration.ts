export const registerServiceWorker = async () => {
    if (typeof window === 'undefined') return;

    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('Service Worker registered:', registration);

            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            if (confirm('A new version of StudentPay is available. Refresh to update?')) {
                                window.location.reload();
                            }
                        }
                    });
                }
            });

            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
};