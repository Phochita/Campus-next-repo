// src/db/test-insert.ts
import { db } from './index'; // or './db' — adjust to your file name
import { users } from './schema'; // your tables file

async function testInsertUser() {
  try {
    const newUser = await db.insert(users).values({
      firstName: 'Sokha',
      lastName: 'Phal',
      email: 'sokha.phal@student.rupp.edu.kh',
      password: 'kampus123', // ← in real app, NEVER store plain text!
      role: 'student',
      contact: '012 345 678',
    }).returning(); // returns the inserted row

    console.log('User inserted successfully!');
    console.log('New user ID:', newUser[0].id);
    console.log('Full user:', newUser[0]);
  } catch (error) {
    console.error('Insert failed:', error);
  }
}

testInsertUser();
