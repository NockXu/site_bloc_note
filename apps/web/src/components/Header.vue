<template>
  <header
    class="bg-gradient-to-r from-primary-500 to-secondary-600 text-white py-8 mb-8 shadow-lg"
  >
    <div
      class="max-w-7xl mx-auto px-8 flex flex-wrap justify-between items-center gap-4"
    >
      <div class="logo">
        <h1 class="text-3xl font-bold m-0">Bloc Notes</h1>
      </div>

      <nav class="flex gap-6">
        <router-link
          to="/"
          class="text-white no-underline px-4 py-2 rounded transition-all duration-300 font-medium hover:bg-white/10"
          :class="{ 'bg-white/20': isActive('home') }"
        >
          Accueil
        </router-link>
        <router-link
          to="/posts"
          class="text-white no-underline px-4 py-2 rounded transition-all duration-300 font-medium hover:bg-white/10"
          :class="{ 'bg-white/20': isActive('posts') }"
        >
          Voir les posts
        </router-link>
        <router-link
          v-if="!authStore.isAuthenticated"
          to="/login"
          class="text-white no-underline px-4 py-2 rounded transition-all duration-300 font-medium hover:bg-white/10"
          :class="{ 'bg-white/20': isActive('login') }"
        >
          Se connecter
        </router-link>
        <button
          v-else-if="authStore.isAuthenticated"
          @click="authStore.logout"
          class="text-white no-underline px-4 py-2 rounded transition-all duration-300 font-medium hover:bg-white/10"
        >
          Se deconnecter
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();

const route = useRoute();

const isActive = (name: string) => {
  return route.name === name;
};
</script>
