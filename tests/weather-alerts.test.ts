import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWeatherAlerts } from '@/lib/weather-alerts';

test('触发降雨和大风提醒', () => {
  const alerts = buildWeatherAlerts(
    { currentTempC: 23, windSpeedMs: 11, windGustMs: 14, precipProbability: 80, weatherCode: 1 },
    { rainProbability: 70, windSpeed: 10, windGust: 13 },
  );

  assert.equal(alerts.some((a) => a.type === 'rain'), true);
  assert.equal(alerts.some((a) => a.type === 'wind'), true);
});

test('无风险时返回天气平稳', () => {
  const alerts = buildWeatherAlerts(
    { currentTempC: 20, windSpeedMs: 2, windGustMs: 3, precipProbability: 10, weatherCode: 1 },
    { rainProbability: 70, windSpeed: 10, windGust: 13 },
  );

  assert.equal(alerts.length, 1);
  assert.equal(alerts[0].level, 'info');
});
