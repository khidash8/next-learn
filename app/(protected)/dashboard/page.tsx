'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            NexLearn Dashboard
          </h1>
          <Button
            onClick={logout}
            className="rounded-md bg-[#177A9C] px-4 py-2 text-sm font-medium text-white hover:bg-[#177A9C]/80 focus:ring-2 focus:outline-none"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Welcome back, {user?.name || 'User'}!
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Quick Actions Card */}
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="mb-3 text-lg font-medium text-gray-900">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button className="w-full rounded-md bg-indigo-50 px-4 py-2 text-left font-medium text-indigo-700 hover:bg-indigo-100">
                  Start Exam
                </Button>
                <Button className="w-full rounded-md bg-gray-50 px-4 py-2 text-left font-medium text-gray-700 hover:bg-gray-100">
                  View Results
                </Button>
                <Button className="w-full rounded-md bg-gray-50 px-4 py-2 text-left font-medium text-gray-700 hover:bg-gray-100">
                  Profile Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
