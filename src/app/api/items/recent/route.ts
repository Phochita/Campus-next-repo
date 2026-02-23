import { NextResponse } from 'next/server';
import { db } from '@/db';
import { itemPosts } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const items = await db
      .select({
        id: itemPosts.id,
        itemTitle: itemPosts.itemTitle,
        description: itemPosts.description,
        location: itemPosts.location,
        found: itemPosts.found,
        datePosted: itemPosts.datePosted,
        photos: itemPosts.photos,
        createdAt: itemPosts.createdAt, // include for ordering
      })
      .from(itemPosts)
      .orderBy(desc(itemPosts.createdAt))
      .limit(6);

    // Parse photos string to array on server
    const parsedItems = items.map(item => {
      let parsedPhotos: string[] = [];
      if (item.photos && typeof item.photos === 'string') {
        let raw = item.photos.trim();

        // Skip empty or invalid values silently
        if (raw === '' || raw === 'null' || raw === '[]' || raw === '""') {
          parsedPhotos = [];
        } else {
          try {
            // Remove outer quotes if double-stringified
            if (raw.startsWith('"[') && raw.endsWith('"]')) {
              raw = raw.slice(1, -1);
            }

            // Unescape quotes
            raw = raw.replace(/\\"/g, '"');

            const parsed = JSON.parse(raw);
            parsedPhotos = Array.isArray(parsed) ? parsed : [parsed];

            // Clean extra quotes around each URL
            parsedPhotos = parsedPhotos.map(url => {
              if (typeof url === 'string') {
                let cleaned = url.trim();
                if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
                  cleaned = cleaned.slice(1, -1);
                }
                return cleaned;
              }
              return url;
            }).filter(url => typeof url === 'string' && url.startsWith('http'));
          } catch (e) {
            // Silent fallback - no console spam
            if (raw.startsWith('http')) {
              parsedPhotos = [raw];
            }
          }
        }
      }

      return {
        ...item,
        photos: parsedPhotos, // send real array to frontend
      };
    });

    return NextResponse.json({ success: true, items: parsedItems });
  } catch (error) {
    console.error('Fetch recent items error:', error);
    return NextResponse.json({ error: 'Failed to load items' }, { status: 500 });
  }
}
