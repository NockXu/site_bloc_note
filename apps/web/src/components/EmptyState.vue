<script setup lang="ts">
/**
 * EmptyState Component
 * 
 * Displays an empty state message when no content is available.
 * Shows different messages based on user authentication status.
 * Provides appropriate call-to-action for authenticated vs anonymous users.
 */

import { useAuthStore } from "../stores/authStore";

// Get authentication state from store
const authStore = useAuthStore();
</script>

<template>
  <!-- Empty state container with centered content -->
  <div class="text-center py-12">
    <!-- Empty state icon (document icon) -->
    <svg
      class="mx-auto h-16 w-16 text-gray-300 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
    
    <!-- Main empty state message -->
    <p class="text-gray-500 text-lg">No notes available at the moment</p>
    
    <!-- Conditional content based on authentication status -->
    <p v-if="authStore.isAuthenticated" class="text-gray-400 text-sm mt-2">
      Create one to get started!
    </p>
    <p v-else class="text-gray-400 text-sm mt-2">
      <router-link to="/login" class="text-primary-600 hover:text-primary-700 underline">Sign in</router-link> to create and manage your notes!
    </p>
  </div>
</template>
