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

    const onMount = async () => {
      if ((navigator as ChromiumNavigator).getBattery) {
        setIsLoading(true);
        setIsSupported(true);

        try {
          const _battery = await (navigator as ChromiumNavigator).getBattery();

          if (isMounted()) {
            battery = _battery;
            handleChange(battery);

            battery.addEventListener("chargingchange", handleChange);
            battery.addEventListener("chargingtimechange", handleChange);
            battery.addEventListener("dischargingtimechange", handleChange);
            battery.addEventListener("levelchange", handleChange);
          }
        } catch (error) {
          setErrorState(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    onMount();

    return () => {
      if (battery) {
        battery.removeEventListener("chargingchange", handleChange);
        battery.removeEventListener("chargingtimechange", handleChange);
        battery.removeEventListener("dischargingtimechange", handleChange);
        battery.removeEventListener("levelchange", handleChange);
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
