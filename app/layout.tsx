'use client';

import "./globals.css";
import { registerServiceWorker } from '@/app/lib/sw-registration';
import { useEffect } from 'react';
import FloatingInstallBubble from './ui/FloatingInstallBubble';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    registerServiceWorker();
  }, []);
  return (
    <html lang="en">
      <head>
        <title>Student Pay Platform</title>
        <meta name="description" content="StudentPay makes departmental payments simple and secure. Students can quickly pay their fees, while departments manage, track, and generate receipts with ease. Fast, mobile-friendly, and built for a seamless university experience." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@site" />
        <meta name="twitter:url" content="https://student-pay.sevalla.app" />
        <meta name="twitter:title" content="Student Pay Platform" />
        <meta name="twitter:description" content="StudentPay makes departmental payments simple and secure. Students can quickly pay their fees, while departments manage, track, and generate receipts with ease. Fast, mobile-friendly, and built for a seamless university experience." />
        <meta name="twitter:image" content="https://student-pay.sevalla.app/apple-icon.png" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Student Pay Platform" />
        <meta property="og:description" content="StudentPay makes departmental payments simple and secure. Students can quickly pay their fees, while departments manage, track, and generate receipts with ease. Fast, mobile-friendly, and built for a seamless university experience." />
        <meta property="og:site_name" content="Student Pay" />
        <meta property="og:url" content="https://student-pay.sevalla.app" />
        <meta property="og:image" content="https://student-pay.sevalla.app/student-pay-logo.png" />
        <link rel="preload" href="/manifest.json" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
        <script async src="https://unpkg.com/pwacompat" crossOrigin="anonymous"></script>
        <link rel="apple-touch-icon" href="/icons/apple-icon.png" />
        <meta name="application-name" content="StudentPay" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="StudentPay" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#059669" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body>
        {children}
        <FloatingInstallBubble />
      </body>
    </html>
  );
}
