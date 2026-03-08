import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Radio, Battery, Wind, Thermometer, Compass, Wifi, AlertTriangle } from 'lucide-react';
import { mockDrones, mockMissions } from '../data/mockData';
import type { FlightData } from '../types';

const genTelemetry = (base: FlightData): FlightData => ({
  ...base,
  altitude: Math.max(50, Math.min(200, base.altitude + (Math.random() - 0.5) * 4)),
  speed: Math.max(5, Math.min(30, base.speed + (Math.random() - 0.5) * 2)),
  battery: Math.max(0, base.battery - 0.05),
  pitch: Math.sin(Date.now() * 0.001) * 5,
  roll: Math.cos(Date.now() * 0.001) * 3,
  heading: (base.heading + 0.5) % 360,
  signalStrength: Math.max(60, Math.min(100, base.signalStrength + (Math.random() - 0.5) * 3)),
  temperature: Math.max(5, Math.min(35, base.temperature + (Math.random() - 0.5) * 0.5)),
  humidity: Math.max(20, Math.min(80, base.humidity + (Math.random() - 0.5) * 0.5)),
  timestamp: new Date().toISOString(),
});

function HorizonDisplay({ pitch, roll }: { pitch: number; roll: number }) {
  return (
    <div className="relative w-32 h-32 rounded-full border-2 border-cyan-400/40 overflow-hidden">
      <div
        className="absolute w-full h-full"
        style={{
          background: `linear-gradient(${roll}deg, #1a4a7a 0%, #1a4a7a 50%, #8B4513 50%, #8B4513 100%)`,
          transform: `rotate(${roll}deg) translateY(${pitch}%)`,
        }}
      />
      {/* Horizon line */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-0.5 bg-yellow-400/80" />
        <div className="absolute w-8 h-8 rounded-full border-2 border-yellow-400" />
        <div className="absolute top-1/2 left-1/4 w-6 h-0.5 bg-yellow-400" />
        <div className="absolute top-1/2 right-1/4 w-6 h-0.5 bg-yellow-400" />
      </div>
      {/* Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 h-4 bg-white/60" />
        <div className="absolute w-4 h-1 bg-white/60" />
      </div>
    </div>
  );
}

function CompassDisplay({ heading }: { heading: number }) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const currentDir = dirs[Math.round((heading / 45)) % 8];
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30" />
      {/* Compass rose */}
      <div
        className="relative w-24 h-24"
        style={{ transform: `rotate(${-heading}deg)`, transition: 'transform 0.5s ease' }}
      >
        {['N', 'E', 'S', 'W'].map((dir, i) => (
          <div
            key={dir}
            className={`absolute text-xs font-bold ${dir === 'N' ? 'text-red-400' : 'text-slate-400'}`}
            style={{
              top: '50%', left: '50%',
              transform: `rotate(${i * 90}deg) translateY(-36px) rotate(${heading}deg) translate(-50%, -50%)`,
            }}
          >
            {dir}
          </div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-400" style={{ marginBottom: '8px' }} />
        </div>
      </div>
      <div className="absolute bottom-0 text-cyan-400 text-xs font-bold">{currentDir} {Math.round(heading)}°</div>
    </div>
  );
}

export default function MonitorPage() {
  const flyingDrones = mockDrones.filter(d => d.status === 'flying');
  const [selectedDrone, setSelectedDrone] = useState(flyingDrones[0]?.id || mockDrones[0].id);
  const [telemetry, setTelemetry] = useState<FlightData>({
    id: 'live', missionId: 'm1', missionName: '城市基础设施巡检-北区', droneId: 'd1',
    timestamp: new Date().toISOString(), altitude: 120, speed: 15, battery: 78,
    latitude: 39.9042, longitude: 116.4074, heading: 45, pitch: 2, roll: -1,
    temperature: 12, humidity: 45, pressure: 1013.25, signalStrength: 87,
    gpsAccuracy: 0.8, imagesCaptured: 120, dataSize: 5832,
  });
  const [history, setHistory] = useState<Array<{ t: string; alt: number; spd: number; bat: number }>>([]);
  const [logMessages, setLogMessages] = useState<Array<{ time: string; msg: string; type: 'info' | 'warn' | 'ok' }>>([
    { time: '11:50:15', msg: '任务开始，系统初始化完成', type: 'ok' },
    { time: '11:50:22', msg: '起飞指令已发送，等待确认', type: 'info' },
    { time: '11:50:35', msg: '无人机已起飞，高度5m', type: 'ok' },
    { time: '11:52:10', msg: '到达预定巡航高度 120m', type: 'ok' },
    { time: '11:55:30', msg: '检测到轻微颠簸，自动修正中', type: 'warn' },
    { time: '11:58:45', msg: '完成第1个检查点，图像数据上传中', type: 'info' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(prev => {
        const next = genTelemetry(prev);
        setHistory(h => [...h.slice(-29), {
          t: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          alt: parseFloat(next.altitude.toFixed(1)),
          spd: parseFloat(next.speed.toFixed(1)),
          bat: parseFloat(next.battery.toFixed(1)),
        }]);
        return next;
      });
      if (Math.random() > 0.92) {
        const msgs = [
          { msg: 'GPS信号强度正常，精度0.8m', type: 'ok' as const },
          { msg: '图像采集完成，数据已上传', type: 'info' as const },
          { msg: '风速轻微增加，注意飞行安全', type: 'warn' as const },
          { msg: '到达下一个航点', type: 'info' as const },
          { msg: '障碍物感知系统正常', type: 'ok' as const },
        ];
        const m = msgs[Math.floor(Math.random() * msgs.length)];
        setLogMessages(prev => [
          ...prev.slice(-19),
          { time: new Date().toLocaleTimeString('zh-CN'), msg: m.msg, type: m.type }
        ]);
      }
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const drone = mockDrones.find(d => d.id === selectedDrone) || mockDrones[0];
  const mission = mockMissions.find(m => m.droneId === selectedDrone && m.status === 'in_progress');

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Radio className="text-cyan-400 w-5 h-5" />
            实时监控
          </h1>
          <p className="text-slate-500 text-sm">无人机飞行状态实时监测</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 status-pulse" />
          <span className="text-green-400 text-xs">实时数据推送</span>
        </div>
      </div>

      {/* Drone selector */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {mockDrones.map(d => (
          <button
            key={d.id}
            onClick={() => setSelectedDrone(d.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm
              ${selectedDrone === d.id
                ? 'bg-cyan-400/10 border-cyan-400/50 text-cyan-400'
                : 'bg-drone-card border-drone-border text-slate-400 hover:border-slate-500'}`}
          >
            <div className={`w-2 h-2 rounded-full ${
              d.status === 'flying' ? 'bg-green-400 status-pulse' :
              d.status === 'idle' ? 'bg-blue-400' :
              d.status === 'charging' ? 'bg-yellow-400' : 'bg-red-400'
            }`} />
            {d.name}
          </button>
        ))}
      </div>

      {/* Main monitor grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Left: instruments */}
        <div className="xl:col-span-1 space-y-4">
          {/* Attitude indicator */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">姿态仪</h3>
            <div className="flex flex-col items-center gap-2">
              <HorizonDisplay pitch={telemetry.pitch} roll={telemetry.roll} />
              <div className="flex gap-4 text-xs text-center">
                <div>
                  <div className="text-cyan-400 font-mono">{telemetry.pitch.toFixed(1)}°</div>
                  <div className="text-slate-500">俯仰</div>
                </div>
                <div>
                  <div className="text-cyan-400 font-mono">{telemetry.roll.toFixed(1)}°</div>
                  <div className="text-slate-500">横滚</div>
                </div>
              </div>
            </div>
          </div>

          {/* Compass */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">罗盘</h3>
            <div className="flex flex-col items-center">
              <CompassDisplay heading={telemetry.heading} />
            </div>
          </div>
        </div>

        {/* Center: map placeholder + telemetry */}
        <div className="xl:col-span-2 space-y-4">
          {/* Map */}
          <div className="glass-card rounded-xl overflow-hidden" style={{ height: 260 }}>
            <div className="map-bg w-full h-full relative flex items-center justify-center">
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `radial-gradient(circle at 39% 49%, rgba(0,212,255,0.15) 0%, transparent 30%)`,
              }} />
              {/* Simulated flight path */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 260" preserveAspectRatio="none">
                <polyline
                  points="50,130 100,90 150,110 200,70 250,100 300,80 350,110 390,90"
                  fill="none" stroke="rgba(0,212,255,0.6)" strokeWidth="2" strokeDasharray="8,4"
                />
                {/* Drone position */}
                <circle cx="300" cy="80" r="8" fill="rgba(0,212,255,0.2)" stroke="#00d4ff" strokeWidth="2">
                  <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="300" cy="80" r="4" fill="#00d4ff"/>
                {/* Waypoints */}
                {[[100,90],[150,110],[200,70],[250,100],[350,110]].map(([x,y], i) => (
                  <circle key={i} cx={x} cy={y} r="4" fill="rgba(0,255,136,0.6)" stroke="#00ff88" strokeWidth="1"/>
                ))}
              </svg>
              <div className="absolute top-3 left-3 glass-card rounded-lg px-3 py-1.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 status-pulse" />
                  <span className="text-slate-300">{drone.name} · {drone.location ? `${drone.location.lat.toFixed(4)}°N ${drone.location.lng.toFixed(4)}°E` : '未知位置'}</span>
                </div>
              </div>
              <div className="absolute bottom-3 right-3 text-slate-600 text-xs">卫星地图模拟视图</div>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: '↑', label: '高度', value: `${telemetry.altitude.toFixed(0)}m`, color: 'text-cyan-400' },
              { icon: '→', label: '速度', value: `${telemetry.speed.toFixed(1)}m/s`, color: 'text-green-400' },
              { icon: '⚡', label: '电量', value: `${telemetry.battery.toFixed(0)}%`, color: telemetry.battery > 50 ? 'text-green-400' : 'text-yellow-400' },
              { icon: '📡', label: '信号', value: `${telemetry.signalStrength.toFixed(0)}%`, color: 'text-purple-400' },
            ].map(m => (
              <div key={m.label} className="glass-card rounded-xl p-3 text-center">
                <div className={`text-xl font-bold font-mono ${m.color}`}>{m.value}</div>
                <div className="text-slate-500 text-xs mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Trend chart */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-slate-300 text-sm font-medium mb-3">实时飞行参数趋势</h3>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
                <XAxis dataKey="t" tick={{ fill: '#64748b', fontSize: 9 }} interval={5} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(13,27,42,0.95)', border: '1px solid #1a2744', borderRadius: '8px', color: '#e2e8f0', fontSize: '11px' }} />
                <Line type="monotone" dataKey="alt" name="高度m" stroke="#00d4ff" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="spd" name="速度m/s" stroke="#00ff88" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: sensors + log */}
        <div className="xl:col-span-1 space-y-4">
          {/* Sensor data */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">传感器数据</h3>
            {[
              { icon: Thermometer, label: '环境温度', value: `${telemetry.temperature.toFixed(1)}°C`, color: 'text-orange-400' },
              { icon: Wind, label: '湿度', value: `${telemetry.humidity.toFixed(0)}%`, color: 'text-blue-400' },
              { icon: Compass, label: '气压', value: `${telemetry.pressure.toFixed(0)} hPa`, color: 'text-purple-400' },
              { icon: Wifi, label: 'GPS精度', value: `${telemetry.gpsAccuracy.toFixed(1)}m`, color: 'text-green-400' },
              { icon: Battery, label: '电池温度', value: '38.5°C', color: 'text-yellow-400' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  {label}
                </div>
                <span className={`text-sm font-mono font-medium ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* Mission info */}
          {mission && (
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">当前任务</h3>
              <p className="text-slate-200 text-sm font-medium">{mission.name}</p>
              <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>完成进度</span>
                  <span className="text-cyan-400">{mission.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full" style={{ width: `${mission.progress}%` }} />
                </div>
                <div className="flex justify-between text-slate-500 mt-1">
                  <span>已用航点 {Math.floor((mission.waypoints || 0) * ((mission.progress || 0) / 100))}/{mission.waypoints}</span>
                  <span>已采集 {mission.dataCollected?.toFixed(1)} GB</span>
                </div>
              </div>
            </div>
          )}

          {/* Flight log */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3">飞行日志</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {logMessages.slice().reverse().map((log, i) => (
                <div key={i} className="flex gap-2 text-xs">
                  <span className="text-slate-600 flex-shrink-0 font-mono">{log.time}</span>
                  <span className={log.type === 'warn' ? 'text-yellow-400' : log.type === 'ok' ? 'text-green-400' : 'text-slate-400'}>
                    {log.type === 'warn' && <AlertTriangle className="inline w-3 h-3 mr-0.5" />}
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
