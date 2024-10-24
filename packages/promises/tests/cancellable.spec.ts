import { cancellable } from "../src/cancellable";

describe("cancellable", () => {
  const CancellablePromise = cancellable(Promise);

  it("should behave as native Promise", async () => {
    await expect(CancellablePromise.resolve(20)).resolves.toBe(20);
    await expect(CancellablePromise.reject(20)).rejects.toBe(20);
  });
});
