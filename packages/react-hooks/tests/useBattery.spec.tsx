import { render, screen, waitFor } from "@testing-library/react";

import { useBattery } from "../src/useBattery";

describe("useBattery", () => {
  const renderTestComponent = () => {
    const TestComponent = () => {
      const { battery, error, loading, supported } = useBattery();

      return (
        <div>
          <div data-testid="error">{error ? "error" : null}</div>
          <div data-testid="level">{battery?.level}</div>
          <div data-testid="loading">{loading.toString()}</div>
          <div data-testid="supported">{supported.toString()}</div>
        </div>
      );
    };

    return render(<TestComponent />);
  };

  it("should return unsupported if battery API is unavailable", () => {
    renderTestComponent();

    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("supported").textContent).toBe("false");
  });

  it("should return loading if battery API is available", async () => {
    vi.stubGlobal("navigator", { getBattery: vi.fn() });
    renderTestComponent();

    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("true"),
    );
    await waitFor(() =>
      expect(screen.getByTestId("supported").textContent).toBe("true"),
    );
  });

  it("should return battery level once battery manager is available", async () => {
    vi.stubGlobal("navigator", {
      getBattery: vi.fn().mockResolvedValue({
        charging: false,
        chargingTime: undefined,
        dischargingTime: 653200,
        level: 33,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });
    renderTestComponent();

    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false"),
    );
    await waitFor(() =>
      expect(screen.getByTestId("supported").textContent).toBe("true"),
    );
    await waitFor(() =>
      expect(screen.getByTestId("level").textContent).toBe("33"),
    );
  });

  it("should return error if battery manager is unavailable", async () => {
    vi.stubGlobal("navigator", {
      getBattery: vi.fn().mockRejectedValue(new Error()),
    });
    renderTestComponent();

    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("false"),
    );
    await waitFor(() =>
      expect(screen.getByTestId("supported").textContent).toBe("true"),
    );
    await waitFor(() =>
      expect(screen.getByTestId("error").textContent).toBe("error"),
    );
  });
});
