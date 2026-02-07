'use client';

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import "./globals.css";

// Search Bar Component
function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'lost', 'found'

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setActiveTab('all');
      return;
    }

    const saved = localStorage.getItem('reportedItems');
    if (!saved) return;

    const allItems = JSON.parse(saved);
    const query = searchQuery.toLowerCase().trim().replace(/\s+/g, ' ');

    const filtered = allItems.filter(item => {
      const text = [
        (item.title || '').toLowerCase(),
        (item.description || '').toLowerCase(),
        (item.location || '').toLowerCase()
      ].join(' ');

      return text.includes(query);
    });

    setResults(filtered);
  }, [searchQuery]);

  const filteredResults = results.filter(item => {
    if (activeTab === 'lost') return item.type === 'lost';
    if (activeTab === 'found') return item.type === 'found';
    return true; // 'all'
  });

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-48 md:w-64 pl-10 pr-4 py-2.5 bg-white border border-pink-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200 shadow-sm placeholder-gray-400"
      />
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      {searchQuery.trim() && (
        <div className="absolute top-full left-0 w-full bg-white rounded-b-xl shadow-lg mt-1 max-h-96 overflow-y-auto z-50 border border-pink-200">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'all' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-600 hover:text-pink-500'}`}
            >
              All ({results.length})
            </button>
            <button
              onClick={() => setActiveTab('lost')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'lost' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-600 hover:text-pink-500'}`}
            >
              Lost ({results.filter(i => i.type === 'lost').length})
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'found' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-600 hover:text-pink-500'}`}
            >
              Found ({results.filter(i => i.type === 'found').length})
            </button>
          </div>

          {/* Results */}
          {filteredResults.length === 0 ? (
            <div className="p-6 text-gray-500 text-center">
              No {activeTab === 'lost' ? 'lost' : activeTab === 'found' ? 'found' : ''} items match "{searchQuery}"
            </div>
          ) : (
            <div className="p-2">
              {filteredResults.map(item => (
                <Link
                  key={item.id}
                  href={`/items/${item.id}`}
                  className="flex items-center gap-4 p-3 hover:bg-pink-50 rounded-lg transition"
                  onClick={() => setSearchQuery('')}
                >
                  {item.photos?.[0] ? (
                    <Image
                      src={item.photos[0]}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400">
                      No photo
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{item.title || 'Untitled'}</p>
                    <p className="text-sm text-gray-600">{item.location || 'Unknown'} • {item.type === 'lost' ? 'Lost' : 'Found'}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-pink-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <Image
                    src="/images/logo.svg"
                    alt="Campus L&F Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-[#AA9F9F]">Campus L&F</span>
              </div>

              {/* Links */}
              <div className="hidden md:flex items-center gap-14 text-lg font-bold tracking-wide">
                <Link href="/" className="hover:text-pink-500 transition">Home</Link>
                <Link href="/report-lost" className="hover:text-pink-500 transition">Report Lost</Link>
                <Link href="/report-found" className="hover:text-purple-500 transition">Report Found</Link>
              </div>

              {/* Right: Search + Profile + Sign In */}
              <div className="flex items-center gap-6">
                <SearchBar />

                <Link href="/profile" className="p-2 hover:text-pink-500 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>

                <Link
                  href="/login"
                  className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-full transition shadow-sm"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
