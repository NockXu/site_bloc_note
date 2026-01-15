<script setup lang="ts">
import { onMounted } from "vue";
import { useNotes } from "../composables/useNotes";
import { useAuthStore } from "../stores/authStore";
import type { CreateNoteDto } from "../types/note";
import ErrorMessage from "../components/ErrorMessage.vue";
import NoteForm from "../components/NoteForm.vue";
import NoteList from "../components/NoteList.vue";
import EmptyState from "../components/EmptyState.vue";

// Utilisation du composable pour gérer les notes
const { notes, loading, error, fetchNotesByUserId, createNote, deleteNote } =
  useNotes();

// Utilisation du store d'authentification
const authStore = useAuthStore();

// Chargement initial des notes de l'utilisateur connecté
onMounted(() => {
  if (authStore.user?.id) {
    fetchNotesByUserId(authStore.user.id);
  }
});

// Gestionnaires d'événements
const refreshUserNotes = () => {
  if (authStore.user?.id) {
    fetchNotesByUserId(authStore.user.id);
  }
};

const handleCreateNote = async (data: CreateNoteDto) => {
  await createNote(data);
  // Rafraîchir la liste des notes après création
  refreshUserNotes();
};

const handleFormError = (message: string) => {
  error.value = message;
};

const handleDeleteNote = async (id: number) => {
  await deleteNote(id);
  // Rafraîchir la liste des notes après suppression
  refreshUserNotes();
};

const handleCloseError = () => {
  error.value = null;
};
</script>

<template>
  <div class="min-h-[60vh] py-8">
    <div class="max-w-4xl mx-auto px-4 md:px-8">
      <!-- Titre -->
      <h2 class="text-3xl md:text-4xl font-bold mb-8 text-gray-800 text-center">
        Mes Notes
      </h2>

      <!-- Messages d'erreur -->
      <ErrorMessage :message="error" @close="handleCloseError" />

      <!-- Formulaire de création -->
      <NoteForm
        v-if="authStore.isAuthenticated"
        :loading="loading"
        @create-note="handleCreateNote"
        @error="handleFormError"
      />

      <!-- Liste des notes -->
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
