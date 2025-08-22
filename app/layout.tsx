import "./globals.css";

export const metadata = {
  description: "Welcome to StudentPay - Seamless payment and receipt generation for university departments and students. Secure. Simple. Fast.",
  generator: 'Next.js',
  title: 'Student Pay',
  applicationName: 'Student Pay',
  referrer: 'origin-when-cross-origin',
  keywords: ['payment', 'receipt generation', 'university payments', 'departments', 'students', 'secure', 'simple', 'fast', 'StudentPay'],
  authors: [{ name: 'Ezekiel Okebule' , url: 'https://github.com/carnage999-max'},],
  creator: 'Ezekiel Okebule(11011)',
  publisher: '11011',
  openGraph: {
    title: 'Student Pay',
    description: 'Seamless payment and receipt generation for university departments and students. Secure. Simple. Fast.',
    url: 'https://student-pay.sevalla.app',
    siteName: 'Student Pay',
    images: [
      {
        url: '/images/og-img.png',
        width: 1200,
        height: 630,
        alt: 'Student Pay - Seamless payment and receipt generation for university departments and students.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
