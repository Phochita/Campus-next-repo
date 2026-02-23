import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { db } from '@/db';
import { users, itemPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function AdminDashboard() {
  const cookieStore = cookies();
  const supabase = createServerClient({ cookies: () => cookieStore });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin');
  }

  // Fetch profile to check role
  const { data: profile, error } = await supabase
    .from('users')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (error || profile?.role !== 'admin') {
    redirect('/?error=Not authorized');
  }

  // Fetch all users
  const allUsers = await db.select().from(users);

  // Fetch all item posts
  const allItems = await db.select().from(itemPosts);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-purple-700">Admin Dashboard</h1>

      {/* Users Table */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">All Users ({allUsers.length})</h2>
        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
          <table className="w-full table-auto bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u.user_id} className="border-t border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-900">{u.user_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{u.first_name} {u.last_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 capitalize">{u.role}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={async () => {
                        await supabase.from('users').delete().eq('user_id', u.user_id);
                        toast.success('User deleted');
                        router.refresh();
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Items Table */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">All Item Posts ({allItems.length})</h2>
        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
          <table className="w-full table-auto bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allItems.map((item) => (
                <tr key={item.id} className="border-t border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.itemTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.found}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.user_id}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={async () => {
                        await supabase.from('item_posts').delete().eq('id', item.id);
                        toast.success('Item deleted');
                        router.refresh();
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
