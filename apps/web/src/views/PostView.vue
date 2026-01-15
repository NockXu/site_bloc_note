<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useNotes } from "../composables/useNotes";
import ErrorMessage from "../components/ErrorMessage.vue";

// Utilisation du composable pour gérer les notes
const { notes, loading, error, fetchNotes, createNote, deleteNote } =
  useNotes();

const newNoteTitle = ref("");
const newNoteContent = ref("");
const selectedUserId = ref(1);

// Chargement initial des notes
onMounted(() => {
  fetchNotes();
});

// Gestionnaires d'événements
const handleCreateNote = async () => {
  if (!newNoteTitle.value.trim() || !newNoteContent.value.trim()) return;
  await createNote({ 
    titre: newNoteTitle.value, 
    contenu: newNoteContent.value,
    userId: selectedUserId.value
  });
  newNoteTitle.value = "";
  newNoteContent.value = "";
};

const handleDeleteNote = async (id: number) => {
  await deleteNote(id);
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
        Liste des notes
      </h2>

      <!-- Messages d'erreur -->
      <ErrorMessage :message="error" @close="handleCloseError" />

      <!-- Formulaire de création -->
      <div
        class="bg-white rounded-lg p-6 shadow-md mb-8 border border-gray-200"
      >
        <h3 class="text-xl font-semibold mb-4 text-gray-700">
          Créer une nouvelle note
        </h3>
        <form
          @submit.prevent="handleCreateNote"
          class="flex flex-col gap-4"
        >
          <input
            v-model="newNoteTitle"
            type="text"
            placeholder="Titre de la note"
            :disabled="loading"
            class="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          />
          <textarea
            v-model="newNoteContent"
            placeholder="Contenu de la note"
            :disabled="loading"
            rows="4"
            class="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all resize-none"
          ></textarea>
          <input
            v-model="selectedUserId"
            type="number"
            placeholder="ID utilisateur"
            :disabled="loading"
            min="1"
            class="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          />
          <button
            type="submit"
            :disabled="loading || !newNoteTitle.trim() || !newNoteContent.trim()"
            class="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium transition-all hover:from-primary-600 hover:to-primary-700 hover:shadow-lg disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {{ loading ? "Ajout..." : "Ajouter" }}
          </button>
        </form>
      </div>

      <!-- Liste des notes -->
      <div class="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-700">Liste des notes</h3>
          <span
            class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
          >
            {{ notes.length }} {{ notes.length > 1 ? "notes" : "note" }}
          </span>
        </div>

        <!-- État de chargement -->
        <div v-if="loading && notes.length === 0" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"
          ></div>
          <p class="mt-4 text-gray-500">Chargement...</p>
        </div>

        <!-- Liste vide -->
        <div v-else-if="notes.length === 0" class="text-center py-12">
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
          <p class="text-gray-400 text-sm mt-2">Créez-en une pour commencer !</p>
        </div>

        <!-- Liste des notes -->
        <ul v-else class="divide-y divide-gray-100">
          <li
            v-for="note in notes"
            :key="note.id"
            class="flex justify-between items-start py-4 px-2 transition-all hover:bg-gray-50 rounded-lg group"
          >
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-gray-800 mb-2">{{ note.titre }}</h4>
              <p class="text-gray-600 mb-2">{{ note.contenu }}</p>
              <p class="text-sm text-gray-400">Utilisateur ID: {{ note.userId }}</p>
            </div>
            <button
              @click="handleDeleteNote(note.id)"
              class="px-4 py-2 bg-red-500 text-white rounded-lg transition-all hover:bg-red-600 hover:shadow-md opacity-0 group-hover:opacity-100"
              title="Supprimer"
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
    </div>
  </div>
</template>
