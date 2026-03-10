import { Activity as ActivityIcon, Clock, Move } from 'lucide-react';

interface ActivityCardProps {
  name: string;
  distance: number;
  duration: string;
  pace: string;
  date: string;
}

export function ActivityCard({ name, distance, duration, pace, date }: ActivityCardProps) {
  return (
    <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm mb-3">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-slate-100">{name}</h4>
        <span className="text-xs text-slate-500">{date}</span>
      </div>
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-blue-400 font-bold">
          <Move size={16} />
          <span>{(distance / 1000).toFixed(2)} km</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock size={16} />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <ActivityIcon size={16} />
          <span>{pace} /km</span>
        </div>
      </div>
    </div>
  );
}
