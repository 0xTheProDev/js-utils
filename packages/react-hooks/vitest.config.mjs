import react from "@vitejs/plugin-react-swc";
import { defineProject, mergeConfig } from "vitest/config";
import sharedConfig from "../../vitest.shared.mjs";

export default defineProject(
  mergeConfig(
    {
      ...sharedConfig,
      plugins: [react(), ...sharedConfig.plugins],
    },
    {
      test: {
        environment: "jsdom",
        setupFiles: "./tests/react-test-setup.mts",
      },
    },
  ),
);
