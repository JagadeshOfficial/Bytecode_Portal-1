
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ToastProps {
    status: { type: 'success' | 'error', msg: string } | null;
    onClose: () => void;
}

const Toast = ({ status, onClose }: ToastProps) => {
    if (!status) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed bottom-4 right-4 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl backdrop-blur-xl min-w-[300px]"
        >
            <div className={`p-2 rounded-full ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            </div>
            <div className="flex-1">
                <div className={`text-sm font-bold ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {status.type === 'success' ? 'Success' : 'Error'}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{status.msg}</div>
            </div>
            <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                aria-label="Close"
            >
                <div className="text-lg leading-none">&times;</div>
            </button>
        </motion.div>
    );
};

export default Toast;
