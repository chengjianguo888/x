import { useState } from 'react';
import { Wrench, Plus, XCircle, CheckCircle, PlayCircle, AlertTriangle } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import type { MaintenanceRecord } from '../types';

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  routine: { label: '例行保养', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  repair: { label: '故障维修', color: 'text-red-400', bg: 'bg-red-400/10' },
  inspection: { label: '飞行检查', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  upgrade: { label: '系统升级', color: 'text-purple-400', bg: 'bg-purple-400/10' },
};

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  scheduled: { label: '已计划', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
  in_progress: { label: '进行中', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  completed: { label: '已完成', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
  overdue: { label: '已逾期', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
};

export default function MaintenancePage() {
  const { maintenanceRecords, drones, addMaintenance, updateMaintenanceStatus, showToast } = useStore();
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ droneId: '', type: 'routine', scheduledDate: '', description: '', cost: '', technician: '' });

  const today = new Date().toISOString().slice(0, 10);
  const records: MaintenanceRecord[] = maintenanceRecords.map(r =>
    r.status === 'scheduled' && r.scheduledDate < today ? { ...r, status: 'overdue' as const } : r
  );

  const tabs = [
    { key: 'all', label: '全部', count: records.length },
    { key: 'in_progress', label: '进行中', count: records.filter(r => r.status === 'in_progress').length },
    { key: 'scheduled', label: '已计划', count: records.filter(r => r.status === 'scheduled').length },
    { key: 'overdue', label: '已逾期', count: records.filter(r => r.status === 'overdue').length },
    { key: 'completed', label: '已完成', count: records.filter(r => r.status === 'completed').length },
  ];

  const filtered = filter === 'all' ? records : records.filter(r => r.status === filter);

  const upcoming = records.filter(r => r.status === 'scheduled' && r.scheduledDate >= today &&
    new Date(r.scheduledDate).getTime() - Date.now() < 30 * 86400000);

  const handleCreate = () => {
    if (!form.droneId || !form.scheduledDate) {
      showToast('error', '请选择无人机和计划日期');
      return;
    }
    const drone = drones.find(d => d.id === form.droneId)!;
    const record: MaintenanceRecord = {
      id: `mr${Date.now()}`,
      droneId: form.droneId,
      droneName: drone.name,
      type: form.type as MaintenanceRecord['type'],
      status: 'scheduled',
      scheduledDate: form.scheduledDate,
      technician: form.technician || '待指定',
      description: form.description || typeConfig[form.type].label,
      cost: Number(form.cost) || 0,
    };
    addMaintenance(record);
    showToast('success', `${drone.name} 的${typeConfig[form.type].label}计划已创建`);
    setShowModal(false);
    setForm({ droneId: '', type: 'routine', scheduledDate: '', description: '', cost: '', technician: '' });
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Wrench className="text-cyan-400 w-5 h-5" />维护管理
          </h1>
          <p className="text-slate-500 text-sm">安排和追踪无人机维护计划</p>
        </div>
        <button onClick={() => setShowModal(true)} className="sm:ml-auto flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-glow-cyan">
          <Plus className="w-4 h-4" />新建维护计划
        </button>
      </div>

      {upcoming.length > 0 && (
        <div className="glass-card rounded-xl p-4 border-yellow-400/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium text-sm">即将到期提醒 ({upcoming.length} 项)</span>
          </div>
          <div className="space-y-2">
            {upcoming.map(r => (
              <div key={r.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{r.droneName} — {typeConfig[r.type]?.label}</span>
                <span className="text-yellow-400 text-xs">{r.scheduledDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`text-sm px-3 py-1.5 rounded-lg transition-all border ${filter === tab.key ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400/40' : 'bg-drone-card text-slate-400 border-drone-border hover:text-slate-200'}`}>
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card rounded-xl p-10 text-center">
            <Wrench className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">暂无{filter === 'all' ? '' : tabs.find(t => t.key === filter)?.label}维护记录</p>
          </div>
        ) : filtered.map(record => {
          const typeCfg = typeConfig[record.type];
          const statusCfg = statusConfig[record.status];
          const isExpanded = expandedId === record.id;
          return (
            <div key={record.id} className="glass-card rounded-xl overflow-hidden hover:border-cyan-400/20 transition-all">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeCfg.bg}`}>
                    <Wrench className={`w-5 h-5 ${typeCfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="text-slate-100 font-semibold text-sm">{record.droneName}</h3>
                        <span className={`text-xs ${typeCfg.color} ${typeCfg.bg} px-2 py-0.5 rounded-full`}>{typeCfg.label}</span>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${statusCfg.color} ${statusCfg.bg} ${statusCfg.border}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-1.5">{record.description}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                      <span>📅 计划: {record.scheduledDate}</span>
                      {record.technician && <span>👤 {record.technician}</span>}
                      {record.cost !== undefined && record.cost > 0 && <span>💰 ¥{record.cost}</span>}
                      {record.completedDate && <span>✅ 完成: {record.completedDate}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  {record.status === 'scheduled' && (
                    <button onClick={() => { updateMaintenanceStatus(record.id, 'in_progress'); showToast('info', `${record.droneName} 维护已开始`); }}
                      className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20 text-xs px-3 py-1.5 rounded-lg transition-all">
                      <PlayCircle className="w-3 h-3" />开始维护
                    </button>
                  )}
                  {record.status === 'in_progress' && (
                    <button onClick={() => { updateMaintenanceStatus(record.id, 'completed'); showToast('success', `${record.droneName} 维护已完成`); }}
                      className="flex items-center gap-1 bg-green-400/10 border border-green-400/30 text-green-400 hover:bg-green-400/20 text-xs px-3 py-1.5 rounded-lg transition-all">
                      <CheckCircle className="w-3 h-3" />标记完成
                    </button>
                  )}
                  {record.status === 'overdue' && (
                    <button onClick={() => { updateMaintenanceStatus(record.id, 'in_progress'); showToast('warning', `${record.droneName} 逾期维护已开始`); }}
                      className="flex items-center gap-1 bg-red-400/10 border border-red-400/30 text-red-400 hover:bg-red-400/20 text-xs px-3 py-1.5 rounded-lg transition-all">
                      <AlertTriangle className="w-3 h-3" />立即处理
                    </button>
                  )}
                  {record.parts && record.parts.length > 0 && (
                    <button onClick={() => setExpandedId(isExpanded ? null : record.id)}
                      className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-700/40 transition-all">
                      {isExpanded ? '收起' : '查看零件'}
                    </button>
                  )}
                </div>
              </div>
              {isExpanded && record.parts && (
                <div className="border-t border-drone-border bg-slate-900/40 px-4 py-3 animate-fade-in">
                  <span className="text-slate-500 text-xs">所需零件</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {record.parts.map(p => <span key={p} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">{p}</span>)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="glass-card rounded-2xl w-full max-w-md p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-100 font-bold text-lg">新建维护计划</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">选择无人机 *</label>
                <select value={form.droneId} onChange={e => setForm(p => ({ ...p, droneId: e.target.value }))}
                  className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50">
                  <option value="">请选择无人机</option>
                  {drones.map(d => <option key={d.id} value={d.id}>{d.name} ({d.model})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">维护类型 *</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50">
                    {Object.entries(typeConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">计划日期 *</label>
                  <input type="date" value={form.scheduledDate} onChange={e => setForm(p => ({ ...p, scheduledDate: e.target.value }))}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">维护技师</label>
                  <input type="text" value={form.technician} onChange={e => setForm(p => ({ ...p, technician: e.target.value }))} placeholder="技师姓名"
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">预计费用 (¥)</label>
                  <input type="number" value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} placeholder="0"
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">维护说明</label>
                <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="维护内容描述..."
                  className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2.5 rounded-lg text-sm transition-all">取消</button>
                <button onClick={handleCreate} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white py-2.5 rounded-lg text-sm transition-all font-medium">创建计划</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
