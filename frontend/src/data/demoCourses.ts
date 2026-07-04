import type { Course } from '../types';

export const DEMO_COURSES: Course[] = [
  {
    id: 'demo-course-1',
    title: 'Vue 3 — The Complete Guide',
    url: 'https://example.com/vue3-course',
    provider: 'Udemy',
    chapters: [
      {
        id: 'demo-ch-1-1',
        title: 'Getting Started',
        sections: [
          { id: 'demo-sec-1-1-1', title: 'What is Vue?', isCompleted: true },
          { id: 'demo-sec-1-1-2', title: 'Setting Up Your Environment', isCompleted: true },
          { id: 'demo-sec-1-1-3', title: 'Your First Vue App', isCompleted: false },
        ],
      },
      {
        id: 'demo-ch-1-2',
        title: 'Reactivity Fundamentals',
        sections: [
          { id: 'demo-sec-1-2-1', title: 'ref() and reactive()', isCompleted: false },
          { id: 'demo-sec-1-2-2', title: 'Computed Properties', isCompleted: false },
          { id: 'demo-sec-1-2-3', title: 'Watchers', isCompleted: false },
        ],
      },
      {
        id: 'demo-ch-1-3',
        title: 'Components',
        sections: [
          { id: 'demo-sec-1-3-1', title: 'Props and Events', isCompleted: false },
          { id: 'demo-sec-1-3-2', title: 'Slots', isCompleted: false },
        ],
      },
    ],
  },
  {
    id: 'demo-course-2',
    title: 'Machine Learning Specialization',
    url: 'https://example.com/ml-specialization',
    provider: 'Coursera',
    chapters: [
      {
        id: 'demo-ch-2-1',
        title: 'Supervised Learning',
        sections: [
          { id: 'demo-sec-2-1-1', title: 'Linear Regression', isCompleted: true },
          { id: 'demo-sec-2-1-2', title: 'Logistic Regression', isCompleted: true },
          { id: 'demo-sec-2-1-3', title: 'Neural Networks Basics', isCompleted: true },
          { id: 'demo-sec-2-1-4', title: 'Overfitting and Regularization', isCompleted: false },
        ],
      },
      {
        id: 'demo-ch-2-2',
        title: 'Unsupervised Learning',
        sections: [
          { id: 'demo-sec-2-2-1', title: 'K-Means Clustering', isCompleted: false },
          { id: 'demo-sec-2-2-2', title: 'Principal Component Analysis', isCompleted: false },
        ],
      },
    ],
  },
  {
    id: 'demo-course-3',
    title: 'مبانی برنامه‌نویسی پایتون',
    url: 'https://example.com/python-fa',
    provider: 'Maktabkhoone',
    chapters: [
      {
        id: 'demo-ch-3-1',
        title: 'مقدمات',
        sections: [
          { id: 'demo-sec-3-1-1', title: 'نصب پایتون', isCompleted: true },
          { id: 'demo-sec-3-1-2', title: 'متغیرها و انواع داده', isCompleted: false },
          { id: 'demo-sec-3-1-3', title: 'عملگرها', isCompleted: false },
        ],
      },
      {
        id: 'demo-ch-3-2',
        title: 'ساختارهای کنترلی',
        sections: [
          { id: 'demo-sec-3-2-1', title: 'شرط if/else', isCompleted: false },
          { id: 'demo-sec-3-2-2', title: 'حلقه for', isCompleted: false },
          { id: 'demo-sec-3-2-3', title: 'حلقه while', isCompleted: false },
        ],
      },
    ],
  },
];
