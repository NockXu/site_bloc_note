<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useNotes } from "../composables/useNotes";
import ErrorMessage from "../components/ErrorMessage.vue";

// Utilisation du composable pour gérer les notes
const { loading, error, fetchRecentNotes } = useNotes();

const recentNotes = ref<any[]>([]);

// Chargement initial des notes récentes
onMounted(async () => {
  try {
    recentNotes.value = await fetchRecentNotes(10);
  } catch (error) {
    console.error("Erreur lors du chargement des notes récentes:", error);
  }
});

const handleCloseError = () => {
  error.value = null;
};
</script>

<template>
  <div class="min-h-[60vh] py-8">
    <div class="max-w-4xl mx-auto px-4 md:px-8">
      <!-- Titre -->
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Bienvenue sur votre Bloc Notes
        </h2>
        <p class="text-lg text-gray-600">
          Découvrez les dernières notes partagées par la communauté
        </p>
      </div>

      <!-- Messages d'erreur -->
      <ErrorMessage :message="error" @close="handleCloseError" />

      <!-- Liste des notes récentes -->
      <div class="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <div class="mb-6">
          <h3 class="text-xl font-semibold text-gray-700">
            📝 Les 10 dernières notes
          </h3>
          <p class="text-sm text-gray-500 mt-1">
            Découvrez les dernières notes partagées par toute la communauté
          </p>
        </div>

        <!-- État de chargement -->
        <div v-if="loading && recentNotes.length === 0" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"
          ></div>
          <p class="mt-4 text-gray-500">Chargement des notes récentes...</p>
        </div>

        <!-- Liste vide -->
        <div v-else-if="recentNotes.length === 0" class="text-center py-12">
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
          <p class="text-gray-500 text-lg">Aucune note récente</p>
          <p class="text-gray-400 text-sm mt-2">
            Soyez le premier à partager une note !
          </p>
        </div>

        <!-- Liste des notes récentes -->
        <ul v-else class="divide-y divide-gray-100">
          <li
            v-for="note in recentNotes"
            :key="note.id"
            class="flex justify-between items-start py-4 px-2 transition-all hover:bg-gray-50 rounded-lg group"
          >
            <div class="flex-1">
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1">
                  <h4 class="text-lg font-semibold text-gray-800 mb-2">
                    {{ note.titre }}
                  </h4>
                  <p class="text-gray-600 mb-2 line-clamp-3">
                    {{ note.contenu }}
                  </p>
                  <div class="flex items-center gap-4 text-sm text-gray-400">
                    <span>
                      Créée par : 
                      <span v-if="note.user" class="font-medium text-gray-600">
                        {{ note.user.username }}
                      </span>
                      <span v-else class="text-gray-500">
                        Utilisateur #{{ note.userId }}
                      </span>
                    </span>
                    <span v-if="note.createdAt" class="text-gray-400">
                      {{ new Date(note.createdAt).toLocaleDateString('fr-FR') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
}
</style>
