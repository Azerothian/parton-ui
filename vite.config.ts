/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import dts from "vite-plugin-dts";
// import { nodeExternals } from './node-externals';
import externals from "rollup-plugin-node-externals";

// https://vitejs.dev/config/
export default defineConfig({
  cacheDir: "node_modules/.vite",
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],

  build: {
    rollupOptions: {
      treeshake: true,
      input: "./src/index.tsx",
      plugins: [externals()],
      // [
      //   "react",
      //   "react-dom",
      //   "react-router-dom",
      //   "@vostro/clean-gql",
      //   "@apollo/client",
      //   "graphql",
      // ],
    },
    minify: true,
    sourcemap: true,
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
    include: ["__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    // server: {
    //   deps: {
    //     inline: ["globby", "fast-glob", "@nodelib/fs.walk", "@nodelib/fs.stat"]
    //   }
    // }
  },
});
