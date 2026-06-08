import App from './App.vue';
import './assets/css/main.css';
import { useMeta } from './composables/useMeta';
import i18n, { t } from './locales/i18n';
import router from './router';
import * as Sentry from '@sentry/vue';
import { createPinia } from 'pinia';
import { register } from 'swiper/element/bundle';
import { createApp, watch } from 'vue';

register();

const app = createApp(App);

app.config.errorHandler = (err) => console.error(err);

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
});

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount('#app');

watch(router.currentRoute, (route) => {
  useMeta({
    title: route.meta.title ? `KINSYN | ${t(route.meta.title)}` : 'KINSYN',
  });
});

window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});
