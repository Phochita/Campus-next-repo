'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ItemDetail() {
  const { id } = useParams();
  const router = useRouter();

  // Dummy data (later pull from localStorage or real data)
  const items = {
    'airpods-1': {
      title: "AirPods Case",
      image: "/images/headphone.jpg",
      location: "Airport",
      date: "Jan 23, 2026",
      description: "Cream case with duck, cute bird design, Hi!! on it",
    },
    'id-card-2': {
      title: "Wonyoung Student ID",
      image: "/images/Student.jpg",
      location: "Wonyoung",
      date: "Aug 31, 2004",
      description: "Gentle High School ID card, name Wonyoung",
    },
    'camera-3': {
      title: "Instax Camera",
      image: "/images/camera.jpg",
      location: "Camera",
      date: "Recent",
      description: "White Instax with strap, like new",
    },
  };

  const item = items[id as string];

  if (!item) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Item not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Big Image in the middle */}
        <div className="relative h-96 md:h-[500px]">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Info below */}
        <div className="p-8 space-y-6">
          <h1 className="text-4xl font-bold text-gray-800 text-center">{item.title}</h1>
          <div className="text-gray-600 space-y-4 text-lg text-center">
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Date:</strong> {item.date}</p>
            <p><strong>Description:</strong> {item.description}</p>
          </div>

          {/* Claim Button */}
          <div className="pt-12 text-center">
            <button
              onClick={() => router.push(`/claim/${id}`)}
              className="inline-block px-16 py-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-2xl rounded-full shadow-2xl hover:from-purple-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300"
            >
              Claim This Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
