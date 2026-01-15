<script setup lang="ts">
/**
 * LoginView Component
 * 
 * Authentication view that handles both login and registration.
 * Switches between login and registration forms.
 * Manages user authentication state and redirects authenticated users.
 */
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUsers } from "../composables/useUsers";
import LoginForm from "../components/LoginForm.vue";
import RegisterForm from "../components/RegisterForm.vue";
import { comparePassword, hashPassword } from "../utils/auth";
import { useAuthStore } from "../stores/authStore";

// Router instance for navigation
const router = useRouter();
// User management composable
const { createUser, fetchUserByUsername } = useUsers();
// Authentication store
const authStore = useAuthStore();

// Component reactive state
const isLogin = ref(true); // Toggle between login/register forms
const loading = ref(false); // Loading state for async operations
const error = ref<string | null>(null); // Error message display

/**
 * Component lifecycle hook
 * Redirects authenticated users away from login page
 */
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push("/");
  }
});

/**
 * Handle user login
 * Validates credentials and authenticates user
 * @param data - User credentials (username and password)
 */
const handleLogin = async (data: { username: string; password: string }) => {
  try {
    loading.value = true;
    error.value = null;
    
    // Fetch user from database
    const user = await fetchUserByUsername(data.username);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Incorrect password");
    } else {
      // Simulate token generation (in real app, this would come from backend)
      const token = btoa(`${user.username}:${Date.now()}`);
      authStore.login(user, token);
      router.push("/");
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An error occurred";
  } finally {
    loading.value = false;
  }
};

/**
 * Handle user registration
 * Creates new user and authenticates
 * @param data - User credentials (username and password)
 */
const handleRegister = async (data: { username: string; password: string }) => {
  try {
    loading.value = true;
    error.value = null;
    
    // Hash password for security
    const hashedPassword = await hashPassword(data.password);
    await createUser({
      username: data.username,
      password: hashedPassword,
    });
    
    // After registration, switch to login mode
    isLogin.value = true;
    error.value = null;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An error occurred";
  } finally {
    loading.value = false;
  }
};

/**
 * Toggle between login and registration modes
 * Clears error state when switching
 */
const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = null;
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