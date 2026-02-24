import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/db';
import { itemPosts } from '@/db/schema';

export const dynamic = "force-dynamic";

export default async function ItemsListPage() {
  // Fetch all items from DB (add your real query)
  const items = await db
    .select()
    .from(itemPosts)
    .limit(20); // show 20 for now

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        All Items
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {items.map(item => (
  <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
    <Link href={`/item/${item.id}`}>
      <Image
        src={`https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/items/${item.photos}`}
        alt={item.itemTitle || "Item image"}
        width={200}
        height={200}
        className="rounded-xl cursor-pointer object-cover"
      />
    </Link>
  </div>
))}
      </div>
    </div>
  );
}
