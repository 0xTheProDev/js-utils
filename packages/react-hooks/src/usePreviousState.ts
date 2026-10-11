import { useEffect, useRef, useState } from "react";

import type { Dispatch, SetStateAction } from "react";

/**
 * Track Previous State during Renders.
 * @returns Array containing Current State, Set State Dispatcher and Previous State.
 *
 * @example
 * const Component = (props) => {
 *  const [count, setCount, prevCount] = usePreviousState(0);
 *
 *  return (
 *    // JSX
 *      <span data-testid="previous">{prevCount}</span>
 *      <span data-testid="current">{count}</span>
 *      <button onClick={() => setCount((c) => c + 1)}>Increase</button>
 *      <button onClick={() => setCount((c) => c - 1)}>Decrease</button>
 *    // More JSX
 *  );
 * }
 */
export const usePreviousState = <S>(
  initialValue: S | (() => S),
): [S, Dispatch<SetStateAction<S>>, S | undefined] => {
  const [currentState, setCurrentState] = useState<S>(initialValue);
  const prevStateRef = useRef<S | undefined>(undefined);

  useEffect(() => {
    prevStateRef.current = currentState;
  }, [currentState]);

  return [currentState, setCurrentState, prevStateRef.current];
};
