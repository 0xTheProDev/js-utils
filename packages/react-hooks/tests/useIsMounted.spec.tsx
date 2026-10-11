import { render } from "@testing-library/react";
import { useEffect } from "react";

import { useIsMounted } from "../src/useIsMounted";

describe("useIsMounted", () => {
  it("reports mounted state and remains stable across renders", () => {
    let mountedCheck = () => false;
    let mountedDuringEffect = false;

    const TestComponent = ({ count }: { count: number }) => {
      mountedCheck = useIsMounted();

      useEffect(() => {
        mountedDuringEffect = mountedCheck();
      });

      return <div>{count}</div>;
    };

    const { rerender, unmount } = render(<TestComponent count={0} />);
    const initialMountedCheck = mountedCheck;

    expect(mountedDuringEffect).toBe(true);

    rerender(<TestComponent count={1} />);
    expect(mountedCheck).toBe(initialMountedCheck);
    expect(mountedDuringEffect).toBe(true);

    unmount();
    expect(mountedCheck()).toBe(false);
  });
});
