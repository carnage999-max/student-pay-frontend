import "./globals.css";

// export const metadata = {
//   description: "Welcome to StudentPay - Seamless payment and receipt generation for university departments and students. Secure. Simple. Fast.",
//   generator: 'Next.js',
//   title: 'Student Pay',
//   applicationName: 'Student Pay',
//   referrer: 'origin-when-cross-origin',
//   metadataBase: new URL("https://student-pay.sevalla.app"),
//   keywords: ['payment', 'receipt generation', 'university payments', 'departments', 'students', 'secure', 'simple', 'fast', 'StudentPay'],
//   authors: [{ name: 'Ezekiel Okebule', url: 'https://github.com/carnage999-max' },],
//   creator: 'Ezekiel Okebule(11011)',
//   publisher: '11011',
//   openGraph: {
//     title: 'Student Pay',
//     description: 'Seamless payment and receipt generation for university departments and students. Secure. Simple. Fast.',
//     url: 'https://student-pay.sevalla.app',
//     siteName: 'Student Pay',
//     images: [
//       {
//         url: 'https://student-pay.sevalla.app/opengraph-image.png',
//         width: 1200,
//         height: 630,
//         alt: 'Student Pay - Seamless payment and receipt generation for university departments and students.',
//       },
//     ],
//     locale: 'en_US',
//     type: 'website',
//   },
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Student Pay Platform</title>
        <meta name="description" content="StudentPay makes departmental payments simple and secure. Students can quickly pay their fees, while departments manage, track, and generate receipts with ease. Fast, mobile-friendly, and built for a seamless university experience." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#26a269" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@site" />
        <meta name="twitter:url" content="https://student-pay.sevalla.app" />
        <meta name="twitter:title" content="Student Pay Platform" />
        <meta name="twitter:description" content="StudentPay makes departmental payments simple and secure. Students can quickly pay their fees, while departments manage, track, and generate receipts with ease. Fast, mobile-friendly, and built for a seamless university experience." />
        <meta name="twitter:image" content="https://student-pay.sevalla.app/student-pay-logo.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Student Pay Platform" />
        <meta property="og:description" content="StudentPay makes departmental payments simple and secure. Students can quickly pay their fees, while departments manage, track, and generate receipts with ease. Fast, mobile-friendly, and built for a seamless university experience." />
        <meta property="og:site_name" content="Student Pay" />
        <meta property="og:url" content="https://student-pay.sevalla.app" />
        <meta property="og:image" content="https://student-pay.sevalla.app/student-pay-logo.jpg" />
        <link rel="preload" href="/manifest.json" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="stylesheet" href="/css/native-like-experience.css" />
        <script async src="https://unpkg.com/pwacompat" crossOrigin="anonymous"></script>
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-touch-icon_120.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon_180.png" />
      </head>
      <body>
        {children}

      </body>
    </html>
  );
}
