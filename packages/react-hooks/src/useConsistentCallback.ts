import { useCallback, useRef } from "react";

import { useIsomorphicInsertionEffect } from "./useIsomorphicInsertionEffect";

/**
 * Creates a stable callback that always invokes the latest callback without changing identity between renders.
 * @param callback Generic Callback Function.
 * @returns A Function with Consistent Identity and without Stale Closure.
 *
 * @example
 * const Component = (props) => {
 *  const [count, setCount] = useState();
 *  const handleClick = useConsistentCallback(() => {
 *    setCount(count + 1);
 *  });
 *
 *  return (
 *    // JSX
 *    <button onClick={handleClick}>Increase</button>
 *  );
 * }
 */
export const useConsistentCallback = <A extends unknown[], R>(
  callback: (...args: A) => R,
): ((...args: A) => R) => {
  const callbackRef = useRef(callback);

  useIsomorphicInsertionEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: A) => callbackRef.current(...args), []);
};
