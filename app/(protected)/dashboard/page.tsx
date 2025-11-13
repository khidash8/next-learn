'use client';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import questionService from '@/services/questionService';
import { ExamConfig } from '@/types/question';

export default function DashboardPage() {
  const router = useRouter();
  const { isLoading } = useAuth();
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    const loadExamConfig = async () => {
      try {
        const data = await questionService.getQuestions();
        setExamConfig({
          questions_count: data.questions_count,
          total_marks: data.total_marks,
          total_time: data.total_time,
          time_for_each_question: data.time_for_each_question,
          mark_per_each_answer: data.mark_per_each_answer,
          instruction: data.instruction,
        });
      } catch (error) {
        console.error('Failed to load exam config:', error);
      } finally {
        setLoadingConfig(false);
      }
    };

    loadExamConfig();
  }, []);

  if (isLoading || loadingConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
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
    <div className="min-h-screen bg-gray-50 py-12">
      <main className="mx-auto max-w-3xl px-4">
        {/* Title */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Exam Overview</h2>
          <p className="text-sm text-gray-600">
            Review the details before starting
          </p>
        </div>

        {/* Stats Card */}
        {examConfig && (
          <div className="mb-8 overflow-hidden rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg">
            <div className="grid grid-cols-3 divide-x divide-slate-700">
              {/* Total MCQs */}
              <div className="px-6 py-8 text-center">
                <p className="mb-2 text-sm font-medium text-slate-400">
                  Total Questions:
                </p>
                <p className="text-4xl font-bold text-white">
                  {examConfig.questions_count}
                </p>
              </div>

              {/* Total Marks */}
              <div className="px-6 py-8 text-center">
                <p className="mb-2 text-sm font-medium text-slate-400">
                  Total marks:
                </p>
                <p className="text-4xl font-bold text-white">
                  {examConfig.total_marks}
                </p>
              </div>

              {/* Total Time */}
              <div className="px-6 py-8 text-center">
                <p className="mb-2 text-sm font-medium text-slate-400">
                  Total time:
                </p>
                <p className="text-4xl font-bold text-white">
                  {examConfig.total_time}:00
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions Section */}
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Instructions:
          </h2>

          {examConfig?.instruction && (
            <div className="mb-6">
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: examConfig.instruction }}
              />
            </div>
          )}

          {/* Start Button */}
          <Button
            onClick={handleStartExam}
            variant={'next_default'}
            className="w-full rounded-lg py-3 text-base font-medium text-white transition-colors hover:bg-slate-700"
          >
            Start Test
          </Button>
        </div>
      </main>
    </div>
  );
}
