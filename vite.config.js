import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cpSync, mkdirSync } from "node:fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-frontend-images",
      closeBundle() {
        mkdirSync("dist/frontend", { recursive: true });
        cpSync("frontend/images", "dist/frontend/images", {
          recursive: true,
        });
      },
    },
  ],
  publicDir: false,
});
