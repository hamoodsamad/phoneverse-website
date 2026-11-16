import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/context/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CompareFloatingBar } from '@/components/common/CompareFloatingBar';

export const metadata: Metadata = {
  title: 'PhoneVerse 2026 - Pakistan Smartphone Discovery, Comparison & Price Tracker',
  description: 'AI-powered smartphone discovery, deep hardware comparisons, live Pakistani retail price tracking in PKR, and official PTA Approved e-commerce platform for 2026.',
  keywords: 'smartphones Pakistan, mobile prices in Pakistan, PKR phone prices, PTA approved, iPhone 16 Pro Max price in Pakistan, Samsung S25 Ultra Pakistan, smartphone comparison, AI recommendations',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#090d16',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col justify-between bg-dark-900 text-gray-100 selection:bg-emerald-500 selection:text-dark-900">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CompareFloatingBar />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
