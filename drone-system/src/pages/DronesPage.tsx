import { useState } from 'react';
import { Cpu, Plus, Search, Battery, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import type { Drone } from '../types';

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  flying: { label: '飞行中', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' },
  idle: { label: '待机中', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
  charging: { label: '充电中', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  maintenance: { label: '维修中', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  offline: { label: '离线', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
};

function DroneCard({ drone }: { drone: Drone }) {
  const [expanded, setExpanded] = useState(false);
  const { updateDroneStatus, showToast } = useStore();
  const status = statusConfig[drone.status];
  const batteryColor = drone.batteryLevel > 60 ? '#00ff88' : drone.batteryLevel > 30 ? '#ffaa00' : '#ff4444';

  const handleRecall = () => {
    updateDroneStatus(drone.id, 'idle');
    showToast('success', `${drone.name} 已发送召回指令，无人机正在返航`);
  };

  const handleAssign = () => {
    showToast('info', `请前往【飞行任务】页面为 ${drone.name} 创建新任务`);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden hover:border-cyan-400/20 transition-all duration-300">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
              <rect x="16" y="20" width="16" height="8" rx="2" fill={drone.status === 'flying' ? 'rgba(0,212,255,0.9)' : 'rgba(100,116,139,0.5)'}/>
              <line x1="16" y1="22" x2="5" y2="12" stroke={drone.status === 'flying' ? 'rgba(0,212,255,0.7)' : 'rgba(100,116,139,0.4)'} strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="32" y1="22" x2="43" y2="12" stroke={drone.status === 'flying' ? 'rgba(0,212,255,0.7)' : 'rgba(100,116,139,0.4)'} strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="16" y1="26" x2="5" y2="36" stroke={drone.status === 'flying' ? 'rgba(0,212,255,0.7)' : 'rgba(100,116,139,0.4)'} strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="32" y1="26" x2="43" y2="36" stroke={drone.status === 'flying' ? 'rgba(0,212,255,0.7)' : 'rgba(100,116,139,0.4)'} strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="5" cy="12" r="3" fill={drone.status === 'flying' ? '#00d4ff' : '#475569'}/>
              <circle cx="43" cy="12" r="3" fill={drone.status === 'flying' ? '#00d4ff' : '#475569'}/>
              <circle cx="5" cy="36" r="3" fill={drone.status === 'flying' ? '#00d4ff' : '#475569'}/>
              <circle cx="43" cy="36" r="3" fill={drone.status === 'flying' ? '#00d4ff' : '#475569'}/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-slate-100 font-bold">{drone.name}</h3>
                <p className="text-slate-500 text-xs">{drone.model}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-lg border font-medium ${status.color} ${status.bg} ${status.border}`}>
                {status.label}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1 text-slate-500"><Battery className="w-3 h-3" />电池电量</span>
            <span className="font-medium" style={{ color: batteryColor }}>{drone.batteryLevel}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${drone.batteryLevel}%`, backgroundColor: batteryColor }} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
          <div className="bg-slate-900/40 rounded-lg p-2 text-center">
            <div className="text-slate-200 font-bold">{Math.floor(drone.totalFlightHours)}h</div>
            <div className="text-slate-500 mt-0.5">总飞行时长</div>
          </div>
          <div className="bg-slate-900/40 rounded-lg p-2 text-center">
            <div className="text-slate-200 font-bold">{drone.totalFlights}</div>
            <div className="text-slate-500 mt-0.5">总飞行架次</div>
          </div>
          <div className="bg-slate-900/40 rounded-lg p-2 text-center">
            <div className="text-slate-200 font-bold">{drone.status === 'flying' ? `${drone.location?.altitude}m` : '--'}</div>
            <div className="text-slate-500 mt-0.5">{drone.status === 'flying' ? '当前高度' : '飞行高度'}</div>
          </div>
        </div>

        {(drone.assignedPilot || drone.lastMission) && (
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            {drone.assignedPilot && <span>👤 {drone.assignedPilot}</span>}
            {drone.lastMission && <span>📋 {drone.lastMission}</span>}
          </div>
        )}

        <div className="flex items-center gap-2 mt-3">
          {drone.status === 'flying' && (
            <button onClick={handleRecall} className="flex-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20 text-xs py-2 rounded-lg transition-all font-medium">
              📡 召回返航
            </button>
          )}
          {drone.status === 'idle' && (
            <button onClick={handleAssign} className="flex-1 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20 text-xs py-2 rounded-lg transition-all font-medium">
              ✈️ 分配任务
            </button>
          )}
          {(drone.status === 'maintenance' || drone.status === 'offline') && (
            <button onClick={() => { updateDroneStatus(drone.id, 'idle'); showToast('success', `${drone.name} 状态已更新为待机`); }}
              className="flex-1 bg-green-400/10 border border-green-400/30 text-green-400 hover:bg-green-400/20 text-xs py-2 rounded-lg transition-all font-medium">
              ✅ 标记就绪
            </button>
          )}
          {drone.status === 'charging' && (
            <button onClick={() => { updateDroneStatus(drone.id, 'idle'); showToast('success', `${drone.name} 充电完成，已设为待机`); }}
              className="flex-1 bg-green-400/10 border border-green-400/30 text-green-400 hover:bg-green-400/20 text-xs py-2 rounded-lg transition-all font-medium">
              🔋 完成充电
            </button>
          )}
          <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs py-2 px-3 rounded-lg hover:bg-slate-700/40 transition-all">
            详情 {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-drone-border bg-slate-900/40 p-4 space-y-3 animate-fade-in">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><span className="text-slate-500">序列号</span><div className="text-slate-200 mt-0.5 font-mono">{drone.serialNumber}</div></div>
            <div><span className="text-slate-500">购入日期</span><div className="text-slate-200 mt-0.5">{drone.purchaseDate}</div></div>
            <div><span className="text-slate-500">最大载重</span><div className="text-slate-200 mt-0.5">{drone.maxPayload} kg</div></div>
            <div><span className="text-slate-500">最大速度</span><div className="text-slate-200 mt-0.5">{drone.maxSpeed} km/h</div></div>
            <div><span className="text-slate-500">最大航程</span><div className="text-slate-200 mt-0.5">{(drone.maxRange / 1000).toFixed(1)} km</div></div>
            <div><span className="text-slate-500">下次维护</span><div className="text-slate-200 mt-0.5">{drone.nextMaintenanceDate}</div></div>
          </div>
          {drone.cameras && drone.cameras.length > 0 && (
            <div>
              <span className="text-slate-500 text-xs">搭载相机</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {drone.cameras.map(c => <span key={c} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{c}</span>)}
              </div>
            </div>
          )}
          {drone.sensors && drone.sensors.length > 0 && (
            <div>
              <span className="text-slate-500 text-xs">搭载传感器</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {drone.sensors.map(s => <span key={s} className="text-xs bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 px-2 py-0.5 rounded">{s}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DronesPage() {
  const { drones, addDrone, showToast } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDrone, setNewDrone] = useState({ name: '', model: '', serialNumber: '', purchaseDate: '' });

  const filtered = drones.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.model.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts: Record<string, number> = { all: drones.length };
  drones.forEach(d => { statusCounts[d.status] = (statusCounts[d.status] || 0) + 1; });

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'flying', label: '飞行中' },
    { key: 'idle', label: '待机中' },
    { key: 'charging', label: '充电中' },
    { key: 'maintenance', label: '维修中' },
    { key: 'offline', label: '离线' },
  ];

  const handleAdd = () => {
    if (!newDrone.name.trim() || !newDrone.model.trim()) {
      showToast('error', '请填写设备名称和型号');
      return;
    }
    const drone: Drone = {
      id: `d${Date.now()}`,
      name: newDrone.name,
      model: newDrone.model,
      serialNumber: newDrone.serialNumber || `SN-${Date.now()}`,
      status: 'idle',
      batteryLevel: 100,
      totalFlightHours: 0,
      totalFlights: 0,
      location: { lat: 39.9, lng: 116.4, altitude: 0 },
      speed: 0,
      purchaseDate: newDrone.purchaseDate || new Date().toISOString().slice(0, 10),
      nextMaintenanceDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
      maxPayload: 1.0, maxSpeed: 60, maxRange: 20000, maxAltitude: 5000,
      cameras: [], sensors: ['GPS', 'IMU'],
    };
    addDrone(drone);
    showToast('success', `设备「${drone.name}」已添加到机队`);
    setShowAddModal(false);
    setNewDrone({ name: '', model: '', serialNumber: '', purchaseDate: '' });
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="text-cyan-400 w-5 h-5" />机队管理
          </h1>
          <p className="text-slate-500 text-sm">管理和监控所有无人机设备</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="sm:ml-auto flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-glow-cyan">
          <Plus className="w-4 h-4" />添加设备
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
            className={`text-sm px-3 py-1.5 rounded-lg transition-all border ${statusFilter === tab.key ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400/40' : 'bg-drone-card text-slate-400 border-drone-border hover:text-slate-200'}`}>
            {tab.label} ({statusCounts[tab.key] || 0})
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input type="text" placeholder="搜索设备名称或型号..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-drone-card border border-drone-border rounded-lg pl-9 pr-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 text-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length > 0 ? filtered.map(d => <DroneCard key={d.id} drone={d} />) : (
          <div className="col-span-3 glass-card rounded-xl p-10 text-center">
            <Cpu className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">暂无符合条件的设备</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="glass-card rounded-2xl w-full max-w-md p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-100 font-bold text-lg">添加新设备</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-300"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">设备名称 *</label>
                <input type="text" value={newDrone.name} onChange={e => setNewDrone(p => ({ ...p, name: e.target.value }))} placeholder="例如：天鹰-07"
                  className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 text-sm" />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">设备型号 *</label>
                <input type="text" value={newDrone.model} onChange={e => setNewDrone(p => ({ ...p, model: e.target.value }))} placeholder="例如：DJI Mavic 3 Enterprise"
                  className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 text-sm" />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">序列号</label>
                <input type="text" value={newDrone.serialNumber} onChange={e => setNewDrone(p => ({ ...p, serialNumber: e.target.value }))} placeholder="设备序列号（可选）"
                  className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 text-sm" />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">购入日期</label>
                <input type="date" value={newDrone.purchaseDate} onChange={e => setNewDrone(p => ({ ...p, purchaseDate: e.target.value }))}
                  className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 focus:outline-none focus:border-cyan-400/50 text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2.5 rounded-lg text-sm transition-all">取消</button>
                <button onClick={handleAdd} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white py-2.5 rounded-lg text-sm transition-all font-medium">添加设备</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
