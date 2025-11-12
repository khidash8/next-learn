export interface QuestionOption {
  id: number;
  option: string;
  is_correct?: boolean;
  image: string | null;
}

export interface Question {
  question_id: number;
  number: number;
  question: string;
  comprehension: string | null;
  image: string | null;
  options: QuestionOption[];
}

export interface QuestionListResponse {
  success: boolean;
  questions_count: number;
  total_marks: number;
  total_time: number;
  time_for_each_question: number;
  mark_per_each_answer: number;
  instruction: string;
  questions: Question[];
}

export interface Answer {
  question_id: number;
  selected_option_id: number | null;
}

export interface SubmitAnswersResponse {
  success: boolean;
  exam_history_id: string;
  score: number;
  correct: number;
  wrong: number;
  not_attended: number;
  submitted_at: string;
  details: Array<{
    question_id: number;
    is_correct: boolean;
    selected_option_id: number | null;
    correct_option_id: number;
  }>;
}

export interface QuestionState {
  currentQuestionIndex: number;
  answers: Map<number, number | null>;
  markedForReview: Set<number>;
  visitedQuestions: Set<number>;
}

export interface QuestionStore extends QuestionState {
  questions: Question[];
  examConfig: {
    questions_count: number;
    total_marks: number;
    total_time: number;
    time_for_each_question: number;
    mark_per_each_answer: number;
    instruction: string;
  } | null;
  isLoading: boolean;
  remainingTime: number;

  setQuestions: (data: QuestionListResponse) => void;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: number, optionId: number | null) => void;
  toggleMarkForReview: (questionId: number) => void;
  markAsVisited: (questionId: number) => void;
  setRemainingTime: (time: number) => void;
  decrementTime: () => void;
  resetExam: () => void;
  getQuestionStatus: (
    questionId: number,
  ) => 'answered' | 'not-answered' | 'marked' | 'answered-marked';
}
