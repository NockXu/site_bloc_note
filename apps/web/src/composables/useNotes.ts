import { ref } from "vue";
import type { Note, CreateNoteDto, UpdateNoteDto } from "../types/note";

export function useNotes() {
  const notes = ref<Note[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchNotes = async () => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch("/api/notes");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des notes");
      }
      notes.value = await response.json();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Fetch notes error:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchNoteById = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`/api/notes/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la note");
      }
      return await response.json();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Fetch note error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchNotesByUserId = async (userId: number) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await fetch(`/api/notes/user/${userId}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des notes de l'utilisateur");
      }
      notes.value = await response.json();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Fetch notes by user error:", err);
    } finally {
      loading.value = false;
    }
  };

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
        throw new Error("Erreur lors de la création de la note");
      }
      const newNote = await response.json();
      notes.value.push(newNote);
      return newNote;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Une erreur est survenue";
      console.error("Create note error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

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
  };
}
