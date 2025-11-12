'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { PhoneInput } from '@/components/phone-input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { formatMobileNumber } from '@/lib/globals';
import {
  type RegisterFormData,
  registerSchema,
} from '@/schemas/register-schema';
import { zodResolver } from '@hookform/resolvers/zod';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createProfile, isLoading } = useAuth();

  const mobileFromParams = searchParams.get('mobile') || '';

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      mobile: formatMobileNumber(mobileFromParams),
      name: '',
      email: '',
      qualification: '',
    },
  });

  const [imagePreview, setImagePreview] = React.useState<string>('');

  useEffect(() => {
    if (!form.getValues('mobile') || form.getValues('mobile') === '+') {
      router.push('/login');
    }
  }, [form, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        form.setError('profile_image', {
          type: 'manual',
          message: 'Please upload a valid image file',
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        form.setError('profile_image', {
          type: 'manual',
          message: 'Image size should be less than 5MB',
        });
        return;
      }

      form.setValue('profile_image', file);
      form.clearErrors('profile_image');

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    const result = await createProfile(data);

    if (result.success) {
      router.push('/dashboard');
    } else {
      form.setError('root', {
        type: 'manual',
        message: result.message,
      });
    }
  };

  return (
    <div className="text-muted-foreground scrollbar-hide flex max-h-[500px] w-full flex-1 items-center justify-center overflow-y-scroll rounded-lg bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h2 className="mt-8 text-center text-2xl font-semibold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-1 text-center text-sm text-gray-600">
            Please provide your details to continue
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {form.formState.errors.root && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-800">
                  {form.formState.errors.root.message}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {/* Profile Image */}
              <FormField
                control={form.control}
                name="profile_image"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="mb-2">Profile Image</FormLabel>
                    <div className="relative mb-3">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          className="h-24 w-24 rounded-full border-2 border-gray-300 object-cover"
                          width={100}
                          height={100}
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-200">
                          <span className="text-xs text-gray-500">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="mt-1 text-xs text-gray-500">
                      Supported formats: JPG, PNG, WebP. Max size: 5MB
                    </p>
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Qualification */}
              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className={'w-full'}>
                          <SelectValue placeholder="Select Qualification" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high_school">High School</SelectItem>
                        <SelectItem value="bachelor">
                          Bachelor&apos;s Degree
                        </SelectItem>
                        <SelectItem value="master">
                          Master&apos;s Degree
                        </SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mobile (Read-only from login flow) */}
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <div className="mt-1">
                        <PhoneInput
                          value={field.value}
                          onChange={() => {}} // Empty function to make it read-only
                          disabled={true}
                          className="cursor-not-allowed bg-gray-50 opacity-70"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="mt-1 text-xs text-gray-500">
                      Mobile number from your login session
                    </p>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              variant="next_default"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating Profile...' : 'Complete Profile'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
