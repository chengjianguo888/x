import { useState } from 'react';
import { Settings, Bell, Shield, Globe, Database, Wifi, Save, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

const settingSections = [
  { id: 'general', label: '基本设置', icon: Settings },
  { id: 'notifications', label: '通知设置', icon: Bell },
  { id: 'security', label: '安全设置', icon: Shield },
  { id: 'data', label: '数据设置', icon: Database },
  { id: 'network', label: '网络设置', icon: Wifi },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${checked ? 'bg-cyan-500' : 'bg-slate-700'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    systemName: '无人机作业管理系统',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
    autoSave: true,
    darkMode: true,
    compactMode: false,

    emailNotify: true,
    smsNotify: false,
    pushNotify: true,
    alertSound: true,
    lowBatteryThreshold: 20,
    windSpeedAlert: 12,
    offlineAlert: true,
    missionCompleteNotify: true,

    sessionTimeout: 60,
    twoFactor: false,
    loginHistory: true,
    ipWhitelist: false,
    dataEncryption: true,
    auditLog: true,

    retentionDays: 90,
    autoBackup: true,
    backupInterval: 24,
    maxStorageGB: 500,
    compressionEnabled: true,
    autoCleanup: false,

    apiEndpoint: 'wss://api.drone-ops.com/ws',
    dataFrequency: 2,
    timeout: 30,
    maxRetries: 3,
    useProxy: false,
    proxyAddress: '',
  });

  const update = (key: string, value: unknown) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 lg:p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Settings className="text-cyan-400 w-5 h-5" />
            系统设置
          </h1>
          <p className="text-slate-500 text-sm">配置系统参数和偏好设置</p>
        </div>
        <div className="sm:ml-auto flex gap-2">
          <button className="flex items-center gap-2 bg-drone-card border border-drone-border text-slate-400 hover:text-slate-200 px-4 py-2.5 rounded-lg text-sm transition-all">
            <RefreshCw className="w-4 h-4" />
            重置默认
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all font-medium ${
              saved ? 'bg-green-500 text-white' : 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-glow-cyan'
            }`}
          >
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? '已保存' : '保存设置'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section tabs */}
        <div className="lg:w-48 flex-shrink-0">
          <nav className="space-y-1">
            {settingSections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left
                  ${activeSection === id ? 'bg-cyan-400/10 border border-cyan-400/30 text-cyan-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings content */}
        <div className="flex-1 space-y-4">
          {activeSection === 'general' && (
            <div className="glass-card rounded-xl p-6 space-y-5">
              <h2 className="text-slate-200 font-semibold border-b border-drone-border pb-3">基本设置</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">系统名称</label>
                  <input
                    type="text"
                    value={settings.systemName}
                    onChange={e => update('systemName', e.target.value)}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-cyan-400/50"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">时区设置</label>
                  <select
                    value={settings.timezone}
                    onChange={e => update('timezone', e.target.value)}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50"
                  >
                    <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">界面语言</label>
                  <select
                    value={settings.language}
                    onChange={e => update('language', e.target.value)}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50"
                  >
                    <option value="zh-CN">简体中文</option>
                    <option value="en-US">English</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4 pt-2">
                {[
                  { key: 'autoSave', label: '自动保存', desc: '每次操作后自动保存配置' },
                  { key: 'darkMode', label: '深色模式', desc: '使用深色界面主题' },
                  { key: 'compactMode', label: '紧凑模式', desc: '减少界面间距，显示更多内容' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <div className="text-slate-300 text-sm font-medium">{label}</div>
                      <div className="text-slate-500 text-xs">{desc}</div>
                    </div>
                    <Toggle checked={settings[key as keyof typeof settings] as boolean} onChange={v => update(key, v)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="glass-card rounded-xl p-6 space-y-5">
              <h2 className="text-slate-200 font-semibold border-b border-drone-border pb-3">通知设置</h2>
              <div className="space-y-4">
                {[
                  { key: 'emailNotify', label: '邮件通知', desc: '重要事件通过邮件通知' },
                  { key: 'smsNotify', label: '短信通知', desc: '紧急告警通过短信通知' },
                  { key: 'pushNotify', label: '推送通知', desc: '浏览器推送通知' },
                  { key: 'alertSound', label: '告警音效', desc: '收到告警时播放提示音' },
                  { key: 'offlineAlert', label: '设备离线告警', desc: '设备离线时立即通知' },
                  { key: 'missionCompleteNotify', label: '任务完成通知', desc: '任务完成时发送通知' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-drone-border/50 last:border-0">
                    <div>
                      <div className="text-slate-300 text-sm font-medium">{label}</div>
                      <div className="text-slate-500 text-xs">{desc}</div>
                    </div>
                    <Toggle checked={settings[key as keyof typeof settings] as boolean} onChange={v => update(key, v)} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">低电量告警阈值 (%)</label>
                  <input
                    type="range" min={5} max={50} step={5}
                    value={settings.lowBatteryThreshold}
                    onChange={e => update('lowBatteryThreshold', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-cyan-400 text-sm mt-1 text-center font-mono">{settings.lowBatteryThreshold}%</div>
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">风速告警阈值 (m/s)</label>
                  <input
                    type="range" min={5} max={20} step={1}
                    value={settings.windSpeedAlert}
                    onChange={e => update('windSpeedAlert', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-cyan-400 text-sm mt-1 text-center font-mono">{settings.windSpeedAlert} m/s</div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="glass-card rounded-xl p-6 space-y-5">
              <h2 className="text-slate-200 font-semibold border-b border-drone-border pb-3">安全设置</h2>
              <div className="space-y-4">
                {[
                  { key: 'twoFactor', label: '双因素认证', desc: '启用两步验证提高账号安全性' },
                  { key: 'loginHistory', label: '登录历史记录', desc: '记录所有登录操作' },
                  { key: 'ipWhitelist', label: 'IP白名单', desc: '仅允许白名单IP访问系统' },
                  { key: 'dataEncryption', label: '数据传输加密', desc: '所有数据传输使用TLS加密' },
                  { key: 'auditLog', label: '操作审计日志', desc: '记录所有用户操作行为' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-drone-border/50 last:border-0">
                    <div>
                      <div className="text-slate-300 text-sm font-medium">{label}</div>
                      <div className="text-slate-500 text-xs">{desc}</div>
                    </div>
                    <Toggle checked={settings[key as keyof typeof settings] as boolean} onChange={v => update(key, v)} />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">会话超时时间 (分钟)</label>
                <input
                  type="range" min={15} max={240} step={15}
                  value={settings.sessionTimeout}
                  onChange={e => update('sessionTimeout', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-cyan-400 text-sm mt-1 text-center font-mono">{settings.sessionTimeout} 分钟</div>
              </div>
              <div className="flex items-start gap-2 bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-3 mt-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-400 text-xs">启用双因素认证需要在移动设备上安装认证器应用（如Google Authenticator）。</p>
              </div>
            </div>
          )}

          {activeSection === 'data' && (
            <div className="glass-card rounded-xl p-6 space-y-5">
              <h2 className="text-slate-200 font-semibold border-b border-drone-border pb-3">数据设置</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">数据保留天数</label>
                  <input
                    type="number"
                    value={settings.retentionDays}
                    onChange={e => update('retentionDays', parseInt(e.target.value))}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-cyan-400/50"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">备份间隔 (小时)</label>
                  <input
                    type="number"
                    value={settings.backupInterval}
                    onChange={e => update('backupInterval', parseInt(e.target.value))}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-cyan-400/50"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">最大存储空间 (GB)</label>
                  <input
                    type="number"
                    value={settings.maxStorageGB}
                    onChange={e => update('maxStorageGB', parseInt(e.target.value))}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-cyan-400/50"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-2">
                {[
                  { key: 'autoBackup', label: '自动备份', desc: '按设定间隔自动备份数据' },
                  { key: 'compressionEnabled', label: '数据压缩', desc: '存储时自动压缩数据以节省空间' },
                  { key: 'autoCleanup', label: '自动清理', desc: '超过保留期限的数据自动清理' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-drone-border/50 last:border-0">
                    <div>
                      <div className="text-slate-300 text-sm font-medium">{label}</div>
                      <div className="text-slate-500 text-xs">{desc}</div>
                    </div>
                    <Toggle checked={settings[key as keyof typeof settings] as boolean} onChange={v => update(key, v)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'network' && (
            <div className="glass-card rounded-xl p-6 space-y-5">
              <h2 className="text-slate-200 font-semibold border-b border-drone-border pb-3">网络设置</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">数据接收服务地址</label>
                  <input
                    type="text"
                    value={settings.apiEndpoint}
                    onChange={e => update('apiEndpoint', e.target.value)}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-cyan-400/50 font-mono"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-slate-400 text-sm mb-2 block">数据频率 (秒)</label>
                    <input
                      type="range" min={1} max={10} step={1}
                      value={settings.dataFrequency}
                      onChange={e => update('dataFrequency', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-cyan-400 text-xs mt-1 text-center font-mono">{settings.dataFrequency}s</div>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-2 block">超时时间 (秒)</label>
                    <input
                      type="range" min={5} max={60} step={5}
                      value={settings.timeout}
                      onChange={e => update('timeout', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-cyan-400 text-xs mt-1 text-center font-mono">{settings.timeout}s</div>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-2 block">最大重试次数</label>
                    <input
                      type="range" min={0} max={10} step={1}
                      value={settings.maxRetries}
                      onChange={e => update('maxRetries', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-cyan-400 text-xs mt-1 text-center font-mono">{settings.maxRetries}次</div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-slate-300 text-sm font-medium">使用代理服务器</div>
                    <div className="text-slate-500 text-xs">通过代理服务器连接</div>
                  </div>
                  <Toggle checked={settings.useProxy} onChange={v => update('useProxy', v)} />
                </div>
                {settings.useProxy && (
                  <div className="animate-fade-in">
                    <label className="text-slate-400 text-sm mb-2 block">代理服务器地址</label>
                    <input
                      type="text"
                      value={settings.proxyAddress}
                      onChange={e => update('proxyAddress', e.target.value)}
                      placeholder="例: http://proxy.example.com:8080"
                      className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50 font-mono"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button className="flex items-center gap-2 bg-green-400/10 border border-green-400/30 text-green-400 hover:bg-green-400/20 px-4 py-2 rounded-lg text-sm transition-all">
                  <Wifi className="w-4 h-4" />
                  测试连接
                </button>
                <Globe className="w-4 h-4 text-slate-500" />
                <span className="text-slate-500 text-xs">上次连接成功: 2026-03-08 11:45:32</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
