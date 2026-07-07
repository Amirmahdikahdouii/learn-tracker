import type { Course } from '../types';

/**
 * Sections store completedAt as an absolute ISO timestamp, but this seed data
 * needs to look "freshly active" no matter when the demo is viewed. So instead
 * of hardcoding dates, we compute them relative to today at module-evaluation
 * time (i.e. whenever the demo page loads) to keep the activity heatmap filled.
 */
function daysAgo(days: number, hour = 14): string {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const DEMO_COURSES: Course[] = [
  {
    id: 'demo-course-1',
    title: 'Vue 3 — The Complete Guide',
    url: 'https://example.com/vue3-course',
    provider: 'Udemy',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop',
    chapters: [
      {
        id: 'demo-ch-1-1',
        title: 'Getting Started',
        sections: [
          { id: 'demo-sec-1-1-1', title: 'What is Vue?', isCompleted: true, completedAt: daysAgo(16) },
          { id: 'demo-sec-1-1-2', title: 'Setting Up Your Environment', isCompleted: true, completedAt: daysAgo(16, 16) },
          { id: 'demo-sec-1-1-3', title: 'Your First Vue App', isCompleted: true, completedAt: daysAgo(14) },
        ],
      },
      {
        id: 'demo-ch-1-2',
        title: 'Reactivity Fundamentals',
        sections: [
          { id: 'demo-sec-1-2-1', title: 'ref() and reactive()', isCompleted: true, completedAt: daysAgo(5) },
          { id: 'demo-sec-1-2-2', title: 'Computed Properties', isCompleted: true, completedAt: daysAgo(0) },
          { id: 'demo-sec-1-2-3', title: 'Watchers', isCompleted: true, completedAt: daysAgo(1) },
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
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
    chapters: [
      {
        id: 'demo-ch-2-1',
        title: 'Supervised Learning',
        sections: [
          { id: 'demo-sec-2-1-1', title: 'Linear Regression', isCompleted: true, completedAt: daysAgo(210) },
          { id: 'demo-sec-2-1-2', title: 'Logistic Regression', isCompleted: true, completedAt: daysAgo(207) },
          { id: 'demo-sec-2-1-3', title: 'Neural Networks Basics', isCompleted: true, completedAt: daysAgo(203) },
          { id: 'demo-sec-2-1-4', title: 'Overfitting and Regularization', isCompleted: false },
        ],
      },
      {
        id: 'demo-ch-2-2',
        title: 'Unsupervised Learning',
        sections: [
          { id: 'demo-sec-2-2-1', title: 'K-Means Clustering', isCompleted: true, completedAt: daysAgo(45) },
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
    imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop',
    chapters: [
      {
        id: 'demo-ch-3-1',
        title: 'مقدمات',
        sections: [
          { id: 'demo-sec-3-1-1', title: 'نصب پایتون', isCompleted: true, completedAt: daysAgo(40) },
          { id: 'demo-sec-3-1-2', title: 'متغیرها و انواع داده', isCompleted: true, completedAt: daysAgo(38) },
          { id: 'demo-sec-3-1-3', title: 'عملگرها', isCompleted: false },
        ],
      },
      {
        id: 'demo-ch-3-2',
        title: 'ساختارهای کنترلی',
        sections: [
          { id: 'demo-sec-3-2-1', title: 'شرط if/else', isCompleted: true, completedAt: daysAgo(5, 18) },
          { id: 'demo-sec-3-2-2', title: 'حلقه for', isCompleted: false },
          { id: 'demo-sec-3-2-3', title: 'حلقه while', isCompleted: false },
        ],
      },
    ],
  },
  {
    id: 'demo-course-4',
    title: 'Docker & Kubernetes for Developers',
    url: 'https://example.com/docker-kubernetes',
    provider: 'Pluralsight',
    imageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&auto=format&fit=crop',
    chapters: [
      {
        id: 'demo-ch-4-1',
        title: 'Docker Basics',
        sections: [
          { id: 'demo-sec-4-1-1', title: 'Intro to Containers', isCompleted: true, completedAt: daysAgo(300) },
          { id: 'demo-sec-4-1-2', title: 'Images vs Containers', isCompleted: true, completedAt: daysAgo(297) },
          { id: 'demo-sec-4-1-3', title: 'Writing a Dockerfile', isCompleted: true, completedAt: daysAgo(293) },
        ],
      },
      {
        id: 'demo-ch-4-2',
        title: 'Docker Compose & Networking',
        sections: [
          { id: 'demo-sec-4-2-1', title: 'Multi-Container Apps', isCompleted: true, completedAt: daysAgo(289) },
          { id: 'demo-sec-4-2-2', title: 'Networking Basics', isCompleted: true, completedAt: daysAgo(289, 20) },
          { id: 'demo-sec-4-2-3', title: 'Volumes & Persistence', isCompleted: true, completedAt: daysAgo(285) },
        ],
      },
      {
        id: 'demo-ch-4-3',
        title: 'Kubernetes Fundamentals',
        sections: [
          { id: 'demo-sec-4-3-1', title: 'Pods & Deployments', isCompleted: true, completedAt: daysAgo(278) },
          { id: 'demo-sec-4-3-2', title: 'Services & Ingress', isCompleted: true, completedAt: daysAgo(274) },
          { id: 'demo-sec-4-3-3', title: 'ConfigMaps & Secrets', isCompleted: true, completedAt: daysAgo(270) },
        ],
      },
    ],
  },
];
