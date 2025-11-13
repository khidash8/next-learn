'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useQuestionStore } from '@/store/questionStore';

interface ResultPageProps {
  params: Promise<{
    exam_history_id: string;
  }>;
}

export default function ResultPage({ params }: ResultPageProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const examResult = useQuestionStore((state) => state.examResult);
  const examConfig = useQuestionStore((state) => state.examConfig);
  const clearExamResult = useQuestionStore((state) => state.clearExamResult);
  const resetExam = useQuestionStore((state) => state.resetExam);

  const handleRetake = () => {
    // Clear the exam result and reset
    clearExamResult();
    resetExam();
    // Navigate to exam page
    router.push('/exam');
  };

  if (!examResult) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">
            No exam results found. Please take the exam first.
          </p>
          <Button
            onClick={() => router.push('/exam')}
            className="mt-4 rounded-lg bg-[#177A9C] px-6 py-2 text-sm font-medium text-white hover:bg-[#177A9C]/90"
          >
            Go to Exam
          </Button>
        </div>
      </div>
    );
  }

  const totalQuestions = examConfig?.questions_count || 100;
  const totalMarks = examConfig?.total_marks || 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-full items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Image src="/images/Logo2.png" alt="logo" width={120} height={40} />
          </div>
          <Button
            onClick={logout}
            className="rounded-lg bg-[#177A9C] px-6 py-2 text-sm font-medium text-white hover:bg-[#177A9C]/90"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-2xl items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Result Card */}
          <div className="rounded-lg bg-white shadow-lg">
            {/* Score Display */}
            <div className="flex flex-col items-center justify-center rounded-t-lg bg-gradient-to-t from-[#1C3141] to-[#177A9C] px-8 py-10">
              <p className="mb-3 text-sm font-medium text-white/90">
                Marks Obtained:
              </p>
              <div className="text-6xl font-bold text-white">
                {examResult.score} / {totalMarks}
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-0 divide-y divide-gray-100 px-8 py-6">
              {/* Total Questions */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                    <svg
                      className="h-5 w-5 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-base font-medium text-gray-700">
                    Total Questions:
                  </span>
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {totalQuestions}
                </span>
              </div>

              {/* Correct Answers */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-base font-medium text-gray-700">
                    Correct Answers:
                  </span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {String(examResult.correct).padStart(3, '0')}
                </span>
              </div>

              {/* Incorrect Answers */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                    <svg
                      className="h-5 w-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <span className="text-base font-medium text-gray-700">
                    Incorrect Answers:
                  </span>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {String(examResult.wrong).padStart(3, '0')}
                </span>
              </div>

              {/* Not Attended */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-base font-medium text-gray-700">
                    Not Attended Questions:
                  </span>
                </div>
                <span className="text-2xl font-bold text-gray-600">
                  {String(examResult.not_attended).padStart(3, '0')}
                </span>
              </div>
            </div>

            {/* Done Button */}
            <div className="px-8 pb-8">
              <Button
                onClick={handleRetake}
                className="w-full rounded-lg bg-[#2c3e50] py-4 text-base font-semibold text-white hover:bg-[#34495e]"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
