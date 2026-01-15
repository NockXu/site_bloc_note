/**
 * useNotes Composable
 * 
 * Provides reactive state and methods for managing notes.
 * Handles CRUD operations (Create, Read, Update, Delete) for notes.
 * Includes pagination and search functionality.
 * 
 * @returns Object containing reactive state and note management methods
 */
import { ref } from "vue";
import type { Note, CreateNoteDto, UpdateNoteDto } from "../types/note";

export function useNotes() {
  // Reactive state
  const notes = ref<Note[]>([]); // Array of notes
  const loading = ref(false); // Loading state indicator
  const error = ref<string | null>(null); // Error message

  /**
   * Fetch all notes from the API
   * Updates the notes array with fetched data
   */
  const fetchNotes = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch("/api/notes");
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      notes.value = await response.json();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An error occurred";
      console.error("Fetch notes error:", err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch a single note by ID
   * @param id - The ID of the note to fetch
   * @returns Promise<Note> - The fetched note
   */
  const fetchNoteById = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`/api/notes/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch note");
      }
      return await response.json();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An error occurred";
      console.error("Fetch note error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch notes by user ID
   * @param userId - The ID of the user whose notes to fetch
   */
  const fetchNotesByUserId = async (userId: number) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`/api/notes/user/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user notes");
      }
      notes.value = await response.json();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An error occurred";
      console.error("Fetch notes by user error:", err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create a new note
   * @param data - Note data to create
   * @returns Promise<Note> - The created note
   */
  const createNote = async (data: CreateNoteDto) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create note");
      }
      const newNote = await response.json();
      notes.value.push(newNote);
      return newNote;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An error occurred";
      console.error("Create note error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update an existing note
   * @param id - ID of note to update
   * @param data - Updated note data
   * @returns Promise<Note> - The updated note
   */
  const updateNote = async (id: number, data: UpdateNoteDto) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la note");
      }
      const updatedNote = await response.json();
      const index = notes.value.findIndex((note) => note.id === id);
      if (index !== -1) {
        notes.value[index] = updatedNote;
      }
      return updatedNote;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Update note error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteNote = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la note");
      }
      notes.value = notes.value.filter((note) => note.id !== id);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Delete note error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchRecentNotes = async (limit: number = 10, offset: number = 0) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`/api/notes?limit=${limit}&offset=${offset}&sort=desc`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des notes récentes");
      }
      const allNotes = await response.json();
      // Trier par date de création décroissante (plus récent en premier)
      return allNotes
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Fetch recent notes error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchNotesPaginated = async (page: number = 1, pageSize: number = 10) => {
    try {
      loading.value = true;
      error.value = null;
      // Récupérer toutes les notes jusqu'à la page demandée
      const totalLimit = page * pageSize;
      const response = await fetch(`/api/notes?limit=${totalLimit}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des notes");
      }
      const allNotes = await response.json();
      // Trier par date de création décroissante
      const sortedNotes = allNotes
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      // Retourner uniquement les notes de la page actuelle
      const startIndex = (page - 1) * pageSize;
      return sortedNotes.slice(startIndex, startIndex + pageSize);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Fetch notes paginated error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const searchNotes = async (query: string, page: number = 1, pageSize: number = 10) => {
    try {
      loading.value = true;
      error.value = null;
      // Pour la recherche, on utilise aussi une approche similaire
      const totalLimit = page * pageSize;
      const response = await fetch(`/api/notes/search?q=${encodeURIComponent(query)}&limit=${totalLimit}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la recherche de notes");
      }
      const allNotes = await response.json();
      // Trier par date de création décroissante
      const sortedNotes = allNotes
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      // Retourner uniquement les notes de la page actuelle
      const startIndex = (page - 1) * pageSize;
      return sortedNotes.slice(startIndex, startIndex + pageSize);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Search notes error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    notes,
    loading,
    error,
    fetchNotes,
    fetchNoteById,
    fetchNotesByUserId,
    createNote,
    updateNote,
    deleteNote,
    fetchRecentNotes,
    fetchNotesPaginated,
    searchNotes,
  };
}
