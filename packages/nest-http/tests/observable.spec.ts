import { catchError, count, lastValueFrom, Observable, of } from "rxjs";

import { makeObservable } from "../src/observable";

describe("makeObservable", () => {
  it("should create an Observable", () => {
    const observable = makeObservable(() => Promise.resolve());
    expect(observable).toBeInstanceOf(Observable);
  });

  it("should emit result if the promise resolves", async () => {
    const result = crypto.randomUUID();
    const promiseFn = () => Promise.resolve(result);
    const observable = makeObservable(promiseFn);
    expect(await lastValueFrom(observable)).toBe(result);
  });

  it("should emit error if the promise rejects", async () => {
    const error = crypto.randomUUID();
    const promiseFn = () => Promise.reject(error);
    const observable = makeObservable(promiseFn).pipe(
      catchError((err) => of(err)),
    );
    expect(await lastValueFrom(observable)).toBe(error);
  });

  it("should emit completed once the promise settles", async () => {
    const promiseFn = () => Promise.resolve();
    const observable = makeObservable(promiseFn).pipe(count(() => true));
    expect(await lastValueFrom(observable)).toBe(1);
  });
});
