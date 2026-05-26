// vite.config.ts
import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';

export default defineConfig({
  server: {
    port: 2999,
  },
  resolve: {
    // Enables Vite to resolve imports using path aliases.
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart(), // if things break, see documentation §3 https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js
    viteReact(),
    nitro(),
  ],
})