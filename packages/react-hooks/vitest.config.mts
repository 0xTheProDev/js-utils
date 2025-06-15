import react from "@vitejs/plugin-react-swc";
import swc from "unplugin-swc";
import { defineProject } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineProject({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/react-test-setup.mts",
  },
  plugins: [
    react(),
    tsconfigPaths(),
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: "es6" },
    }),
  ],
});
