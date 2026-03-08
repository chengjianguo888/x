import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Activity, Battery, MapPin, AlertTriangle,
  TrendingUp, Clock, Database, CheckCircle
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { flightTrendData, flightTrendDataMonth, missionTypeData, dronePerformanceData } from '../data/mockData';

const StatCard = ({
  icon: Icon, label, value, sub, color, trend
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  trend?: { value: number; up: boolean };
}) => (
  <div className="glass-card rounded-xl p-5 hover-lift hover:border-cyan-400/30 transition-all duration-300 cursor-default">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
      </div>
      <div className="w-11 h-11 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: color === 'text-cyan-400' ? 'rgba(0,212,255,0.1)' : color === 'text-green-400' ? 'rgba(0,255,136,0.1)' : color === 'text-yellow-400' ? 'rgba(255,170,0,0.1)' : 'rgba(168,139,250,0.1)' }}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    {trend && (
      <div className={`flex items-center gap-1 mt-3 text-xs ${trend.up ? 'text-green-400' : 'text-red-400'}`}>
        {trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
        <span>{trend.up ? '+' : ''}{trend.value}% 较昨日</span>
      </div>
    )}
  </div>
);

export default function Dashboard() {
  const { drones, missions, alerts, showToast } = useStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveData, setLiveData] = useState({ altitude: 120, speed: 15, battery: 78 });
  const [periodTab, setPeriodTab] = useState<'week' | 'month'>('week');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setLiveData(prev => ({
        altitude: Math.max(50, Math.min(200, prev.altitude + (Math.random() - 0.5) * 5)),
        speed: Math.max(5, Math.min(30, prev.speed + (Math.random() - 0.5) * 2)),
        battery: Math.max(0, prev.battery - 0.01),
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const activeDrones = drones.filter(d => d.status === 'flying').length;
  const missionInProgress = missions.filter(m => m.status === 'in_progress').length;
  const unresolvedAlerts = alerts.filter(a => !a.resolved).length;

  const statusColors: Record<string, string> = {
    flying: 'text-green-400 bg-green-400/10',
    idle: 'text-blue-400 bg-blue-400/10',
    charging: 'text-yellow-400 bg-yellow-400/10',
    maintenance: 'text-orange-400 bg-orange-400/10',
    offline: 'text-red-400 bg-red-400/10',
  };
  const statusLabels: Record<string, string> = {
    flying: '飞行中', idle: '待机', charging: '充电中', maintenance: '维修中', offline: '离线'
  };

  const COLORS = ['#00d4ff', '#00ff88', '#ffaa00', '#a78bfa', '#ff6b6b'];
  const chartData = periodTab === 'week' ? flightTrendData : flightTrendDataMonth;

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">数据总览</h1>
          <p className="text-slate-500 text-sm">
            {currentTime.toLocaleString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 status-pulse" />
            <span className="text-green-400 text-xs font-medium">实时数据更新中</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Activity} label="在线无人机" value={`${activeDrones}/${drones.length}`} sub="飞行中/总数" color="text-cyan-400" trend={{ value: 15, up: true }} />
        <StatCard icon={MapPin} label="进行中任务" value={missionInProgress} sub={`今日共 ${missions.length} 个任务`} color="text-green-400" trend={{ value: 8, up: true }} />
        <StatCard icon={AlertTriangle} label="未处理告警" value={unresolvedAlerts} sub="需要关注" color="text-yellow-400" />
        <StatCard icon={Database} label="今日采集数据" value="16.4 GB" sub="较昨日增加23%" color="text-purple-400" trend={{ value: 23, up: true }} />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Flight trend chart */}
        <div className="xl:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-slate-200 font-semibold">{periodTab === 'week' ? '本周' : '本月'}飞行趋势</h2>
              <p className="text-slate-500 text-xs mt-0.5">飞行架次 / 飞行时长 / 数据量</p>
            </div>
            <div className="flex gap-2">
              {(['week', 'month'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setPeriodTab(t)}
                  className={`text-xs px-3 py-1 rounded-lg transition-all ${periodTab === t ? 'bg-cyan-400/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/40'}`}
                >
                  {t === 'week' ? '本周' : '本月'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="flightsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(13,27,42,0.95)', border: '1px solid #1a2744', borderRadius: '8px', color: '#e2e8f0' }} />
              <Legend wrapperStyle={{ color: '#64748b', fontSize: '12px' }} />
              <Area type="monotone" dataKey="flights" name="飞行架次" stroke="#00d4ff" strokeWidth={2} fill="url(#flightsGrad)" dot={false} />
              <Area type="monotone" dataKey="hours" name="飞行时长(h)" stroke="#00ff88" strokeWidth={2} fill="url(#hoursGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Mission type distribution */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-slate-200 font-semibold mb-1">任务类型分布</h2>
          <p className="text-slate-500 text-xs mb-4">本月任务统计</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={missionTypeData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {missionTypeData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(13,27,42,0.95)', border: '1px solid #1a2744', borderRadius: '8px', color: '#e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {missionTypeData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: COLORS[i] }} />
                  </div>
                  <span className="text-slate-300 w-7 text-right">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Drone fleet status */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-slate-200 font-semibold mb-4">机队实时状态</h2>
          <div className="space-y-3">
            {drones.map(drone => (
              <div key={drone.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/40 hover:bg-slate-900/60 transition-all">
                <div className="flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                    <rect x="8" y="10" width="8" height="4" rx="1" fill={drone.status === 'flying' ? 'rgba(0,212,255,0.9)' : 'rgba(100,116,139,0.5)'}/>
                    <line x1="8" y1="11" x2="2" y2="7" stroke={drone.status === 'flying' ? 'rgba(0,212,255,0.7)' : 'rgba(100,116,139,0.4)'} strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="16" y1="11" x2="22" y2="7" stroke={drone.status === 'flying' ? 'rgba(0,212,255,0.7)' : 'rgba(100,116,139,0.4)'} strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="8" y1="13" x2="2" y2="17" stroke={drone.status === 'flying' ? 'rgba(0,212,255,0.7)' : 'rgba(100,116,139,0.4)'} strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="16" y1="13" x2="22" y2="17" stroke={drone.status === 'flying' ? 'rgba(0,212,255,0.7)' : 'rgba(100,116,139,0.4)'} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200 text-sm font-medium">{drone.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${statusColors[drone.status]}`}>
                      {statusLabels[drone.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <Battery className="w-3 h-3 text-slate-500" />
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${drone.batteryLevel}%`, backgroundColor: drone.batteryLevel > 60 ? '#00ff88' : drone.batteryLevel > 30 ? '#ffaa00' : '#ff4444' }} />
                    </div>
                    <span className="text-slate-500 text-xs">{drone.batteryLevel}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance bar chart */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-slate-200 font-semibold mb-1">设备效能排行</h2>
          <p className="text-slate-500 text-xs mb-4">本月飞行架次</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dronePerformanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={55} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(13,27,42,0.95)', border: '1px solid #1a2744', borderRadius: '8px', color: '#e2e8f0', fontSize: '12px' }} />
              <Bar dataKey="flights" name="架次" radius={[0, 4, 4, 0]}>
                {dronePerformanceData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={`rgba(0, 212, 255, ${1 - index * 0.15})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent missions */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-slate-200 font-semibold mb-4">最近任务</h2>
          <div className="space-y-3">
            {missions.slice(0, 5).map(mission => (
              <div key={mission.id} className="flex items-start gap-3">
                <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                  ${mission.status === 'completed' ? 'bg-green-400/20' : mission.status === 'in_progress' ? 'bg-cyan-400/20' : 'bg-slate-700'}`}>
                  {mission.status === 'completed' ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  ) : mission.status === 'in_progress' ? (
                    <div className="w-2 h-2 rounded-full bg-cyan-400 status-pulse" />
                  ) : (
                    <Clock className="w-3 h-3 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm font-medium truncate">{mission.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-slate-500 text-xs">{mission.droneName}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-500 text-xs">{mission.pilotName}</span>
                  </div>
                  {mission.status === 'in_progress' && mission.progress !== undefined && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${mission.progress}%` }} />
                      </div>
                      <span className="text-xs text-cyan-400">{mission.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => showToast('info', '正在跳转至任务管理页面...')}
            className="mt-4 w-full text-center text-cyan-400 text-xs hover:text-cyan-300 transition-colors py-1.5 rounded-lg hover:bg-cyan-400/5"
          >
            查看全部任务 →
          </button>
        </div>
      </div>

      {/* Live telemetry strip */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-400 status-pulse" />
          <span className="text-slate-300 text-sm font-medium">天鹰-01 实时遥测数据</span>
          <span className="text-slate-500 text-xs ml-auto">任务: 城市基础设施巡检-北区</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { label: '飞行高度', value: `${liveData.altitude.toFixed(1)}m`, color: '#00d4ff' },
            { label: '飞行速度', value: `${liveData.speed.toFixed(1)}m/s`, color: '#00ff88' },
            { label: '电池电量', value: `${liveData.battery.toFixed(0)}%`, color: liveData.battery > 50 ? '#00ff88' : '#ffaa00' },
            { label: 'GPS精度', value: '0.8m', color: '#a78bfa' },
            { label: '信号强度', value: '87%', color: '#00d4ff' },
            { label: '温度', value: '12.3°C', color: '#ff6b6b' },
            { label: '风速', value: '8.2m/s', color: '#ffaa00' },
            { label: '已飞时长', value: '1h 18m', color: '#64748b' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className="text-lg font-bold" style={{ color: item.color }}>{item.value}</div>
              <div className="text-slate-500 text-xs mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
