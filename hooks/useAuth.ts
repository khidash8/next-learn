/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import authService from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { CreateProfileData } from '@/types/auth';

export const useAuth = () => {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setTokens,
    clearAuth,
    setLoading,
  } = useAuthStore();

  /**
   * Send OTP to mobile number
   */
  const sendOTP = useCallback(
    async (mobile: string) => {
      try {
        setLoading(true);
        const response = await authService.sendOTP(mobile);

        if (response.success) {
          return { success: true, message: response.message };
        } else {
          return { success: false, message: response.message };
        }
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to send OTP';
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [setLoading],
  );

  /**
   * Verify OTP and handle login/registration flow
   */
  const verifyOTP = useCallback(
    async (mobile: string, otp: string) => {
      try {
        setLoading(true);
        const response = await authService.verifyOTP(mobile, otp);

        if (response.success) {
          if (
            response.login &&
            response.access_token &&
            response.refresh_token
          ) {
            // User exists and is logged in
            setTokens(response.access_token, response.refresh_token);

            if (response.user) {
              setUser(response.user);
            }

            return {
              success: true,
              login: true,
              message: response.message,
            };
          } else {
            // OTP verified but user needs to complete profile
            return {
              success: true,
              login: false,
              message: response.message,
            };
          }
        }

        return {
          success: false,
          login: false,
          message: response.message,
        };
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to verify OTP';
        return {
          success: false,
          login: false,
          message,
        };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setTokens, setUser],
  );

  /**
   * Create user profile (for new users)
   */
  const createProfile = useCallback(
    async (data: CreateProfileData) => {
      try {
        setLoading(true);
        const response = await authService.createProfile(data);

        if (response.success) {
          setTokens(response.access_token, response.refresh_token);
          setUser(response.user);

          return {
            success: true,
            message: response.message,
          };
        }

        return {
          success: false,
          message: response.message,
        };
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'Failed to create profile';
        return {
          success: false,
          message,
        };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setTokens, setUser],
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      router.push('/login');
    }
  }, [clearAuth, router]);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, [setUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    sendOTP,
    verifyOTP,
    createProfile,
    logout,
    refreshUser,
  };
};

export default useAuth;
