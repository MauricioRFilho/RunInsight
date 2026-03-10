'use client';

import React, { useState } from 'react';
import { X, Target, Calendar, Clock } from 'lucide-react';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateGoalModal({ isOpen, onClose, onSubmit }: CreateGoalModalProps) {
  const [type, setType] = useState('rodagem');
  const [distance, setDistance] = useState('');
  const [date, setDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      targetDistance: parseFloat(distance) * 1000, // convert to meters
      scheduledFor: new Date(date).toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Target className="text-indigo-400 w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Nova Meta de Treino</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Tipo de Treino</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="rodagem">Rodagem (Leve)</option>
              <option value="intervalado">Intervalado (Tiro)</option>
              <option value="longao">Longão</option>
              <option value="prova">Competição</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Distância Alvo (km)</label>
            <div className="relative">
              <input 
                type="number" 
                step="0.1"
                required
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Ex: 10.5"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">KM</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Data Agendada</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl mt-4 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Clock size={18} /> Agendar Treino
          </button>
        </form>
      </div>
    </div>
  );
}
