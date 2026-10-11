import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { memo, useLayoutEffect, useState } from "react";

import { useConsistentCallback } from "../src/useConsistentCallback";

describe("useConsistentCallback", () => {
  const renderTestComponents = (fn: VoidFunction) => {
    const ChildComponent = memo(
      ({
        onClick,
        onRender,
      }: {
        onClick: VoidFunction;
        onRender: VoidFunction;
      }) => {
        onRender();
        return <button onClick={onClick}>Increase</button>;
      },
    );

    const ParentComponent = ({ onRender }: { onRender: VoidFunction }) => {
      const [count, setCount] = useState(0);

      const handleClick = useConsistentCallback(() => {
        setCount(count + 1);
      });

      return (
        <div>
          <span>{count}</span>
          <ChildComponent onClick={handleClick} onRender={onRender} />
        </div>
      );
    };

    return render(<ParentComponent onRender={fn} />);
  };

  it("should not re-render on state update", async () => {
    const mockFn = vi.fn();
    renderTestComponents(mockFn);

    expect(mockFn).toHaveBeenCalledOnce();

    await userEvent.click(screen.getByRole("button", { name: "Increase" }));
    await userEvent.click(screen.getByRole("button", { name: "Increase" }));

    expect(mockFn).toHaveBeenCalledOnce();
    expect(screen.getByText("2").textContent).toBe("2");
  });

  it("should expose the latest callback before child layout effects run", () => {
    const onCallback = vi.fn();

    const ChildComponent = ({
      value,
      onLayout,
    }: {
      value: string;
      onLayout: VoidFunction;
    }) => {
      useLayoutEffect(() => {
        onLayout();
      }, [onLayout, value]);

      return null;
    };

    const ParentComponent = ({ value }: { value: string }) => {
      const onLayout = useConsistentCallback(() => onCallback(value));

      return <ChildComponent value={value} onLayout={onLayout} />;
    };

    const { rerender } = render(<ParentComponent value="initial" />);
    expect(onCallback).toHaveBeenLastCalledWith("initial");

    rerender(<ParentComponent value="updated" />);
    expect(onCallback).toHaveBeenLastCalledWith("updated");
  });
});
