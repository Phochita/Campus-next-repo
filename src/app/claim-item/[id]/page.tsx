'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ClaimItem() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    proofDescription: '',
    proofFile: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({ ...prev, proofFile: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('itemId', id as string);
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('proofDescription', formData.proofDescription);
      if (formData.proofFile) {
        data.append('proofFile', formData.proofFile);
      }

      const res = await fetch('/api/claim-item', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit claim');
      }

      setShowSuccess(true);

      setTimeout(() => {
        router.push('/');
      }, 4000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative flex items-center justify-center px-4 py-12">
      <div className={`max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-10 transition-opacity duration-500 ${showSuccess ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          Claim Item
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Description proof of Ownership</label>
            <textarea
              name="proofDescription"
              value={formData.proofDescription}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
              placeholder="Explain why this item belongs to you..."
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Upload proof of Ownership</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="proof-upload"
              />
              <label htmlFor="proof-upload" className="cursor-pointer">
                <p className="text-gray-700 font-medium text-lg">Tap to upload or drag & drop</p>
                <p className="text-gray-500 mt-2">Image or PDF proof</p>
              </label>
            </div>
            {formData.proofFile && (
              <p className="mt-3 text-green-600 font-medium">Selected: {formData.proofFile.name}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-5 text-white font-bold text-xl rounded-full transition shadow-xl
              ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600'}`}
          >
            {isSubmitting ? 'Submitting Claim...' : 'Submit Claim'}
          </button>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Success!</h2>
            <p className="text-gray-600 text-lg mb-8">
              Claim submitted successfully!<br />
              Thank you! We will review your proof soon.
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xl rounded-full shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
            >
              Go Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
