// app/report-found/page.tsx
import Image from 'next/image';

export default function ReportFound() {
  return (
    <div className="min-h-screen bg-white pt-20 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 text-purple-700">
          Report Found
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Card 1 - Book */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 hover:-translate-y-2 group">
            <div className="relative h-52 bg-gray-50 flex items-center justify-center p-6">
              <Image
                src="/images/book.jpg"
                alt="Book"
                fill
                className="object-contain rounded-t-3xl"
              />
              <div className="absolute top-4 left-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                Found
              </div>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-800 font-semibold text-lg">Book</p>
            </div>
          </div>

          {/* Card 2 - Backpack */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 hover:-translate-y-2 group">
            <div className="relative h-52 bg-gray-50 flex items-center justify-center p-6">
              <Image
                src="/images/cute.jpg"
                alt="Backpack"
                fill
                className="object-contain rounded-t-3xl"
              />
              <div className="absolute top-4 left-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                Found
              </div>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-800 font-semibold text-lg">Backpack</p>
            </div>
          </div>

          {/* Card 3 - Smartwatch */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 hover:-translate-y-2 group">
            <div className="relative h-52 bg-gray-50 flex items-center justify-center p-6">
              <Image
                src="/images/watch.jpg"
                alt="Smartwatch"
                fill
                className="object-contain rounded-t-3xl"
              />
              <div className="absolute top-4 left-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                Found
              </div>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-800 font-semibold text-lg">Smartwatch</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
        <a
        href="/found"
         className="px-12 py-5 bg-purple-500 hover:bg-purple-600 text-white text-xl font-semibold rounded-full shadow-xl transition transform hover:scale-105"
      >
        View More Found Items
        </a>
      </div>
      </div>
    </div>
  );
}
