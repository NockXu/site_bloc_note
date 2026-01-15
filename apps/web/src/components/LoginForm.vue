<script setup lang="ts">
import { ref } from "vue";

interface LoginFormProps {
  loading?: boolean;
  error?: string | null;
}

interface LoginFormEmits {
  (e: "submit", data: { username: string; password: string }): void;
  (e: "close-error"): void;
}

const props = withDefaults(defineProps<LoginFormProps>(), {
  loading: false,
  error: null,
});

const emit = defineEmits<LoginFormEmits>();

const formData = ref({
  username: "",
  password: "",
});

const handleSubmit = () => {
  if (formData.value.username.trim() && formData.value.password.trim()) {
    emit("submit", { ...formData.value });
  }
};

const handleCloseError = () => {
  emit("close-error");
};
</script>

<template>
  <div class="min-h-[60vh] py-8">
    <div class="max-w-4xl mx-auto px-4 md:px-8">
      <!-- Titre -->
      <h2 class="text-3xl md:text-4xl font-bold mb-8 text-gray-800 text-center">
        Connexion
      </h2>

      <div class="max-w-md mx-auto">
        <!-- Messages d'erreur -->
        <div
          v-if="error"
          class="rounded-md bg-red-50 p-4 border border-red-200 mb-6"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
            <div class="ml-auto pl-3">
              <button
                @click="handleCloseError"
                class="text-red-400 hover:text-red-500"
              >
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Formulaire -->
        <div class="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  v-model="formData.username"
                  name="username"
                  type="text"
                  required
                  :disabled="loading"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                  placeholder="Entrez votre nom d'utilisateur"
                />
              </div>
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  id="password"
                  v-model="formData.password"
                  name="password"
                  type="password"
                  required
                  :disabled="loading"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                  placeholder="Entrez votre mot de passe"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                :disabled="loading || !formData.username.trim() || !formData.password.trim()"
                class="w-full px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium transition-all hover:from-primary-600 hover:to-primary-700 hover:shadow-lg disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                <svg
                  v-if="loading"
                  class="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ loading ? "Chargement..." : "Se connecter" }}
              </button>
            </div>
          </form>

          <!-- Lien vers inscription -->
          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Pas encore de compte ?
              <button
                @click="$emit('toggle-mode')"
                class="font-medium text-primary-600 hover:text-primary-500 focus:outline-none"
              >
                S'inscrire
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
