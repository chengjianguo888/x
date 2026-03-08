import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Database, Download, RefreshCw, Eye, Filter } from 'lucide-react';
import { mockFlightData } from '../data/mockData';
import { useStore } from '../hooks/useStore';

const tabs = [
  { id: 'altitude', label: '飞行高度', unit: 'm', color: '#00d4ff', key: 'altitude' as const },
  { id: 'speed', label: '飞行速度', unit: 'm/s', color: '#00ff88', key: 'speed' as const },
  { id: 'battery', label: '电池电量', unit: '%', color: '#ffaa00', key: 'battery' as const },
];

const PAGE_SIZE = 10;

export default function DataPage() {
  const { showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'altitude' | 'speed' | 'battery'>('altitude');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState<typeof mockFlightData[number] | null>(null);
  const [filterDrone, setFilterDrone] = useState('all');

  const droneNames = useMemo(() => ['all', ...Array.from(new Set(mockFlightData.map(d => d.droneName ?? '天鹰-01')))], []);
  const filtered = filterDrone === 'all' ? mockFlightData : mockFlightData.filter(d => (d.droneName ?? '天鹰-01') === filterDrone);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const tab = tabs.find(t => t.id === activeTab)!;

  const allSelected = pageData.length > 0 && pageData.every(d => selectedRows.has(d.id));
  const toggleAll = () => {
    if (allSelected) setSelectedRows(prev => { const n = new Set(prev); pageData.forEach(d => n.delete(d.id)); return n; });
    else setSelectedRows(prev => { const n = new Set(prev); pageData.forEach(d => n.add(d.id)); return n; });
  };

  const handleExportAll = () => {
    showToast('success', `正在导出全部 ${filtered.length} 条数据（CSV格式）...`);
    setTimeout(() => showToast('success', `数据导出完成，文件：flight_data_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '')}.csv`), 1500);
  };

  const handleExportSelected = () => {
    if (selectedRows.size === 0) { showToast('error', '请先选择要导出的数据行'); return; }
    showToast('success', `正在导出选中的 ${selectedRows.size} 条数据...`);
    setTimeout(() => showToast('success', `已导出 ${selectedRows.size} 条数据`), 1200);
  };

  const handleRefresh = () => {
    setSelectedRows(new Set());
    setPage(1);
    showToast('info', '数据已刷新');
  };

  const chartData = mockFlightData.slice(0, 30).map((d, i) => ({
    t: i,
    altitude: d.altitude,
    speed: d.speed,
    battery: d.battery,
  }));

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="text-cyan-400 w-5 h-5" />数据采集中心
          </h1>
          <p className="text-slate-500 text-sm">实时飞行遥测数据管理与分析</p>
        </div>
        <div className="sm:ml-auto flex gap-2">
          <button onClick={handleRefresh} className="flex items-center gap-2 bg-drone-card border border-drone-border text-slate-400 hover:text-slate-200 px-3 py-2.5 rounded-lg text-sm transition-all hover:border-slate-500">
            <RefreshCw className="w-4 h-4" />刷新
          </button>
          <button onClick={handleExportAll} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2.5 rounded-lg text-sm transition-all font-medium shadow-glow-cyan">
            <Download className="w-4 h-4" />导出全部
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex gap-2">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${activeTab === t.id ? 'border-cyan-400/40 bg-cyan-400/20 text-cyan-400' : 'border-drone-border text-slate-400 hover:text-slate-200'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <span className="text-slate-500 text-xs">最近 30 条记录趋势</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={tab.color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={tab.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
            <XAxis dataKey="t" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'rgba(13,27,42,0.95)', border: '1px solid #1a2744', borderRadius: '8px', color: '#e2e8f0', fontSize: '12px' }} />
            <Area type="monotone" dataKey={tab.key} name={`${tab.label} (${tab.unit})`} stroke={tab.color} strokeWidth={2} fill="url(#areaGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Filters & Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-drone-border flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>筛选无人机:</span>
              <select value={filterDrone} onChange={e => { setFilterDrone(e.target.value); setPage(1); setSelectedRows(new Set()); }}
                className="bg-slate-900 border border-drone-border rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-cyan-400/50">
                <option value="all">全部</option>
                {droneNames.filter(n => n !== 'all').map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            {selectedRows.size > 0 && (
              <span className="text-cyan-400 text-xs font-medium">已选 {selectedRows.size} 条</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExportSelected}
              className="flex items-center gap-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg transition-all">
              <Download className="w-3 h-3" />导出选中 ({selectedRows.size})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-drone-border/60">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-cyan-400 w-3.5 h-3.5 cursor-pointer" />
                </th>
                <th className="px-4 py-3 text-left text-slate-500 font-medium">时间戳</th>
                <th className="px-4 py-3 text-left text-slate-500 font-medium">高度(m)</th>
                <th className="px-4 py-3 text-left text-slate-500 font-medium">速度(m/s)</th>
                <th className="px-4 py-3 text-left text-slate-500 font-medium">电量(%)</th>
                <th className="px-4 py-3 text-left text-slate-500 font-medium hidden md:table-cell">温度(°C)</th>
                <th className="px-4 py-3 text-left text-slate-500 font-medium hidden lg:table-cell">信号(%)</th>
                <th className="px-4 py-3 text-left text-slate-500 font-medium hidden lg:table-cell">GPS精度(m)</th>
                <th className="px-4 py-3 text-left text-slate-500 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((row, idx) => (
                <tr key={row.timestamp} className={`border-b border-drone-border/30 hover:bg-slate-900/40 transition-colors ${selectedRows.has(row.id) ? 'bg-cyan-400/5' : idx % 2 === 1 ? 'bg-slate-900/20' : ''}`}>
                  <td className="px-4 py-2.5">
                    <input type="checkbox" checked={selectedRows.has(row.id)} onChange={() => {
                      setSelectedRows(prev => { const n = new Set(prev); n.has(row.id) ? n.delete(row.id) : n.add(row.id); return n; });
                    }} className="accent-cyan-400 w-3.5 h-3.5 cursor-pointer" />
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 font-mono">{new Date(row.timestamp).toLocaleTimeString('zh-CN')}</td>
                  <td className="px-4 py-2.5 text-cyan-400 font-medium">{row.altitude.toFixed(1)}</td>
                  <td className="px-4 py-2.5 text-green-400">{row.speed.toFixed(1)}</td>
                  <td className="px-4 py-2.5">
                    <span className={row.battery > 60 ? 'text-green-400' : row.battery > 30 ? 'text-yellow-400' : 'text-red-400'}>{row.battery.toFixed(0)}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 hidden md:table-cell">{row.temperature.toFixed(1)}</td>
                  <td className="px-4 py-2.5 text-slate-400 hidden lg:table-cell">{row.signalStrength.toFixed(0)}</td>
                  <td className="px-4 py-2.5 text-slate-400 hidden lg:table-cell">{row.gpsAccuracy.toFixed(2)}</td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => setShowDetailModal(row)} className="text-slate-500 hover:text-cyan-400 transition-colors" title="查看详情">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-drone-border/60">
          <span className="text-slate-500 text-xs">共 {filtered.length} 条数据，第 {page}/{totalPages} 页</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(1)} disabled={page === 1}
              className="w-7 h-7 rounded text-xs transition-all disabled:opacity-30 hover:bg-slate-700 text-slate-400 disabled:cursor-not-allowed">«</button>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-7 h-7 rounded text-xs transition-all disabled:opacity-30 hover:bg-slate-700 text-slate-400 disabled:cursor-not-allowed">‹</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              if (p < 1 || p > totalPages) return null;
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded text-xs transition-all ${p === page ? 'bg-cyan-400/20 text-cyan-400' : 'hover:bg-slate-700 text-slate-400'}`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-7 h-7 rounded text-xs transition-all disabled:opacity-30 hover:bg-slate-700 text-slate-400 disabled:cursor-not-allowed">›</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
              className="w-7 h-7 rounded text-xs transition-all disabled:opacity-30 hover:bg-slate-700 text-slate-400 disabled:cursor-not-allowed">»</button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(null)}>
          <div className="glass-card rounded-2xl w-full max-w-sm p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-100 font-bold">数据详情</h3>
              <button onClick={() => setShowDetailModal(null)} className="text-slate-500 hover:text-slate-300"><Eye className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ['时间戳', new Date(showDetailModal.timestamp).toLocaleString('zh-CN')],
                ['飞行高度', `${showDetailModal.altitude.toFixed(2)} m`],
                ['飞行速度', `${showDetailModal.speed.toFixed(2)} m/s`],
                ['电池电量', `${showDetailModal.battery.toFixed(1)} %`],
                ['温度', `${showDetailModal.temperature.toFixed(1)} °C`],
                ['湿度', `${showDetailModal.humidity.toFixed(1)} %`],
                ['气压', `${showDetailModal.pressure.toFixed(2)} hPa`],
                ['信号强度', `${showDetailModal.signalStrength.toFixed(1)} %`],
                ['GPS精度', `${showDetailModal.gpsAccuracy.toFixed(2)} m`],
                ['已拍图像', `${showDetailModal.imagesCaptured ?? '--'} 张`],
                ['数据大小', showDetailModal.dataSize ? `${showDetailModal.dataSize.toFixed(1)} MB` : '--'],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between">
                  <span className="text-slate-500">{k}</span>
                  <span className="text-slate-200 font-mono text-xs">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
