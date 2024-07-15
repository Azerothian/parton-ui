/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
// https://vitejs.dev/config/

export default defineConfig({
  cacheDir: "node_modules/.vite",
  plugins: [react()],

  build: {
    rollupOptions: {
      // treeshake: true,
      input: {
        index: "./src/index.tsx",
        data: "./src/data.ts",
      },

      external: [
        "react",
        "react-dom",
        "react-router-dom",
        "@vostro/clean-gql",
        "@apollo/client",
        "graphql",
      ],
    },
    minify: true,
    lib: {
      entry: "./src/index.tsx",
      name: "PartonUI",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs"],
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: ["tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    // server: {
    //   deps: {
    //     inline: ["globby", "fast-glob", "@nodelib/fs.walk", "@nodelib/fs.stat"]
    //   }
    // }
  },
});
