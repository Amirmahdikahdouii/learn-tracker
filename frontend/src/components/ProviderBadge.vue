<script setup lang="ts">
import { computed } from 'vue';
import { Youtube, MonitorPlay, GraduationCap, Terminal, Code, BookOpen, Sparkles, Building2, Smartphone, Boxes } from 'lucide-vue-next';

const props = defineProps<{
  provider?: string;
}>();

const brandConfig = computed(() => {
  switch (props.provider) {
    case 'maktabkhoone.org':
      return { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/30', icon: Terminal };
    case 'bytebyteGo':
      return { bg: 'bg-slate-100 dark:bg-slate-700/50', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-600', icon: Code };
    case 'Udemy':
      return { bg: 'bg-purple-100 dark:bg-purple-500/20', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-500/30', icon: MonitorPlay };
    case 'Coursera':
      return { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/30', icon: GraduationCap };
    case 'Faradars.org':
      return { bg: 'bg-teal-100 dark:bg-teal-500/20', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-500/30', icon: BookOpen };
    case 'Antropic courses':
      return { bg: 'bg-orange-100 dark:bg-orange-500/20', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-500/30', icon: Sparkles };
    case 'YouTube':
      return { bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-500/30', icon: Youtube };
    case 'hamrah.academy':
      return { bg: 'bg-cyan-100 dark:bg-cyan-500/20', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-500/30', icon: Smartphone };
    case 'Pluralsight':
      return { bg: 'bg-pink-100 dark:bg-pink-500/20', text: 'text-pink-700 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-500/30', icon: Boxes };
    default:
      return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700', icon: Building2 };
  }
});
</script>

<template>
  <span 
    v-if="provider" 
    class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border gap-1"
    :class="[brandConfig.bg, brandConfig.text, brandConfig.border]"
  >
    <component :is="brandConfig.icon" class="w-3 h-3" />
    {{ provider }}
  </span>
</template>
