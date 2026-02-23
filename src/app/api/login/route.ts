import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    console.log('Login attempt with email:', email);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      console.log('No user found for email:', email);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('Password mismatch for email:', email);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    console.log('Login success for user_id:', user.user_id);

    const response = NextResponse.json({ success: true, message: 'Logged in' });

    // Force-set cookie
    response.cookies.set('userId', user.user_id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login crash:', error);
    return NextResponse.json({ error: 'Server error during login' }, { status: 500 });
  }
}
