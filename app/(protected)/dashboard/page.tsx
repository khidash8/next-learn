'use client';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { FileText } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { isLoading, user } = useAuth();

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

  const handleStartExam = () => {
    router.push('/exam');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome, Section */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-gray-600">
            Ready to test your knowledge? Start your exam when you're ready.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Start Exam Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#177A9C]/10">
              <FileText className="h-6 w-6 text-[#177A9C]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Start Exam
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Begin your multiple choice question test. Make sure you have
              enough time before starting.
            </p>
            <Button
              onClick={handleStartExam}
              className="w-full rounded-md bg-[#177A9C] px-4 py-2 text-white hover:bg-[#177A9C]/80"
            >
              Start Now
            </Button>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h3 className="mb-3 text-lg font-semibold text-blue-900">
            Exam Instructions
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-600">•</span>
              <span>
                Ensure you have a stable internet connection before starting
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-600">•</span>
              <span>
                The exam will be timed. Make sure you're ready before beginning
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-600">•</span>
              <span>
                You can mark questions for review and come back to them later
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-blue-600">•</span>
              <span>
                Submit your exam before time runs out to save your answers
              </span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
