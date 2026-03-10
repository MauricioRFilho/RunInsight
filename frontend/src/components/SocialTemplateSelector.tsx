import React from 'react';
import { X, Calendar, Trophy, History, Image as ImageIcon, Box } from 'lucide-react';
import { TemplateType } from './SocialCard';

interface SocialTemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: TemplateType, transparent: boolean) => void;
}

export const SocialTemplateSelector: React.FC<SocialTemplateSelectorProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const templates = [
    { id: 'weekly', name: 'Resumo da Semana', icon: Calendar, color: 'emerald' },
    { id: 'pr', name: 'Recordes Pessoais', icon: Trophy, color: 'indigo' },
    { id: 'tbt', name: 'Throwback (TBT)', icon: History, color: 'amber' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 pb-4 flex justify-between items-center">
          <h2 className="text-2xl font-black text-white italic tracking-tight">VAMOS COMPARTILHAR?</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <div className="p-8 pt-4 space-y-4">
          <p className="text-slate-400 text-sm font-medium mb-6 italic">Escolha o template que melhor define seu corre de hoje.</p>
          
          <div className="grid gap-3">
            {templates.map((t) => (
              <div key={t.id} className="group">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">{t.name}</p>
                <div className="flex gap-2">
                   <button
                    onClick={() => onSelect(t.id as TemplateType, false)}
                    className="flex-1 bg-slate-800/50 border border-slate-700 hover:border-indigo-500 p-4 rounded-2xl flex items-center gap-3 transition-all hover:translate-y-[-2px] group"
                  >
                    <div className="bg-indigo-500/10 p-2 rounded-xl group-hover:bg-indigo-500/20">
                      <t.icon size={20} className="text-indigo-400" />
                    </div>
                    <span className="font-bold text-slate-200">Padrão</span>
                    <ImageIcon size={14} className="ml-auto text-slate-600" />
                  </button>
                  <button
                    onClick={() => onSelect(t.id as TemplateType, true)}
                    className="bg-slate-800/50 border border-slate-700 hover:border-emerald-500 p-4 rounded-2xl flex items-center gap-3 transition-all hover:translate-y-[-2px] group"
                    title="Modo Sticker (Fundo Transparente)"
                  >
                    <Box size={20} className="text-emerald-400" />
                    <span className="font-bold text-slate-200">Sticker</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 pt-0 text-center">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">RUNINSIGHT SOCIAL ENGINE v1.0</p>
        </div>
      </div>
    </div>
  );
};
