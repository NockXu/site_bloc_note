/**
 * Authentication Store
 * 
 * Pinia store for managing user authentication state.
 * Handles user login/logout and session persistence.
 * Provides reactive authentication status across the application.
 */
import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import type { User } from '../types/user';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null); // Current authenticated user
  const isAuthenticated = computed(() => user.value !== null); // Authentication status

  // Actions

  /**
   * Log in a user and store session
   * @param userData - User information to store
   * @param token - Optional authentication token
   */
  const login = (userData: User, token?: string) => {
    user.value = userData;
    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('authToken', token);
    }
  };

  /**
   * Log out current user and clear session
   */
  const logout = () => {
    user.value = null;
    // Remove from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  /**
   * Initialize authentication state from localStorage
   * Called on app startup to restore user session
   */
  const initAuth = () => {
    // Retrieve user from localStorage on app startup
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
        console.log('User restored from localStorage:', user.value);
      } catch (error) {
        console.error('Error retrieving user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    
    if (storedToken) {
      console.log('Authentication token restored');
    }
  };

  // Return state and actions
  return {
    // State
    user: readonly(user),
    isAuthenticated,
    
    // Actions
    login,
    logout,
    initAuth,
  };
});
