import { useState } from 'react';
import { FileText, Download, Plus, XCircle, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import type { Report } from '../types';

const typeConfig: Record<string, { label: string; icon: string; color: string }> = {
  mission: { label: '任务报告', icon: '🗺️', color: 'text-cyan-400' },
  fleet: { label: '机队报告', icon: '🚁', color: 'text-blue-400' },
  maintenance: { label: '维护报告', icon: '🔧', color: 'text-yellow-400' },
  performance: { label: '性能分析', icon: '📊', color: 'text-purple-400' },
  monthly: { label: '综合月报', icon: '📋', color: 'text-green-400' },
};

export default function ReportsPage() {
  const { showToast } = useStore();
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['mission']);
  const [reportPeriod, setReportPeriod] = useState('week');
  const [reports, setReports] = useState<Report[]>([
    { id: 'r1', name: '2026年3月第一周飞行报告', type: 'mission', status: 'ready', createdAt: '2026-03-08 08:00:00', createdBy: '张伟', size: '2.3 MB', period: '2026-03-01 ~ 2026-03-07', missionCount: 18, flightHours: 34.5 },
    { id: 'r2', name: '无人机机队状态月报', type: 'fleet', status: 'ready', createdAt: '2026-03-01 09:00:00', createdBy: '张伟', size: '1.8 MB', period: '2026年2月', missionCount: 67, flightHours: 128.3 },
    { id: 'r3', name: '设备维护记录汇总', type: 'maintenance', status: 'ready', createdAt: '2026-02-28 17:00:00', createdBy: '李明', size: '856 KB', period: '2026年2月' },
    { id: 'r4', name: '飞行性能分析报告', type: 'performance', status: 'ready', createdAt: '2026-03-08 11:00:00', createdBy: '张伟', size: '3.1 MB', period: '2026年2月' },
    { id: 'r5', name: '2026年2月综合月报', type: 'monthly', status: 'ready', createdAt: '2026-03-01 08:00:00', createdBy: '张伟', size: '5.2 MB', period: '2026年2月', missionCount: 67, flightHours: 128.3 },
  ]);

  const filtered = filter === 'all' ? reports : reports.filter(r => r.type === filter);

  const handleDownload = (report: Report) => {
    if (report.status !== 'ready') {
      showToast('warning', '报告正在生成，请稍后再试');
      return;
    }
    setGenerating(report.id);
    showToast('info', `正在准备下载「${report.name}」...`);
    setTimeout(() => {
      setGenerating(null);
      showToast('success', `「${report.name}」下载完成 (${report.size})`);
    }, 1500);
  };

  const handleGenerate = () => {
    if (selectedTypes.length === 0) {
      showToast('error', '请至少选择一种报告类型');
      return;
    }
    const period = reportPeriod === 'week' ? '本周' : reportPeriod === 'month' ? '本月' : '本季度';
    const newId = `r${Date.now()}`;
    const typeCfg = typeConfig[selectedTypes[0]];
    const name = `${period}${typeCfg.label} (${new Date().toLocaleDateString('zh-CN')})`;
    const pending: Report = {
      id: newId, name, type: selectedTypes[0] as Report['type'],
      status: 'generating', createdAt: new Date().toLocaleString('zh-CN'), createdBy: '张伟',
    };
    setReports(prev => [pending, ...prev]);
    setShowModal(false);
    showToast('info', `「${name}」生成中，预计 10 秒完成`);
    setTimeout(() => {
      setReports(prev => prev.map(r => r.id === newId ? { ...r, status: 'ready', size: `${(Math.random() * 4 + 0.5).toFixed(1)} MB` } : r));
      showToast('success', `「${name}」已生成完毕，可以下载`);
    }, 10000);
  };

  const handleRefresh = () => {
    showToast('info', '报告列表已刷新');
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="text-cyan-400 w-5 h-5" />报表中心
          </h1>
          <p className="text-slate-500 text-sm">生成和下载各类飞行作业报告</p>
        </div>
        <div className="sm:ml-auto flex gap-2">
          <button onClick={handleRefresh} className="flex items-center gap-2 bg-drone-card border border-drone-border text-slate-400 hover:text-slate-200 px-4 py-2.5 rounded-lg text-sm transition-all hover:border-slate-500">
            <RefreshCw className="w-4 h-4" />刷新
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-glow-cyan">
            <Plus className="w-4 h-4" />生成报告
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('all')} className={`text-sm px-3 py-1.5 rounded-lg border transition-all ${filter === 'all' ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400/40' : 'bg-drone-card text-slate-400 border-drone-border hover:text-slate-200'}`}>
          全部 ({reports.length})
        </button>
        {Object.entries(typeConfig).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(key)} className={`text-sm px-3 py-1.5 rounded-lg border transition-all ${filter === key ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400/40' : 'bg-drone-card text-slate-400 border-drone-border hover:text-slate-200'}`}>
            {cfg.icon} {cfg.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(report => {
          const cfg = typeConfig[report.type];
          return (
            <div key={report.id} className="glass-card rounded-xl p-4 hover:border-cyan-400/20 transition-all group">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-xl flex-shrink-0">{cfg.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="text-slate-100 font-semibold text-sm">{report.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className={cfg.color}>{cfg.label}</span>
                        {report.period && <span>📅 {report.period}</span>}
                        {report.missionCount && <span>📋 {report.missionCount} 次任务</span>}
                        {report.flightHours && <span>⏱ {report.flightHours}h</span>}
                        <span>👤 {report.createdBy}</span>
                        <span>{report.createdAt.slice(0, 16)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {report.status === 'generating' ? (
                        <span className="flex items-center gap-1 text-yellow-400 text-xs">
                          <RefreshCw className="w-3 h-3 animate-spin" />生成中...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-400 text-xs">
                          <CheckCircle className="w-3 h-3" />{report.size}
                        </span>
                      )}
                      <button
                        onClick={() => handleDownload(report)}
                        disabled={report.status !== 'ready' || generating === report.id}
                        className="flex items-center gap-1.5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20 text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                        {generating === report.id ? <Clock className="w-3 h-3 animate-pulse" /> : <Download className="w-3 h-3" />}
                        下载
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="glass-card rounded-2xl w-full max-w-md p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-100 font-bold text-lg">生成新报告</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm mb-2 block">报告类型 (可多选)</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(typeConfig).map(([key, cfg]) => (
                    <button key={key}
                      onClick={() => setSelectedTypes(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}
                      className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 text-sm transition-all ${selectedTypes.includes(key) ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-300' : 'border-drone-border text-slate-400 hover:border-cyan-400/30'}`}>
                      <span>{cfg.icon}</span><span>{cfg.label}</span>
                      {selectedTypes.includes(key) && <CheckCircle className="w-3.5 h-3.5 ml-auto text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">统计周期</label>
                <div className="flex gap-2">
                  {[{ v: 'week', l: '本周' }, { v: 'month', l: '本月' }, { v: 'quarter', l: '本季度' }].map(p => (
                    <button key={p.v} onClick={() => setReportPeriod(p.v)}
                      className={`flex-1 py-2 rounded-lg text-sm border transition-all ${reportPeriod === p.v ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400/40' : 'bg-drone-card text-slate-400 border-drone-border hover:text-slate-200'}`}>
                      {p.l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2.5 rounded-lg text-sm transition-all">取消</button>
                <button onClick={handleGenerate} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white py-2.5 rounded-lg text-sm transition-all font-medium">开始生成</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
