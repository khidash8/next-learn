import apiClient from '@/lib/axios';
import {
  CreateProfileData,
  CreateProfileResponse,
  SendOTPResponse,
  User,
  VerifyOTPResponse,
} from '@/types/auth';

export const authService = {
  /**
   * Send OTP to mobile number
   */
  sendOTP: async (mobile: string): Promise<SendOTPResponse> => {
    const formData = new FormData();
    formData.append('mobile', mobile);

    const response = await apiClient.post<SendOTPResponse>(
      '/auth/send-otp',
      formData,
    );
    return response.data;
  },

  /**
   * Verify OTP
   */
  verifyOTP: async (
    mobile: string,
    otp: string,
  ): Promise<VerifyOTPResponse> => {
    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('otp', otp);

    const response = await apiClient.post<VerifyOTPResponse>(
      '/auth/verify-otp',
      formData,
    );
    return response.data;
  },

  /**
   * Create user profile
   */
  createProfile: async (
    data: CreateProfileData,
  ): Promise<CreateProfileResponse> => {
    const formData = new FormData();
    formData.append('mobile', data.mobile);
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('qualification', data.qualification);
    formData.append('profile_image', data.profile_image);

    const response = await apiClient.post<CreateProfileResponse>(
      '/auth/create-profile',
      formData,
    );
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

export default authService;
