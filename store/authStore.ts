import { AuthStore, User } from '@/types/auth';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Cookie utilities for Next.js
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name: string): string | undefined => {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        accessToken: null,
        refreshToken: null,

        /**
         * Set user data
         */
        setUser: (user: User | null) => {
          set({
            user,
            isAuthenticated: !!user,
          });
        },

        /**
         * Set authentication tokens
         */
        setTokens: (accessToken: string, refreshToken: string) => {
          // Store tokens in cookies
          setCookie('access_token', accessToken, 7); // 7 days
          setCookie('refresh_token', refreshToken, 30); // 30 days

          set({
            accessToken,
            refreshToken,
            isAuthenticated: true,
          });
        },

        /**
         * Clear authentication data
         */
        clearAuth: () => {
          // Remove tokens from cookies
          deleteCookie('access_token');
          deleteCookie('refresh_token');

          set({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
          });
        },

        /**
         * Set loading state
         */
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        /**
         * Initialize auth from cookies on app start
         */
        initializeAuth: () => {
          try {
            const accessToken = getCookie('access_token');
            const refreshToken = getCookie('refresh_token');

            if (accessToken) {
              // Optional: Decode JWT to check expiration
              // This is basic validation - adjust based on your JWT structure
              try {
                // Simple check - you might want more sophisticated validation
                const tokenParts = accessToken.split('.');
                if (tokenParts.length === 3) {
                  set({
                    accessToken,
                    refreshToken: refreshToken || null,
                    isAuthenticated: true,
                    isLoading: false,
                  });
                  return;
                }
              } catch (error) {
                console.error('Invalid token format:', error);
              }
            }

            // No valid token found
            set({
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
              user: null,
            });
          } catch (error) {
            console.error('Error initializing auth:', error);
            set({
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
              user: null,
            });
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
  ),
);

export default useAuthStore;
