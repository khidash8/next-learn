import apiClient from '@/lib/axios';
import {
  Answer,
  QuestionListResponse,
  SubmitAnswersResponse,
} from '@/types/question';

export const questionService = {
  /**
   * Get all exam questions
   */
  getQuestions: async (): Promise<QuestionListResponse> => {
    const response =
      await apiClient.get<QuestionListResponse>('/question/list');
    return response.data;
  },

  /**
   * Submit exam answers
   */
  submitAnswers: async (answers: Answer[]): Promise<SubmitAnswersResponse> => {
    const formData = new FormData();
    formData.append('answers', JSON.stringify(answers));

    const response = await apiClient.post<SubmitAnswersResponse>(
      '/answers/submit',
      formData,
    );
    return response.data;
  },
};

export default questionService;
