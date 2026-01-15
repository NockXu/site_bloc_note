<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useNotes } from "../composables/useNotes";
import ErrorMessage from "../components/ErrorMessage.vue";
import SearchBar from "../components/SearchBar.vue";
import NotesList from "../components/NotesList.vue";

// Use notes composable for data management
const { loading, error, fetchNotesPaginated, searchNotes } = useNotes();

// Component reactive state
const recentNotes = ref<any[]>([]);
const currentPage = ref(1);
const hasMoreNotes = ref(true);
const notesPerPage = 10;
const searchQuery = ref("");
const isSearchMode = ref(false);
const searchTimeout = ref<number | null>(null);
let refreshInterval: number | null = null;

// Debounce function to prevent excessive API calls during search
const debounceSearch = (query: string) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  searchTimeout.value = window.setTimeout(() => {
    performSearch(query);
  }, 300); // 300ms debounce delay
};

/**
 * Execute search with API call
 * @param query - Search query string
 */
const performSearch = async (query: string) => {
  if (!query.trim()) {
    isSearchMode.value = false;
    await loadNotes(true);
    return;
  }
  
  try {
    isSearchMode.value = true;
    currentPage.value = 1;
    recentNotes.value = [];
    
    const results = await searchNotes(query.trim(), currentPage.value, notesPerPage);
    recentNotes.value = results;
    hasMoreNotes.value = results.length === notesPerPage;
  } catch (error) {
    console.error("Search error:", error);
  }
};

/**
 * Load more search results with pagination
 * Prevents duplicate notes by checking existing IDs
 */
const loadMoreSearchResults = async () => {
  if (!loading.value && hasMoreNotes.value && searchQuery.value.trim()) {
    currentPage.value++;
    
    try {
      const newResults = await searchNotes(searchQuery.value.trim(), currentPage.value, notesPerPage);
      // Prevent duplicates by checking existing IDs
      const existingIds = new Set(recentNotes.value.map((note: any) => note.id));
      const uniqueNewResults = newResults.filter((note: any) => !existingIds.has(note.id));
      recentNotes.value = [...recentNotes.value, ...uniqueNewResults];
      hasMoreNotes.value = newResults.length === notesPerPage;
    } catch (error) {
      console.error("Load more search results error:", error);
    }
  }
};

/**
 * Handle search input changes
 * @param query - New search query
 */
const handleSearchChange = (query: string) => {
  searchQuery.value = query;
  debounceSearch(query);
};

/**
 * Handle search clear action
 * Resets search mode and loads normal notes
 */
const handleSearchClear = async () => {
  searchQuery.value = "";
  isSearchMode.value = false;
  await loadNotes(true);
};

/**
 * Load notes with pagination and duplicate prevention
 * @param reset - Whether to reset pagination and clear notes
 */
const loadNotes = async (reset = false) => {
  try {
    if (reset) {
      currentPage.value = 1;
      recentNotes.value = [];
    }
    
    const newNotes = await fetchNotesPaginated(currentPage.value, notesPerPage);
    
    if (reset) {
      recentNotes.value = newNotes;
    } else {
      // Prevent duplicates by checking existing IDs
      const existingIds = new Set(recentNotes.value.map((note: any) => note.id));
      const uniqueNewNotes = newNotes.filter((note: any) => !existingIds.has(note.id));
      recentNotes.value = [...recentNotes.value, ...uniqueNewNotes];
    }
    
    // Check if there are more notes (if we receive less than requested, it's the end)
    hasMoreNotes.value = newNotes.length === notesPerPage;
  } catch (error) {
    console.error("Load notes error:", error);
  }
};

/**
 * Load more notes with pagination
 * Only works when not in search mode
 */
const loadMoreNotes = async () => {
  if (!loading.value && hasMoreNotes.value && !isSearchMode.value) {
    currentPage.value++;
    await loadNotes(false);
  }
};

/**
 * Component lifecycle hook
 * Load initial notes and setup auto-refresh
 */
onMounted(async () => {
  await loadNotes();

  // Auto-refresh every 3 seconds
  refreshInterval = window.setInterval(() => {
    loadNotes();
  }, 1000);
});

/**
 * Component cleanup hook
 * Clear intervals and timeouts to prevent memory leaks
 */
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});

/**
 * Handle error message close
 * Clears the error state
 */
const handleCloseError = () => {
  error.value = null;
};
</script>

<template>
  <div class="min-h-[60vh] py-8">
    <div class="max-w-4xl mx-auto px-4 md:px-8">
      <!-- Page Title -->
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Welcome to your Note Block
        </h2>
        <p class="text-lg text-gray-600">
          Discover the latest notes shared by the community
        </p>
      </div>

      <!-- Search Bar -->
      <div class="bg-white rounded-lg p-6 shadow-md border border-gray-200 mb-6">
        <SearchBar
          v-model="searchQuery"
          placeholder="Search notes by title or content..."
          :disabled="loading"
          @search="handleSearchChange"
          @clear="handleSearchClear"
        />
      </div>

      <!-- Error Messages -->
      <ErrorMessage :message="error" @close="handleCloseError" />

      <!-- Notes List -->
      <NotesList
        :notes="recentNotes"
        :loading="loading"
        :title="isSearchMode ? 'Search Results' : 'Recent Notes'"
        :subtitle='isSearchMode ? `Results for "${searchQuery}"` : "Discover the latest notes shared by the community"'
        :show-load-more="hasMoreNotes"
        :has-more-notes="hasMoreNotes"
        :load-more-text="isSearchMode ? 'Load more results' : 'Load more notes'"
        @load-more="isSearchMode ? loadMoreSearchResults() : loadMoreNotes()"
      />
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
