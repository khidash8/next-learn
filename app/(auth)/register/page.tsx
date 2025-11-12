'use client';

import React, { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { PhoneInput } from '@/components/phone-input';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createProfile, isLoading } = useAuth();

  const mobileFromParams = searchParams.get('mobile') || '';

  // Ensure the mobile number is in E.164 format
  const formatMobileNumber = (mobile: string): string => {
    if (!mobile) return '';

    // Remove any existing + and spaces, then add +91
    const cleaned = mobile.replace(/[\s\+]/g, '');

    // If it starts with 91 and has 12 digits, add + prefix
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return `+${cleaned}`;
    }

    // If it's 10 digits, assume Indian number and add +91
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }

    // If it already has + but missing country code, handle it
    if (mobile.startsWith('+') && mobile.length < 12) {
      return `+91${mobile.slice(1)}`;
    }

    // Return as is if it already has proper format
    return mobile.startsWith('+') ? mobile : `+${mobile}`;
  };

  const [formData, setFormData] = useState({
    mobile: formatMobileNumber(mobileFromParams),
    name: '',
    email: '',
    qualification: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!formData.mobile || formData.mobile === '+') {
      router.push('/login');
    }
  }, [formData.mobile, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setProfileImage(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!profileImage) {
      setError('Please upload a profile image');
      return;
    }

    const result = await createProfile({
      ...formData,
      profile_image: profileImage,
    });

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please provide your details to continue
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <div className="relative mb-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 rounded-full border-2 border-gray-300 object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-200">
                    <span className="text-sm text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                required
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Supported formats: JPG, PNG, WebP. Max size: 5MB
              </p>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="relative mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            {/* Qualification */}
            <div>
              <label
                htmlFor="qualification"
                className="block text-sm font-medium text-gray-700"
              >
                Qualification *
              </label>
              <select
                id="qualification"
                name="qualification"
                required
                className="relative mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                value={formData.qualification}
                onChange={handleInputChange}
                disabled={isLoading}
              >
                <option value="">Select Qualification</option>
                <option value="high_school">High School</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Mobile (Read-only from login flow) */}
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <div className="mt-1">
                <PhoneInput
                  value={formData.mobile}
                  onChange={() => {}} // Empty function to make it read-only
                  disabled={true}
                  className="cursor-not-allowed bg-gray-50 opacity-70"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Mobile number from your login session
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Creating Profile...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
