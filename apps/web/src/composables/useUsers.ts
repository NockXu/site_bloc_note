import { ref } from "vue";
import type { User, CreateUserDto, UpdateUserDto } from "../types/user";

export function useUsers() {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchUsers = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des utilisateurs");
      }
      users.value = await response.json();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Fetch users error:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchUserById = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'utilisateur");
      }
      return await response.json();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Fetch user error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchUserByUsername = async (username: string) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`/api/users/username/${username}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'utilisateur");
      }
      return await response.json();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Fetch user by username error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (data: CreateUserDto) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'utilisateur");
      }
      const newUser = await response.json();
      users.value.push(newUser);
      return newUser;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Create user error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateUser = async (id: number, data: UpdateUserDto) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'utilisateur");
      }
      const updatedUser = await response.json();
      const index = users.value.findIndex((user) => user.id === id);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }
      return updatedUser;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Update user error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'utilisateur");
      }
      users.value = users.value.filter((user) => user.id !== id);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Delete user error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    fetchUserByUsername,
    createUser,
    updateUser,
    deleteUser,
  };
}
