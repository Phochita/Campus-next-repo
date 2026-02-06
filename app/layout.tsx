import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Lost & Found",
  description: "Campus Lost & Found — Help you recover your items back",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${GeistSans.variable} ${GeistMono.variable} antialiased
          bg-[#FFFFFF] text-[#AA9F9F] min-h-screen
        `}
      >
        {/* Top Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <Image
                    src="/images/logo.svg" // ← change if your logo path is different
                    alt="Campus L&F Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-[#AA9F9F]">Campus L&F</span>
              </div>

              {/* Center Links */}
              <div className="hidden md:flex items-center gap-14 text-lg font-bold tracking-wide">
                <a href="/" className="hover:text-pink-500 transition">Home</a>
                <a href="/report-lost" className="hover:text-pink-500 transition">Report Lost</a>
                <a href="/report-found" className="hover:text-pink-500 transition">Report Found</a>

              </div>

              {/* Right Icons + Sign In */}
              <div className="flex items-center gap-6">
                {/* Search bar with icon inside */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-48 md:w-64 pl-10 pr-4 py-2.5 bg-white border border-pink-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200 shadow-sm placeholder-gray-400"
                  />
                  {/* Magnifier icon */}
                  <svg
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Profile icon */}
                <a href="/profile" className="p-2 hover:text-pink-500 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
                </a>

                {/* Sign In button */}
                <a
                  href="/login"
                  className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-full transition shadow-sm"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content – pushed down because navbar is fixed */}
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
