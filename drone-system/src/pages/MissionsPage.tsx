import { useState } from 'react';
import { MapPin, Plus, Search, Filter, Clock, XCircle, Play, Pause, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import type { Mission } from '../types';

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  planned: { label: '已计划', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
  in_progress: { label: '进行中', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' },
  completed: { label: '已完成', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
  cancelled: { label: '已取消', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
  paused: { label: '已暂停', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
};

const typeConfig: Record<string, { label: string; emoji: string }> = {
  inspection: { label: '基础设施巡检', emoji: '🔍' },
  mapping: { label: '航测建图', emoji: '🗺️' },
  delivery: { label: '物流配送', emoji: '📦' },
  surveillance: { label: '安防监控', emoji: '👁️' },
  agriculture: { label: '精准农业', emoji: '🌾' },
  search_rescue: { label: '搜索救援', emoji: '🆘' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: '低', color: 'text-slate-400' },
  medium: { label: '中', color: 'text-yellow-400' },
  high: { label: '高', color: 'text-orange-400' },
  critical: { label: '紧急', color: 'text-red-400' },
};

function MissionCard({ mission }: { mission: Mission }) {
  const [expanded, setExpanded] = useState(false);
  const { updateMissionStatus, showToast } = useStore();
  const status = statusConfig[mission.status];
  const type = typeConfig[mission.type];
  const priority = priorityConfig[mission.priority];

  const handlePause = () => {
    updateMissionStatus(mission.id, 'paused');
    showToast('warning', `任务「${mission.name}」已暂停`);
  };

  const handleResume = () => {
    updateMissionStatus(mission.id, 'in_progress');
    showToast('success', `任务「${mission.name}」已恢复`);
  };

  const handleStart = () => {
    updateMissionStatus(mission.id, 'in_progress');
    showToast('success', `任务「${mission.name}」已启动，无人机正在起飞...`);
  };

  const handleCancel = () => {
    if (confirm(`确定要取消任务「${mission.name}」吗？`)) {
      updateMissionStatus(mission.id, 'cancelled');
      showToast('error', `任务「${mission.name}」已取消`);
    }
  };

  const handleComplete = () => {
    updateMissionStatus(mission.id, 'completed');
    showToast('success', `任务「${mission.name}」已标记为完成`);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden hover:border-cyan-400/20 transition-all duration-300">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl flex-shrink-0">
            {type.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-slate-100 font-semibold text-sm leading-tight">{mission.name}</h3>
              <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border ${status.color} ${status.bg} ${status.border}`}>
                {status.label}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
              <span>🚁 {mission.droneName}</span>
              <span>👤 {mission.pilotName}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{mission.startTime.slice(0, 16)}</span>
              <span className={priority.color}>优先级: {priority.label}</span>
            </div>
          </div>
        </div>

        {mission.status === 'in_progress' && mission.progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>任务进度</span>
              <span className="text-cyan-400 font-medium">{mission.progress}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400" style={{ width: `${mission.progress}%` }} />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          {mission.waypoints && <span>📍 {mission.waypoints} 航点</span>}
          {mission.coverageArea && <span>📐 {mission.coverageArea} km²</span>}
          {mission.dataCollected && <span>💾 {mission.dataCollected} GB</span>}
          {mission.weather && <span>🌡 {mission.weather.temperature}°C · 💨 {mission.weather.windSpeed}m/s</span>}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            {mission.status === 'in_progress' && (
              <>
                <button onClick={handlePause} className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs px-3 py-1.5 rounded-lg hover:bg-yellow-400/20 transition-all">
                  <Pause className="w-3 h-3" />暂停
                </button>
                <button onClick={handleComplete} className="flex items-center gap-1 bg-green-400/10 border border-green-400/30 text-green-400 text-xs px-3 py-1.5 rounded-lg hover:bg-green-400/20 transition-all">
                  <CheckCircle className="w-3 h-3" />完成
                </button>
              </>
            )}
            {mission.status === 'paused' && (
              <button onClick={handleResume} className="flex items-center gap-1 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs px-3 py-1.5 rounded-lg hover:bg-cyan-400/20 transition-all">
                <Play className="w-3 h-3" />继续
              </button>
            )}
            {mission.status === 'planned' && (
              <button onClick={handleStart} className="flex items-center gap-1 bg-green-400/10 border border-green-400/30 text-green-400 text-xs px-3 py-1.5 rounded-lg hover:bg-green-400/20 transition-all">
                <Play className="w-3 h-3" />启动
              </button>
            )}
            {(mission.status === 'planned' || mission.status === 'in_progress' || mission.status === 'paused') && (
              <button onClick={handleCancel} className="flex items-center gap-1 bg-red-400/10 border border-red-400/30 text-red-400 text-xs px-3 py-1.5 rounded-lg hover:bg-red-400/20 transition-all">
                <XCircle className="w-3 h-3" />取消
              </button>
            )}
          </div>
          <button onClick={() => setExpanded(!expanded)} className="text-slate-500 hover:text-slate-300 transition-colors text-xs flex items-center gap-1">
            详情 {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-drone-border px-4 py-4 bg-slate-900/40 space-y-3 animate-fade-in">
          <div>
            <span className="text-slate-500 text-xs">任务描述</span>
            <p className="text-slate-300 text-sm mt-1">{mission.description}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div><span className="text-slate-500">计划时长</span><div className="text-slate-200 mt-0.5">{mission.plannedDuration} 分钟</div></div>
            {mission.actualDuration && <div><span className="text-slate-500">实际时长</span><div className="text-slate-200 mt-0.5">{mission.actualDuration} 分钟</div></div>}
            {mission.area && <div><span className="text-slate-500">作业区域</span><div className="text-slate-200 mt-0.5">{mission.area}</div></div>}
            {mission.endTime && <div><span className="text-slate-500">结束时间</span><div className="text-slate-200 mt-0.5">{mission.endTime.slice(0, 16)}</div></div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MissionsPage() {
  const { missions, drones, addMission, showToast } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMission, setNewMission] = useState({
    name: '', type: 'inspection', priority: 'medium', droneId: '', startTime: '', description: ''
  });

  const filtered = missions.filter(m => {
    const matchSearch = m.name.includes(search) || m.droneName.includes(search) || m.pilotName.includes(search);
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchType = typeFilter === 'all' || m.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const counts = {
    all: missions.length,
    in_progress: missions.filter(m => m.status === 'in_progress').length,
    planned: missions.filter(m => m.status === 'planned').length,
    completed: missions.filter(m => m.status === 'completed').length,
  };

  const handleCreate = () => {
    if (!newMission.name.trim()) {
      showToast('error', '请输入任务名称');
      return;
    }
    if (!newMission.startTime) {
      showToast('error', '请选择计划开始时间');
      return;
    }
    const selectedDrone = drones.find(d => d.id === newMission.droneId) || drones[0];
    const mission: Mission = {
      id: `m${Date.now()}`,
      name: newMission.name,
      type: newMission.type as Mission['type'],
      status: 'planned',
      droneId: selectedDrone.id,
      droneName: selectedDrone.name,
      pilotId: 'u2',
      pilotName: '李明',
      startTime: newMission.startTime,
      plannedDuration: 60,
      description: newMission.description || '新建任务',
      priority: newMission.priority as Mission['priority'],
      progress: 0,
    };
    addMission(mission);
    showToast('success', `任务「${mission.name}」创建成功`);
    setShowCreateModal(false);
    setNewMission({ name: '', type: 'inspection', priority: 'medium', droneId: '', startTime: '', description: '' });
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="text-cyan-400 w-5 h-5" />飞行任务管理
          </h1>
          <p className="text-slate-500 text-sm">规划、执行和追踪无人机飞行任务</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="sm:ml-auto flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-glow-cyan">
          <Plus className="w-4 h-4" />新建任务
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: '全部', key: 'all', color: 'text-slate-400' },
          { label: '进行中', key: 'in_progress', color: 'text-cyan-400' },
          { label: '已计划', key: 'planned', color: 'text-blue-400' },
          { label: '已完成', key: 'completed', color: 'text-green-400' },
        ].map(({ label, key, color }) => (
          <button key={key} onClick={() => setStatusFilter(key)}
            className={`glass-card rounded-xl p-3 text-center transition-all hover:border-cyan-400/20 ${statusFilter === key ? 'border-cyan-400/40' : ''}`}>
            <div className={`text-2xl font-bold ${statusFilter === key ? 'text-cyan-400' : color}`}>{counts[key as keyof typeof counts] ?? 0}</div>
            <div className="text-slate-500 text-xs mt-0.5">{label}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="搜索任务名称、无人机、操作员..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-drone-card border border-drone-border rounded-lg pl-9 pr-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 text-sm" />
        </div>
        <div className="flex gap-2">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="bg-drone-card border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50 cursor-pointer">
            <option value="all">全部类型</option>
            {Object.entries(typeConfig).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
          </select>
          <button onClick={() => { setSearch(''); setStatusFilter('all'); setTypeFilter('all'); showToast('info', '筛选条件已重置'); }}
            className="flex items-center gap-2 bg-drone-card border border-drone-border text-slate-400 hover:text-slate-200 px-3 py-2.5 rounded-lg text-sm transition-all hover:border-slate-500">
            <Filter className="w-4 h-4" />重置
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.length > 0 ? filtered.map(m => <MissionCard key={m.id} mission={m} />) : (
          <div className="col-span-2 glass-card rounded-xl p-10 text-center">
            <MapPin className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">暂无符合条件的任务</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
          <div className="glass-card rounded-2xl w-full max-w-lg p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-100 font-bold text-lg">新建飞行任务</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">任务名称 *</label>
                <input type="text" value={newMission.name} onChange={e => setNewMission(p => ({ ...p, name: e.target.value }))}
                  placeholder="请输入任务名称"
                  className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">任务类型 *</label>
                  <select value={newMission.type} onChange={e => setNewMission(p => ({ ...p, type: e.target.value }))}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50">
                    {Object.entries(typeConfig).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">优先级 *</label>
                  <select value={newMission.priority} onChange={e => setNewMission(p => ({ ...p, priority: e.target.value }))}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50">
                    <option value="low">低</option>
                    <option value="medium">中</option>
                    <option value="high">高</option>
                    <option value="critical">紧急</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">指派无人机 *</label>
                  <select value={newMission.droneId} onChange={e => setNewMission(p => ({ ...p, droneId: e.target.value }))}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50">
                    <option value="">请选择无人机</option>
                    {drones.filter(d => d.status === 'idle' || d.status === 'charging').map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.model})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">计划开始时间 *</label>
                  <input type="datetime-local" value={newMission.startTime} onChange={e => setNewMission(p => ({ ...p, startTime: e.target.value }))}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">任务描述</label>
                <textarea rows={3} value={newMission.description} onChange={e => setNewMission(p => ({ ...p, description: e.target.value }))}
                  placeholder="请描述任务目标和注意事项..."
                  className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 text-sm resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2.5 rounded-lg font-medium text-sm transition-all">取消</button>
                <button onClick={handleCreate} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white py-2.5 rounded-lg font-medium text-sm transition-all">创建任务</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
