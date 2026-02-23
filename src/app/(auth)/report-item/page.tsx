'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function ReportItem() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = searchParams.get('type') || 'lost';
  const isLost = type === 'lost';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    photos: [] as File[],
    previews: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    // Force load session on page open + listen for changes
    supabase.auth.getSession(); // trigger initial load

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        console.log('Session refreshed or signed in:', session?.user?.email);
      }
      if (event === 'SIGNED_OUT') {
        toast.error('Logged out - redirecting');
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && formData.photos.length + files.length <= 3) {
      const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newFiles],
        previews: [...prev.previews, ...newPreviews],
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
      previews: prev.previews.filter((_, i) => i !== index),
    }));
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && formData.photos.length + files.length <= 3) {
      const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newFiles],
        previews: [...prev.previews, ...newPreviews],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('location', formData.location);
      form.append('date', formData.date);
      form.append('type', type);

      // FIXED: Append all photos with the correct name 'photos' (server expects this)
      formData.photos.forEach((file) => {
        form.append('photos', file);
      });

      const res = await fetch('/api/report-item', {
        method: 'POST',
        body: form,
        credentials: 'include', // send cookies to server
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = { error: 'Server sent bad response' };
      }

      if (!res.ok) {
        throw new Error(data.error || `Server error (${res.status})`);
      }

      toast.success('Item reported successfully!', {
        description: 'Thank you — it has been added.',
      });

      setShowSuccess(true);

      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err: any) {
      toast.error('Failed to report', {
        description: err.message || 'Please try again.',
      });
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className={`flex items-center justify-center px-4 py-12 transition-opacity duration-500 ${showSuccess ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-pink-400 to-purple-400 relative flex items-center justify-center">
            <h1 className="text-2xl font-bold text-white">
              Campus Report {isLost ? 'Lost' : 'Found'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-pink-50 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="e.g. Black Wallet Lost"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-pink-50 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Details about the item..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-pink-50 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Last seen / Found location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-pink-50 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="e.g. Library 2nd floor, near printer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Upload photos (Max 3)</label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center bg-pink-50 transition-all duration-200 cursor-pointer ${dragActive ? 'border-purple-500 bg-purple-50 border-4 scale-105' : 'border-pink-300'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photos-upload"
                  name="photos"
                />
                <label htmlFor="photos-upload">
                  <p className="text-gray-600 font-medium">
                    {dragActive ? 'Drop photos here...' : 'Tap to upload or drag & drop'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">(Max 3 photos)</p>
                </label>
              </div>

              {formData.previews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {formData.previews.map((preview, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover w-full h-24"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 text-white font-semibold rounded-full transition shadow-lg flex items-center justify-center gap-2 ${isSubmitting ? 'bg-purple-400 cursor-not-allowed' : 'bg-[#18A0FB]'}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Form submitted Successfully</h2>
            <p className="text-gray-600 mb-8">Thank you! The form has been submitted successfully.</p>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3.5 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-full transition shadow-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
