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

    // Insert new user
    const [newUser] = await db.insert(users).values({
      firstName: firstName || '',
      lastName: lastName || '',
      email,
      password: hashedPassword,
      role: 'student', // default — change later if needed
      contact: contact || '',
    }).returning();

    // Auto-login by setting cookie
    const response = NextResponse.json({ success: true, user: newUser });
    response.cookies.set('userId', newUser.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
