// app/report-lost/page.tsx
import Image from 'next/image';

export default function ReportLost() {
  return (
    <div className="min-h-screen bg-white pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 text-pink-700">
          Report Lost
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Card 1 - Acoustic Guitar */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 hover:-translate-y-2 group">
            <div className="relative h-52 bg-gray-50 flex items-center justify-center p-6">
              <Image
                src="/images/guitar.jpg"
                alt="Acoustic Guitar"
                fill
                className="object-contain rounded-t-3xl transition duration-500 group-hover:scale-105"
              />
              {/* Small "Lost" badge */}
              <div className="absolute top-4 left-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                Lost
              </div>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-800 font-semibold text-lg">Acoustic Guitar</p>
            </div>
          </div>

          {/* Card 2 - Handheld Fan */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 hover:-translate-y-2 group">
            <div className="relative h-52 bg-gray-50 flex items-center justify-center p-6">
              <Image
                src="/images/fan.jpg"
                alt="Handheld Fan"
                fill
                className="object-contain rounded-t-3xl transition duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                Lost
              </div>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-800 font-semibold text-lg">Handheld Fan</p>
            </div>
          </div>

          {/* Card 3 - Computer Mouse */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 hover:-translate-y-2 group">
            <div className="relative h-52 bg-gray-50 flex items-center justify-center p-6">
              <Image
                src="/images/mouse.jpg"
                alt="Computer Mouse"
                fill
                className="object-contain rounded-t-3xl transition duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                Lost
              </div>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-800 font-semibold text-lg">Computer Mouse</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
        <a
        href="/lost"
         className="px-12 py-5 bg-green-500 hover:bg-green-600 text-white text-xl font-semibold rounded-full shadow-xl transition transform hover:scale-105"
        >
        View More Lost Items
      </a>
      </div>
      </div>
    </div>
  );
}
