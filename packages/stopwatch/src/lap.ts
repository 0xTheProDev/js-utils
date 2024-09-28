export class Lap {
  constructor(
    private readonly startTime: number,
    private readonly endTime: number,
  ) {}

  get start() {
    return this.startTime;
  }

  get end() {
    return this.endTime;
  }
}
