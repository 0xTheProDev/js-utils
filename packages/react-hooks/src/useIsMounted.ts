import { useCallback, useEffect, useRef } from "react";

/**
 * Check if a Component has been mounted on the Viewport.
 * @returns Function that returns whether the React Component Tree has been mounted on the DOM or not.
 *
 * @example
 * const Component = (props) => {
 *  const [state, setState] = useState();
 *  const isMounted = useIsMounted();
 *
 *  useEffect(() => {
 *    // do something async
 *    if (isMounted()) {
 *      setState({ success: true })
 *    }
 *  }, [isMounted]);
 *
 *  // JSX
 * }
 */
export const useIsMounted = () => {
  const unmountSignal = Symbol("Unmount Signal");
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    return () => {
      abortControllerRef.current?.abort(unmountSignal);
      abortControllerRef.current = null;
    };
  }, []);

  return useCallback(
    () => Boolean(abortControllerRef.current?.signal.aborted),
    [],
  );
};
