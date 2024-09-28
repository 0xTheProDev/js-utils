import { Lap } from "./lap";

export class StopWatch {
  private timer: number = 0;
  private laps: Lap[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  constructor(private readonly precision: number) {}

  get duration() {
    return this.timer;
  }

  start() {
    this.reset();
    this.startCounter();
  }

  pause() {
    this.stopCounter();
  }

  resume() {
    this.startCounter();
  }

  reset() {
    this.timer = 0;
  }

  private startCounter() {
    const start = Date.now();

    this.intervalId = setInterval(() => {
      const end = Date.now();
      this.timer += end - start;
    }, this.precision);
  }

  private stopCounter() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
