import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: true,
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        content: "src/content.ts",
        popup: "src/popup/popup.ts"
      },
      output: {
        entryFileNames: (chunkInfo) =>
          chunkInfo.name === "content" ? "content.js" : "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]",
        format: "es"
      }
    }
  }
});
