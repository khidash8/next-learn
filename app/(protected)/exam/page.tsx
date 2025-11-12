'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useQuestion } from '@/hooks/useQuestion';
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
  }, []);

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

    if (result.success) {
      router.push(`/results/${result.data?.exam_history_id}`);
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

        {/* Instructions Bar */}
        {examConfig.instruction && (
          <div className="border-t bg-gray-50 px-6 py-3">
            <div
              className="text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: examConfig.instruction }}
            />
          </div>
        )}
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
        <div className="w-96">
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
            <div className="mb-6 space-y-3 border-t pt-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-green-500"></div>
                <span className="text-sm text-gray-700">Attended</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-red-500"></div>
                <span className="text-sm text-gray-700">Not Attended</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-500"></div>
                <span className="text-sm text-gray-700">Marked for Review</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-700"></div>
                <span className="text-sm text-gray-700">
                  Answered and Marked
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Total Questions:</span>
                <span className="font-bold text-gray-900">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Answered:</span>
                <span className="font-bold text-green-600">
                  {stats.answered}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Not Answered:</span>
                <span className="font-bold text-red-600">
                  {stats.notAnswered}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Marked for Review:</span>
                <span className="font-bold text-purple-600">
                  {stats.marked}
                </span>
              </div>
            </div>

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
      {showSubmitDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Are you sure you want to submit the test?
            </h3>
            <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-4 w-4" />
                  Remaining Time:
                </span>
                <span className="font-mono font-bold text-gray-900">
                  {formatTime(remainingTime)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Total Questions:</span>
                <span className="font-bold text-gray-900">{stats.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Questions Answered:</span>
                <span className="font-bold text-green-600">
                  {stats.answered}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Marked for review:</span>
                <span className="font-bold text-purple-600">
                  {stats.marked}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowSubmitDialog(false)}
                className="flex-1 rounded-lg bg-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-300"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-[#177A9C] py-3 text-sm font-medium text-white hover:bg-[#177A9C]/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
