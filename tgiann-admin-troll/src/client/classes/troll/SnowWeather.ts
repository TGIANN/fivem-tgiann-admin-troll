import MainTroll from ".";

const WEATHER_HASH_MAP: Record<number, string> = {
  [GetHashKey("EXTRASUNNY")]: "EXTRASUNNY",
  [GetHashKey("CLEAR")]: "CLEAR",
  [GetHashKey("CLOUDS")]: "CLOUDS",
  [GetHashKey("SMOG")]: "SMOG",
  [GetHashKey("FOGGY")]: "FOGGY",
  [GetHashKey("OVERCAST")]: "OVERCAST",
  [GetHashKey("RAIN")]: "RAIN",
  [GetHashKey("THUNDER")]: "THUNDER",
  [GetHashKey("CLEARING")]: "CLEARING",
  [GetHashKey("NEUTRAL")]: "NEUTRAL",
  [GetHashKey("SNOW")]: "SNOW",
  [GetHashKey("BLIZZARD")]: "BLIZZARD",
  [GetHashKey("SNOWLIGHT")]: "SNOWLIGHT",
  [GetHashKey("XMAS")]: "XMAS",
  [GetHashKey("HALLOWEEN")]: "HALLOWEEN",
};

class SnowWeather extends MainTroll {
  private tick: number = null;
  private previousWeather: string = null;

  private clearTick() {
    if (this.tick !== null) {
      clearTick(this.tick);
      this.tick = null;
    }
  }

  async start() {
    const weatherHash = GetPrevWeatherTypeHashName();
    this.previousWeather = WEATHER_HASH_MAP[weatherHash] || "CLEAR";

    this.tick = setTick(() => {
      SetWeatherTypeNowPersist("XMAS");
      SetForcePedFootstepsTracks(true);
      SetForceVehicleTrails(true);
    });

    return false;
  }

  stop() {
    this.clearTick();
    if (this.previousWeather) {
      SetWeatherTypeNowPersist(this.previousWeather);
    }
    SetForcePedFootstepsTracks(false);
    SetForceVehicleTrails(false);
    super.stop();
  }
}

export default new SnowWeather("snow_weather");
