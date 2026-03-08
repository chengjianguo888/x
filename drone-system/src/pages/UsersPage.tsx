import { useState } from 'react';
import { Users, Plus, Search, Edit, Trash2, XCircle, CheckCircle, Shield, Eye, Lock } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import type { User } from '../types';
import { useAuth } from '../hooks/useAuth';

const roleConfig: Record<string, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  admin: { label: '系统管理员', color: 'text-red-400', bg: 'bg-red-400/10', icon: Shield },
  operator: { label: '飞行操作员', color: 'text-cyan-400', bg: 'bg-cyan-400/10', icon: CheckCircle },
  viewer: { label: '数据查看员', color: 'text-purple-400', bg: 'bg-purple-400/10', icon: Eye },
};

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.includes(search) || u.username.includes(search) || u.email.includes(search);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="text-cyan-400 w-5 h-5" />
            用户管理
          </h1>
          <p className="text-slate-500 text-sm">管理系统用户账号和权限</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditUser(null); setShowModal(true); }}
            className="sm:ml-auto flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-glow-cyan"
          >
            <Plus className="w-4 h-4" />
            添加用户
          </button>
        )}
      </div>

      {/* Role stats */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(roleConfig).map(([key, { label, color, bg, icon: Icon }]) => (
          <div key={key} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <div className={`text-xl font-bold ${color}`}>{mockUsers.filter(u => u.role === key).length}</div>
              <div className="text-slate-500 text-xs">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="搜索用户名、姓名、邮箱..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-drone-card border border-drone-border rounded-lg pl-9 pr-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {[{ key: 'all', label: '全部' }, ...Object.entries(roleConfig).map(([k, v]) => ({ key: k, label: v.label }))].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setRoleFilter(key)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-all border ${
                roleFilter === key ? 'bg-cyan-400/10 border-cyan-400/40 text-cyan-400' : 'glass-card text-slate-400 hover:border-slate-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Users table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-drone-border">
                {['用户信息', '角色权限', '部门', '联系方式', '最后登录', '状态', '操作'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-slate-400 font-medium text-xs whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => {
                const role = roleConfig[user.role];
                const RoleIcon = role.icon;
                const isCurrentUser = user.id === currentUser?.id;
                return (
                  <tr key={user.id} className={`border-b border-drone-border/50 hover:bg-slate-700/20 transition-colors ${isCurrentUser ? 'bg-cyan-400/3' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {user.name[0]}
                        </div>
                        <div>
                          <div className="text-slate-200 font-medium flex items-center gap-1.5">
                            {user.name}
                            {isCurrentUser && <span className="text-xs bg-cyan-400/20 text-cyan-400 px-1.5 py-0.5 rounded">当前</span>}
                          </div>
                          <div className="text-slate-500 text-xs">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${role.bg}`}>
                        <RoleIcon className={`w-3 h-3 ${role.color}`} />
                        <span className={role.color}>{role.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">{user.department || '-'}</td>
                    <td className="px-5 py-4">
                      <div className="text-slate-400 text-xs">{user.email}</div>
                      {user.phone && <div className="text-slate-500 text-xs">{user.phone}</div>}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">{user.lastLogin || '-'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                        user.status === 'active' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`} />
                        {user.status === 'active' ? '正常' : '禁用'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {isAdmin && !isCurrentUser ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setEditUser(user); setShowModal(true); }}
                            className="text-slate-500 hover:text-cyan-400 transition-colors" title="编辑"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-slate-500 hover:text-yellow-400 transition-colors" title="重置密码">
                            <Lock className="w-4 h-4" />
                          </button>
                          <button className="text-slate-500 hover:text-red-400 transition-colors" title="删除">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">暂无匹配的用户</p>
          </div>
        )}
      </div>

      {/* Add/Edit user modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="glass-card rounded-2xl w-full max-w-md p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-100 font-bold text-lg">{editUser ? '编辑用户' : '添加用户'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">真实姓名 *</label>
                  <input type="text" defaultValue={editUser?.name} placeholder="请输入真实姓名" className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">用户名 *</label>
                  <input type="text" defaultValue={editUser?.username} placeholder="请输入用户名" className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">邮箱地址 *</label>
                <input type="email" defaultValue={editUser?.email} placeholder="请输入邮箱地址" className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">角色权限 *</label>
                  <select defaultValue={editUser?.role} className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50">
                    {Object.entries(roleConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">所属部门</label>
                  <input type="text" defaultValue={editUser?.department} placeholder="部门名称" className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50" />
                </div>
              </div>
              {!editUser && (
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">初始密码 *</label>
                  <input type="password" placeholder="请设置初始密码" className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50" />
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2.5 rounded-lg text-sm transition-all">取消</button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white py-2.5 rounded-lg text-sm transition-all font-medium">{editUser ? '保存修改' : '创建用户'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
