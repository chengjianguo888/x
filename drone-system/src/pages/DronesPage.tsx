import { useState } from 'react';
import { Activity, Plus, Search, Battery, Wrench, ChevronDown, ChevronUp } from 'lucide-react';
import { mockDrones } from '../data/mockData';
import type { Drone } from '../types';

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  flying: { label: '飞行中', color: 'text-green-400', bg: 'bg-green-400/10', dot: 'bg-green-400' },
  idle: { label: '待机中', color: 'text-blue-400', bg: 'bg-blue-400/10', dot: 'bg-blue-400' },
  charging: { label: '充电中', color: 'text-yellow-400', bg: 'bg-yellow-400/10', dot: 'bg-yellow-400' },
  maintenance: { label: '维修中', color: 'text-orange-400', bg: 'bg-orange-400/10', dot: 'bg-orange-400' },
  offline: { label: '离线', color: 'text-red-400', bg: 'bg-red-400/10', dot: 'bg-red-400' },
};

function DroneCard({ drone }: { drone: Drone }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[drone.status];

  const batteryColor = drone.batteryLevel > 60 ? '#00ff88' : drone.batteryLevel > 30 ? '#ffaa00' : '#ff4444';

  return (
    <div className="glass-card rounded-xl overflow-hidden hover:border-cyan-400/20 transition-all duration-300">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Drone icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${drone.status === 'flying' ? 'bg-cyan-400/10 border border-cyan-400/20' : 'bg-slate-800'}`}>
              <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                <rect x="10" y="12" width="12" height="8" rx="2" fill={drone.status === 'offline' ? 'rgba(100,116,139,0.4)' : 'rgba(0,212,255,0.8)'}/>
                <line x1="10" y1="14" x2="3" y2="9" stroke={drone.status === 'offline' ? 'rgba(100,116,139,0.3)' : 'rgba(0,212,255,0.6)'} strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="22" y1="14" x2="29" y2="9" stroke={drone.status === 'offline' ? 'rgba(100,116,139,0.3)' : 'rgba(0,212,255,0.6)'} strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="10" y1="18" x2="3" y2="23" stroke={drone.status === 'offline' ? 'rgba(100,116,139,0.3)' : 'rgba(0,212,255,0.6)'} strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="22" y1="18" x2="29" y2="23" stroke={drone.status === 'offline' ? 'rgba(100,116,139,0.3)' : 'rgba(0,212,255,0.6)'} strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="16" cy="20" r="2" fill="rgba(0,0,0,0.4)" stroke="rgba(0,212,255,0.5)" strokeWidth="0.5"/>
              </svg>
            </div>
            <div>
              <h3 className="text-slate-100 font-bold">{drone.name}</h3>
              <p className="text-slate-500 text-xs">{drone.model}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${status.bg}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${status.dot} ${drone.status === 'flying' ? 'status-pulse' : ''}`} />
            <span className={status.color}>{status.label}</span>
          </div>
        </div>

        {/* Battery */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1"><Battery className="w-3 h-3" />电池电量</span>
            <span style={{ color: batteryColor }} className="font-medium">{drone.batteryLevel}%</span>
          </div>
          <div className="relative h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${drone.batteryLevel}%`, backgroundColor: batteryColor }}
            />
            {/* Battery segments */}
            {[25, 50, 75].map(pct => (
              <div key={pct} className="absolute top-0 bottom-0 w-px bg-slate-900/50" style={{ left: `${pct}%` }} />
            ))}
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          <div className="bg-slate-900/40 rounded-lg p-2">
            <div className="text-cyan-400 font-bold text-sm">{drone.totalFlightHours.toFixed(0)}h</div>
            <div className="text-slate-500 text-xs">总飞行时长</div>
          </div>
          <div className="bg-slate-900/40 rounded-lg p-2">
            <div className="text-green-400 font-bold text-sm">{drone.totalFlights}</div>
            <div className="text-slate-500 text-xs">总飞行架次</div>
          </div>
          <div className="bg-slate-900/40 rounded-lg p-2">
            <div className="text-purple-400 font-bold text-sm">
              {drone.status === 'flying' && drone.location ? `${drone.location.altitude}m` : '--'}
            </div>
            <div className="text-slate-500 text-xs">{drone.status === 'flying' ? '当前高度' : '飞行高度'}</div>
          </div>
        </div>

        {/* Current location/mission */}
        {drone.assignedPilot && (
          <div className="mt-3 text-xs text-slate-500">
            <span>👤 {drone.assignedPilot}</span>
            {drone.lastMission && <span className="ml-3">📋 {drone.lastMission}</span>}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          {drone.status === 'idle' && (
            <button className="flex-1 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20 text-xs py-2 rounded-lg transition-all font-medium">
              分配任务
            </button>
          )}
          {drone.status === 'flying' && (
            <button className="flex-1 bg-red-400/10 border border-red-400/30 text-red-400 hover:bg-red-400/20 text-xs py-2 rounded-lg transition-all font-medium">
              召回返航
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 bg-slate-700/50 hover:bg-slate-700 text-slate-400 text-xs px-3 py-2 rounded-lg transition-all"
          >
            详情 {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expanded specs */}
      {expanded && (
        <div className="border-t border-drone-border bg-slate-900/40 px-5 py-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500">序列号</span>
              <div className="text-slate-300 mt-0.5 font-mono">{drone.serialNumber}</div>
            </div>
            <div>
              <span className="text-slate-500">购入日期</span>
              <div className="text-slate-300 mt-0.5">{drone.purchaseDate}</div>
            </div>
            <div>
              <span className="text-slate-500">最大载重</span>
              <div className="text-slate-300 mt-0.5">{drone.maxPayload} kg</div>
            </div>
            <div>
              <span className="text-slate-500">最大速度</span>
              <div className="text-slate-300 mt-0.5">{drone.maxSpeed} km/h</div>
            </div>
            <div>
              <span className="text-slate-500">最大航程</span>
              <div className="text-slate-300 mt-0.5">{(drone.maxRange / 1000).toFixed(1)} km</div>
            </div>
            <div>
              <span className="text-slate-500">最大高度</span>
              <div className="text-slate-300 mt-0.5">{drone.maxAltitude} m</div>
            </div>
            {drone.cameras && drone.cameras.length > 0 && (
              <div className="col-span-2">
                <span className="text-slate-500">搭载相机</span>
                <div className="text-slate-300 mt-0.5">{drone.cameras.join(' · ')}</div>
              </div>
            )}
            {drone.sensors && (
              <div className="col-span-2">
                <span className="text-slate-500">传感器</span>
                <div className="text-slate-300 mt-0.5">{drone.sensors.join(' · ')}</div>
              </div>
            )}
            <div className="col-span-2 flex items-center gap-1 text-yellow-400 bg-yellow-400/5 border border-yellow-400/20 rounded-lg px-2.5 py-1.5">
              <Wrench className="w-3 h-3 flex-shrink-0" />
              <span>下次维护: {drone.nextMaintenanceDate}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DronesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockDrones.filter(d => {
    const matchSearch = d.name.includes(search) || d.model.includes(search);
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = Object.entries(statusConfig).reduce((acc, [key]) => {
    acc[key] = mockDrones.filter(d => d.status === key).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="text-cyan-400 w-5 h-5" />
            机队管理
          </h1>
          <p className="text-slate-500 text-sm">管理和监控所有无人机设备</p>
        </div>
        <button className="sm:ml-auto flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-glow-cyan">
          <Plus className="w-4 h-4" />
          添加设备
        </button>
      </div>

      {/* Status summary */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        <button
          onClick={() => setStatusFilter('all')}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all
            ${statusFilter === 'all' ? 'bg-cyan-400/10 border-cyan-400/40 text-cyan-400' : 'glass-card text-slate-400 hover:border-slate-500'}`}
        >
          全部 <span className="text-xs opacity-70">({mockDrones.length})</span>
        </button>
        {Object.entries(statusConfig).map(([key, { label, color, dot }]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all
              ${statusFilter === key ? `bg-cyan-400/10 border-cyan-400/40 ${color}` : 'glass-card text-slate-400 hover:border-slate-500'}`}
          >
            <div className={`w-2 h-2 rounded-full ${dot}`} />
            {label} ({statusCounts[key] || 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="搜索设备名称或型号..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-drone-card border border-drone-border rounded-lg pl-9 pr-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 text-sm"
        />
      </div>

      {/* Drone cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(drone => <DroneCard key={drone.id} drone={drone} />)}
        {filtered.length === 0 && (
          <div className="col-span-3 glass-card rounded-xl p-10 text-center">
            <Activity className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">暂无符合条件的设备</p>
          </div>
        )}
      </div>
    </div>
  );
}
