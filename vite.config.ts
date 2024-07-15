/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";


export default defineConfig({
  cacheDir: "node_modules/.vite",
  plugins: [react()],
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
