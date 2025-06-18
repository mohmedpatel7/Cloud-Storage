import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ReduxProvider from "@/Redux/Provider/provider";
import Sidebar from "@/components/common/Sidebar";
import { ToastProvider } from "@/components/common/ToastProivder";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cloud Storage",
  description: "Cloud Storage for Data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <ReduxProvider>
            <div className="flex">
              {/* Fixed Sidebar */}
              <Sidebar />

              {/* Main content with left margin = sidebar width */}
              <div className="ml-0 lg:ml-64 w-full min-h-screen bg-gray-50 p-6">
                <ToastProvider>{children}</ToastProvider>
              </div>
            </div>
          </ReduxProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
