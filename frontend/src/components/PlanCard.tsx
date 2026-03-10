import React from 'react';
import { Calendar, Target, ChevronRight } from 'lucide-react';

interface PlanCardProps {
  type: string;
  distance: number;
  scheduledFor: string;
  isCompleted?: boolean;
}

export function PlanCard({ type, distance, scheduledFor, isCompleted }: PlanCardProps) {
  const date = new Date(scheduledFor).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' });
  const distanceKm = (distance / 1000).toFixed(1);

  return (
    <div className={`p-4 rounded-xl border mb-3 flex items-center justify-between transition-all ${isCompleted ? 'bg-slate-900/50 border-slate-800 opacity-60' : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50'}`}>
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500/10 text-green-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
          {isCompleted ? <Target size={18} /> : <Calendar size={18} />}
        </div>
        <div>
          <h4 className="font-bold text-slate-200 capitalize">{type}</h4>
          <p className="text-xs text-slate-500 uppercase tracking-wider">{date} • {distanceKm}km</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-600" />
    </div>
  );
}
