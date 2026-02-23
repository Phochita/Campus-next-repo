// src/app/api/signup/route.ts
import { db } from '@/db';
import { users } from '@/db/schema';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, contact } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Check if email already exists
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Hash password (10 rounds = safe & fast)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user — use snake_case column names to match Supabase
    const [newUser] = await db.insert(users).values({
      first_name: firstName || '',
      last_name: lastName || '',
      email,
      password: hashedPassword,
      role: 'student', // default
      contact: contact || '',
    }).returning();

    console.log('New user created:', newUser.user_id, newUser.email);

    // Auto-login by setting cookie — use user_id (not id)
    const response = NextResponse.json({ success: true, user: newUser });
    response.cookies.set('userId', newUser.user_id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Signup crash:', error);
    return NextResponse.json({ error: 'Server error - try again' }, { status: 500 });
  }
}
