import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function GET() {
  console.log('[TEST DB] Started at', new Date().toISOString());

  try {
    console.log('[TEST DB] Test 1: Basic DB connection');

    // Test 1: Simple query to see if DB is connected
    const testConnection = await db.query.users.findMany({ limit: 1 });
    console.log('[TEST DB] Test 1 success - connection good, first user:', testConnection[0] || 'no users yet');

    console.log('[TEST DB] Test 2: Select with column');

    // Test 2: Select with column
    const testColumn = await db.select({ email: users.email }).from(users).limit(1);
    console.log('[TEST DB] Test 2 success - column email:', testColumn[0]?.email || 'no email');

    console.log('[TEST DB] Test 3: Full query with eq');

    // Test 3: Full query with eq (use a known user_id, change to your test ID, e.g. 5)
    const testId = 5; // Change to a real user_id from Supabase
    const [testUser] = await db.select().from(users).where(eq(users.user_id, testId)).limit(1);
    console.log('[TEST DB] Test 3 success - user for ID ' + testId + ':', testUser || 'not found');

    return NextResponse.json({ success: true, tests: 'All tests passed' });
  } catch (error) {
    console.error('[TEST DB] CRASH:', error);
    console.error('[TEST DB] Name:', error.name);
    console.error('[TEST DB] Message:', error.message);
    console.error('[TEST DB] Stack:', error.stack);
    return NextResponse.json({ error: 'DB test failed - check terminal' }, { status: 500 });
  }
}
