<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/authStore";
import type { CreateNoteDto } from "../types/note";

interface Props {
  loading: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  createNote: [data: CreateNoteDto];
  error: [message: string];
}>();

const authStore = useAuthStore();

const title = ref("");
const content = ref("");
const notification = ref<{
  type: "success" | "error" | null;
  message: string;
  show: boolean;
}>({
  type: null,
  message: "",
  show: false,
});

// Validation
const isFormValid = computed(() => {
  return title.value.trim().length > 0 && content.value.trim().length > 0;
});

const titleError = computed(() => {
  if (title.value.trim().length === 0) return "Le titre est requis";
  if (title.value.trim().length > 100) return "Le titre ne doit pas dépasser 100 caractères";
  return null;
});

const contentError = computed(() => {
  if (content.value.trim().length === 0) return "Le contenu est requis";
  if (content.value.trim().length > 2000) return "Le contenu ne doit pas dépasser 2000 caractères";
  return null;
});

const hasErrors = computed(() => {
  return titleError.value !== null || contentError.value !== null;
});

const showNotification = (type: "success" | "error", message: string) => {
  notification.value = { type, message, show: true };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
};

const handleCreateNote = async () => {
  if (!isFormValid.value || hasErrors.value) {
    return;
  }

  if (!authStore.user?.id) {
    const errorMsg = "Utilisateur non connecté";
    emit("error", errorMsg);
    showNotification("error", errorMsg);
    return;
  }

  const noteData: CreateNoteDto = {
    titre: title.value.trim(),
    contenu: content.value.trim(),
    userId: authStore.user.id,
  };

  try {
    emit("createNote", noteData);
    showNotification("success", "Note créée avec succès !");
    
    // Réinitialiser le formulaire
    title.value = "";
    content.value = "";
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Erreur lors de la création de la note";
    showNotification("error", errorMsg);
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && event.ctrlKey) {
    event.preventDefault();
    handleCreateNote();
  }
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
      <!-- Icône succès -->
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
      
      <!-- Icône erreur -->
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
      
      <!-- Bouton fermer -->
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

  <div class="bg-white rounded-lg p-6 shadow-md mb-8 border border-gray-200">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-gray-700">
        Créer une nouvelle note
      </h3>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Ctrl+Entrée pour envoyer</span>
      </div>
    </div>

    <form @submit.prevent="handleCreateNote" class="space-y-4">
      <!-- Champ Titre -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
          Titre <span class="text-red-500">*</span>
        </label>
        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="Donnez un titre à votre note..."
          :disabled="loading"
          maxlength="100"
          @keydown="handleKeyDown"
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          :class="{
            'border-red-300 focus:border-red-500 focus:ring-red-100': titleError,
          }"
        />
        <div class="flex justify-between items-center mt-1">
          <p v-if="titleError" class="text-sm text-red-600">
            {{ titleError }}
          </p>
          <p v-else class="text-sm text-gray-400">
            {{ title.trim().length }}/100 caractères
          </p>
        </div>
      </div>

      <!-- Champ Contenu -->
      <div>
        <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
          Contenu <span class="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          v-model="content"
          placeholder="Écrivez le contenu de votre note..."
          :disabled="loading"
          rows="6"
          maxlength="2000"
          @keydown="handleKeyDown"
          class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all resize-none"
          :class="{
            'border-red-300 focus:border-red-500 focus:ring-red-100': contentError,
          }"
        ></textarea>
        <div class="flex justify-between items-center mt-1">
          <p v-if="contentError" class="text-sm text-red-600">
            {{ contentError }}
          </p>
          <p v-else class="text-sm text-gray-400">
            {{ content.trim().length }}/2000 caractères
          </p>
        </div>
      </div>

      <!-- Bouton de soumission -->
      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="title = ''; content = ''"
          :disabled="loading"
          class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Effacer
        </button>
        <button
          type="submit"
          :disabled="loading || !isFormValid || hasErrors"
          class="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium transition-all hover:from-primary-600 hover:to-primary-700 hover:shadow-lg disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
        >
          <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? "Création..." : "Créer la note" }}
        </button>
      </div>
    </form>
  </div>
</template>
