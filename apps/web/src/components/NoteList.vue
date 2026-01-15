<script setup lang="ts">
/**
 * NoteList Component
 * 
 * Displays a list of notes with delete functionality.
 * Provides user notifications for actions.
 * Supports loading states and empty list handling.
 */
import { ref } from "vue";
import type { Note } from "../types/note";

// Define component props
interface Props {
  /** Array of notes to display */
  notes: Note[];
  /** Whether the component is in loading state */
  loading: boolean;
}

// Define component props
const props = withDefaults(defineProps<Props>(), {
  notes: () => [],
  loading: false,
});

// Define component emits
const emit = defineEmits<{
  /** Emitted when a note is deleted */
  deleteNote: [id: number];
}>();

// Notification state
const notification = ref<{
  type: "success" | "error" | null; // Notification type
  message: string; // Notification message
  show: boolean; // Notification visibility
}>({
  type: null,
  message: "",
  show: false,
});

/**
 * Show notification with auto-hide
 * @param type - Notification type (success/error)
 * @param message - Message to display
 */
const showNotification = (type: "success" | "error", message: string) => {
  notification.value = { type, message, show: true };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

/**
 * Handle note deletion
 * Emits deleteNote event and shows notification
 * @param id - ID of the note to delete
 */
const handleDeleteNote = async (id: number) => {
  try {
    emit("deleteNote", id);
    showNotification("success", "Note deleted successfully!");
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Error deleting note";
    showNotification("error", errorMsg);
  }
};

/**
 * Format date for display
 * @param dateString - Date string to format
 * @returns Formatted date string
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US");
};
</script>

<template>
  <!-- Notification -->
  <transition
    name="notification"
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="transform translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-2 opacity-0"
  >
    <div
      v-if="notification.show"
      :class="{
        'bg-green-50 border-green-200 text-green-800': notification.type === 'success',
        'bg-red-50 border-red-200 text-red-800': notification.type === 'error',
      }"
      class="mb-4 p-4 rounded-lg border flex items-center gap-3 shadow-sm"
    >
      <!-- Success Icon -->
      <svg
        v-if="notification.type === 'success'"
        class="w-5 h-5 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      
      <!-- Error Icon -->
      <svg
        v-else-if="notification.type === 'error'"
        class="w-5 h-5 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      
      <span class="flex-1">{{ notification.message }}</span>
      
      <!-- Close Button -->
      <button
        @click="notification.show = false"
        class="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </transition>

  <!-- Notes Container -->
  <div class="bg-white rounded-lg p-6 shadow-md border border-gray-200">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold text-gray-700">Notes List</h3>
      <span
        class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
      >
        {{ notes.length }} {{ notes.length > 1 ? "notes" : "note" }}
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="loading && notes.length === 0" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"
      ></div>
      <p class="mt-4 text-gray-500">Loading...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="notes.length === 0" class="text-center py-12">
      <slot name="empty-message">
        <p class="text-gray-500 text-lg">No notes available</p>
        <p class="text-gray-400 text-sm mt-2">Create one to get started!</p>
      </slot>
    </div>

    <!-- Notes List -->
    <ul v-else class="divide-y divide-gray-100">
      <li
        v-for="note in notes"
        :key="note.id"
        class="flex justify-between items-start py-4 px-2 transition-all hover:bg-gray-50 rounded-lg group"
      >
        <!-- Note Content -->
        <div class="flex-1">
          <h4 class="text-lg font-semibold text-gray-800 mb-2">{{ note.titre }}</h4>
          <p class="text-gray-600 mb-2">{{ note.contenu }}</p>
          <p class="text-sm text-gray-400">
            Created by: 
            <span v-if="note.user" class="font-medium text-gray-600">{{ note.user.username }}</span>
            <span v-else class="text-gray-500">User #{{ note.userId }}</span>
          </p>
        </div>
        
        <!-- Delete Button -->
        <button
          @click="handleDeleteNote(note.id)"
          class="px-4 py-2 bg-red-500 text-white rounded-lg transition-all hover:bg-red-600 hover:shadow-md opacity-0 group-hover:opacity-100"
          title="Delete"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>
