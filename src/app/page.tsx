'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRecent = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/items/recent', { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to load');

        setRecentItems(data.items || []);
      } catch (err) {
        console.error('Fetch recent error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  // Filter items by search
  const filteredItems = recentItems.filter(item =>
    item.itemTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section>
        <div className="relative bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[#FFB9B9] mb-4">
              Campus Lost & Found
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-medium tracking-wide">
              <span style={{ color: '#72D093' }}>Where</span>{' '}
              <span style={{ color: '#A78D8D' }}>lost</span>{' '}
              <span style={{ color: '#A78D8D' }}>things</span>{' '}
              <span style={{ color: '#E680B3' }}>find</span>{' '}
              <span style={{ color: '#A78D8D' }}>their</span>{' '}
              <span style={{ color: '#A78D8D' }}>way</span>{' '}
              <span style={{ color: '#EB7DE9' }}>home</span>
            </p>
          </div>
        </div>

        {/* Real Recent Items + Search */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center mb-8 text-[#EB7DE9] drop-shadow-md">
            Recent Items
          </h2>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-4 pl-14 bg-white border border-gray-300 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
              />
              <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-600 text-lg py-10">Loading recent items...</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-gray-600 text-lg py-10">
              {search ? 'No items match your search' : 'No items reported yet. Be the first!'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => {
                const photos = Array.isArray(item.photos) ? item.photos : [];

                return (
                  <Link
                    key={item.id}
                    href={`/item/${item.id}`}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer block"
                  >
                    {photos.length > 0 ? (
                      <div className="relative overflow-hidden h-64">
                        <Image
                          src={photos[0]}
                          alt={item.itemTitle || 'Item photo'}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={false}
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder.jpg';
                            e.currentTarget.alt = 'Image failed to load';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                        No photo
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="font-bold text-xl text-gray-800 mb-1 group-hover:text-pink-600 transition-colors">
                        {item.itemTitle}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{item.location}</p>
                      <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {item.found === 'lost' ? 'Lost' : 'Found'} • {new Date(item.datePosted).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto px-4 pb-20 flex flex-col sm:flex-row gap-6 justify-center">
          <div className="flex gap-4 justify-center">
            <Link
              href="/report-item?type=lost"
              className="bg-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-pink-600 transition text-center"
            >
              I Lost Something
            </Link>
            <Link
              href="/report-item?type=found"
              className="bg-purple-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-purple-600 transition text-center"
            >
              I Found Something
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white py-12 border-t-4 border-purple-300">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
              <div className="flex items-center gap-4">
                <div className="relative w-15 h-15">
                  <Image
                    src="/images/logo.svg"
                    alt="Graduation Cap"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-16 md:gap-32 w-full md:w-auto">
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-bold text-purple-700 mb-4">RESOURCES</h3>
                  <ul className="space-y-3 text-gray-600 text-sm">
                    <li>Browse All Items</li>
                    <li>Report a Find</li>
                  </ul>
                </div>

                <div className="text-center md:text-left">
                  <h3 className="text-lg font-bold text-purple-700 mb-4">HELP</h3>
                  <ul className="space-y-3 text-gray-600 text-sm">
                    <li>Safety Tips</li>
                    <li>Contact Admin</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-purple-200 flex justify-center md:justify-end gap-8 text-purple-500">
              {/* Social icons */}
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}

