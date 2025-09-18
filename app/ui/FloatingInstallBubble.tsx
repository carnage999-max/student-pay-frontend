'use client';

import { useState, useEffect } from 'react';
import { Download, X, Share, Plus, Smartphone } from 'lucide-react';

export default function FloatingInstallBubble() {
    const [showBubble, setShowBubble] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone;

            setIsIOS(iOS);
            setIsInstalled(standalone);

            // Show bubble if not installed and not dismissed recently
            if (!standalone && !getBubbleDismissed()) {
                setTimeout(() => setShowBubble(true), 10000);
            }
        };

        checkDevice();
    }, []);

    const getBubbleDismissed = () => {
        const dismissed = localStorage.getItem('install-bubble-dismissed');
        if (!dismissed) return false;

        const dismissedTime = parseInt(dismissed);
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        return Date.now() - dismissedTime < oneWeek;
    };

    const dismissBubble = () => {
        setShowBubble(false);
        localStorage.setItem('install-bubble-dismissed', Date.now().toString());
    };

    if (isInstalled || !showBubble) return null;

    return (
        <>
            {/* Floating Bubble */}
            <div className="fixed bottom-6 right-6 z-40">
                <div className="relative">
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group animate-bounce"
                        title="Install StudentPay"
                    >
                        <Download className="w-6 h-6" />
                    </button>

                    {/* Close button on bubble */}
                    <button
                        onClick={dismissBubble}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Installation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Smartphone className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Install StudentPay</h3>
                                    <p className="text-sm text-gray-500">Get the app experience</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {isIOS ? (
                                // iOS Instructions
                                <div className="space-y-4">
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Install StudentPay on your iPhone for faster access and a better mobile experience.
                                    </p>

                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-blue-800 font-medium">Tap Share</span>
                                                    <Share className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <p className="text-sm text-blue-700">Look for the share button in Safari</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-emerald-800 font-medium">Add to Home Screen</span>
                                                    <Plus className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <p className="text-sm text-emerald-700">Scroll down to find this option</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                                            <div className="flex-1">
                                                <span className="text-purple-800 font-medium">Tap "Add"</span>
                                                <p className="text-sm text-purple-700 mt-1">StudentPay will appear on your home screen</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Android/Desktop
                                <div className="space-y-4">
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Your browser should show an install prompt soon, or you can install StudentPay manually through your browser settings.
                                    </p>

                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                        <h4 className="font-medium text-emerald-800 mb-2">Look for:</h4>
                                        <ul className="text-sm text-emerald-700 space-y-1">
                                            <li>• "Install" button in the address bar</li>
                                            <li>• Browser menu → "Install StudentPay"</li>
                                            <li>• "Add to Home Screen" option</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Benefits */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-3">Benefits of installing:</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                    <div>• Faster loading</div>
                                    <div>• Offline access</div>
                                    <div>• App-like experience</div>
                                    <div>• Easy home screen access</div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                            >
                                {isIOS ? "I'll add it now" : "Got it"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}