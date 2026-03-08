import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Radio, MapPin, Database, Wrench,
  FileBarChart2, Users, Settings, Bell, LogOut,
  ChevronLeft, ChevronRight, Zap, Shield, Menu, X,
  Activity
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { Alert } from '../types';
import { mockAlerts } from '../data/mockData';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: '数据总览', exact: true },
  { path: '/monitor', icon: Radio, label: '实时监控' },
  { path: '/missions', icon: MapPin, label: '飞行任务' },
  { path: '/drones', icon: Activity, label: '机队管理' },
  { path: '/data', icon: Database, label: '数据采集' },
  { path: '/maintenance', icon: Wrench, label: '维护管理' },
  { path: '/reports', icon: FileBarChart2, label: '报表中心' },
  { path: '/users', icon: Users, label: '用户管理' },
  { path: '/settings', icon: Settings, label: '系统设置' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const unresolved = mockAlerts.filter((a: Alert) => !a.resolved);
  const criticalCount = unresolved.filter((a: Alert) => a.priority === 'critical' || a.priority === 'high').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const alertTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'success': return 'text-green-400 bg-green-400/10 border-green-400/30';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    }
  };

  return (
    <div className="flex h-screen bg-drone-dark overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 lg:z-auto
          flex flex-col h-full
          transition-all duration-300 ease-in-out
          bg-drone-card border-r border-drone-border
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-drone-border">
          <div className="flex-shrink-0">
            <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
              <rect x="10" y="12" width="12" height="8" rx="2" fill="rgba(0,212,255,0.9)"/>
              <line x1="10" y1="14" x2="3" y2="9" stroke="rgba(0,212,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="22" y1="14" x2="29" y2="9" stroke="rgba(0,212,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="10" y1="18" x2="3" y2="23" stroke="rgba(0,212,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="22" y1="18" x2="29" y2="23" stroke="rgba(0,212,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
              <ellipse cx="3" cy="9" rx="3" ry="1" stroke="rgba(0,212,255,0.9)" strokeWidth="1"/>
              <ellipse cx="29" cy="9" rx="3" ry="1" stroke="rgba(0,212,255,0.9)" strokeWidth="1"/>
              <ellipse cx="3" cy="23" rx="3" ry="1" stroke="rgba(0,212,255,0.9)" strokeWidth="1"/>
              <ellipse cx="29" cy="23" rx="3" ry="1" stroke="rgba(0,212,255,0.9)" strokeWidth="1"/>
            </svg>
          </div>
          {!collapsed && (
            <div className="min-w-0 overflow-hidden">
              <div className="text-cyan-400 font-bold text-sm truncate" style={{ fontFamily: "Orbitron, 'Noto Sans SC', sans-serif" }}>
                无人机系统
              </div>
              <div className="text-slate-500 text-xs truncate">UAV OPS SYSTEM</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          {navItems.map(({ path, icon: Icon, label, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
                ${isActive
                  ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-cyan-400 rounded-r-full" />
                  )}
                  <Icon className={`flex-shrink-0 w-5 h-5 ${isActive ? 'text-cyan-400' : ''}`} />
                  {!collapsed && (
                    <span className="text-sm font-medium truncate">{label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-drone-border p-3">
          {!collapsed ? (
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-700/30 transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user?.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-200 text-sm font-medium truncate">{user?.name}</div>
                <div className="text-slate-500 text-xs truncate">
                  {user?.role === 'admin' ? '系统管理员' : user?.role === 'operator' ? '飞行操作员' : '数据查看员'}
                </div>
              </div>
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors" title="退出登录">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex justify-center p-2 text-slate-500 hover:text-red-400 transition-colors"
              title="退出登录"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 items-center justify-center w-6 h-6 rounded-full bg-drone-card border border-drone-border text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-all z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="h-16 bg-drone-card border-b border-drone-border flex items-center px-4 lg:px-6 gap-4 flex-shrink-0">
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-slate-400 hover:text-slate-200"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* System status */}
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 status-pulse" />
              <span className="text-slate-400">系统正常</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-slate-400">2架飞行中</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">数据安全</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Time */}
            <div className="hidden md:block text-slate-500 text-xs font-mono">
              {new Date().toLocaleString('zh-CN')}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-all"
              >
                <Bell className="w-5 h-5" />
                {unresolved.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center leading-none">
                    {unresolved.length}
                  </span>
                )}
              </button>

              {showAlerts && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-drone-card border border-drone-border rounded-xl shadow-card z-50 overflow-hidden animate-fade-in">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-drone-border">
                    <span className="text-sm font-semibold text-slate-200">系统通知</span>
                    {criticalCount > 0 && (
                      <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">{criticalCount} 条紧急</span>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {mockAlerts.map(alert => (
                      <div key={alert.id} className={`px-4 py-3 border-b border-drone-border/50 hover:bg-slate-700/20 transition-all ${alert.resolved ? 'opacity-50' : ''}`}>
                        <div className="flex items-start gap-2">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs border mt-0.5 flex-shrink-0 ${alertTypeColor(alert.type)}`}>
                            {alert.type === 'error' ? '错误' : alert.type === 'warning' ? '警告' : alert.type === 'success' ? '成功' : '信息'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-slate-200 text-sm font-medium">{alert.title}</div>
                            <div className="text-slate-500 text-xs mt-0.5 truncate">{alert.message}</div>
                            <div className="text-slate-600 text-xs mt-1">{alert.timestamp}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 text-center">
                    <button className="text-cyan-400 text-xs hover:text-cyan-300" onClick={() => setShowAlerts(false)}>
                      查看全部通知
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:ring-2 hover:ring-cyan-400/50 transition-all">
              {user?.name[0]}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
