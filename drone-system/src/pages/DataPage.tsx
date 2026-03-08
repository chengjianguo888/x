import { useState } from 'react';
import { Database, Download, Search, Filter, Image, BarChart2, FileText, Eye } from 'lucide-react';
import { mockFlightData, mockMissions } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const dataTypes = [
  { id: 'telemetry', icon: BarChart2, label: '遥测数据', count: '50条', size: '24.8 KB', color: 'text-cyan-400' },
  { id: 'images', icon: Image, label: '影像数据', count: '1,247张', size: '8.7 GB', color: 'text-green-400' },
  { id: 'logs', icon: FileText, label: '飞行日志', count: '18个', size: '2.3 MB', color: 'text-purple-400' },
  { id: 'sensor', icon: BarChart2, label: '传感器数据', count: '15,832点', size: '156 KB', color: 'text-yellow-400' },
];

export default function DataPage() {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [search, setSearch] = useState('');
  const [missionFilter, setMissionFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filteredData = mockFlightData.filter((_, i) => i < 20);

  const altitudeChart = mockFlightData.slice(0, 30).map(d => ({
    t: new Date(d.timestamp).toLocaleTimeString('zh-CN', { minute: '2-digit', second: '2-digit' }),
    alt: parseFloat(d.altitude.toFixed(1)),
    spd: parseFloat(d.speed.toFixed(1)),
    bat: parseFloat(d.battery.toFixed(1)),
  }));

  const toggleRow = (id: string) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="text-cyan-400 w-5 h-5" />
            数据采集中心
          </h1>
          <p className="text-slate-500 text-sm">查看、分析和导出无人机采集的各类数据</p>
        </div>
        <div className="sm:ml-auto flex gap-2">
          <button className="flex items-center gap-2 bg-drone-card border border-drone-border text-slate-400 hover:text-slate-200 px-4 py-2.5 rounded-lg text-sm transition-all hover:border-slate-500">
            <Filter className="w-4 h-4" />
            筛选
          </button>
          <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2.5 rounded-lg text-sm transition-all font-medium">
            <Download className="w-4 h-4" />
            导出数据
          </button>
        </div>
      </div>

      {/* Data type cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dataTypes.map(({ id, icon: Icon, label, count, size, color }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`glass-card rounded-xl p-4 text-left transition-all hover:border-cyan-400/20 ${activeTab === id ? 'border-cyan-400/40' : ''}`}
          >
            <Icon className={`w-6 h-6 ${color} mb-2`} />
            <div className="text-slate-200 font-medium text-sm">{label}</div>
            <div className="text-slate-500 text-xs mt-1">{count}</div>
            <div className="text-slate-600 text-xs">{size}</div>
          </button>
        ))}
      </div>

      {/* Analytics charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-slate-200 font-semibold mb-1">飞行高度 & 速度趋势</h3>
          <p className="text-slate-500 text-xs mb-4">最近30次采样数据</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={altitudeChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
              <XAxis dataKey="t" tick={{ fill: '#64748b', fontSize: 9 }} interval={4} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(13,27,42,0.95)', border: '1px solid #1a2744', borderRadius: '8px', color: '#e2e8f0', fontSize: '11px' }} />
              <Line type="monotone" dataKey="alt" name="高度(m)" stroke="#00d4ff" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="spd" name="速度(m/s)" stroke="#00ff88" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-slate-200 font-semibold mb-1">电池电量趋势</h3>
          <p className="text-slate-500 text-xs mb-4">飞行过程中电量变化</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={altitudeChart.filter((_, i) => i % 3 === 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" vertical={false} />
              <XAxis dataKey="t" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: 'rgba(13,27,42,0.95)', border: '1px solid #1a2744', borderRadius: '8px', color: '#e2e8f0', fontSize: '11px' }} />
              <Bar dataKey="bat" name="电量(%)" radius={[4, 4, 0, 0]}>
                {altitudeChart.filter((_, i) => i % 3 === 0).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.bat > 60 ? '#00ff88' : entry.bat > 30 ? '#ffaa00' : '#ff4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-drone-border">
          <h3 className="text-slate-200 font-semibold">遥测数据记录</h3>
          <div className="flex gap-3 sm:ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="搜索..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-slate-900/60 border border-drone-border rounded-lg pl-8 pr-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 text-xs w-36"
              />
            </div>
            <select
              value={missionFilter}
              onChange={e => setMissionFilter(e.target.value)}
              className="bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2 text-slate-300 text-xs focus:outline-none focus:border-cyan-400/50"
            >
              <option value="all">全部任务</option>
              {mockMissions.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>

        {selectedRows.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-cyan-400/5 border-b border-drone-border">
            <span className="text-cyan-400 text-xs">已选择 {selectedRows.length} 条</span>
            <button className="text-xs text-slate-400 hover:text-white ml-auto flex items-center gap-1">
              <Download className="w-3 h-3" />导出选中
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-xs data-table">
            <thead>
              <tr className="border-b border-drone-border">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="accent-cyan-400"
                    onChange={e => setSelectedRows(e.target.checked ? filteredData.map(d => d.id) : [])}
                  />
                </th>
                {['时间戳', '高度(m)', '速度(m/s)', '电量(%)', '纬度', '经度', '航向(°)', '信号(%)', '图像数'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-slate-400 font-medium whitespace-nowrap">{h}</th>
                ))}
                <th className="px-4 py-3 text-left text-slate-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(row => (
                <tr key={row.id} className={`border-b border-drone-border/50 transition-colors ${selectedRows.includes(row.id) ? 'bg-cyan-400/5' : ''}`}>
                  <td className="px-4 py-2.5">
                    <input
                      type="checkbox"
                      className="accent-cyan-400"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRow(row.id)}
                    />
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 font-mono whitespace-nowrap">
                    {new Date(row.timestamp).toLocaleTimeString('zh-CN')}
                  </td>
                  <td className="px-4 py-2.5 text-cyan-400 font-mono">{row.altitude.toFixed(1)}</td>
                  <td className="px-4 py-2.5 text-green-400 font-mono">{row.speed.toFixed(1)}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${row.battery}%`,
                          backgroundColor: row.battery > 60 ? '#00ff88' : row.battery > 30 ? '#ffaa00' : '#ff4444'
                        }} />
                      </div>
                      <span className="font-mono">{row.battery.toFixed(0)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-400 font-mono">{row.latitude.toFixed(4)}</td>
                  <td className="px-4 py-2.5 text-slate-400 font-mono">{row.longitude.toFixed(4)}</td>
                  <td className="px-4 py-2.5 text-slate-400 font-mono">{row.heading.toFixed(0)}°</td>
                  <td className="px-4 py-2.5 text-purple-400 font-mono">{row.signalStrength.toFixed(0)}</td>
                  <td className="px-4 py-2.5 text-slate-400 font-mono">{row.imagesCaptured}</td>
                  <td className="px-4 py-2.5">
                    <button className="text-slate-500 hover:text-cyan-400 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-drone-border text-xs text-slate-500">
          <span>显示 1-20 / 共 {mockFlightData.length} 条记录</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-7 h-7 rounded text-xs transition-all ${p === 1 ? 'bg-cyan-400/20 text-cyan-400' : 'hover:bg-slate-700 text-slate-400'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
