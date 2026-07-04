<script setup lang="ts">
import { Section } from '../types';

defineProps<{
  section: Section
}>();

defineEmits<{
  (e: 'toggle'): void
}>();
</script>

<template>
  <label class="flex items-center space-x-3 text-sm cursor-pointer group">
    <input 
      type="checkbox" 
      :checked="section.isCompleted"
      @change="$emit('toggle')"
      class="sr-only"
    />
    <div 
      class="w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0"
      :class="[
        section.isCompleted 
          ? 'bg-indigo-600 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-500' 
          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1e293b] group-hover:border-indigo-500'
      ]"
    >
      <svg v-if="section.isCompleted" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
    <span 
      dir="auto"
      class="transition-colors truncate flex-1"
      :class="section.isCompleted ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'"
    >
      {{ section.title }}
    </span>
  </label>
</template>
