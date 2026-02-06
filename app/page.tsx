// app/page.tsx

import Image from 'next/image';
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section>
      <div className="relative bg-[#FFFFFF]-no-repeart from-pink-50 via-purple-50 to-indigo-50 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#FFB9B9]mb-4">
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

          {/* Claim Now button */}
          <button className="px-10 py-4 bg-pink-500 hover:bg-pink-600 text-white text-lg font-medium rounded-full shadow-lg transition transform hover:scale-105">
            Claim Now
          </button>
        </div>
      </div>

      {/* Recent Items Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Recent Items
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Item 1 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <Image
              src="/images/headphone.jpg"
              alt="AirPods case"
              width="400"
              height={300}
              className="w-full h-56 object-cover"
            />
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-1">AirPods Case</h3>
              <p className="text-gray-600 text-sm">Airport</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <Image
              src="/images/Student.jpg"
              alt="Student ID"
              width={400}
              height={300}
              className="w-full h-56 object-cover"
            />
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-1">Wonyoung Student ID</h3>
              <p className="text-gray-600 text-sm">Wonyoung</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <Image
              src="/images/camera.jpg"
              alt="Instax Camera"
              width={400}
              height={300}
              className="w-full h-56 object-cover"
            />
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-1">Instax Camera</h3>
              <p className="text-gray-600 text-sm">Camera</p>
            </div>
          </div>
        </div>
      </div>

      {/* Big Action Buttons */}
      <div className="max-w-4xl mx-auto px-4 pb-20 flex flex-col sm:flex-row gap-6 justify-center">
        <button className="flex-1 py-6 bg-pink-500 hover:bg-pink-600 text-white text-xl font-medium rounded-full shadow-lg transition transform hover:scale-105">
          I Lost Something
        </button>
        <button className="flex-1 py-6 bg-indigo-500 hover:bg-indigo-600 text-white text-xl font-medium rounded-full shadow-lg transition transform hover:scale-105">
          I Found Something
        </button>
      </div>
      </section>

{/* Footer */}
<footer className="bg-white py-12 border-t-4 border-purple-300">
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
      {/* Left: Graduation cap icon */}
      <div className="flex items-center gap-4">
        <div className="relative w-15 h-15">
          <Image
            src="/images/logo.svg" // ← your cap icon file in public/images/
            alt="Graduation Cap"
            fill
            className="object-contain p-2"
          />
        </div>
      </div>

      {/* Right: Two columns */}
      <div className="flex flex-col md:flex-row gap-16 md:gap-32 w-full md:w-auto">
        {/* RESOURCES */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-purple-700 mb-4">
            RESOURCES
          </h3>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li>Browse All Items</li>
            <li>Report a Find</li>
          </ul>
        </div>

        {/* HELP */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-purple-700 mb-4">
            HELP
          </h3>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li>safety Tips</li>
            <li>Contact Admin</li>
          </ul>
        </div>
      </div>
    </div>

    {/* Social icons + bottom line */}
    <div className="mt-10 pt-6 border-t border-purple-200 flex justify-center md:justify-end gap-8 text-purple-500">
      <a href="#" className="hover:text-pink-500 transition">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24h-1.918c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
        </svg>
      </a>
      <a href="#" className="hover:text-pink-500 transition">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291.225.026.449.039.673.039 1.322 0 2.537-.449 3.503-1.203-1.235-.023-2.277-.839-2.635-1.96.432.078.881.078 1.323.078.638 0 1.258-.083 1.846-.239-1.295-.261-2.272-1.405-2.272-2.775v-.035c.381.212.812.338 1.269.353-.756-.505-1.25-1.365-1.25-2.337 0-.515.138-1.002.38-1.417 1.389 1.703 3.465 2.823 5.805 2.939-.041-.212-.063-.425-.063-.641 0-1.552 1.259-2.812 2.812-2.812.81 0 1.544.342 2.06.891.643-.126 1.249-.36 1.796-.682-.211.658-.659 1.212-1.243 1.561.554-.066 1.082-.213 1.571-.427-.368.554-.832 1.04-1.367 1.43z" />
        </svg>
      </a>
      <a href="#" className="hover:text-pink-500 transition">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </a>
    </div>
  </div>
</footer>

    </div>
  );
}
