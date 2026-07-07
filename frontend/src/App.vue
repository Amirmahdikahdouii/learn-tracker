<script setup lang="ts">
import { ref } from 'vue';
import { useCourseStore } from './stores/courseStore';
import { useDarkMode } from './composables/useDarkMode';
import { Moon, Sun, Download, Upload, Plus, AlertCircle, FileJson, RotateCcw, Info } from 'lucide-vue-next';
import Dashboard from './components/Dashboard.vue';
import CourseDetail from './components/CourseDetail.vue';
import CourseEditor from './components/CourseEditor.vue';

const store = useCourseStore();
const { isDark, toggleDark } = useDarkMode();
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

const currentView = ref<'dashboard' | 'detail' | 'editor'>('dashboard');
const selectedCourseId = ref<string | null>(null);

const fileInput = ref<HTMLInputElement | null>(null);
const errorMessage = ref<string | null>(null);

function showMessage(msg: string) {
  errorMessage.value = msg;
  setTimeout(() => {
    if (errorMessage.value === msg) {
      errorMessage.value = null;
    }
  }, 3000);
}

function downloadTemplate() {
  const template = [
    {
      "id": "template-course-1",
      "title": "Example Template Course",
      "url": "https://example.com/course",
      "imageUrl": "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop",
      "provider": "Udemy",
      "chapters": [
        {
          "id": "ch-1",
          "title": "Introduction",
          "sections": [
            { "id": "sec-1", "title": "Welcome", "isCompleted": false },
            { "id": "sec-2", "title": "Setup", "isCompleted": false }
          ]
        }
      ]
    }
  ];
  const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'learntrack-template.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function goToDashboard() {
  currentView.value = 'dashboard';
  selectedCourseId.value = null;
}

function viewCourse(id: string) {
  selectedCourseId.value = id;
  currentView.value = 'detail';
}

function editCourse(id: string | null) {
  selectedCourseId.value = id;
  currentView.value = 'editor';
}

function handleImport(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.every(c => c.id && c.title && Array.isArray(c.chapters))) {
        store.importCourses(parsed);
      } else {
        showMessage('Invalid JSON format for courses.');
      }
    } catch (error) {
      showMessage('Error parsing JSON file.');
    }
    if (fileInput.value) fileInput.value.value = '';
  };
  reader.readAsText(file);
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200">
    <header class="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] flex items-center justify-between px-6 shrink-0 shadow-sm dark:shadow-lg sticky top-0 z-10 transition-colors duration-200">
      <div class="flex items-center gap-3 cursor-pointer" @click="goToDashboard">
        <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg text-white">L</div>
        <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">LearnTrack</h1>
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="flex space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-md border border-slate-200 dark:border-slate-700 transition-colors">
          <button @click="downloadTemplate" class="px-3 py-1.5 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded transition flex items-center gap-2" title="Download JSON Template">
            <FileJson class="w-4 h-4" /> Template
          </button>
          <div class="w-px h-5 bg-slate-300 dark:bg-slate-700 my-auto"></div>
          <button @click="store.exportCourses" class="px-3 py-1.5 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded transition flex items-center gap-2" title="Export JSON">
            <Download class="w-4 h-4" /> Export
          </button>
          <button @click="fileInput?.click()" class="px-3 py-1.5 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded transition flex items-center gap-2" title="Import JSON">
            <Upload class="w-4 h-4" /> Import
          </button>
          <template v-if="isDemoMode">
            <div class="w-px h-5 bg-slate-300 dark:bg-slate-700 my-auto"></div>
            <button @click="store.resetDemoData(); goToDashboard()" class="px-3 py-1.5 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded transition flex items-center gap-2" title="Reset demo data">
              <RotateCcw class="w-4 h-4" /> Reset demo
            </button>
          </template>
        </div>
        <input type="file" ref="fileInput" accept=".json" class="hidden" @change="handleImport" />
        
        <div class="w-px h-6 bg-slate-300 dark:bg-slate-700 transition-colors"></div>
        
        <button @click="toggleDark()" class="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition text-slate-600 dark:text-slate-300" title="Toggle Dark Mode">
          <Moon v-if="!isDark" class="w-5 h-5" />
          <Sun v-else class="w-5 h-5" />
        </button>
      </div>
    </header>

    <div
      v-if="isDemoMode"
      class="bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-200 dark:border-indigo-900 px-6 py-2 flex items-center gap-2 text-sm text-indigo-800 dark:text-indigo-200"
    >
      <Info class="w-4 h-4 shrink-0" />
      <span>Demo mode — changes are saved only in this browser.</span>
    </div>

    <main class="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-4rem)]">
      <Dashboard 
        v-if="currentView === 'dashboard'" 
        @view-course="viewCourse" 
        @edit-course="editCourse"
      />
      <CourseDetail 
        v-else-if="currentView === 'detail' && selectedCourseId" 
        :course-id="selectedCourseId"
        @back="goToDashboard"
        @edit="editCourse(selectedCourseId)"
      />
      <CourseEditor
        v-else-if="currentView === 'editor'"
        :course-id="selectedCourseId"
        @save="goToDashboard"
        @cancel="goToDashboard"
      />
    </main>

    <!-- Error Message Toast -->
    <div 
      class="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg border border-red-500 flex items-center gap-3 transition-all duration-300 transform z-50"
      :class="errorMessage ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'"
    >
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span class="text-sm font-medium">{{ errorMessage }}</span>
    </div>
  </div>
</template>
