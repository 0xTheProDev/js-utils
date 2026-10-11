import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { usePreviousState } from "../src/usePreviousState";

describe("usePreviousState", () => {
  const renderTestComponent = () => {
    const TestComponent = () => {
      const [count, setCount, prevCount] = usePreviousState(0);

      return (
        <div>
          <span data-testid="previous">{prevCount}</span>
          <span data-testid="current">{count}</span>
          <button onClick={() => setCount((c) => c + 1)}>Increase</button>
          <button onClick={() => setCount((c) => c - 1)}>Decrease</button>
        </div>
      );
    };

    return render(<TestComponent />);
  };

  it("should return previous state", async () => {
    renderTestComponent();

    expect(screen.getByTestId("previous").textContent).toBe("");
    expect(screen.getByTestId("current").textContent).toBe("0");

    await userEvent.click(screen.getByRole("button", { name: "Increase" }));

    expect(screen.getByTestId("previous").textContent).toBe("0");
    expect(screen.getByTestId("current").textContent).toBe("1");

    await userEvent.click(screen.getByRole("button", { name: "Decrease" }));

    expect(screen.getByTestId("previous").textContent).toBe("1");
    expect(screen.getByTestId("current").textContent).toBe("0");
  });
});
