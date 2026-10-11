import swc from "unplugin-swc";
import tsconfigPaths from "vite-tsconfig-paths";

export default {
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
      module: { type: "es6" },
    }),
  ],
};
