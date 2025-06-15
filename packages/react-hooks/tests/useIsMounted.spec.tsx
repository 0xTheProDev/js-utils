import { act, render, screen } from "@testing-library/react";
import { useEffect, useState } from "react";

import { useIsMounted } from "../src/useIsMounted";

describe("useIsMounted", () => {
  const renderTestComponent = (fn: () => Promise<void>) => {
    const TestComponent = ({ getData }: { getData: () => Promise<void> }) => {
      const [state, setState] = useState("loading");
      const isMounted = useIsMounted();

      useEffect(() => {
        const handleAsyncEffect = async () => {
          await getData();
          console.log("test");
          if (isMounted()) {
            setState("loaded");
          }
        };

        handleAsyncEffect();
      }, []);

      return <div data-testid="state">{state}</div>;
    };

    return render(<TestComponent getData={fn} />);
  };

  it("should update state if component is mounted", () => {
    const mockFn = vi.fn();
    renderTestComponent(mockFn);

    expect(mockFn).toHaveBeenCalledOnce();
    expect(screen.getByTestId("state").textContent).toBe("loading");
    console.log("before");

    act(() => {
      mockFn.mockResolvedValue(undefined);
      console.log("after");
      expect(screen.getByTestId("state").textContent).toBe("loaded");
    });
  });
});
