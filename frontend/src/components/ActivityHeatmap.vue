<script setup lang="ts">
import { computed } from 'vue';
import { useCourseStore } from '../stores/courseStore';
import { Activity } from 'lucide-vue-next';

const store = useCourseStore();
const activityData = computed(() => store.getActivityData);

const WEEKS = 52;

const heatmapData = computed(() => {
  const weeks: { date: string; value: number; isFuture: boolean }[][] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dayOfWeek = today.getDay(); // 0 is Sunday
  
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (WEEKS - 1) * 7 - dayOfWeek);
  
  for (let w = 0; w < WEEKS; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + (w * 7) + d);
      
      const isFuture = current > today;
      
      // Handle timezone differences carefully when converting to string
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      week.push({
        date: dateStr,
        value: activityData.value[dateStr] || 0,
        isFuture
      });
    }
    weeks.push(week);
  }
  
  return weeks;
});

const totalContributions = computed(() => {
  return Object.values(activityData.value).reduce((a, b) => a + b, 0);
});

function getColorClass(value: number, isFuture: boolean) {
  if (isFuture) return 'opacity-0'; // Hide future days
  if (value === 0) return 'bg-slate-100 dark:bg-slate-800/80';
  if (value === 1) return 'bg-emerald-200 dark:bg-emerald-900/60';
  if (value === 2) return 'bg-emerald-300 dark:bg-emerald-700/80';
  if (value === 3) return 'bg-emerald-400 dark:bg-emerald-600';
  return 'bg-emerald-500 dark:bg-emerald-500';
}
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 p-6 w-full mb-8 flex flex-col">
    <h3 class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4 shrink-0 flex items-center">
      <Activity class="w-4 h-4 mr-2 text-emerald-500" />
      {{ totalContributions }} sections completed in the last year
    </h3>
    
    <div class="overflow-x-auto custom-scrollbar pb-2 flex-1">
      <div class="flex gap-1 min-w-max">
        <div class="flex flex-col gap-[3px] text-[10px] text-slate-400 dark:text-slate-500 pr-2 leading-3">
          <div class="h-3 flex items-center text-transparent">Sun</div>
          <div class="h-3 flex items-center">Mon</div>
          <div class="h-3 flex items-center text-transparent">Tue</div>
          <div class="h-3 flex items-center">Wed</div>
          <div class="h-3 flex items-center text-transparent">Thu</div>
          <div class="h-3 flex items-center">Fri</div>
          <div class="h-3 flex items-center text-transparent">Sat</div>
        </div>
        
        <div class="flex gap-1">
          <div v-for="(week, weekIndex) in heatmapData" :key="weekIndex" class="flex flex-col gap-1">
            <div v-for="day in week" :key="day.date" 
              class="w-3 h-3 rounded-sm transition-colors"
              :class="getColorClass(day.value, day.isFuture)"
              :title="day.isFuture ? '' : `${day.value} sections completed on ${day.date}`"
            >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-end gap-2 mt-2 text-[10px] text-slate-500 shrink-0">
      <span>Less</span>
      <div class="flex gap-1">
        <div class="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800/80"></div>
        <div class="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/60"></div>
        <div class="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-700/80"></div>
        <div class="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-600"></div>
        <div class="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-500"></div>
      </div>
      <span>More</span>
    </div>
  </div>
</template>
