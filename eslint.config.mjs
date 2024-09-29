import defineConfig from "@theprodev/eslint-config";

export default defineConfig({
  typescript: {
    "@typescript-eslint/no-extraneous-class": "off", // For classes with Annotations, the body might well be empty.
  },
});
