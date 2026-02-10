'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Profile() {
  const [user, setUser] = useState(null); // null = loading
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  // Crop & save states
  const [showCropModal, setShowCropModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage only on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userProfile');
      let loadedUser;
      if (saved) {
        try {
          loadedUser = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved profile', e);
        }
      }
      if (!loadedUser) {
        loadedUser = {
          name: 'Chuan',
          email: 'achuan90@example.com',
          birthday: 'January 1, 2000',
          avatar: '/images/avatar.jpg',
        };
      }
      setUser(loadedUser);
      setEditedUser(loadedUser);
    }
  }, []);

  // Save to localStorage whenever user changes
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      localStorage.setItem('userProfile', JSON.stringify(user));
    }
  }, [user]);

  // File upload → crop modal
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setUploadedImage(previewUrl);
      setShowCropModal(true);
    }
  };

  // Apply crop → save modal
  const handleApplyCrop = () => {
    setShowCropModal(false);
    setShowSaveModal(true);
  };

  // Rotate
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Save avatar — auto-close, no alert
  const handleSaveAvatar = () => {
    setIsSaving(true);
    setTimeout(() => {
      setUser(prev => ({ ...prev, avatar: uploadedImage || prev.avatar }));
      setShowSaveModal(false);
      setIsSaving(false);
      setUploadedImage(null);
      setRotation(0);
    }, 1500);
  };

  // Edit handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  // FIXED: Protect avatar when saving edits
  const handleSave = () => {
    setUser(prevUser => ({
      ...editedUser,
      avatar: prevUser.avatar  // ← keeps your crush image safe
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  // Loading state (prevents hydration mismatch)
  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 relative">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="h-32 bg-gradient-to-r from-pink-400 to-[#F1D1D1]-400 relative">
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-xl bg-white relative">
            <Image
              src={user.avatar}
              alt="Profile Avatar"
              fill
              className="object-cover"
            />

            <input
              type="file"
              accept="image/*"
              id="avatar-upload"
              className="hidden"
              onChange={handleFileChange}
            />

            <label
              htmlFor="avatar-upload"
              className="absolute bottom-1 right-0.5 bg-pink-500 p-2 rounded-full shadow-lg hover:bg-pink-600 transition cursor-pointer"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
          </div>
        </div>

        {/* User info */}
        <div className="pt-20 px-8 pb-8 space-y-6">
          {/* Name */}
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

          {/* Email */}
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

          {/* Birthday */}
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

          {/* Edit / Save / Cancel */}
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

          {/* Log out */}
          <button className="w-full mt-4 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition shadow-md">
            Log out
          </button>
        </div>
      </div>

      {/* Crop & Rotate Modal */}
      {showCropModal && uploadedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <button onClick={() => setShowCropModal(false)} className="text-gray-400 hover:text-white">
                ←
              </button>
              <h2 className="text-lg font-semibold text-white">Crop & rotate</h2>
              <div className="w-6" />
            </div>

            <div className="p-6 bg-gray-800 relative">
              <div className="aspect-square rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto w-64 h-64">
                <div style={{ transform: `rotate(${rotation}deg)` }} className="w-full h-full">
                  <Image
                    src={uploadedImage}
                    alt="Crop preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <button
                onClick={handleRotate}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition"
              >
                Rotate
              </button>
            </div>

            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleApplyCrop}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Preview Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl w-full max-w-lg mx-4 overflow-hidden p-6">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Your new profile picture</h2>

            <div className="flex justify-center mb-6">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-purple-500 shadow-2xl">
                <Image
                  src={uploadedImage || user.avatar}
                  alt="New avatar preview"
                  width={192}
                  height={192}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4 text-gray-400 text-sm">
              <span className="text-blue-400">🌐</span> Visible to anyone
            </div>

            <p className="text-center text-gray-500 text-sm mb-6">
              It could take a day or two to see the change across all services
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-full transition"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAvatar}
                disabled={isSaving}
                className={`flex-1 py-3 bg-purple-600 text-white font-semibold rounded-full transition flex items-center justify-center gap-2
                  ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'}`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save as profile picture'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
