// Skip Husky installation in production and CI
if (
  process.env.NODE_ENV === "production" ||
  ["1", "true"].includes(process.env.CI)
) {
  process.exit(0);
}
const husky = (await import("husky")).default;
husky();
