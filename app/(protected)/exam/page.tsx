'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import InstructionsDialog from '@/components/exam/instruction-dialog';
import Legends from '@/components/exam/legends';
import SubmitDialog from '@/components/exam/submit-dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useQuestion } from '@/hooks/useQuestion';
import { useQuestionStore } from '@/store/questionStore';
import { Clock, FileText } from 'lucide-react';

export default function ExamPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const {
    questions,
    currentQuestion,
    currentQuestionIndex,
    answers,
    remainingTime,
    examConfig,
    loadQuestions,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    answerQuestion,
    markCurrentForReview,
    submitExam,
    getQuestionStatus,
    getStats,
  } = useQuestion();

  const setExamResult = useQuestionStore((state) => state.setExamResult);

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      await loadQuestions();
      setIsLoading(false);
    };
    fetchQuestions();
  }, [loadQuestions]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await submitExam();
    setIsSubmitting(false);
    setShowSubmitDialog(false);

    if (result.success && result.data) {
      // Store result in Zustand
      setExamResult(result.data);
      // Navigate to results page
      router.push(`/results/${result.data.exam_history_id}`);
    } else {
      alert(result.message || 'Failed to submit exam');
    }
  };

  const stats = getStats();

  if (isLoading || !currentQuestion || !examConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-[#177A9C]"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  const currentAnswer = answers.get(currentQuestion.question_id);
  const questionStatus = getQuestionStatus(currentQuestion.question_id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="sticky top-0 z-50 mx-auto flex max-w-full items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Image src="/images/Logo2.png" alt="logo" width={120} height={40} />
          </div>

          <div className="flex items-center gap-6">
            <InstructionsDialog instruction={examConfig.instruction} />

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm">
                <Clock className="h-5 w-5 text-gray-600" />
                <span className="font-mono text-xl font-bold text-gray-900">
                  {formatTime(remainingTime)}
                </span>
              </div>
              <Button
                onClick={logout}
                className="rounded-lg bg-[#177A9C] px-6 py-2 text-sm font-medium text-white hover:bg-[#177A9C]/90"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto flex max-w-full gap-6 p-6">
        {/* Question Section */}
        <div className="flex-1">
          <div className="rounded-lg border bg-white shadow-sm">
            {/* Question Header */}
            <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-600" />
                <span className="text-base font-semibold text-gray-900">
                  Question {currentQuestionIndex + 1}/{questions.length}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-600">
                Marks: {examConfig.mark_per_each_answer}
              </div>
            </div>

            {/* Question Content */}
            <div className="p-6">
              {/* Comprehension Text */}
              {currentQuestion.comprehension && (
                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm text-gray-700">
                    {currentQuestion.comprehension}
                  </p>
                </div>
              )}

              {/* Question Text */}
              <div className="mb-6">
                <h2 className="mb-4 text-base font-normal text-gray-900">
                  {currentQuestion.number}. {currentQuestion.question}
                </h2>
                {currentQuestion.image && (
                  <div className="mb-6">
                    <Image
                      src={currentQuestion.image}
                      alt="Question"
                      width={400}
                      height={300}
                      className="rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Choose the answer:
                </p>
                {currentQuestion.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 bg-white p-4 transition-all ${
                      currentAnswer === option.id
                        ? 'border-[#177A9C] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      checked={currentAnswer === option.id}
                      onChange={() => answerQuestion(option.id)}
                      className="h-5 w-5 cursor-pointer text-[#177A9C] focus:ring-2 focus:ring-[#177A9C] focus:ring-offset-2"
                    />
                    <span className="flex-1 text-base text-gray-900">
                      {option.option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4">
              <Button
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="rounded-lg bg-gray-200 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </Button>

              <Button
                onClick={markCurrentForReview}
                className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
                  questionStatus === 'marked' ||
                  questionStatus === 'answered-marked'
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                Mark for Review
              </Button>

              <Button
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="rounded-lg bg-[#177A9C] px-6 py-2 text-sm font-medium text-white hover:bg-[#177A9C]/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Question Navigator Sidebar */}
        <div className="hidden w-96 lg:block">
          <div className="sticky top-6 rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Question Numbers:
            </h3>

            {/* Question Number Grid */}
            <div className="mb-6 grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const status = getQuestionStatus(q.question_id);
                let bgColor = 'bg-red-500 hover:bg-red-600'; // Not Attended

                if (status === 'answered') {
                  bgColor = 'bg-green-500 hover:bg-green-600';
                } else if (status === 'marked') {
                  bgColor = 'bg-purple-500 hover:bg-purple-600';
                } else if (status === 'answered-marked') {
                  bgColor = 'bg-purple-700 hover:bg-purple-800';
                }

                const isActive = idx === currentQuestionIndex;

                return (
                  <button
                    key={q.question_id}
                    onClick={() => goToQuestion(idx)}
                    className={`flex h-12 w-12 items-center justify-center rounded-lg text-sm font-semibold text-white transition-all ${bgColor} ${
                      isActive
                        ? 'ring-4 ring-gray-900 ring-offset-2'
                        : 'hover:scale-105'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <Legends />

            {/* Submit Button */}
            <Button
              onClick={() => setShowSubmitDialog(true)}
              className="mt-6 w-full rounded-lg bg-red-600 py-3 text-base font-semibold text-white hover:bg-red-700"
            >
              Submit Test
            </Button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <SubmitDialog
        isOpen={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        remainingTime={remainingTime}
        stats={stats}
      />

      <div className={'flex w-full flex-1 justify-center p-4 lg:hidden'}>
        <Button
          onClick={() => setShowSubmitDialog(true)}
          className="w-full max-w-sm rounded-lg bg-red-600 text-base font-semibold text-white hover:bg-red-700"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Test'}
        </Button>
      </div>
    </div>
  );
}
