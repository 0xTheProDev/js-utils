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
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return useCallback(() => mountedRef.current, []);
};
