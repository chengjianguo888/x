import { useState } from 'react';
import { Users, Plus, XCircle, Shield, Eye, Edit, Trash2, KeyRound } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';

const roleConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  admin: { label: '管理员', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
  operator: { label: '操作员', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' },
  viewer: { label: '查看者', color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/30' },
};

const deptOptions = ['系统管理部', '飞行作业部', '数据分析部', '后勤保障部', '技术研发部'];

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser, showToast } = useStore();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', username: '', email: '', phone: '', role: 'operator', department: '飞行作业部', status: 'active' });

  const filtered = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);

  const openCreate = () => {
    setEditUser(null);
    setForm({ name: '', username: '', email: '', phone: '', role: 'operator', department: '飞行作业部', status: 'active' });
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setForm({ name: user.name, username: user.username, email: user.email || '', phone: user.phone || '', role: user.role, department: user.department || '飞行作业部', status: user.status });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.username.trim()) {
      showToast('error', '请填写姓名和用户名');
      return;
    }
    if (editUser) {
      updateUser({ ...editUser, ...form, role: form.role as User['role'], status: form.status as User['status'] });
      showToast('success', `用户「${form.name}」信息已更新`);
    } else {
      if (users.find(u => u.username === form.username)) {
        showToast('error', '用户名已存在，请换一个');
        return;
      }
      addUser({
        id: `u${Date.now()}`,
        name: form.name, username: form.username, email: form.email, phone: form.phone,
        role: form.role as User['role'], department: form.department,
        status: form.status as User['status'],
        lastLogin: '从未登录', createdAt: new Date().toISOString().slice(0, 10),
      });
      showToast('success', `用户「${form.name}」创建成功`);
    }
    setShowModal(false);
  };

  const handleDelete = (user: User) => {
    if (user.id === 'u1') { showToast('error', '不能删除超级管理员账户'); return; }
    if (user.id === currentUser?.id) { showToast('error', '不能删除自己的账户'); return; }
    setShowDeleteConfirm(user.id);
  };

  const confirmDelete = (userId: string) => {
    const user = users.find(u => u.id === userId)!;
    deleteUser(userId);
    showToast('success', `用户「${user.name}」已删除`);
    setShowDeleteConfirm(null);
  };

  const handleResetPassword = (user: User) => {
    showToast('success', `已向 ${user.email || user.name} 发送密码重置邮件`);
  };

  const handleToggleStatus = (user: User) => {
    if (user.id === 'u1') { showToast('error', '不能禁用超级管理员账户'); return; }
    const newStatus: User['status'] = user.status === 'active' ? 'inactive' : 'active';
    updateUser({ ...user, status: newStatus });
    showToast('info', `用户「${user.name}」已${newStatus === 'active' ? '启用' : '禁用'}`);
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="text-cyan-400 w-5 h-5" />用户管理
          </h1>
          <p className="text-slate-500 text-sm">管理系统用户账户和权限</p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} className="sm:ml-auto flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-glow-cyan">
            <Plus className="w-4 h-4" />添加用户
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: `全部 (${users.length})` },
          { key: 'admin', label: `管理员 (${users.filter(u => u.role === 'admin').length})` },
          { key: 'operator', label: `操作员 (${users.filter(u => u.role === 'operator').length})` },
          { key: 'viewer', label: `查看者 (${users.filter(u => u.role === 'viewer').length})` },
        ].map(tab => (
          <button key={tab.key} onClick={() => setRoleFilter(tab.key)}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-all ${roleFilter === tab.key ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400/40' : 'bg-drone-card text-slate-400 border-drone-border hover:text-slate-200'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-drone-border">
                <th className="text-left text-slate-500 px-4 py-3 font-medium">用户</th>
                <th className="text-left text-slate-500 px-4 py-3 font-medium">角色</th>
                <th className="text-left text-slate-500 px-4 py-3 font-medium hidden sm:table-cell">部门</th>
                <th className="text-left text-slate-500 px-4 py-3 font-medium hidden md:table-cell">最后登录</th>
                <th className="text-left text-slate-500 px-4 py-3 font-medium">状态</th>
                {isAdmin && <th className="text-left text-slate-500 px-4 py-3 font-medium">操作</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => {
                const roleCfg = roleConfig[user.role];
                const isCurrentUser = user.id === currentUser?.id;
                return (
                  <tr key={user.id} className={`border-b border-drone-border/50 transition-colors hover:bg-slate-900/30 ${i % 2 === 0 ? '' : 'bg-slate-900/20'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {user.name[0]}
                        </div>
                        <div>
                          <div className="text-slate-200 font-medium flex items-center gap-1">
                            {user.name}
                            {isCurrentUser && <span className="text-xs text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded">我</span>}
                          </div>
                          <div className="text-slate-500 text-xs">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-lg border ${roleCfg.color} ${roleCfg.bg} ${roleCfg.border}`}>
                        {roleCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs hidden sm:table-cell">{user.department}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{user.lastLogin}</td>
                    <td className="px-4 py-3">
                      {isAdmin && !isCurrentUser ? (
                        <button onClick={() => handleToggleStatus(user)}
                          className={`text-xs px-2 py-1 rounded-lg cursor-pointer transition-all ${user.status === 'active' ? 'text-green-400 bg-green-400/10 hover:bg-green-400/20' : 'text-red-400 bg-red-400/10 hover:bg-red-400/20'}`}>
                          {user.status === 'active' ? '✅ 正常' : '❌ 已禁用'}
                        </button>
                      ) : (
                        <span className={`text-xs px-2 py-1 rounded-lg ${user.status === 'active' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                          {user.status === 'active' ? '✅ 正常' : '❌ 已禁用'}
                        </span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(user)} className="text-slate-500 hover:text-cyan-400 transition-colors" title="编辑用户">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleResetPassword(user)} className="text-slate-500 hover:text-yellow-400 transition-colors" title="重置密码">
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(user)} disabled={user.id === 'u1' || isCurrentUser}
                            className="text-slate-500 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="删除用户">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-slate-500 hover:text-green-400 transition-colors" title="查看权限">
                            <Shield className="w-4 h-4" />
                          </button>
                          <button onClick={() => showToast('info', `查看用户 ${user.name} 的详细信息`)} className="text-slate-500 hover:text-blue-400 transition-colors" title="查看详情">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl w-full max-w-sm p-6 animate-fade-in">
            <h3 className="text-slate-100 font-bold text-lg mb-2">确认删除</h3>
            <p className="text-slate-400 text-sm mb-5">确定要删除用户「{users.find(u => u.id === showDeleteConfirm)?.name}」吗？此操作不可撤销。</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2.5 rounded-lg text-sm transition-all">取消</button>
              <button onClick={() => confirmDelete(showDeleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-400 text-white py-2.5 rounded-lg text-sm transition-all font-medium">确认删除</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="glass-card rounded-2xl w-full max-w-md p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-100 font-bold text-lg">{editUser ? '编辑用户' : '添加新用户'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">姓名 *</label>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="真实姓名"
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">用户名 *</label>
                  <input type="text" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} placeholder="登录用户名" disabled={!!editUser}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50 disabled:opacity-50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">邮箱</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="电子邮箱"
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">手机号</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="手机号码"
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">角色</label>
                  <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50">
                    <option value="admin">管理员</option>
                    <option value="operator">操作员</option>
                    <option value="viewer">查看者</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-1 block">部门</label>
                  <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                    className="w-full bg-slate-900/60 border border-drone-border rounded-lg px-3 py-2 text-slate-300 text-sm focus:outline-none focus:border-cyan-400/50">
                    {deptOptions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2.5 rounded-lg text-sm transition-all">取消</button>
                <button onClick={handleSave} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white py-2.5 rounded-lg text-sm transition-all font-medium">{editUser ? '保存修改' : '创建用户'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
