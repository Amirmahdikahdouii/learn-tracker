# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

LearnTrack is a client-side course progress tracker: courses have chapters, chapters have sections, and sections are marked complete/incomplete. All app code lives under `frontend/`; there is no backend — the app was scaffolded from a Google AI Studio Vue template (hence the `@google/genai`/`express` deps in `frontend/package.json`), but none of that is wired up or used anywhere in `frontend/src`.

## Commands

All commands run from `frontend/`:

```
npm install       # install deps
npm run dev       # vite dev server on port 3000, host 0.0.0.0
npm run build     # vite build
npm run preview   # preview production build
npm run lint      # type-check only (tsc --noEmit) — there is no eslint/prettier config
```

There is no test suite configured in this repo.

## Architecture

- **Stack**: Vue 3 (`<script setup>` SFCs) + TypeScript + Pinia + Vite + Tailwind v4 (via `@tailwindcss/vite`).
- **State & persistence**: All app state lives in a single Pinia store, [frontend/src/stores/courseStore.ts](frontend/src/stores/courseStore.ts). Course data is persisted via `useStorage` from `@vueuse/core`, which syncs directly to `localStorage` under the key `local-first-courses` — there is no backend/API layer. Any change to the store's `courses` array is auto-persisted.
- **Data model** ([frontend/src/types.ts](frontend/src/types.ts)): `Course` → `Chapter[]` → `Section[]`, each with its own `id` (UUIDs via the `uuid` package). Progress percentages are derived getters on the store (`getChapterProgress`, `getCourseProgress`), not stored fields — never persist a computed progress value.
- **Navigation**: There is no router. [frontend/src/App.vue](frontend/src/App.vue) holds a single `currentView` ref (`'dashboard' | 'detail' | 'editor'`) plus a `selectedCourseId` ref, and conditionally renders one of `Dashboard.vue`, `CourseDetail.vue`, or `CourseEditor.vue` based on that state. View transitions happen via emitted events (`@view-course`, `@edit-course`, `@save`, `@cancel`) bubbling up to `App.vue`, which flips `currentView`/`selectedCourseId`.
- **Import/export**: JSON import/export of the entire course list is handled in `App.vue` (file input + `FileReader` for import, Blob/data-URI download for export and for the "download template" button) and calls into `store.importCourses` / `store.exportCourses`. Import validates shape loosely (`id`, `title`, `chapters` array present) and de-duplicates by regenerating UUIDs (course, chapters, sections) when an imported course `id` already exists locally.
- **Dark mode**: [frontend/src/composables/useDarkMode.ts](frontend/src/composables/useDarkMode.ts) wraps `@vueuse/core`'s `useDark`/`useToggle`, toggling a `dark` class on `<html>`; Tailwind dark-mode utility classes throughout components key off that class.
- **Components** ([frontend/src/components/](frontend/src/components/)): `Dashboard` (course list/grid), `CourseDetail` (chapter/section drill-down + toggling completion), `CourseEditor` (create/edit a course's chapters and sections), `Accordion`/`SectionItem`/`ProviderBadge` are smaller presentational pieces reused by the above.

## Notes

- `vite.config.ts` disables HMR/file-watching when the `DISABLE_HMR` env var is `true` — this is an AI Studio agent-editing accommodation; don't remove it.
- `tsconfig.json` sets `jsx: "react-jsx"` even though this is a Vue project — leftover from the template; harmless since there's no JSX in the codebase, but don't take it as a signal to use React patterns.
