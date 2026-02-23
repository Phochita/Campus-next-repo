// src/app/api/report-item/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { itemPosts } from '@/db/schema';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    console.log('=== REPORT ITEM API STARTED ===');

    // Auth
    let userId = null;
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!authError && user) {
      userId = user.id;
      console.log('Auth success - user ID:', userId);
    } else {
      const cookieStore = await cookies();
      const userIdStr = cookieStore.get('userId')?.value;
      console.log('Auth fallback - cookie userId:', userIdStr);

      if (!userIdStr) {
        console.log('No user ID found');
        return NextResponse.json({ error: 'Please log in first' }, { status: 401 });
      }

      userId = Number(userIdStr);
      if (isNaN(userId)) {
        console.log('Invalid user ID from cookie');
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
      }
    }

    console.log('User ID final:', userId);

    // Form data - with proper types
    const form = await request.formData() as FormData;

    const title = form.get('title') as string | null;
    const description = form.get('description') as string | null;
    const location = form.get('location') as string | null;
    const date = form.get('date') as string | null;
    const type = form.get('type') as string | null;

    console.log('Parsed form fields:', { title, description, location, date, type });

    if (!title || !description || !location || !date || !type) {
      console.log('Missing fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Photos - real upload with extra fix + logs
    const photoUrls: string[] = [];
    const photos = form.getAll('photos') as File[];

    console.log('Photos count:', photos.length);
    if (photos.length > 0) {
      console.log('Photos received:', photos.map(p => ({
        name: p.name,
        size: p.size,
        type: p.type,
      })));

      for (const photo of photos) {
        if (!photo.type.startsWith('image/')) {
          console.log('Skipped non-image file:', photo.name);
          continue;
        }

        const fileName = `${userId}_${Date.now()}_${photo.name.replace(/\s+/g, '_')}`;
        console.log('Uploading real file:', fileName);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('items')
          .upload(fileName, photo, {
            contentType: photo.type, // extra fix for type
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          console.error('UPLOAD ERROR:', uploadError.message, uploadError);
          continue;
        }

        console.log('Upload success:', uploadData);

        // Add delay for Supabase to process (sometimes needed)
        await new Promise(r => setTimeout(r, 1000)); // 1 sec delay for Supabase

        const { data: urlData } = supabase.storage.from('items').getPublicUrl(fileName);
        console.log('getPublicUrl response:', urlData);

        if (urlData.publicUrl) {
          console.log('Real public URL:', urlData.publicUrl);
          photoUrls.push(urlData.publicUrl);
        } else {
          console.log('No public URL returned for:', fileName);
        }
      }
    } else {
      console.log('No photos uploaded this time');
    }

    console.log('Final photoUrls before save:', photoUrls);

    // Save to DB
    await db.insert(itemPosts).values({
      userId,
      itemTitle: title,
      description,
      location,
      found: type,
      datePosted: date ? new Date(date) : new Date(),
      status: 'open',
      createdAt: new Date(),
      photos: photoUrls.length > 0 ? JSON.stringify(photoUrls) : null,
    });

    console.log('DB insert success - photos saved:', photoUrls.length > 0 ? 'YES' : 'NULL');

    return NextResponse.json({ success: true, message: 'Item reported!' });
  } catch (error: any) {
    console.error('API CRASH:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
