/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// https://vitejs.dev/config/
export default defineConfig({
  cacheDir: 'node_modules/.vite',
  plugins: [react()],
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'Class Name Filter Sorter',
      fileName: 'index',
      formats: ["es", "iife", "cjs"]
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // server: {
    //   deps: {
    //     inline: ["globby", "fast-glob", "@nodelib/fs.walk", "@nodelib/fs.stat"]
    //   }
    // }
  },
});
