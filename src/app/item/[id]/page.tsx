import Image from 'next/image';
import Link from 'next/link';

export default async function ItemPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ← this makes id real (e.g. "25")

  // Your image URL (change to real)
  const imageUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/items/${id}.jpg`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-12">
        <div className="relative w-96 h-96 rounded-3xl overflow-hidden border-4 border-red-500 shadow-2xl">
          <Image
            src={imageUrl || '/placeholder-image.jpg'}
            alt="Item"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <Link href={`/claim-item/${id}`}> {/* ← now uses real id */}
        <button className="px-20 py-8 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-3xl rounded-full shadow-2xl transition-all">
          Claim
        </button>
      </Link>
    </div>
  );
}
