import { z } from 'zod';

export const signupSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name too long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'First name contains invalid characters'),

  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name too long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Last name contains invalid characters'),

  email: z.email({
    message: 'Please enter a valid email address',
  })
    .max(254, 'Email is too long')
    .transform((val) => val.toLowerCase().trim()),

  companyName: z.string()
    .max(100, 'Company name too long')
    .optional()
    .or(z.literal('')),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'), // optional
});

export const loginSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address',
  })
    .max(254, 'Email is too long')
    .transform((val) => val.toLowerCase().trim()),

  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});