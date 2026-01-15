<template>
  <footer class="mt-16 py-8 border-t border-gray-200 bg-gray-50">
    <div class="max-w-7xl mx-auto px-8 text-center">
      <p class="mb-4 text-gray-600 text-sm">
        © {{ currentYear }} Site Bloc Note - Développé par
        <a
          href="https://github.com/NockXu"
          target="_blank"
          rel="noopener"
          class="text-primary-500 no-underline font-medium transition-colors hover:text-secondary-600 hover:underline"
        >
          DAVID Gabriel
        </a>
        &
        <a
          href="https://github.com/TarzanHR"
          target="_blank"
          rel="noopener"
          class="text-primary-500 no-underline font-medium transition-colors hover:text-secondary-600 hover:underline"
        >
          GUILMIN Leny
        </a>
      </p>
      <div class="flex justify-center items-center gap-3 text-sm">
        <a
          href="https://github.com/NockXu/site_bloc_note"
          target="_blank"
          rel="noopener"
          class="text-gray-600 no-underline transition-colors hover:text-primary-500"
        >
          GitHub
        </a>
        <span class="text-gray-300">•</span>
        <router-link
          to="/about"
          class="text-gray-600 no-underline transition-colors hover:text-primary-500"
        >
          À propos
        </router-link>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>
