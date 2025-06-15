import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { memo, useState } from "react";

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

    expect(mockFn).toHaveBeenCalledOnce();
  });
});
