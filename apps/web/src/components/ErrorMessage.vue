<template>
  <div
    v-if="message"
    class="flex justify-between items-center bg-red-50 text-red-800 p-4 rounded mb-4 border-l-4 border-red-800"
  >
    <span>{{ message }}</span>
    <button
      @click="emit('close')"
      class="bg-transparent border-none text-red-800 text-2xl cursor-pointer p-0 w-6 h-6 flex items-center justify-center rounded-full transition-colors hover:bg-red-800/10"
      title="Fermer"
    >
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string | null;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>
