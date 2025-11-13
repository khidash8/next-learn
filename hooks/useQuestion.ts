/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import questionService from '@/services/questionService';
import { useQuestionStore } from '@/store/questionStore';
import { Answer } from '@/types/question';

export const useQuestion = () => {
  const router = useRouter();
  const {
    questions,
    examConfig,
    currentQuestionIndex,
    answers,
    markedForReview,
    visitedQuestions,
    remainingTime,
    isLoading,
    setQuestions,
    setCurrentQuestion,
    setAnswer,
    toggleMarkForReview,
    decrementTime,
    resetExam,
    getQuestionStatus,
    setExamResult,
  } = useQuestionStore();

  /**
   * Load exam questions
   */
  const loadQuestions = useCallback(async () => {
    try {
      const data = await questionService.getQuestions();
      setQuestions(data);
      return { success: true };
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to load questions';
      return { success: false, message };
    }
  }, [setQuestions]);

  /**
   * Submit exam answers
   */
  const submitExam = useCallback(async () => {
    try {
      const answersArray: Answer[] = questions.map((q) => ({
        question_id: q.question_id,
        selected_option_id: answers.get(q.question_id) ?? null,
      }));

      const result = await questionService.submitAnswers(answersArray);

      // Store result in Zustand instead of resetting
      setExamResult(result);

      return { success: true, data: result };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to submit exam';
      return { success: false, message };
    }
  }, [questions, answers, setExamResult]);

  /**
   * Navigate to next question
   */
  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestion(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions.length, setCurrentQuestion]);

  /**
   * Navigate to previous question
   */
  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestion(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, setCurrentQuestion]);

  /**
   * Jump to specific question
   */
  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setCurrentQuestion(index);
      }
    },
    [questions.length, setCurrentQuestion],
  );

  /**
   * Answer current question
   */
  const answerQuestion = useCallback(
    (optionId: number) => {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        setAnswer(currentQuestion.question_id, optionId);
      }
    },
    [currentQuestionIndex, questions, setAnswer],
  );

  /**
   * Mark current question for review
   */
  const markCurrentForReview = useCallback(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      toggleMarkForReview(currentQuestion.question_id);
    }
  }, [currentQuestionIndex, questions, toggleMarkForReview]);

  /**
   * Get statistics
   */
  const getStats = useCallback(() => {
    const answered = Array.from(answers.values()).filter(
      (v) => v !== null,
    ).length;
    const notAnswered = questions.length - answered;
    const marked = markedForReview.size;
    const notVisited = questions.length - visitedQuestions.size;

    return {
      answered,
      notAnswered,
      marked,
      notVisited,
      total: questions.length,
    };
  }, [questions.length, answers, markedForReview, visitedQuestions]);

  /**
   * Timer countdown
   */
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        decrementTime();
      }, 1000);

      return () => clearInterval(timer);
    } else if (remainingTime === 0 && questions.length > 0) {
      // Auto-submit when time runs out
      submitExam().then((result) => {
        if (result.success) {
          router.push(`/results/${result.data?.exam_history_id}`);
        }
      });
    }
  }, [remainingTime, questions.length, decrementTime, submitExam, router]);

  return {
    questions,
    examConfig,
    currentQuestion: questions[currentQuestionIndex],
    currentQuestionIndex,
    answers,
    markedForReview,
    visitedQuestions,
    remainingTime,
    isLoading,
    loadQuestions,
    submitExam,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    answerQuestion,
    markCurrentForReview,
    getQuestionStatus,
    getStats,
    resetExam,
  };
};

export default useQuestion;
