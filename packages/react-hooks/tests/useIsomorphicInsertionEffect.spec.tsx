import { render } from "@testing-library/react";
import { useLayoutEffect, useRef } from "react";

import { useIsomorphicInsertionEffect } from "../src/useIsomorphicInsertionEffect";

describe("useIsomorphicInsertionEffect", () => {
  it("runs before layout effects and uses the latest callback", () => {
    const observedValues: string[] = [];

    const TestComponent = ({ value }: { value: string }) => {
      const valueRef = useRef("");

      useIsomorphicInsertionEffect(() => {
        valueRef.current = value;
      }, [value]);

      useLayoutEffect(() => {
        observedValues.push(valueRef.current);
      }, [value]);

      return null;
    };

    const { rerender } = render(<TestComponent value="initial" />);
    rerender(<TestComponent value="updated" />);

    expect(observedValues).toEqual(["initial", "updated"]);
  });
});
