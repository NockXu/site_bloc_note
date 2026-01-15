<template>
  <!-- Application Header -->
  <header
    class="bg-gradient-to-r from-primary-500 to-secondary-600 text-white py-8 mb-8 shadow-lg"
  >
    <div
      class="max-w-7xl mx-auto px-8 flex flex-wrap justify-between items-center gap-4"
    >
      <!-- Application Logo -->
      <div class="logo">
        <h1 class="text-3xl font-bold m-0">Bloc Notes</h1>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex gap-6">
        <!-- Home Link -->
        <router-link
          to="/"
          class="text-white no-underline px-4 py-2 rounded transition-all duration-300 font-medium hover:bg-white/10"
          :class="{ 'bg-white/20': isActive('home') }"
        >
          Home
        </router-link>
        
        <!-- My Notes Link -->
        <router-link
          to="/posts"
          class="text-white no-underline px-4 py-2 rounded transition-all duration-300 font-medium hover:bg-white/10"
          :class="{ 'bg-white/20': isActive('posts') }"
        >
          My Notes
        </router-link>
        
        <!-- Login Link (shown when not authenticated) -->
        <router-link
          v-if="!authStore.isAuthenticated"
          to="/login"
          class="text-white no-underline px-4 py-2 rounded transition-all duration-300 font-medium hover:bg-white/10"
          :class="{ 'bg-white/20': isActive('login') }"
        >
          Sign In
        </router-link>
        
        <!-- Logout Button (shown when authenticated) -->
        <button
          v-else-if="authStore.isAuthenticated"
          @click="authStore.logout"
          class="text-white no-underline px-4 py-2 rounded transition-all duration-300 font-medium hover:bg-white/10"
        >
          Sign Out
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * Header Component
 * 
 * Application header with navigation and authentication controls.
 * Displays logo, navigation links, and login/logout functionality.
 * Uses Tailwind CSS for responsive design and hover effects.
 */

import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/authStore";

// Get authentication store and current route
const authStore = useAuthStore();
const route = useRoute();

/**
 * Check if a route is currently active
 * @param name - Route name to check
 * @returns boolean - True if route is active
 */
const isActive = (name: string) => {
  return route.name === name;
};
</script>
