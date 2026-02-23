import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  console.log('[PROFILE API] Started at', new Date().toISOString());

  try {
    const cookieStore = await cookies();
    console.log('[PROFILE API] All cookies:', cookieStore.getAll());

    const userIdStr = cookieStore.get('userId')?.value;
    console.log('[PROFILE API] userId from cookie:', userIdStr);

    if (!userIdStr) {
      console.log('[PROFILE API] No userId cookie found');
      return NextResponse.json({ error: 'Please log in first (no userId cookie)' }, { status: 401 });
    }

    const userId = Number(userIdStr);
    console.log('[PROFILE API] Parsed userId:', userId);

    if (isNaN(userId)) {
      console.log('[PROFILE API] Invalid userId format');
      return NextResponse.json({ error: 'Invalid userId format' }, { status: 400 });
    }

    console.log('[PROFILE API] Running query for user_id =', userId);

    const [user] = await db
      .select({
        user_id: users.user_id,
        first_name: users.first_name,
        last_name: users.last_name,
        email: users.email,
        role: users.role,
        contact: users.contact,
        created_at: users.created_at,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.user_id, userId))
      .limit(1);

    if (!user) {
      console.log('[PROFILE API] No user found for ID', userId);
      return NextResponse.json({ error: 'User not found (ID does not exist)' }, { status: 404 });
    }

    console.log('[PROFILE API] User found:', user.user_id, user.email, user.first_name);

    const safeUser = {
      ...user,
      avatar: user.avatar || '/images/default-avatar.jpg',
    };

    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('[PROFILE API] FULL CRASH:', error);
    console.error('[PROFILE API] Error name:', error?.name);
    console.error('[PROFILE API] Error message:', error?.message);
    console.error('[PROFILE API] Error stack:', error?.stack);
    
    return NextResponse.json(
      { error: 'Server crashed while loading profile - check terminal logs' },
      { status: 500 }
    );
  }
}
