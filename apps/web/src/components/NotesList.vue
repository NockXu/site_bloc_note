<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import type { Note, CreateNoteDto } from "../types/note";

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
  "create-reply": [data: CreateNoteDto];
}>();

const authStore = useAuthStore();

// Track which notes have replies section expanded
const expandedNotes = ref<Set<number>>(new Set());
// Track which notes have reply form open
const replyFormOpen = ref<Set<number>>(new Set());
// Reply form content for each note
const replyContent = ref<Map<number, { titre: string; contenu: string }>>(new Map());

// Toggle replies visibility
const toggleReplies = (noteId: number) => {
  if (expandedNotes.value.has(noteId)) {
    expandedNotes.value.delete(noteId);
  } else {
    expandedNotes.value.add(noteId);
  }
};

// Toggle reply form
const toggleReplyForm = (noteId: number) => {
  if (replyFormOpen.value.has(noteId)) {
    replyFormOpen.value.delete(noteId);
    replyContent.value.delete(noteId);
  } else {
    replyFormOpen.value.add(noteId);
    replyContent.value.set(noteId, { titre: "", contenu: "" });
  }
};

// Submit reply
const submitReply = (parentNote: Note) => {
  const content = replyContent.value.get(parentNote.id);
  if (!content || !authStore.user?.id) return;

  if (!content.titre.trim() || !content.contenu.trim()) {
    return;
  }

  const replyData: CreateNoteDto = {
    titre: content.titre.trim(),
    contenu: content.contenu.trim(),
    userId: authStore.user.id,
    parentId: parentNote.id,
  };

  emit("create-reply", replyData);

  // Clear form and close
  replyFormOpen.value.delete(parentNote.id);
  replyContent.value.delete(parentNote.id);

  // Expand replies to show the new one
  expandedNotes.value.add(parentNote.id);
};

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Format time ago
const timeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(dateString);
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
    <ul v-else class="space-y-4">
      <li
        v-for="note in notes"
        :key="note.id"
        class="border border-gray-200 rounded-lg overflow-hidden transition-all hover:border-gray-300"
      >
        <!-- Main note -->
        <div class="p-4 bg-white">
          <div class="flex items-start gap-3">
            <!-- User avatar placeholder -->
            <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span class="text-primary-600 font-semibold text-sm">
                {{ note.user?.username?.[0]?.toUpperCase() || 'U' }}
              </span>
            </div>

            <div class="flex-1 min-w-0">
              <!-- Note header -->
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold text-gray-900">
                  {{ note.user?.username || `User #${note.userId}` }}
                </span>
                <span class="text-gray-400 text-sm">·</span>
                <span class="text-gray-500 text-sm" :title="formatDate(note.createdAt || '')">
                  {{ note.createdAt ? timeAgo(note.createdAt) : '' }}
                </span>
              </div>

              <!-- Note title -->
              <h4 class="text-lg font-semibold text-gray-800 mb-2">
                {{ note.titre }}
              </h4>

              <!-- Note content -->
              <p class="text-gray-700 mb-3 whitespace-pre-wrap">
                {{ note.contenu }}
              </p>

              <!-- Note actions -->
              <div class="flex items-center gap-4 text-sm">
                <!-- Reply button -->
                <button
                  v-if="authStore.isAuthenticated"
                  @click="toggleReplyForm(note.id)"
                  class="flex items-center gap-1 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  <span>Reply</span>
                </button>

                <!-- Show replies button -->
                <button
                  v-if="note.replies && note.replies.length > 0"
                  @click="toggleReplies(note.id)"
                  class="flex items-center gap-1 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <svg
                    class="w-4 h-4 transition-transform"
                    :class="{ 'rotate-180': expandedNotes.has(note.id) }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span>{{ note.replies.length }} {{ note.replies.length === 1 ? 'reply' : 'replies' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Reply form -->
        <div v-if="replyFormOpen.has(note.id)" class="border-t border-gray-200 bg-gray-50 p-4">
          <div class="flex gap-3">
            <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span class="text-primary-600 font-semibold text-sm">
                {{ authStore.user?.username?.[0]?.toUpperCase() || 'U' }}
              </span>
            </div>
            <div class="flex-1">
              <input
                v-model="replyContent.get(note.id)!.titre"
                type="text"
                placeholder="Reply title..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 mb-2"
                maxlength="100"
              />
              <textarea
                v-model="replyContent.get(note.id)!.contenu"
                placeholder="Write your reply..."
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none mb-2"
                maxlength="2000"
              ></textarea>
              <div class="flex justify-end gap-2">
                <button
                  @click="toggleReplyForm(note.id)"
                  class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  @click="submitReply(note)"
                  :disabled="!replyContent.get(note.id)?.titre?.trim() || !replyContent.get(note.id)?.contenu?.trim()"
                  class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Replies list -->
        <div v-if="expandedNotes.has(note.id) && note.replies && note.replies.length > 0" class="border-t border-gray-200 bg-gray-50">
          <div
            v-for="reply in note.replies"
            :key="reply.id"
            class="p-4 pl-8 ml-6 border-l-4 border-l-blue-300 border-b border-b-gray-100 last:border-b-0 flex gap-3"
          >
            <!-- Reply user avatar -->
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span class="text-blue-600 font-semibold text-xs">
                {{ reply.user?.username?.[0]?.toUpperCase() || 'U' }}
              </span>
            </div>

            <div class="flex-1 min-w-0">
              <!-- Reply header -->
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold text-gray-900 text-sm">
                  {{ reply.user?.username || `User #${reply.userId}` }}
                </span>
                <span class="text-gray-400 text-xs">·</span>
                <span class="text-gray-500 text-xs" :title="formatDate(reply.createdAt || '')">
                  {{ reply.createdAt ? timeAgo(reply.createdAt) : '' }}
                </span>
              </div>

              <!-- Reply title -->
              <h5 class="font-semibold text-gray-800 mb-1 text-sm">
                {{ reply.titre }}
              </h5>

              <!-- Reply content -->
              <p class="text-gray-700 text-sm whitespace-pre-wrap">
                {{ reply.contenu }}
              </p>
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
