import { useCallback, useRef } from "react";

/**
 * Creates Idempotent Function to provide as Callback to a component without triggering extra re-renders.
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
export const useConsistentCallback = <A extends any[], R>(
  callback: (...args: A) => R,
) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((...args: A) => callbackRef.current(...args), []);
};
