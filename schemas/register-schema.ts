import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  qualification: z.string().min(1, 'Please select a qualification'),
  mobile: z.string().min(10, 'Please enter a valid mobile number'),
  profile_image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      'File size should be less than 5MB',
    ),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
