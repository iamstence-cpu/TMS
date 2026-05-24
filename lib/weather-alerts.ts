export type WeatherSnapshot = {
  currentTempC: number;
  windSpeedMs: number;
  windGustMs: number;
  precipProbability: number;
  weatherCode: number;
};

export type AlertThresholds = {
  rainProbability: number;
  windSpeed: number;
  windGust: number;
};

export type WeatherAlert = {
  type: 'rain' | 'wind' | 'storm';
  level: 'info' | 'warning';
  title: string;
  message: string;
};

const THUNDERSTORM_CODES = new Set([95, 96, 99]);

export function buildWeatherAlerts(
  snapshot: WeatherSnapshot,
  thresholds: AlertThresholds,
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  if (snapshot.precipProbability >= thresholds.rainProbability) {
    alerts.push({
      type: 'rain',
      level: 'warning',
      title: '降雨提醒',
      message: `未来1小时降雨概率 ${snapshot.precipProbability}% ，建议带伞。`,
    });
  }

  if (
    snapshot.windSpeedMs >= thresholds.windSpeed ||
    snapshot.windGustMs >= thresholds.windGust
  ) {
    alerts.push({
      type: 'wind',
      level: 'warning',
      title: '大风提醒',
      message: `当前风速 ${snapshot.windSpeedMs.toFixed(1)}m/s，阵风 ${snapshot.windGustMs.toFixed(1)}m/s，外出请注意安全。`,
    });
  }

  if (THUNDERSTORM_CODES.has(snapshot.weatherCode)) {
    alerts.push({
      type: 'storm',
      level: 'warning',
      title: '雷暴提醒',
      message: '检测到雷暴天气，请尽量减少户外停留。',
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      type: 'rain',
      level: 'info',
      title: '天气平稳',
      message: '当前未触发降雨/大风/雷暴阈值。',
    });
  }

  return alerts;
}
