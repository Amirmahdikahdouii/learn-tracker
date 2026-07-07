import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { Course } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useCourseStore = defineStore('courses', {
  state: () => ({
    courses: useStorage<Course[]>('local-first-courses', []),
  }),
  getters: {
    getChapterProgress: (state) => (courseId: string, chapterId: string) => {
      const course = state.courses.find((c) => c.id === courseId);
      if (!course) return 0;
      const chapter = course.chapters.find((ch) => ch.id === chapterId);
      if (!chapter || chapter.sections.length === 0) return 0;
      
      const completed = chapter.sections.filter((s) => s.isCompleted).length;
      return Math.round((completed / chapter.sections.length) * 100);
    },
    getCourseProgress: (state) => (courseId: string) => {
      const course = state.courses.find((c) => c.id === courseId);
      if (!course) return 0;
      
      let totalSections = 0;
      let completedSections = 0;
      
      course.chapters.forEach((chapter) => {
        totalSections += chapter.sections.length;
        completedSections += chapter.sections.filter((s) => s.isCompleted).length;
      });
      
      if (totalSections === 0) return 0;
      return Math.round((completedSections / totalSections) * 100);
    },
    getActivityData: (state) => {
      const data: Record<string, number> = {};
      state.courses.forEach(course => {
        course.chapters.forEach(chapter => {
          chapter.sections.forEach(section => {
            if (section.isCompleted && section.completedAt) {
              const dateStr = section.completedAt.split('T')[0];
              data[dateStr] = (data[dateStr] || 0) + 1;
            }
          });
        });
      });
      return data;
    }
  },
  actions: {
    addCourse(course: Course) {
      this.courses.push(course);
    },
    updateCourse(updatedCourse: Course) {
      const index = this.courses.findIndex((c) => c.id === updatedCourse.id);
      if (index !== -1) {
        this.courses[index] = updatedCourse;
      }
    },
    deleteCourse(courseId: string) {
      const index = this.courses.findIndex((c) => c.id === courseId);
      if (index !== -1) {
        this.courses.splice(index, 1);
      }
    },
    toggleSectionCompletion(courseId: string, chapterId: string, sectionId: string) {
      const course = this.courses.find((c) => c.id === courseId);
      if (course) {
        const chapter = course.chapters.find((ch) => ch.id === chapterId);
        if (chapter) {
          const section = chapter.sections.find((s) => s.id === sectionId);
          if (section) {
            section.isCompleted = !section.isCompleted;
            if (section.isCompleted) {
              section.completedAt = new Date().toISOString();
            } else {
              delete section.completedAt;
            }
          }
        }
      }
    },
    importCourses(importedCourses: Course[]) {
      importedCourses.forEach(importedCourse => {
        const exists = this.courses.some(c => c.id === importedCourse.id);
        if (exists) {
          const newCourse: Course = {
            ...importedCourse,
            id: uuidv4(),
            title: `${importedCourse.title} (Copy)`,
            chapters: importedCourse.chapters.map(ch => ({
              ...ch,
              id: uuidv4(),
              sections: ch.sections.map(s => ({
                ...s,
                id: uuidv4(),
              }))
            }))
          };
          this.courses.push(newCourse);
        } else {
          this.courses.push(importedCourse);
        }
      });
    },
    exportCourses() {
      const dataStr = JSON.stringify(this.courses, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'courses_export.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  }
});
