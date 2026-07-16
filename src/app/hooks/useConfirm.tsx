import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { Btn } from '@/app/components/ui/Shared';

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({ title: '', message: '', onConfirm: () => {} });

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    setConfig({ title, message, onConfirm });
    setIsOpen(true);
  };

  const ConfirmModal = () => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/70 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 10 }} 
            className="relative bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <div className="flex justify-between items-start mb-4 mt-2">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 shadow-inner">
                  <AlertTriangle size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{config.title}</h3>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1"><X size={20}/></button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 mt-2 ml-16">{config.message}</p>
            <div className="flex gap-3 justify-end mt-4">
              <Btn label="Annuler" variant="secondary" onClick={() => setIsOpen(false)} />
              <Btn label="Confirmer" variant="danger" onClick={() => { config.onConfirm(); setIsOpen(false); }} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return { confirmAction, ConfirmModal };
}
