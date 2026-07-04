import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { useCourseStore } from './stores/courseStore';
import './index.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
useCourseStore(pinia).seedDemoIfNeeded();
app.mount('#app');
