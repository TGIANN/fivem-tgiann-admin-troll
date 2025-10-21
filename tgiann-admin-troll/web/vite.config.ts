import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@scriptTypes": path.resolve(__dirname, "../src/types"),
    },
  },
  base: "./",
  build: {
    emptyOutDir: true,
    outDir: "../dist/web",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
      },
    },
  },
});
