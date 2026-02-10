import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('user_id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(), // e.g., 'student', 'admin'
  contact: text('contact').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const itemPosts = pgTable('item_posts', {
  id: serial('item_id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }), // ← correct foreign key
  itemTitle: text('item_title').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  found: text('found').notNull(), // 'yes' or 'no'
  datePosted: timestamp('date_posted').defaultNow().notNull(),
  status: text('status').notNull(), // 'open', 'claimed', 'closed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const claims = pgTable('claims', {
  id: serial('claim_id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }), // ← correct FK
  itemId: integer('item_id')
    .notNull()
    .references(() => itemPosts.id, { onDelete: 'cascade' }), // ← correct FK
  claimDate: timestamp('claim_date').defaultNow().notNull(),
  status: text('status').notNull(), // 'pending', 'approved', 'rejected'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
