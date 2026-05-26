import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: true,
    target: "es2020",
    rollupOptions: {
      input: "src/content.ts",
      output: {
        entryFileNames: "content.js",
        format: "iife",
        inlineDynamicImports: true
      }
    }
  }
});
