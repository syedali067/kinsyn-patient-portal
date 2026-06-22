import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import svgLoader from 'vite-svg-loader';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  const appPort = env.APP_PORT ? Number.parseInt(env.APP_PORT, 10) : undefined;
  const basePath = '/portal';

  return {
    base: basePath,
    build: {
      sourcemap: false,
      outDir: 'dist',
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('swiper-'),
          },
        },
      }),
      vueDevTools(),
      tailwindcss(),
      svgLoader({ svgo: false }),
      env.SENTRY_AUTH_TOKEN && env.SENTRY_ORG && env.SENTRY_PROJECT
        ? sentryVitePlugin({
            authToken: env.SENTRY_AUTH_TOKEN,
            org: env.SENTRY_ORG,
            project: env.SENTRY_PROJECT,
          })
        : null,
      sentryVitePlugin({
        authToken: env.SENTRY_AUTH_TOKEN,
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
      }),
    ],

    server: {
      strictPort: true,
      allowedHosts: command === 'serve' ? [env.VITE_NGROK_DOMAIN] : undefined,
      port: Number.isFinite(appPort) ? appPort : undefined,
      proxy: {
        '/api/v3': {
          target: env.VITE_API_SYMFONY_BASE_URL,
          changeOrigin: true,
        },
        '^/(api|actions)/.*': {
          target: env.VITE_API_CRAFT_BASE_URL,
          changeOrigin: true,
        },
      },
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});
