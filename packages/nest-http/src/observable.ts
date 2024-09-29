import { Observable } from "rxjs";

/**
 * @internal
 * Create Observable from Promise.
 *
 * @param callback - Promise Factory.
 * @returns Observable instance.
 */
export function makeObservable<T>(callback: () => Promise<T>): Observable<T> {
  return new Observable<T>((subscriber) => {
    callback()
      .then((res) => {
        subscriber.next(res);
      })
      .catch((err) => {
        subscriber.error(err);
      })
      .finally(() => {
        subscriber.complete();
      });
  });
}
