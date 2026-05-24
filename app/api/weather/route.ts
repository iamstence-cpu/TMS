import { NextRequest, NextResponse } from 'next/server';
import { buildWeatherAlerts } from '@/lib/weather-alerts';

export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get('lat'));
  const lon = Number(req.nextUrl.searchParams.get('lon'));
  const rainThreshold = Number(req.nextUrl.searchParams.get('rainThreshold') ?? 70);
  const windThreshold = Number(req.nextUrl.searchParams.get('windThreshold') ?? 10);
  const gustThreshold = Number(req.nextUrl.searchParams.get('gustThreshold') ?? 13);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: 'lat/lon 参数无效' }, { status: 400 });
  }

  const apiUrl = new URL('https://api.open-meteo.com/v1/forecast');
  apiUrl.searchParams.set('latitude', String(lat));
  apiUrl.searchParams.set('longitude', String(lon));
  apiUrl.searchParams.set('current', 'temperature_2m,wind_speed_10m,wind_gusts_10m,weather_code');
  apiUrl.searchParams.set('hourly', 'precipitation_probability');
  apiUrl.searchParams.set('forecast_hours', '1');
  apiUrl.searchParams.set('timezone', 'auto');

  const response = await fetch(apiUrl, { cache: 'no-store' });
  if (!response.ok) {
    return NextResponse.json({ error: '天气服务暂不可用' }, { status: 502 });
  }

  const data = await response.json();
  const snapshot = {
    currentTempC: data.current?.temperature_2m ?? 0,
    windSpeedMs: data.current?.wind_speed_10m ?? 0,
    windGustMs: data.current?.wind_gusts_10m ?? 0,
    weatherCode: data.current?.weather_code ?? 0,
    precipProbability: data.hourly?.precipitation_probability?.[0] ?? 0,
  };

  const alerts = buildWeatherAlerts(snapshot, {
    rainProbability: rainThreshold,
    windSpeed: windThreshold,
    windGust: gustThreshold,
  });

  return NextResponse.json({
    location: { lat, lon },
    snapshot,
    alerts,
    fetchedAt: new Date().toISOString(),
  });
}
