import { useEffect, useMemo, useState } from "react";

import { useIsMounted } from "./useIsMounted";

type Battery = {
  readonly charging: boolean;
  readonly chargingTime: number;
  readonly dischargingTime: number;
  readonly level: number;
};

type BatteryEvent =
  | "chargingchange"
  | "chargingtimechange"
  | "dischargingtimechange"
  | "levelchange";

type BatteryEventTarget = {
  addEventListener(
    event: BatteryEvent,
    callback: (battery: BatteryManager) => void,
  ): void;
  removeEventListener(
    event: BatteryEvent,
    callback: (battery: BatteryManager) => void,
  ): void;
};

type BatteryManager = Battery & BatteryEventTarget;

type ChromiumNavigator = Navigator & {
  getBattery(): Promise<BatteryManager>;
};

/**
 * Provide Battery Information of the Device.
 * @returns Object containing Browser Support State, Battery State, Loading State, Error State (if any).
 *
 * @example
 * const Component = (props) => {
 *  const { battery } = useBattery();
 *
 *  const handleChange = useCallback(() => {
 *    if (battery?.level > 15) {
 *      // do something costly
 *    }
 *  }, [battery]);
 *
 *  // JSX
 * }
 */
export const useBattery = () => {
  const [batteryState, setBatteryState] = useState<Battery | null>(null);
  const [errorState, setErrorState] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  const isMounted = useIsMounted();

  useEffect(() => {
    let battery: BatteryManager | undefined;
    const events: BatteryEvent[] = [
      "chargingchange",
      "chargingtimechange",
      "dischargingtimechange",
      "levelchange",
    ];

    const handleChange = ({
      charging,
      chargingTime,
      dischargingTime,
      level,
    }: Battery) => {
      if (!isMounted()) return;

      setBatteryState({
        charging,
        chargingTime,
        dischargingTime,
        level,
      });
    };

    const initializeBattery = async () => {
      const batteryApi = navigator as ChromiumNavigator;
      if (!isMounted() || typeof batteryApi.getBattery !== "function") return;

      setIsLoading(true);
      setIsSupported(true);

      try {
        battery = await batteryApi.getBattery();
        if (!isMounted()) return;

        handleChange(battery);
        events.forEach((event) =>
          battery?.addEventListener(event, handleChange),
        );
      } catch (error) {
        if (isMounted()) {
          setErrorState(error);
        }
      } finally {
        if (isMounted()) {
          setIsLoading(false);
        }
      }
    };

    void initializeBattery();

    return () => {
      if (battery) {
        events.forEach((event) =>
          battery?.removeEventListener(event, handleChange),
        );
      }
    };
  }, []);

  return useMemo(
    () => ({
      battery: batteryState,
      error: errorState,
      loading: isLoading,
      supported: isSupported,
    }),
    [batteryState, errorState, isLoading, isSupported],
  );
};
