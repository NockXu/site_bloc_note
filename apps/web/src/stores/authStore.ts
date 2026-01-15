import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import type { User } from '../types/user';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => user.value !== null);

  // Actions
  const login = (userData: User) => {
    user.value = userData;
    // Stocker dans localStorage pour la persistance
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    user.value = null;
    // Supprimer du localStorage
    localStorage.removeItem('user');
  };

  const initAuth = () => {
    // Récupérer l'utilisateur depuis localStorage au démarrage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        localStorage.removeItem('user');
      }
    }
  };

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
