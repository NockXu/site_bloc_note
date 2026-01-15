<script setup lang="ts">
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();
</script>

<template>
  <div class="text-center py-12">
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
    <p class="text-gray-500 text-lg">Aucune note pour le moment</p>
    <p v-if="authStore.isAuthenticated" class="text-gray-400 text-sm mt-2">
      Créez-en une pour commencer !
    </p>
    <p v-else class="text-gray-400 text-sm mt-2">
      <router-link to="/login" class="text-primary-600 hover:text-primary-700 underline">Connectez-vous</router-link> pour créer et gérer vos notes !
    </p>
  </div>
</template>
