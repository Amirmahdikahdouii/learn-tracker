<script setup lang="ts">
import { ref } from 'vue';
import { useCourseStore } from '../stores/courseStore';
import { Plus, BookOpen, Edit2, Trash2, ExternalLink } from 'lucide-vue-next';
import ProviderBadge from './ProviderBadge.vue';

const store = useCourseStore();

const emit = defineEmits<{
  (e: 'view-course', id: string): void
  (e: 'edit-course', id: string | null): void
}>();

const courseToDelete = ref<string | null>(null);

function triggerDelete(id: string) {
  courseToDelete.value = id;
}

function confirmDelete() {
  if (courseToDelete.value) {
    store.deleteCourse(courseToDelete.value);
    courseToDelete.value = null;
  }
}

function cancelDelete() {
  courseToDelete.value = null;
}
</script>

<template>
  <div class="flex-1 flex flex-col h-full bg-white dark:bg-[#020617] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-inner transition-colors duration-200">
    <div class="flex items-center justify-between mb-8 shrink-0">
      <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Your Courses</h2>
      <button 
        @click="emit('edit-course', null)"
        class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center transition"
      >
        <Plus class="w-4 h-4 mr-2" />
        New Course
      </button>
    </div>

    <div v-if="store.courses.length === 0" class="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#1e293b]/50 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed transition-colors duration-200">
      <BookOpen class="h-12 w-12 text-slate-400 dark:text-slate-600 mb-4" />
      <h3 class="text-sm font-medium text-slate-700 dark:text-slate-300">No courses yet</h3>
      <p class="mt-1 text-sm text-slate-500">Get started by creating a new course or importing one.</p>
      <button 
        @click="emit('edit-course', null)"
        class="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center transition"
      >
        <Plus class="w-4 h-4 mr-2" />
        New Course
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 pb-8 flex-1 content-start">
      <div 
        v-for="course in store.courses" 
        :key="course.id"
        class="bg-slate-50 dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition group flex flex-col cursor-pointer min-h-[160px]"
        @click="emit('view-course', course.id)"
      >
        <div class="p-5 flex-1 flex flex-col">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 dir="auto" class="font-medium text-base text-slate-800 dark:text-slate-200 line-clamp-2">
                {{ course.title }}
              </h3>
              <div class="mt-2 flex items-center gap-2 flex-wrap">
                <ProviderBadge :provider="course.provider" />
                <div v-if="course.url" class="flex items-center text-[11px] text-slate-500 dark:text-slate-400">
                  <ExternalLink class="w-3 h-3 mr-1" />
                  <span class="truncate max-w-[130px]">
                    {{ (() => {
                      try { return new URL(course.url).hostname }
                      catch(e) { return course.url }
                    })() }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button @click.stop="emit('edit-course', course.id)" class="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition bg-white dark:bg-slate-800/50 shadow-sm dark:shadow-none hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-transparent">
                <Edit2 class="w-3.5 h-3.5" />
              </button>
              <button @click.stop="triggerDelete(course.id)" class="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded transition bg-white dark:bg-slate-800/50 shadow-sm dark:shadow-none hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-transparent">
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div class="mt-auto pt-4">
            <div class="flex justify-between mt-2 text-[11px] text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider font-semibold">
              <span>Progress</span>
              <span :class="store.getCourseProgress(course.id) === 100 ? 'text-green-500 dark:text-green-400' : ''">{{ store.getCourseProgress(course.id) }}%</span>
            </div>
            <div class="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full w-full overflow-hidden">
              <div 
                class="h-full transition-all duration-500 ease-out rounded-full" 
                :class="store.getCourseProgress(course.id) === 100 ? 'bg-green-500' : 'bg-indigo-500'"
                :style="{ width: `${store.getCourseProgress(course.id)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Modal -->
  <div v-if="courseToDelete" class="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-200" @click="cancelDelete">
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
