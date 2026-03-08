import { useState } from 'react';
import { Wrench, Plus, Calendar, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { mockMaintenanceRecords, mockDrones } from '../data/mockData';
import type { MaintenanceRecord } from '../types';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  scheduled: { label: '已计划', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Calendar },
  in_progress: { label: '进行中', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
  completed: { label: '已完成', color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle },
  overdue: { label: '已逾期', color: 'text-red-400', bg: 'bg-red-400/10', icon: AlertTriangle },
};

const typeConfig: Record<string, { label: string; color: string }> = {
  routine: { label: '例行保养', color: 'text-green-400' },
  repair: { label: '故障维修', color: 'text-red-400' },
  upgrade: { label: '升级改造', color: 'text-purple-400' },
  inspection: { label: '检查验收', color: 'text-blue-400' },
};

function MaintenanceCard({ record }: { record: MaintenanceRecord }) {
  const status = statusConfig[record.status];
  const type = typeConfig[record.type];
  const StatusIcon = status.icon;

  return (
    <div className={`glass-card rounded-xl p-4 border-l-4 transition-all hover:border-l-cyan-400 ${
      record.status === 'overdue' ? 'border-l-red-500' :
      record.status === 'in_progress' ? 'border-l-yellow-500' :
      record.status === 'completed' ? 'border-l-green-500' : 'border-l-blue-500'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-slate-100 font-semibold text-sm">{record.droneName}</h3>
          <span className={`text-xs ${type.color} font-medium`}>{type.label}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg}`}>
          <StatusIcon className={`w-3 h-3 ${status.color}`} />
          <span className={status.color}>{status.label}</span>
        </div>
      </div>

      <p className="text-slate-400 text-xs mb-3">{record.description}</p>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-slate-500">计划日期</span>
          <div className="text-slate-300 mt-0.5">{record.scheduledDate}</div>
        </div>
        {record.completedDate && (
          <div>
            <span className="text-slate-500">完成日期</span>
            <div className="text-green-400 mt-0.5">{record.completedDate}</div>
          </div>
        )}
        {record.technician && (
          <div>
            <span className="text-slate-500">维修人员</span>
            <div className="text-slate-300 mt-0.5">{record.technician}</div>
          </div>
        )}
        {record.cost !== undefined && (
          <div>
            <span className="text-slate-500">费用</span>
            <div className="text-yellow-400 mt-0.5">¥{record.cost.toLocaleString()}</div>
          </div>
        )}
      </div>

      {record.parts && record.parts.length > 0 && (
        <div className="mt-3">
          <span className="text-slate-500 text-xs">更换零件</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {record.parts.map(part => (
              <span key={part} className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-md">{part}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-3">
        {record.status !== 'completed' && (
          <button className="flex-1 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20 text-xs py-1.5 rounded-lg transition-all">
            {record.status === 'scheduled' ? '开始维护' : '标记完成'}
          </button>
        )}
        <button className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-slate-400 text-xs py-1.5 rounded-lg transition-all">
          查看详情
        </button>
      </div>
    </div>
  );
}

export default function MaintenancePage() {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? mockMaintenanceRecords : mockMaintenanceRecords.filter(r => r.status === filter);

  // Upcoming maintenance
  const upcomingDrones = mockDrones.filter(d => {
    const next = new Date(d.nextMaintenanceDate);
    const now = new Date();
    const days = Math.floor((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days <= 30;
  });

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Wrench className="text-cyan-400 w-5 h-5" />
            维护管理
          </h1>
          <p className="text-slate-500 text-sm">设备维保记录与计划管理</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="sm:ml-auto flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-glow-cyan"
        >
          <Plus className="w-4 h-4" />
          新建维护计划
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, { label, color, bg, icon: Icon }]) => (
          <div key={key} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <div className={`text-xl font-bold ${color}`}>{mockMaintenanceRecords.filter(r => r.status === key).length}</div>
              <div className="text-slate-500 text-xs">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming maintenance alert */}
      {upcomingDrones.length > 0 && (
        <div className="glass-card rounded-xl p-4 border border-yellow-400/20 bg-yellow-400/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium text-sm">即将到期的维护计划</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingDrones.map(drone => {
              const next = new Date(drone.nextMaintenanceDate);
              const days = Math.floor((next.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={drone.id} className="flex items-center justify-between bg-slate-900/40 rounded-lg px-3 py-2">
                  <span className="text-slate-300 text-sm">{drone.name}</span>
                  <span className={`text-xs font-medium ${days <= 7 ? 'text-red-400' : days <= 14 ? 'text-orange-400' : 'text-yellow-400'}`}>
                    {days <= 0 ? '已逾期' : `${days}天后`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[{ key: 'all', label: '全部' }, ...Object.entries(statusConfig).map(([key, { label }]) => ({ key, label }))].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-all border ${
              filter === key ? 'bg-cyan-400/10 border-cyan-400/40 text-cyan-400' : 'glass-card text-slate-400 hover:border-slate-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Maintenance cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(r => <MaintenanceCard key={r.id} record={r} />)}
        {filtered.length === 0 && (
          <div className="col-span-3 glass-card rounded-xl p-10 text-center">
            <Wrench className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">暂无维护记录</p>
          </div>
        )}
      </div>

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="glass-card rounded-2xl w-full max-w-md p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-100 font-bold text-lg">新建维护计划</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">选择设备 *</label>
                <select className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50">
                  {mockDrones.map(d => <option key={d.id}>{d.name} - {d.model}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">维护类型 *</label>
                  <select className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50">
                    {Object.entries(typeConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">计划日期 *</label>
                  <input type="date" className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">维修人员</label>
                <input type="text" placeholder="请输入维修人员姓名" className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50" />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">维护说明 *</label>
                <textarea rows={3} placeholder="请描述维护内容..." className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2.5 rounded-lg text-sm transition-all">取消</button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white py-2.5 rounded-lg text-sm transition-all font-medium">创建计划</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
