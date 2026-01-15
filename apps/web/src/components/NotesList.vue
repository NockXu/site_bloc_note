<script setup lang="ts">
interface Note {
  id: number;
  titre: string;
  contenu: string;
  createdAt: string;
  user?: {
    username: string;
  };
  userId: number;
}

interface Props {
  notes: Note[];
  loading: boolean;
  title?: string;
  subtitle?: string;
  showLoadMore?: boolean;
  hasMoreNotes?: boolean;
  loadMoreText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Recent Notes",
  subtitle: "Discover the latest notes shared by the community",
  showLoadMore: true,
  hasMoreNotes: false,
  loadMoreText: "Load more notes",
});

const emit = defineEmits<{
  "load-more": [];
}>();

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US");
};
</script>

<template>
  <div class="bg-white rounded-lg p-6 shadow-md border border-gray-200">
    <!-- Header -->
    <div class="mb-6">
      <h3 class="text-xl font-semibold text-gray-700">
        📝 {{ title }}
      </h3>
      <p v-if="subtitle" class="text-sm text-gray-500 mt-1">
        {{ subtitle }}
      </p>
    </div>

    <!-- Initial loading state -->
    <div v-if="loading && notes.length === 0" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      <p class="mt-4 text-gray-500">Loading notes...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="notes.length === 0" class="text-center py-12">
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
      <p class="text-gray-500 text-lg">No notes found</p>
      <p class="text-gray-400 text-sm mt-2">
        Be the first to share a note!
      </p>
    </div>

    <!-- Notes list -->
    <ul v-else class="divide-y divide-gray-100">
      <li
        v-for="note in notes"
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
                  Created by:
                  <span v-if="note.user" class="font-medium text-gray-600">
                    {{ note.user.username }}
                  </span>
                  <span v-else class="text-gray-500">
                    User #{{ note.userId }}
                  </span>
                </span>
                <span v-if="note.createdAt" class="text-gray-400">
                  {{ formatDate(note.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- Load more button -->
    <div v-if="showLoadMore && hasMoreNotes && !loading" class="text-center mt-6">
      <button
        @click="$emit('load-more')"
        class="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 font-medium"
      >
        {{ loadMoreText }}
      </button>
    </div>

    <!-- End of notes message -->
    <div v-if="!hasMoreNotes && notes.length > 0" class="text-center mt-6 text-gray-500">
      <p>🎉 All notes have been displayed</p>
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
