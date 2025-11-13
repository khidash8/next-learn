'use client';

import React from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();

  return (
    <div>
      <header className="sticky top-0 z-50 bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Image src="/images/Logo2.png" alt="logo" width={100} height={100} />
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            )}
            <Button
              onClick={logout}
              className="rounded-md bg-[#177A9C] px-4 py-2 text-sm font-medium text-white hover:bg-[#177A9C]/80 focus:ring-2 focus:outline-none"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
};
export default ProtectedLayout;
