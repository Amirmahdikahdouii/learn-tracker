<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCourseStore } from '../stores/courseStore';
import { Course, Chapter, Section } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-vue-next';

const props = defineProps<{
  courseId: string | null
}>();

const emit = defineEmits<{
  (e: 'save'): void
  (e: 'cancel'): void
}>();

const store = useCourseStore();

const formCourse = ref<Course>({
  id: uuidv4(),
  title: '',
  chapters: []
});

onMounted(() => {
  if (props.courseId) {
    const existing = store.courses.find(c => c.id === props.courseId);
    if (existing) {
      // deep clone
      formCourse.value = JSON.parse(JSON.stringify(existing));
    }
  }
});

function addChapter() {
  formCourse.value.chapters.push({
    id: uuidv4(),
    title: '',
    sections: []
  });
}

function removeChapter(index: number) {
  formCourse.value.chapters.splice(index, 1);
}

function addSection(chapterIndex: number) {
  formCourse.value.chapters[chapterIndex].sections.push({
    id: uuidv4(),
    title: '',
    isCompleted: false
  });
}

function removeSection(chapterIndex: number, sectionIndex: number) {
  formCourse.value.chapters[chapterIndex].sections.splice(sectionIndex, 1);
}

function saveCourse() {
  if (!formCourse.value.title.trim()) {
    alert('Course title is required');
    return;
  }
  
  if (props.courseId) {
    store.updateCourse(formCourse.value);
  } else {
    store.addCourse(formCourse.value);
  }
  emit('save');
}
</script>

<template>
  <div class="flex-1 flex flex-col bg-white dark:bg-[#020617] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-inner overflow-hidden max-h-full transition-colors duration-200">
    <div class="flex items-center justify-between mb-8 shrink-0">
      <div class="flex-1">
        <div class="flex items-center space-x-2 text-xs text-slate-500 mb-3">
          <span class="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer flex items-center transition" @click="emit('cancel')">
            <ArrowLeft class="w-3.5 h-3.5 mr-1" /> Back
          </span>
        </div>
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">{{ courseId ? 'Edit Course' : 'New Course' }}</h2>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="emit('cancel')"
          class="text-xs font-medium px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
        >
          Cancel
        </button>
        <button 
          @click="saveCourse"
          class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center transition"
        >
          Save Course
        </button>
      </div>
    </div>

    <div class="overflow-y-auto pr-2 pb-8 space-y-6 flex-1 custom-scrollbar">
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-400">Course Title</label>
          <input 
            v-model="formCourse.title" 
            type="text" 
            dir="auto"
            placeholder="e.g. Advanced TypeScript Mastery" 
            class="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
        
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-400">Course URL (Optional)</label>
          <input 
            v-model="formCourse.url" 
            type="url" 
            placeholder="e.g. https://example.com/course" 
            class="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-400">Course Image URL (Optional)</label>
          <div class="flex gap-4 items-start">
            <input 
              v-model="formCourse.imageUrl" 
              type="url" 
              placeholder="e.g. https://example.com/cover.jpg" 
              class="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            <div v-if="formCourse.imageUrl" class="shrink-0 w-16 h-12 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-hidden">
              <img :src="formCourse.imageUrl" alt="Preview" class="w-full h-full object-cover" @error="$event.target.style.display='none'" @load="$event.target.style.display='block'" />
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-400">Course Provider</label>
          <select 
            v-model="formCourse.provider" 
            class="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none"
          >
            <option value="" disabled>Select a provider...</option>
            <option value="maktabkhoone.org">maktabkhoone.org</option>
            <option value="bytebyteGo">bytebyteGo</option>
            <option value="Udemy">Udemy</option>
            <option value="Coursera">Coursera</option>
            <option value="Faradars.org">Faradars.org</option>
            <option value="Antropic courses">Antropic courses</option>
            <option value="YouTube">YouTube</option>
            <option value="hamrah.academy">hamrah.academy</option>
          </select>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-slate-900 dark:text-slate-200">Chapters</h3>
          <button 
            @click="addChapter"
            class="text-xs font-medium px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-md transition flex items-center"
          >
            <Plus class="w-3.5 h-3.5 mr-1" /> Add Chapter
          </button>
        </div>

        <div v-if="formCourse.chapters.length === 0" class="text-center py-8 bg-slate-50 dark:bg-[#1e293b]/50 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed text-slate-500 text-sm">
          No chapters added yet. Click "Add Chapter" to begin.
        </div>

        <div class="space-y-4">
          <div 
            v-for="(chapter, cIndex) in formCourse.chapters" 
            :key="chapter.id"
            class="bg-slate-50 dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4"
          >
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 border border-slate-300 dark:border-slate-700 mt-1">
                {{ (cIndex + 1).toString().padStart(2, '0') }}
              </div>
              <div class="flex-1 space-y-3">
                <div class="flex gap-2">
                  <input 
                    v-model="chapter.title" 
                    type="text" 
                    dir="auto"
                    placeholder="Chapter Title" 
                    class="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button 
                    @click="removeChapter(cIndex)"
                    class="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                    title="Remove Chapter"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>

                <div class="space-y-2 pl-2 border-l border-slate-300 dark:border-slate-700/50 ml-2">
                  <div 
                    v-for="(section, sIndex) in chapter.sections" 
                    :key="section.id"
                    class="flex items-center gap-2 group"
                  >
                    <GripVertical class="w-4 h-4 text-slate-400 dark:text-slate-600 cursor-move opacity-50 group-hover:opacity-100" />
                    <input 
                      v-model="section.title" 
                      type="text" 
                      dir="auto"
                      placeholder="Section Title" 
                      class="flex-1 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-md px-3 py-1.5 text-sm text-slate-800 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800"
                    />
                    <button 
                      @click="removeSection(cIndex, sIndex)"
                      class="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <button 
                    @click="addSection(cIndex)"
                    class="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center ml-6 py-1"
                  >
                    <Plus class="w-3 h-3 mr-1" /> Add Section
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
