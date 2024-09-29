import { defineConfig } from "@theprodev/tsup-config";

export default defineConfig({
  entry: ["src/index.ts"],
  libOptions: {
    sourceURL: "https://github.com/0xTheProDev/js-utils",
    startYear: 2024,
  },
  outDir: "dist",
  sourcemap: true,
  tsconfig: "./tsconfig.json",
});
