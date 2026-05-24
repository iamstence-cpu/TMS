'use client';

import { useState } from 'react';

type ApiResponse = {
  fetchedAt: string;
  snapshot: {
    currentTempC: number;
    windSpeedMs: number;
    windGustMs: number;
    precipProbability: number;
    weatherCode: number;
  };
  alerts: Array<{ type: string; title: string; message: string; level: string }>;
};

export default function WeatherAlertPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rainThreshold, setRainThreshold] = useState(70);
  const [windThreshold, setWindThreshold] = useState(10);
  const [gustThreshold, setGustThreshold] = useState(13);
  const [data, setData] = useState<ApiResponse | null>(null);

  const loadWeather = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError('当前浏览器不支持定位。');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const params = new URLSearchParams({
            lat: String(latitude),
            lon: String(longitude),
            rainThreshold: String(rainThreshold),
            windThreshold: String(windThreshold),
            gustThreshold: String(gustThreshold),
          });
          const res = await fetch(`/api/weather?${params.toString()}`);
          if (!res.ok) {
            throw new Error('天气服务请求失败，请稍后重试。');
          }
          const payload = (await res.json()) as ApiResponse;
          setData(payload);
        } catch (e) {
          setError(e instanceof Error ? e.message : '未知错误');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('定位失败，请检查定位权限。');
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };

  return (
    <main className="container-page space-y-4">
      <section className="card space-y-3">
        <h1 className="text-2xl font-bold">实时天气预警助手</h1>
        <p className="text-sm text-slate-600">根据你当前定位，实时判断降雨、大风、雷暴风险并即时提醒。</p>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="text-sm">降雨阈值(%)<input className="input mt-1" type="number" value={rainThreshold} onChange={(e) => setRainThreshold(Number(e.target.value))} /></label>
          <label className="text-sm">风速阈值(m/s)<input className="input mt-1" type="number" value={windThreshold} onChange={(e) => setWindThreshold(Number(e.target.value))} /></label>
          <label className="text-sm">阵风阈值(m/s)<input className="input mt-1" type="number" value={gustThreshold} onChange={(e) => setGustThreshold(Number(e.target.value))} /></label>
        </div>
        <button className="btn" onClick={loadWeather} disabled={loading}>{loading ? '加载中...' : '获取当前位置天气'}</button>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </section>

      {data ? (
        <section className="card space-y-3">
          <h2 className="text-lg font-semibold">实时天气</h2>
          <div className="grid gap-2 text-sm md:grid-cols-4">
            <p>温度：{data.snapshot.currentTempC}°C</p>
            <p>降雨概率：{data.snapshot.precipProbability}%</p>
            <p>风速：{data.snapshot.windSpeedMs}m/s</p>
            <p>阵风：{data.snapshot.windGustMs}m/s</p>
          </div>
          <p className="text-xs text-slate-500">更新时间：{new Date(data.fetchedAt).toLocaleString()}</p>
          <h3 className="font-medium">提醒列表</h3>
          <ul className="space-y-2">
            {data.alerts.map((alert, idx) => (
              <li key={idx} className="rounded border p-3 text-sm">
                <p className="font-medium">{alert.title}</p>
                <p className="text-slate-700">{alert.message}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
