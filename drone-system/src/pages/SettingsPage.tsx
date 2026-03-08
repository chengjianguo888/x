import { useState } from 'react';
import { Settings, Bell, Shield, Database, Wifi, RotateCcw, Save, CheckCircle } from 'lucide-react';
import { useStore } from '../hooks/useStore';

const defaultSettings = {
  systemName: '无人机作业管理系统',
  timezone: 'Asia/Shanghai (UTC+8)',
  language: '简体中文',
  autoSave: true,
  darkMode: true,
  compactMode: false,
  emailAlerts: true,
  smsAlerts: false,
  pushAlerts: true,
  alertBattery: true,
  alertMaintenance: true,
  alertMission: true,
  twoFactor: false,
  sessionTimeout: 30,
  loginAttempts: 5,
  retentionDays: 90,
  autoBackup: true,
  backupInterval: 24,
  compressionEnabled: true,
  apiServer: 'https://api.drone.local:8443',
  dataServer: 'https://data.drone.local:9000',
  socketPort: 8765,
  networkTimeout: 30,
};

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0 ${value ? 'bg-cyan-500' : 'bg-slate-700'}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${value ? 'left-5' : 'left-0.5'}`} />
    </button>
  );
}

function Slider({ value, min, max, onChange, unit = '' }: { value: number; min: number; max: number; onChange: (v: number) => void; unit?: string }) {
  return (
    <div className="flex items-center gap-3">
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
        className="flex-1 accent-cyan-500 h-1.5 cursor-pointer" />
      <span className="text-cyan-400 text-sm font-medium w-14 text-right">{value}{unit}</span>
    </div>
  );
}

export default function SettingsPage() {
  const { showToast } = useStore();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(defaultSettings);
  const [testStatus, setTestStatus] = useState<Record<string, 'idle' | 'testing' | 'ok' | 'fail'>>({
    api: 'idle', data: 'idle', socket: 'idle'
  });
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const set = <K extends keyof typeof defaultSettings>(key: K, value: typeof defaultSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    showToast('success', '系统设置已保存');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => setShowResetConfirm(true);

  const confirmReset = () => {
    setSettings(defaultSettings);
    setSaved(false);
    setShowResetConfirm(false);
    showToast('info', '设置已恢复为默认值');
  };

  const handleTestConnection = (type: string) => {
    setTestStatus(prev => ({ ...prev, [type]: 'testing' }));
    showToast('info', `正在测试${type === 'api' ? 'API' : '数据'}服务器连接...`);
    setTimeout(() => {
      const ok = Math.random() > 0.3;
      setTestStatus(prev => ({ ...prev, [type]: ok ? 'ok' : 'fail' }));
      showToast(ok ? 'success' : 'error', ok ? `服务器连接正常，延迟 ${Math.floor(Math.random() * 30 + 5)}ms` : '连接失败，请检查服务器地址和网络');
    }, 1500);
  };

  const tabs = [
    { key: 'general', label: '基本设置', icon: Settings },
    { key: 'notifications', label: '通知设置', icon: Bell },
    { key: 'security', label: '安全设置', icon: Shield },
    { key: 'data', label: '数据设置', icon: Database },
    { key: 'network', label: '网络设置', icon: Wifi },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Settings className="text-cyan-400 w-5 h-5" />系统设置
          </h1>
          <p className="text-slate-500 text-sm">配置系统参数和偏好设置</p>
        </div>
        <div className="sm:ml-auto flex gap-2">
          <button onClick={handleReset} className="flex items-center gap-2 bg-drone-card border border-drone-border text-slate-400 hover:text-red-400 hover:border-red-400/30 px-4 py-2.5 rounded-lg text-sm transition-all">
            <RotateCcw className="w-4 h-4" />重置默认
          </button>
          <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all font-medium ${saved ? 'bg-green-500 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-glow-cyan'}`}>
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? '已保存' : '保存设置'}
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Tab nav */}
        <nav className="flex lg:flex-col gap-1 flex-wrap lg:flex-nowrap lg:w-44 flex-shrink-0">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${activeTab === tab.key ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />{tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex-1 glass-card rounded-xl p-6 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-5">
              <h2 className="text-slate-200 font-semibold text-base border-b border-drone-border pb-2">基本设置</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">系统名称</label>
                  <input type="text" value={settings.systemName} onChange={e => set('systemName', e.target.value)}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-cyan-400/50" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">时区设置</label>
                  <select value={settings.timezone} onChange={e => set('timezone', e.target.value)}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50 cursor-pointer">
                    <option>Asia/Shanghai (UTC+8)</option>
                    <option>UTC</option>
                    <option>America/New_York</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">界面语言</label>
                  <select value={settings.language} onChange={e => set('language', e.target.value)}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50 cursor-pointer">
                    <option>简体中文</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'autoSave' as const, label: '自动保存', desc: '每次操作后自动保存配置' },
                  { key: 'darkMode' as const, label: '深色模式', desc: '使用深色界面主题' },
                  { key: 'compactMode' as const, label: '紧凑模式', desc: '减少界面间距，显示更多内容' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg">
                    <div>
                      <div className="text-slate-200 text-sm">{item.label}</div>
                      <div className="text-slate-500 text-xs">{item.desc}</div>
                    </div>
                    <Toggle value={settings[item.key]} onChange={v => set(item.key, v)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h2 className="text-slate-200 font-semibold text-base border-b border-drone-border pb-2">通知设置</h2>
              <div className="space-y-2">
                <p className="text-slate-400 text-sm font-medium">通知渠道</p>
                {[
                  { key: 'emailAlerts' as const, label: '邮件通知', desc: '通过电子邮件接收告警' },
                  { key: 'smsAlerts' as const, label: '短信通知', desc: '通过短信接收紧急告警' },
                  { key: 'pushAlerts' as const, label: '推送通知', desc: '浏览器桌面推送通知' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg">
                    <div><div className="text-slate-200 text-sm">{item.label}</div><div className="text-slate-500 text-xs">{item.desc}</div></div>
                    <Toggle value={settings[item.key]} onChange={v => set(item.key, v)} />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-slate-400 text-sm font-medium">告警类型</p>
                {[
                  { key: 'alertBattery' as const, label: '电量告警', desc: '电池电量低于阈值时通知' },
                  { key: 'alertMaintenance' as const, label: '维护到期', desc: '设备维护计划到期时通知' },
                  { key: 'alertMission' as const, label: '任务状态', desc: '任务完成、失败、异常时通知' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg">
                    <div><div className="text-slate-200 text-sm">{item.label}</div><div className="text-slate-500 text-xs">{item.desc}</div></div>
                    <Toggle value={settings[item.key]} onChange={v => set(item.key, v)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              <h2 className="text-slate-200 font-semibold text-base border-b border-drone-border pb-2">安全设置</h2>
              <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg">
                <div>
                  <div className="text-slate-200 text-sm">双因素认证 (2FA)</div>
                  <div className="text-slate-500 text-xs">登录时需要验证码</div>
                </div>
                <Toggle value={settings.twoFactor} onChange={v => { set('twoFactor', v); showToast(v ? 'success' : 'info', v ? '双因素认证已启用' : '双因素认证已关闭'); }} />
              </div>
              <div className="p-3 bg-slate-900/40 rounded-lg">
                <div className="text-slate-200 text-sm mb-3">会话超时时间</div>
                <Slider value={settings.sessionTimeout} min={5} max={120} onChange={v => set('sessionTimeout', v)} unit=" 分钟" />
              </div>
              <div className="p-3 bg-slate-900/40 rounded-lg">
                <div className="text-slate-200 text-sm mb-3">最大登录失败次数</div>
                <Slider value={settings.loginAttempts} min={3} max={10} onChange={v => set('loginAttempts', v)} unit=" 次" />
              </div>
              <button onClick={() => showToast('success', '密码修改链接已发送至您的邮箱')}
                className="w-full py-2.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20 rounded-lg text-sm transition-all">
                修改登录密码
              </button>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-5">
              <h2 className="text-slate-200 font-semibold text-base border-b border-drone-border pb-2">数据设置</h2>
              <div className="p-3 bg-slate-900/40 rounded-lg">
                <div className="text-slate-200 text-sm mb-3">数据保留天数</div>
                <Slider value={settings.retentionDays} min={30} max={365} onChange={v => set('retentionDays', v)} unit=" 天" />
              </div>
              <div className="space-y-2">
                {[
                  { key: 'autoBackup' as const, label: '自动备份', desc: '定时自动备份系统数据' },
                  { key: 'compressionEnabled' as const, label: '数据压缩', desc: '压缩存储数据以节省空间' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg">
                    <div><div className="text-slate-200 text-sm">{item.label}</div><div className="text-slate-500 text-xs">{item.desc}</div></div>
                    <Toggle value={settings[item.key]} onChange={v => set(item.key, v)} />
                  </div>
                ))}
              </div>
              {settings.autoBackup && (
                <div className="p-3 bg-slate-900/40 rounded-lg">
                  <div className="text-slate-200 text-sm mb-3">备份间隔</div>
                  <Slider value={settings.backupInterval} min={1} max={72} onChange={v => set('backupInterval', v)} unit=" 小时" />
                </div>
              )}
              <button onClick={() => { showToast('info', '正在手动备份数据...'); setTimeout(() => showToast('success', `数据备份完成，已保存至云端`), 2000); }}
                className="w-full py-2.5 bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20 rounded-lg text-sm transition-all">
                立即手动备份
              </button>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="space-y-5">
              <h2 className="text-slate-200 font-semibold text-base border-b border-drone-border pb-2">网络设置</h2>
              {[
                { field: 'apiServer' as const, label: 'API 服务器地址', testKey: 'api' },
                { field: 'dataServer' as const, label: '数据服务器地址', testKey: 'data' },
              ].map(({ field, label, testKey }) => (
                <div key={field}>
                  <label className="text-slate-400 text-sm mb-1.5 block">{label}</label>
                  <div className="flex gap-2">
                    <input type="text" value={settings[field]} onChange={e => set(field, e.target.value)}
                      className="flex-1 bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-cyan-400/50 font-mono text-xs" />
                    <button onClick={() => handleTestConnection(testKey)}
                      disabled={testStatus[testKey] === 'testing'}
                      className={`px-3 py-2 rounded-lg text-xs transition-all border font-medium flex-shrink-0 ${
                        testStatus[testKey] === 'ok' ? 'border-green-400/40 text-green-400 bg-green-400/10' :
                        testStatus[testKey] === 'fail' ? 'border-red-400/40 text-red-400 bg-red-400/10' :
                        testStatus[testKey] === 'testing' ? 'border-yellow-400/40 text-yellow-400 bg-yellow-400/10' :
                        'border-drone-border text-slate-400 hover:border-cyan-400/40 hover:text-cyan-400'
                      } disabled:cursor-not-allowed`}>
                      {testStatus[testKey] === 'testing' ? '测试中...' : testStatus[testKey] === 'ok' ? '✓ 正常' : testStatus[testKey] === 'fail' ? '✗ 失败' : '测试连接'}
                    </button>
                  </div>
                </div>
              ))}
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">WebSocket 端口</label>
                <input type="number" value={settings.socketPort} onChange={e => set('socketPort', Number(e.target.value))}
                  className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-cyan-400/50" />
              </div>
              <div className="p-3 bg-slate-900/40 rounded-lg">
                <div className="text-slate-200 text-sm mb-3">网络超时时间</div>
                <Slider value={settings.networkTimeout} min={5} max={120} onChange={v => set('networkTimeout', v)} unit=" 秒" />
              </div>
            </div>
          )}
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl w-full max-w-sm p-6 animate-fade-in">
            <h3 className="text-slate-100 font-bold text-lg mb-2">确认重置</h3>
            <p className="text-slate-400 text-sm mb-5">确定要将所有设置恢复为默认值吗？所有自定义配置将会丢失。</p>
            <div className="flex gap-3">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2.5 rounded-lg text-sm transition-all">取消</button>
              <button onClick={confirmReset} className="flex-1 bg-red-500 hover:bg-red-400 text-white py-2.5 rounded-lg text-sm transition-all font-medium">确认重置</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
