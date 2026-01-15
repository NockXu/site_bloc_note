/**
 * useUsers Composable
 * 
 * Provides reactive state and methods for managing users.
 * Handles CRUD operations (Create, Read, Update, Delete) for users.
 * 
 * @returns Object containing reactive state and user management methods
 */
import { ref } from "vue";
import type { User, CreateUserDto, UpdateUserDto } from "../types/user";

export function useUsers() {
  // Reactive state
  const users = ref<User[]>([]); // Array of users
  const loading = ref(false); // Loading state indicator
  const error = ref<string | null>(null); // Error message

  /**
   * Fetch all users from API
   * Updates the users array with fetched data
   */
  const fetchUsers = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      users.value = await response.json();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An error occurred";
      console.error("Fetch users error:", err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch a single user by ID
   * @param id - The ID of the user to fetch
   * @returns Promise<User> - The fetched user
   */
  const fetchUserById = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return await response.json();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An error occurred";
      console.error("Fetch user error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch a user by username
   * @param username - The username of the user to fetch
   * @returns Promise<User> - The fetched user
   */
  const fetchUserByUsername = async (username: string) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`/api/users/username/${username}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return await response.json();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An error occurred";
      console.error("Fetch user by username error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create a new user
   * @param data - User data to create
   * @returns Promise<User> - The created user
   */
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
        throw new Error("Failed to create user");
      }
      const newUser = await response.json();
      users.value.push(newUser);
      return newUser;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An error occurred";
      console.error("Create user error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update an existing user
   * @param id - The ID of the user to update
   * @param data - Updated user data
   * @returns Promise<User> - The updated user
   */
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
        throw new Error("Failed to update user");
      }
      const updatedUser = await response.json();
      const index = users.value.findIndex((user) => user.id === id);
      if (index !== -1) {
        users.value[index] = updatedUser;
      }
      return updatedUser;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An error occurred";
      console.error("Update user error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete a user by ID
   * @param id - The ID of the user to delete
   */
  const deleteUser = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      users.value = users.value.filter((user) => user.id !== id);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An error occurred";
      console.error("Delete user error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Return reactive state and methods
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
