import React from 'react';
import { Award, Calendar, Flame, TrendingUp, Trophy } from 'lucide-react';

export type TemplateType = 'weekly' | 'pr' | 'tbt' | 'streak';

interface SocialCardProps {
  template: TemplateType;
  userName: string;
  data: {
    weeklyVolume?: number;
    hasFlashBadge?: boolean;
    streak?: number;
    records?: {
      best5k: string;
      best10k: string;
      best21k: string;
    };
    activity?: {
      name: string;
      distance: number;
      pace: string;
      date: string;
    };
  };
  transparent?: boolean;
}

const SocialCard: React.FC<SocialCardProps> = ({ template, userName, data, transparent = false }) => {
  const bgClass = transparent 
    ? 'bg-transparent' 
    : template === 'pr' 
      ? 'bg-linear-to-br from-indigo-600 to-blue-700' 
      : template === 'tbt'
        ? 'bg-linear-to-br from-emerald-500 to-teal-700'
        : template === 'streak'
          ? 'bg-linear-to-br from-rose-500 to-orange-600'
          : 'bg-linear-to-br from-orange-500 to-red-600';

  return (
    <div 
      id="social-card"
      className={`w-[400px] h-[600px] ${bgClass} p-8 flex flex-col justify-between text-white rounded-3xl shadow-2xl relative overflow-hidden`}
    >
      {!transparent && (
        <>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-black/20 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* Header */}
      <div className="relative z-10">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">
          Run<span className={transparent ? 'text-indigo-400' : 'text-white'}>Insight</span>
        </h1>
        <p className="text-white/80 font-bold uppercase text-[10px] tracking-[0.2em]">
          {template === 'weekly' && 'Weekly Performance'}
          {template === 'pr' && 'Recordes Pessoais'}
          {template === 'tbt' && 'Throwback Thursday'}
        </p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
        {template === 'weekly' && (
          <div className="text-center">
            <div className="text-8xl font-black tabular-nums tracking-tighter mb-2">
              {data.weeklyVolume?.toFixed(1)}
              <span className="text-2xl ml-2 uppercase opacity-70">km</span>
            </div>
            <p className="text-xl font-bold uppercase tracking-widest text-white/90">
              Volume da Semana
            </p>
          </div>
        )}

        {template === 'pr' && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-[10px] font-black uppercase opacity-60 mb-1">Melhor 5K</p>
              <p className="text-3xl font-black">{data.records?.best5k || 'N/A'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-[10px] font-black uppercase opacity-60 mb-1">Melhor 10K</p>
              <p className="text-3xl font-black">{data.records?.best10k || 'N/A'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-[10px] font-black uppercase opacity-60 mb-1">Meia Maratona</p>
              <p className="text-3xl font-black">{data.records?.best21k || 'N/A'}</p>
            </div>
          </div>
        )}

        {template === 'streak' && (
          <div className="text-center">
             <div className="inline-block p-6 bg-white/20 rounded-full mb-6 animate-pulse">
                <Flame size={64} className="text-orange-400 fill-orange-400" />
             </div>
             <div className="text-8xl font-black tabular-nums tracking-tighter mb-2">
               {data.streak || 0}
             </div>
             <p className="text-xl font-bold uppercase tracking-widest text-white/90">
               Dias em Sequência
             </p>
          </div>
        )}

        {template === 'tbt' && (
          <div className="text-center">
             <div className="inline-block p-4 bg-white/10 rounded-full mb-6">
                <Calendar size={48} />
             </div>
             <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2">{data.activity?.date}</p>
             <h2 className="text-3xl font-black mb-4 leading-tight">{data.activity?.name}</h2>
             <div className="flex justify-center gap-6 text-xl font-bold">
                <div>
                   <p className="text-[10px] opacity-60 uppercase">Distância</p>
                   <p>{(data.activity?.distance || 0 / 1000).toFixed(1)}km</p>
                </div>
                <div>
                   <p className="text-[10px] opacity-60 uppercase">Pace</p>
                   <p>{data.activity?.pace}/km</p>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-6">
        <div>
          <p className="text-xs uppercase tracking-widest opacity-70 font-bold mb-1">Atleta</p>
          <p className="text-lg font-bold">@{userName.toLowerCase().replace(/\s+/g, '')}</p>
        </div>
        
        {template === 'weekly' && data.hasFlashBadge && (
          <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-black text-sm flex items-center gap-2 shadow-lg transform rotate-3">
             <TrendingUp size={16} />
             <span>PACE SEGURO</span>
          </div>
        )}

        {template === 'pr' && (
           <div className="bg-indigo-400 text-white px-4 py-2 rounded-full font-black text-sm flex items-center gap-2 shadow-lg">
              <Trophy size={16} />
              <span>LEVEL UP</span>
           </div>
        )}
      </div>

      {/* Watermark */}
      <div className="absolute bottom-4 right-8 opacity-20 transform -rotate-90 origin-bottom-right translate-y-full">
         <span className="text-6xl font-black tracking-tighter uppercase italic">RunInsight</span>
      </div>
    </div>
  );
};

export default SocialCard;
