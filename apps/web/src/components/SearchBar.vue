<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "Search...",
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  search: [query: string];
  clear: [];
}>();

const localValue = ref(props.modelValue);

// Handle input changes and emit events
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  localValue.value = target.value;
  emit("update:modelValue", target.value);
  emit("search", target.value);
};

// Handle clear button click
const handleClear = () => {
  localValue.value = "";
  emit("update:modelValue", "");
  emit("clear");
};

// Sync with props changes
watch(() => props.modelValue, (newValue: string) => {
  localValue.value = newValue;
});
</script>

<template>
  <div class="relative">
    <input
      v-model="localValue"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="handleInput"
      class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <!-- Clear button -->
    <button
      v-if="localValue"
      @click="handleClear"
      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      title="Clear search"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <!-- Search icon -->
    <div
      v-else
      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>
</template>
