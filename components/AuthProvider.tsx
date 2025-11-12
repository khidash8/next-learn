'use client';

import { useEffect } from 'react';

import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Initialize auth state from cookies on mount
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
