import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  user_id: serial('user_id').primaryKey(),
  first_name: text('first_name'),
  last_name: text('last_name'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('student'),
  contact: text('contact'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  avatar: text('avatar'),
});

export const itemPosts = pgTable('item_posts', {
  id: serial('item_id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.user_id, { onDelete: 'cascade' }), // ← FIXED here
  itemTitle: text('item_title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  found: text('found').notNull(),
  datePosted: timestamp('date_posted').defaultNow().notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  photos: text('photos'),
});

export const claims = pgTable('claims', {
  id: serial('claim_id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.user_id, { onDelete: 'cascade' }), // ← FIXED here
  itemId: integer('item_id')
    .notNull()
    .references(() => itemPosts.id, { onDelete: 'cascade' }),
  claimDate: timestamp('claim_date').defaultNow().notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
