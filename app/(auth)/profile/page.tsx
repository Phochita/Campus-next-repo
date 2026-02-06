'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Profile() {
  // Dummy data (later replace with real user from auth)
  const [user, setUser] = useState({
    name: 'Chuan',
    email: 'achuan90@example.com',
    birthday: 'January 1, 2000',
    avatar: '/images/avatar.jpg', // ← your avatar file in public/images/
  });

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  // Handle input changes while editing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  // Save changes
  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
    alert('Profile updated! (Demo - later save to backend)');
  };

  // Cancel edit
  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Top pink header */}
        <div className="h-32 bg-gradient-to-r from-pink-400 to-[#F1D1D1]-400 relative">
          {/* Avatar circle overlapping header */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-xl bg-white">
            <Image
              src={user.avatar}
              alt="Profile Avatar"
              fill
              className="object-cover"
            />
            {/* Camera icon button */}
            <button className="absolute bottom-1 right-0.5 bg-pink-500 p-2 rounded-full shadow-lg hover:bg-pink-600 transition">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* User info - pink cards */}
        <div className="pt-20 px-8 pb-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-pink-50 border border-pink-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            ) : (
              <div
                className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-lg text-gray-900 font-medium cursor-pointer hover:bg-pink-100 transition"
                onClick={() => setIsEditing(true)}
              >
                {user.name}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editedUser.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-pink-50 border border-pink-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            ) : (
              <div
                className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-lg text-gray-900 font-medium cursor-pointer hover:bg-pink-100 transition"
                onClick={() => setIsEditing(true)}
              >
                {user.email}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Birthday</label>
            {isEditing ? (
              <input
                type="text"
                name="birthday"
                value={editedUser.birthday}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-pink-50 border border-pink-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="January 1, 2000"
              />
            ) : (
              <div
                className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-lg text-gray-900 font-medium cursor-pointer hover:bg-pink-100 transition"
                onClick={() => setIsEditing(true)}
              >
                {user.birthday}
              </div>
            )}
          </div>

          {/* Edit / Save / Cancel buttons */}
          {isEditing ? (
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition shadow-md"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-full transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-8 py-3.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full transition shadow-lg"
            >
              Edit Profile
            </button>
          )}

          {/* Log out button */}
          <button className="w-full mt-4 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition shadow-md">
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}


