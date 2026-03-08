import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useStore } from '../hooks/useStore';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'border-green-500/40 bg-green-500/10 text-green-400',
  error: 'border-red-500/40 bg-red-500/10 text-red-400',
  warning: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400',
  info: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(toast => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-card backdrop-blur-sm animate-fade-in ${colors[toast.type]}`}
            style={{ background: 'rgba(13,27,42,0.95)' }}
          >
            <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="text-sm flex-1 text-slate-200">{toast.message}</span>
            <button onClick={() => dismissToast(toast.id)} className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
