<template>
  <!-- Error message container with close button -->
  <div
    v-if="message"
    class="flex justify-between items-center bg-red-50 text-red-800 p-4 rounded mb-4 border-l-4 border-red-800"
  >
    <!-- Error message text -->
    <span>{{ message }}</span>
    <!-- Close button to dismiss the error -->
    <button
      @click="emit('close')"
      class="bg-transparent border-none text-red-800 text-2xl cursor-pointer p-0 w-6 h-6 flex items-center justify-center rounded-full transition-colors hover:bg-red-800/10"
      title="Close error"
    >
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * ErrorMessage Component
 * 
 * A reusable component for displaying error messages with a dismiss button.
 * Uses Tailwind CSS for styling and provides a clean, accessible error display.
 */

// Define component props
defineProps<{
  /** The error message to display. If null or empty, the component is hidden */
  message: string | null;
}>();

// Define component events
const emit = defineEmits<{
  /** Emitted when the user clicks the close button */
  close: [];
}>();
</script>
