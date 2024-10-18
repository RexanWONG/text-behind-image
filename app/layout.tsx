import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google'
import "./globals.css";
import SupabaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Background Magics | Make Designs with AI",
  description: "Create stunning text behind image, gradient background designs with Background Magics. Easy-to-use tool for unique visual content.",
  keywords: "background magics, text behind image, gradient background, gradient behind image, image design, graphic design, visual content creation",
  openGraph: {
    title: "Background Magics | Create Text Behind Image Designs",
    description: "Create stunning text behind image designs with Background Magic. Easy-to-use tool for unique visual content.",
    type: "website",
    url: "https://www.bgmagics.com", // Replace with your actual URL
    images: [
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
            <UserProvider>
              <div>
                {children}
                <Analytics />
                <SpeedInsights />
                <Toaster />
              </div>
            </UserProvider>
        </SupabaseProvider>
        
      </body>
    </html>
  );
}
