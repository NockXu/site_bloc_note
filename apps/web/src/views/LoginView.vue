<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUsers } from "../composables/useUsers";
import LoginForm from "../components/LoginForm.vue";
import RegisterForm from "../components/RegisterForm.vue";
import { comparePassword, hashPassword } from "../utils/auth";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const { createUser, fetchUserByUsername } = useUsers();
const authStore = useAuthStore();

const isLogin = ref(true);
const loading = ref(false);
const error = ref<string | null>(null);

// Initialiser l'auth au montage du composant
onMounted(() => {
  authStore.initAuth();
});

const handleLogin = async (data: { username: string; password: string }) => {
  try {
    loading.value = true;
    error.value = null;
    
    const user = await fetchUserByUsername(data.username);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Mot de passe incorrect");
    } else {
      authStore.login(user);
      router.push("/");
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Une erreur est survenue";
  } finally {
    loading.value = false;
  }
};

const handleRegister = async (data: { username: string; password: string }) => {
  try {
    loading.value = true;
    error.value = null;
    
    const hashedPassword = await hashPassword(data.password);
    await createUser({
      username: data.username,
      password: hashedPassword,
    });
    
    // Après l'inscription, on bascule vers le login
    isLogin.value = true;
    error.value = null;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Une erreur est survenue";
  } finally {
    loading.value = false;
  }
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = null;
};

const handleCloseError = () => {
  error.value = null;
};
</script>

<template>
  <LoginForm
    v-if="isLogin"
    :loading="loading"
    :error="error"
    @submit="handleLogin"
    @close-error="handleCloseError"
    @toggle-mode="toggleMode"
  />
  <RegisterForm
    v-else
    :loading="loading"
    :error="error"
    @submit="handleRegister"
    @close-error="handleCloseError"
    @toggle-mode="toggleMode"
  />
</template>