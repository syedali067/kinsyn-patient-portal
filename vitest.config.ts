import viteConfig from './vite.config';
import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig, configDefaults } from 'vitest/config';

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/**'],
        root: fileURLToPath(new URL('./', import.meta.url)),
      },
    }),
  ),
);
