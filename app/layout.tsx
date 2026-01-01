import type { Metadata } from "next";
import { Inter, Geist_Mono, Xanh_Mono } from 'next/font/google';
import "./globals.css";

// Configure Inter
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-inter',
  display: 'swap',
});

// Configure Geist Mono
const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal'],
  variable: '--font-geist-mono',
  display: 'swap',
});

// Configure Xanh Mono
const xanhMono = Xanh_Mono({
  subsets: ['latin', 'vietnamese'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-xanh-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Jenny Li | Portfolio"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} ${xanhMono.variable}`}>
      <body className="m-0 p-0 overflow-hidden font-inter">
        {children}
      </body>
    </html>
  );
}
