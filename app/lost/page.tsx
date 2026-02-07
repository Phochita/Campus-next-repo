'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function AllLostItems() {
  const [lostItems, setLostItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('reportedItems');
    if (saved) {
      const all = JSON.parse(saved);
      const onlyLost = all.filter(item => item.type === 'lost');
      setLostItems(onlyLost);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 text-pink-700">
          All Lost Items ({lostItems.length})
        </h2>

        {lostItems.length === 0 ? (
          <p className="text-center text-gray-600 text-2xl">
            No lost items reported yet. Be the first to report one!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {lostItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 hover:-translate-y-2 group"
              >
                <div className="relative h-52 bg-gray-50 flex items-center justify-center p-6">
                  {item.photos?.[0] ? (
                    <Image
                      src={item.photos[0]}
                      alt={item.title}
                      fill
                      className="object-contain rounded-t-3xl transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <p className="text-gray-400">No photo uploaded</p>
                  )}
                  <div className="absolute top-4 left-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    Lost
                  </div>
                </div>
                <div className="p-6 text-center">
                  <p className="text-gray-800 font-semibold text-lg">{item.title}</p>
                  <p className="text-gray-600 text-sm mt-1">{item.location || 'Unknown location'}</p>
                  <p className="text-gray-500 text-sm mt-1">Date: {item.date || 'Unknown date'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
