import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="description"
          content="Welcome to StudentPay - Seamless payment and receipt generation for university departments and students. Secure. Simple. Fast."
        />
        <meta
          name="keywords"
          content="payment receipt generation, university payments, student payments, department management"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
