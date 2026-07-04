<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

const props = defineProps<{
  title: string
  progress: number
  defaultOpen?: boolean
  index?: number
}>();

const isOpen = ref(props.defaultOpen || false);
const formattedIndex = computed(() => props.index ? props.index.toString().padStart(2, '0') : '');
</script>

<template>
  <div class="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-[#1e293b] overflow-hidden transition-all duration-200 shadow-sm dark:shadow-none">
    <button 
      @click="isOpen = !isOpen"
      class="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-b border-transparent focus:outline-none"
      :class="{ 'border-slate-100 dark:border-slate-800/50': isOpen }"
    >
      <div class="flex items-center space-x-4 flex-1">
        <div 
          v-if="formattedIndex"
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0"
          :class="progress === 100 ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30' : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30'"
        >
          {{ formattedIndex }}
        </div>
        <div class="flex-1 text-left min-w-0 pr-4">
          <h4 class="text-sm font-semibold text-slate-900 dark:text-white truncate" dir="auto">{{ title }}</h4>
          <div class="h-1 w-full max-w-[12rem] bg-slate-200 dark:bg-slate-700 rounded-full mt-2">
            <div 
              class="h-full rounded-full transition-all duration-500" 
              :class="progress === 100 ? 'bg-green-500' : 'bg-indigo-500'"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
      </div>
      <ChevronDown 
        class="w-5 h-5 transition-transform duration-200 flex-shrink-0" 
        :class="[isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500']"
      />
    </button>
    <div v-show="isOpen">
      <slot></slot>
    </div>
  </div>
</template>
