<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCourseStore } from '../stores/courseStore';
import { ArrowLeft, Edit2, Trash2, ExternalLink } from 'lucide-vue-next';
import Accordion from './Accordion.vue';
import SectionItem from './SectionItem.vue';
import ProviderBadge from './ProviderBadge.vue';

const props = defineProps<{
  courseId: string
}>();

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'edit'): void
}>();

const store = useCourseStore();

const course = computed(() => store.courses.find(c => c.id === props.courseId));
const courseProgress = computed(() => store.getCourseProgress(props.courseId));

const showDeleteConfirm = ref(false);

function triggerDelete() {
  showDeleteConfirm.value = true;
}

function confirmDelete() {
  store.deleteCourse(props.courseId);
  emit('back');
}

function cancelDelete() {
  showDeleteConfirm.value = false;
}

const formattedUrl = computed(() => {
  if (!course.value?.url) return '';
  try {
    return new URL(course.value.url).hostname;
  } catch (e) {
    return course.value.url;
  }
});
</script>

<template>
  <div v-if="course" class="flex-1 flex flex-col bg-white dark:bg-[#020617] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-inner overflow-hidden max-h-full transition-colors duration-200">
    <div class="flex flex-col md:flex-row items-start justify-between mb-8 shrink-0 gap-6">
      <div class="flex-1 pr-0 md:pr-6 min-w-0">
        <div class="flex items-center space-x-2 text-xs text-slate-500 mb-3">
          <span class="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer flex items-center transition" @click="emit('back')">
            <ArrowLeft class="w-3.5 h-3.5 mr-1" /> Dashboard
          </span>
          <span>/</span>
          <span class="text-slate-700 dark:text-slate-300 truncate max-w-[200px]" dir="auto">{{ course.title }}</span>
        </div>
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2" dir="auto">{{ course.title }}</h2>
        <div class="flex items-center gap-3 mb-4 flex-wrap">
          <ProviderBadge :provider="course.provider" />
          <a v-if="course.url" :href="course.url" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline transition-colors">
            <ExternalLink class="w-3.5 h-3.5 mr-1" />
            {{ formattedUrl }}
          </a>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="emit('edit')"
            class="text-xs font-medium px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center"
          >
            <Edit2 class="w-3.5 h-3.5 mr-2" />
            Edit Course
          </button>
          <button 
            @click="triggerDelete"
            class="text-xs font-medium px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition flex items-center"
          >
            <Trash2 class="w-3.5 h-3.5 mr-2" />
            Delete
          </button>
        </div>
      </div>
      
      <div class="flex items-center gap-4 shrink-0 w-full md:w-auto overflow-hidden">
        <div v-if="course.imageUrl" class="hidden md:block w-32 h-32 md:w-48 lg:w-56 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 overflow-hidden">
          <img :src="course.imageUrl" alt="Course Cover" class="w-full h-full object-cover" @error="$event.target.style.display='none'" />
        </div>
        <div class="w-32 h-32 rounded-xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-inner shrink-0 transition-colors">
          <span class="text-3xl font-black" :class="courseProgress === 100 ? 'text-green-500 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'">{{ courseProgress }}%</span>
          <span class="text-[10px] uppercase tracking-wider text-slate-500 mt-1 font-bold">Overall</span>
        </div>
      </div>
    </div>

    <!-- Chapters Accordion -->
    <div class="space-y-4 overflow-y-auto pr-2 pb-8 flex-1">
      <Accordion 
        v-for="(chapter, index) in course.chapters" 
        :key="chapter.id"
        :title="chapter.title"
        :progress="store.getChapterProgress(course.id, chapter.id)"
        :default-open="index === 0"
        :index="index + 1"
      >
        <div class="px-12 py-3 space-y-3 pb-4 pt-2">
          <SectionItem 
            v-for="section in chapter.sections" 
            :key="section.id"
            :section="section"
            @toggle="store.toggleSectionCompletion(course.id, chapter.id, section.id)"
          />
        </div>
      </Accordion>
    </div>
  </div>
  <div v-else class="flex-1 flex flex-col items-center justify-center bg-white dark:bg-[#020617] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-inner">
    <div class="text-slate-500 mb-4">Course not found</div>
    <button 
      @click="emit('back')"
      class="text-sm font-medium px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition text-slate-700 dark:text-slate-200"
    >
      Return to Dashboard
    </button>
  </div>

  <!-- Delete Modal -->
  <div v-if="showDeleteConfirm" class="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-200" @click="cancelDelete">
    <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-700 shadow-xl" @click.stop>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Course</h3>
      <p class="text-slate-600 dark:text-slate-400 mb-6 text-sm">Are you sure you want to delete this course? This action cannot be undone.</p>
      <div class="flex justify-end gap-3">
        <button @click="cancelDelete" class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent dark:border-slate-600">Cancel</button>
        <button @click="confirmDelete" class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm">Delete</button>
      </div>
    </div>
  </div>
</template>
