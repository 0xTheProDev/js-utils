import { useCallback, useEffect, useRef } from "react";

/**
 * Check whether a component is currently mounted.
 * @returns A stable function that reports whether the component is mounted.
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
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(() => isMountedRef.current, []);
};
