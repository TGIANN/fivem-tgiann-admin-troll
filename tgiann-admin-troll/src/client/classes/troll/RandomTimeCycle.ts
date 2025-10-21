import MainTroll from ".";

class RandomTimeCycle extends MainTroll {
  private currentTime: [number, number, number] = [12, 0, 0];
  private timeout: CitizenTimer = null;

  private clearTimeout() {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  private async setRandomTime() {
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);

    NetworkOverrideClockTime(hour, minute, second);

    this.timeout = setTimeout(() => {
      this.setRandomTime();
    }, Math.floor(Math.random() * 2000) + 500);
  }

  async start() {
    this.currentTime = [GetClockHours(), GetClockMinutes(), GetClockSeconds()];
    this.clearTimeout();
    this.setRandomTime();

    return false;
  }

  stop() {
    NetworkOverrideClockTime(
      this.currentTime[0],
      this.currentTime[1],
      this.currentTime[2]
    );
    this.clearTimeout();
    super.stop();
  }
}

export default new RandomTimeCycle("random_time_cycle");
