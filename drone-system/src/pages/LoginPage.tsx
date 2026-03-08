import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number; opacity: number }>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    setParticles(
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.02 + 0.005,
        opacity: Math.random() * 0.6 + 0.1,
      }))
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const lines: Array<{ x1: number; y1: number; x2: number; y2: number; alpha: number; speed: number }> = Array.from({ length: 15 }, () => ({
      x1: Math.random() * window.innerWidth,
      y1: Math.random() * window.innerHeight,
      x2: Math.random() * window.innerWidth,
      y2: Math.random() * window.innerHeight,
      alpha: Math.random() * 0.15,
      speed: Math.random() * 0.003 + 0.001,
    }));

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      lines.forEach(line => {
        line.x1 += Math.sin(time + line.speed * 100) * 0.3;
        line.y1 += Math.cos(time + line.speed * 100) * 0.3;
        line.x2 += Math.cos(time * 0.7 + line.speed * 50) * 0.3;
        line.y2 += Math.sin(time * 0.7 + line.speed * 50) * 0.3;

        if (line.x1 < 0 || line.x1 > canvas.width) line.x1 = Math.random() * canvas.width;
        if (line.x2 < 0 || line.x2 > canvas.width) line.x2 = Math.random() * canvas.width;
        if (line.y1 < 0 || line.y1 > canvas.height) line.y1 = Math.random() * canvas.height;
        if (line.y2 < 0 || line.y2 > canvas.height) line.y2 = Math.random() * canvas.height;

        const gradient = ctx.createLinearGradient(line.x1, line.y1, line.x2, line.y2);
        gradient.addColorStop(0, `rgba(0, 212, 255, ${line.alpha})`);
        gradient.addColorStop(1, `rgba(0, 255, 136, ${line.alpha * 0.5})`);

        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }
    setError('');
    setLoading(true);
    const ok = await login(username, password);
    setLoading(false);
    if (!ok) {
      setError('用户名或密码错误，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-drone-dark relative overflow-hidden flex items-center justify-center">
      {/* Animated background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Radial glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.06) 0%, transparent 70%)' }} />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-cyan-400"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animation: `float ${3 + p.speed * 100}s ease-in-out infinite`,
              animationDelay: `${p.id * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      {/* Main login card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
        {/* Logo section */}
        <div className="text-center mb-8">
          {/* Drone SVG icon */}
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400 opacity-30 animate-ping" />
            <div className="absolute inset-2 rounded-full border border-cyan-400 opacity-50" />
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
                {/* Drone body */}
                <rect x="22" y="26" width="20" height="12" rx="3" fill="rgba(0,212,255,0.9)" />
                {/* Arms */}
                <line x1="22" y1="30" x2="8" y2="22" stroke="rgba(0,212,255,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="42" y1="30" x2="56" y2="22" stroke="rgba(0,212,255,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="22" y1="34" x2="8" y2="42" stroke="rgba(0,212,255,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="42" y1="34" x2="56" y2="42" stroke="rgba(0,212,255,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
                {/* Rotors */}
                <ellipse cx="8" cy="22" rx="6" ry="2" stroke="rgba(0,212,255,0.9)" strokeWidth="1.5" className="rotor"/>
                <ellipse cx="56" cy="22" rx="6" ry="2" stroke="rgba(0,212,255,0.9)" strokeWidth="1.5" className="rotor"/>
                <ellipse cx="8" cy="42" rx="6" ry="2" stroke="rgba(0,212,255,0.9)" strokeWidth="1.5" className="rotor"/>
                <ellipse cx="56" cy="42" rx="6" ry="2" stroke="rgba(0,212,255,0.9)" strokeWidth="1.5" className="rotor"/>
                {/* Camera */}
                <circle cx="32" cy="38" r="3" fill="rgba(0,0,0,0.5)" stroke="rgba(0,212,255,0.6)" strokeWidth="1"/>
                <circle cx="32" cy="38" r="1.5" fill="rgba(0,212,255,0.4)"/>
                {/* LED indicators */}
                <circle cx="27" cy="29" r="1.5" fill="rgba(0,255,136,1)"/>
                <circle cx="37" cy="29" r="1.5" fill="rgba(255,0,0,0.9)"/>
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold neon-text tracking-wider" style={{ fontFamily: 'Orbitron, sans-serif', color: '#00d4ff' }}>
            无人机作业管理系统
          </h1>
          <p className="text-slate-400 text-sm mt-1 tracking-widest">UAV OPERATION DATA SYSTEM</p>
        </div>

        {/* Login form card */}
        <div className="glass-card rounded-2xl p-8 shadow-card">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="text-cyan-400 w-5 h-5" />
            <span className="text-slate-300 font-medium">系统登录</span>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 status-pulse" />
              <span className="text-xs text-green-400">系统在线</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username field */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-sm font-medium">用户名</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className="w-full bg-slate-900/60 border border-drone-border rounded-lg pl-10 pr-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-sm font-medium">密码</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full bg-slate-900/60 border border-drone-border rounded-lg pl-10 pr-10 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 accent-cyan-400" defaultChecked />
                <span className="text-slate-400 text-sm">记住我</span>
              </label>
              <button type="button" className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                忘记密码?
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-lg py-3.5 text-sm font-semibold text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? 'linear-gradient(135deg, #1a3a5c, #1a3a5c)'
                  : 'linear-gradient(135deg, #0ea5e9, #06b6d4, #00d4ff)',
                boxShadow: loading ? 'none' : '0 0 20px rgba(0, 212, 255, 0.4)',
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <span>正在验证...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>安全登录</span>
                  </>
                )}
              </span>
              {!loading && <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />}
            </button>
          </form>

          {/* Demo accounts hint */}
          <div className="mt-5 pt-5 border-t border-drone-border">
            <p className="text-slate-500 text-xs text-center mb-2">演示账号（密码均为 admin123）</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { user: 'admin', role: '管理员', color: 'text-cyan-400' },
                { user: 'operator1', role: '操作员', color: 'text-green-400' },
                { user: 'viewer1', role: '查看者', color: 'text-purple-400' },
              ].map(({ user, role, color }) => (
                <button
                  key={user}
                  type="button"
                  onClick={() => { setUsername(user); setPassword('admin123'); }}
                  className="bg-slate-900/60 border border-drone-border rounded-lg px-2 py-1.5 hover:border-cyan-400/50 transition-all group"
                >
                  <div className={`text-xs font-medium ${color}`}>{role}</div>
                  <div className="text-slate-500 text-xs">{user}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          © 2026 无人机作业管理系统 · 版本 v2.5.0 · 技术支持
        </p>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 text-slate-700 text-xs font-mono">SYS://UAV-OPS-V2.5</div>
      <div className="absolute top-4 right-4 text-slate-700 text-xs font-mono">{new Date().toLocaleString('zh-CN')}</div>
      <div className="absolute bottom-4 left-4 text-slate-700 text-xs font-mono">LAT:39.9042 / LNG:116.4074</div>
      <div className="absolute bottom-4 right-4 text-slate-700 text-xs font-mono">STATUS: ONLINE</div>
    </div>
  );
}
