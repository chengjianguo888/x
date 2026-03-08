import { useState } from 'react';
import { FileBarChart2, Download, Plus, RefreshCw, FileText, BarChart2, Wrench, TrendingUp, CheckCircle, XCircle, Loader } from 'lucide-react';
import { mockReports } from '../data/mockData';

const typeConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  mission: { label: '任务报告', icon: FileText, color: 'text-cyan-400' },
  fleet: { label: '机队报告', icon: BarChart2, color: 'text-green-400' },
  maintenance: { label: '维护报告', icon: Wrench, color: 'text-yellow-400' },
  performance: { label: '性能报告', icon: TrendingUp, color: 'text-purple-400' },
  monthly: { label: '综合月报', icon: FileBarChart2, color: 'text-blue-400' },
};

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? mockReports : mockReports.filter(r => r.type === filter);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3000);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'generating': return <Loader className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileBarChart2 className="text-cyan-400 w-5 h-5" />
            报表中心
          </h1>
          <p className="text-slate-500 text-sm">生成、查看和导出各类作业报告</p>
        </div>
        <div className="sm:ml-auto flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 bg-drone-card border border-drone-border text-slate-400 hover:text-slate-200 px-4 py-2.5 rounded-lg text-sm transition-all hover:border-slate-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
            {generating ? '生成中...' : '刷新报表'}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2.5 rounded-lg text-sm transition-all font-medium"
          >
            <Plus className="w-4 h-4" />
            生成报告
          </button>
        </div>
      </div>

      {/* Report type cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(typeConfig).map(([key, { label, icon: Icon, color }]) => (
          <button
            key={key}
            onClick={() => setFilter(filter === key ? 'all' : key)}
            className={`glass-card rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:border-cyan-400/20 ${filter === key ? 'border-cyan-400/40' : ''}`}
          >
            <Icon className={`w-6 h-6 ${color}`} />
            <span className="text-slate-300 text-xs font-medium">{label}</span>
            <span className="text-slate-500 text-xs">{mockReports.filter(r => r.type === key).length} 份</span>
          </button>
        ))}
      </div>

      {/* Reports list */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-drone-border">
          <h3 className="text-slate-200 font-semibold">报告列表</h3>
        </div>
        <div className="divide-y divide-drone-border">
          {filtered.map(report => {
            const { label, icon: Icon, color } = typeConfig[report.type];
            return (
              <div key={report.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-700/20 transition-all group">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-slate-200 font-medium text-sm truncate">{report.name}</h4>
                    <span className={`text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 flex-shrink-0`}>{label}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1 text-xs text-slate-500">
                    <span>创建者: {report.createdBy}</span>
                    <span>{report.createdAt.slice(0, 16)}</span>
                    {report.period && <span>周期: {report.period}</span>}
                    {report.size && <span>大小: {report.size}</span>}
                    {report.missionCount && <span>{report.missionCount} 个任务</span>}
                    {report.flightHours && <span>{report.flightHours} 飞行小时</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {statusIcon(report.status)}
                  <span className={`text-xs ${report.status === 'ready' ? 'text-green-400' : report.status === 'generating' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {report.status === 'ready' ? '可下载' : report.status === 'generating' ? '生成中' : '失败'}
                  </span>
                  {report.status === 'ready' && (
                    <button className="opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20 text-xs px-3 py-1.5 rounded-lg transition-all">
                      <Download className="w-3 h-3" />
                      下载
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-10 text-center">
              <FileBarChart2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">暂无报告</p>
            </div>
          )}
        </div>
      </div>

      {/* Generate report modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="glass-card rounded-2xl w-full max-w-md p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-100 font-bold text-lg">生成新报告</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">报告类型 *</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(typeConfig).map(([key, { label, icon: Icon, color }]) => (
                    <button key={key} className="flex items-center gap-2 bg-slate-900/60 border border-drone-border hover:border-cyan-400/40 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-all">
                      <Icon className={`w-4 h-4 ${color}`} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">报告名称</label>
                <input type="text" placeholder="请输入报告名称（可选）" className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">开始日期</label>
                  <input type="date" className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">结束日期</label>
                  <input type="date" className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">包含内容</label>
                <div className="space-y-2">
                  {['飞行统计数据', '任务完成情况', '设备状态分析', '异常告警记录', '数据采集汇总'].map(item => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-cyan-400" defaultChecked />
                      <span className="text-slate-400 text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2.5 rounded-lg text-sm transition-all">取消</button>
                <button onClick={() => { setShowModal(false); handleGenerate(); }} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white py-2.5 rounded-lg text-sm transition-all font-medium">
                  开始生成
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
