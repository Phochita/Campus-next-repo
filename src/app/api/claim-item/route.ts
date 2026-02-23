import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { itemPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Please sign in to claim' }, { status: 401 });
    }

    const formData = await request.formData();

    const itemId = formData.get('itemId') as string;
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const proofDescription = formData.get('proofDescription') as string;
    const proofFile = formData.get('proofFile') as File | null;

    if (!itemId || !fullName || !email || !proofDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Optional: Upload proofFile to storage (like you did for item photos)
    const proofUrl = null;
    if (proofFile) {
      // Reuse your existing upload logic here (from report-item)
      // For now, skip or add simple upload if you want
      // proofUrl = await uploadToSupabase(proofFile, 'proofs');
    }

    // Save claim to DB - add new table or update item
    // Option 1: Update item_posts (simple)
    await db
      .update(itemPosts)
      .set({
        status: 'claimed',
        claimedBy: userId,
        claimedAt: new Date(),
        claimProof: proofDescription, // or save proofUrl
        claimName: fullName,
        claimEmail: email,
      })
      .where(eq(itemPosts.id, itemId));

    // Option 2: Create separate claims table later (more scalable)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Claim error:', error);
    return NextResponse.json({ error: 'Failed to submit claim' }, { status: 500 });
  }
}

