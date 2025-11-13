import {
  QuestionListResponse,
  QuestionStore,
  SubmitAnswersResponse,
} from '@/types/question';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ExtendedQuestionStore extends QuestionStore {
  examResult: SubmitAnswersResponse | null;
  setExamResult: (result: SubmitAnswersResponse) => void;
  clearExamResult: () => void;
}

export const useQuestionStore = create<ExtendedQuestionStore>()(
  devtools(
    (set, get) => ({
      questions: [],
      examConfig: null,
      currentQuestionIndex: 0,
      answers: new Map(),
      markedForReview: new Set(),
      visitedQuestions: new Set(),
      isLoading: false,
      remainingTime: 0,
      examResult: null,

      setQuestions: (data: QuestionListResponse) => {
        set({
          questions: data.questions,
          examConfig: {
            questions_count: data.questions_count,
            total_marks: data.total_marks,
            total_time: data.total_time,
            time_for_each_question: data.time_for_each_question,
            mark_per_each_answer: data.mark_per_each_answer,
            instruction: data.instruction,
          },
          remainingTime: data.total_time * 60, // seconds
          currentQuestionIndex: 0,
          answers: new Map(),
          markedForReview: new Set(),
          visitedQuestions: new Set([data.questions[0]?.question_id]),
        });
      },

      setCurrentQuestion: (index: number) => {
        const { questions, visitedQuestions } = get();
        const questionId = questions[index]?.question_id;

        if (questionId) {
          const newVisited = new Set(visitedQuestions);
          newVisited.add(questionId);

          set({
            currentQuestionIndex: index,
            visitedQuestions: newVisited,
          });
        }
      },

      setAnswer: (questionId: number, optionId: number | null) => {
        const { answers } = get();
        const newAnswers = new Map(answers);
        newAnswers.set(questionId, optionId);

        set({ answers: newAnswers });
      },

      toggleMarkForReview: (questionId: number) => {
        const { markedForReview } = get();
        const newMarked = new Set(markedForReview);

        if (newMarked.has(questionId)) {
          newMarked.delete(questionId);
        } else {
          newMarked.add(questionId);
        }

        set({ markedForReview: newMarked });
      },

      markAsVisited: (questionId: number) => {
        const { visitedQuestions } = get();
        const newVisited = new Set(visitedQuestions);
        newVisited.add(questionId);

        set({ visitedQuestions: newVisited });
      },

      setRemainingTime: (time: number) => {
        set({ remainingTime: time });
      },

      decrementTime: () => {
        const { remainingTime } = get();
        if (remainingTime > 0) {
          set({ remainingTime: remainingTime - 1 });
        }
      },

      setExamResult: (result: SubmitAnswersResponse) => {
        set({ examResult: result });
      },

      clearExamResult: () => {
        set({ examResult: null });
      },

      resetExam: () => {
        set({
          questions: [],
          examConfig: null,
          currentQuestionIndex: 0,
          answers: new Map(),
          markedForReview: new Set(),
          visitedQuestions: new Set(),
          isLoading: false,
          remainingTime: 0,
          examResult: null,
        });
      },

      getQuestionStatus: (questionId: number) => {
        const { answers, markedForReview } = get();
        const isAnswered =
          answers.has(questionId) && answers.get(questionId) !== null;
        const isMarked = markedForReview.has(questionId);

        if (isAnswered && isMarked) return 'answered-marked';
        if (isMarked) return 'marked';
        if (isAnswered) return 'answered';
        return 'not-answered';
      },
    }),
    { name: 'question-store' },
  ),
);

export default useQuestionStore;
