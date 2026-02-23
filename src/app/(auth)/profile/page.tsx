'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Crop & save states
  const [showCropModal, setShowCropModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load user from /api/user
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const res = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        let data;
        try {
          data = await res.json();
        } catch {
          throw new Error('Invalid server response');
        }

        if (!res.ok) {
          throw new Error(data?.error || `API error (${res.status})`);
        }

        if (!data?.user) {
          throw new Error('No user data');
        }

        setUser(data.user);
        setEditedUser(data.user);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('Profile error:', message);
        setErrorMessage(message);
        toast.error('Cannot load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Avatar upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setUploadedImage(previewUrl);
      setShowCropModal(true);
    }
  };

  const handleApplyCrop = () => {
    setShowCropModal(false);
    setShowSaveModal(true);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // FIXED: Safe avatar save with Supabase UUID
  const handleSaveAvatar = async () => {
    if (!uploadedImage) return;

    setIsSaving(true);

    try {
      // Get real logged-in user UUID
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not logged in');

      // Convert preview to blob
      const response = await fetch(uploadedImage);
      const blob = await response.blob();

      // Unique filename with UUID
      const fileName = `${authUser.id}_${Date.now()}.jpg`;

      // Upload to avatars bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Save URL to users table with UUID
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar: publicUrl })
        .eq('user_id', authUser.id);

      if (updateError) throw updateError;

      // Update local state
      setUser(prev => ({ ...prev, avatar: publicUrl }));
      setEditedUser(prev => ({ ...prev, avatar: publicUrl }));
      setShowSaveModal(false);
      setUploadedImage(null);
      setRotation(0);
      toast.success('Avatar saved permanently!');

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Avatar save failed:', message);
      toast.error('Failed to save avatar — check console');
    } finally {
      setIsSaving(false);
    }
  };

  // Save text edits
  const handleSave = async () => {
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedUser),
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Save failed');
      }

      setUser(editedUser);
      setIsEditing(false);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to save profile');
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Loading your profile...</div>;

  if (errorMessage) return <div className="text-red-600 text-center">Error: {errorMessage}</div>;

  if (!user) return <div className="text-red-600 text-center">No profile data — log in again</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 relative">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Header gradient */}
        <div className="h-32 bg-gradient-to-r from-pink-400 to-purple-400 relative" />

        {/* Avatar */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-2xl bg-white relative">
            <Image
              src={user?.avatar || '/images/default-avatar.jpg'}
              alt="Avatar"
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
              className="absolute bottom-0 right-0 bg-pink-500 p-2 rounded-full shadow-lg hover:bg-pink-600 cursor-pointer"
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
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={editedUser?.first_name || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-pink-50 border border-pink-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-lg text-gray-900 font-medium">
                {user?.first_name || 'Not set'} {user?.last_name || ''}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <div className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-lg text-gray-900 font-medium">
              {user?.email || 'Not set'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
            <div className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-lg text-gray-900 font-medium capitalize">
              {user?.role || 'Not set'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Contact</label>
            {isEditing ? (
              <input
                type="text"
                name="contact"
                value={editedUser?.contact || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-pink-50 border border-pink-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-lg text-gray-900 font-medium">
                {user?.contact || 'Not set'}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Joined</label>
            <div className="w-full px-4 py-3 bg-pink-50 border border-pink-200 rounded-lg text-gray-900 font-medium">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Not set'}
            </div>
          </div>

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

          <button
            onClick={() => {
              document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
              window.location.href = '/login';
            }}
            className="w-full mt-4 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition shadow-md"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Crop Modal */}
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
                  src={uploadedImage || user?.avatar || '/images/default-avatar.jpg'}
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
