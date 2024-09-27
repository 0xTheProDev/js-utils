import path from "node:path";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    root: "./",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
      exclude: [
        "**/index.ts",
        "**/*.types.ts",
        "**/*types.ts",
        "**/*.type.ts",
        "tests/**",
        "types/**",
        "**/__tests__/**",
      ],
    },
  },
  plugins: [
    tsconfigPaths(),
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: "es6" },
    }),
  ],
});
