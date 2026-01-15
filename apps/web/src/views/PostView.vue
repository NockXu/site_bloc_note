<script setup lang="ts">
/**
 * PostView Component
 * 
 * User's personal notes management view.
 * Displays, creates, and deletes notes for the authenticated user.
 * Provides form for creating new notes and list for managing existing ones.
 */
import { onMounted } from "vue";
import { useNotes } from "../composables/useNotes";
import { useAuthStore } from "../stores/authStore";
import type { CreateNoteDto } from "../types/note";
import ErrorMessage from "../components/ErrorMessage.vue";
import NoteForm from "../components/NoteForm.vue";
import NoteList from "../components/NoteList.vue";
import EmptyState from "../components/EmptyState.vue";

// Notes management composable
const { notes, loading, error, fetchNotesByUserId, createNote, deleteNote } =
  useNotes();

// Authentication store
const authStore = useAuthStore();

/**
 * Component lifecycle hook
 * Load user's notes when component mounts
 */
onMounted(() => {
  if (authStore.user?.id) {
    fetchNotesByUserId(authStore.user.id);
  }
});

// Event handlers

/**
 * Refresh user's notes from the server
 * Called after create/delete operations to sync data
 */
const refreshUserNotes = () => {
  if (authStore.user?.id) {
    fetchNotesByUserId(authStore.user.id);
  }
};

/**
 * Handle note creation
 * Creates new note and refreshes the list
 * @param data - Note data to create
 */
const handleCreateNote = async (data: CreateNoteDto) => {
  await createNote(data);
  // Refresh notes list after creation
  refreshUserNotes();
};

/**
 * Handle form error display
 * Sets error message from form components
 * @param message - Error message to display
 */
const handleFormError = (message: string) => {
  error.value = message;
};

/**
 * Handle note deletion
 * Deletes note and refreshes the list
 * @param id - ID of note to delete
 */
const handleDeleteNote = async (id: number) => {
  await deleteNote(id);
  // Refresh notes list after deletion
  refreshUserNotes();
};

/**
 * Handle error message close
 * Clears the error state
 */
const handleCloseError = () => {
  error.value = null;
};
</script>

<template>
  <div class="min-h-[60vh] py-8">
    <div class="max-w-4xl mx-auto px-4 md:px-8">
      <!-- Page Title -->
      <h2 class="text-3xl md:text-4xl font-bold mb-8 text-gray-800 text-center">
        My Notes
      </h2>

      <!-- Error Messages -->
      <ErrorMessage :message="error" @close="handleCloseError" />

      <!-- Note Creation Form -->
      <NoteForm
        v-if="authStore.isAuthenticated"
        :loading="loading"
        @create-note="handleCreateNote"
        @error="handleFormError"
      />

      <!-- Notes List -->
      <NoteList
        :notes="notes"
        :loading="loading"
        @delete-note="handleDeleteNote"
      >
        <template #empty-message>
          <EmptyState />
        </template>
      </NoteList>
    </div>
  </div>
</template>
