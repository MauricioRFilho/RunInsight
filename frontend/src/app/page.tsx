'use client';

import { useState, useEffect } from 'react';
import { Activity, Award, RefreshCw, Zap, TrendingUp, ShieldAlert } from 'lucide-react';
import { WeeklyLoadChart } from '@/components/WeeklyLoadChart';
import { ActivityCard } from '@/components/ActivityCard';
import { api } from '@/lib/api';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [loadData, setLoadData] = useState<any>(null);
  const userId = 'default-user-id'; // Substituir por auth real

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getLoadAnalysis(userId);
        setLoadData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-medium italic">
      <RefreshCw className="animate-spin mr-2" /> Carregando Dashboard...
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-950 p-5 text-slate-100">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Run<span className="text-blue-500 underline decoration-blue-500/30 underline-offset-4">Insight</span></h1>
          <p className="text-slate-400 text-sm">Bem-vindo de volta, Atleta.</p>
        </div>
        <div className="h-10 w-10 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center">
          <Zap size={20} className="text-yellow-400 fill-yellow-400" />
        </div>
      </header>

      {/* Load Analysis Status */}
      <section className="mb-8">
        <div className={`p-4 rounded-2xl flex items-center gap-4 ${loadData?.isOverloaded ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-green-500/10 border border-green-500/30 text-green-400'}`}>
          {loadData?.isOverloaded ? <ShieldAlert size={28} /> : <TrendingUp size={28} />}
          <div>
            <h2 className="font-bold text-lg leading-tight">
              {loadData?.isOverloaded ? 'Atenção: Sobrecarga' : 'Pace Seguro'}
            </h2>
            <p className="text-sm opacity-80">
              {loadData?.isOverloaded 
                ? `Aumento de ${loadData.increasePercentage}% detectado. Risco de lesão elevado.` 
                : 'Sua carga está dentro da margem de segurança de 10%.'}
            </p>
          </div>
        </div>
      </section>

      {/* Load Chart */}
      <section className="mb-8">
        <WeeklyLoadChart 
          currentWeekVolume={loadData?.currentWeekVolume || 0} 
          previousWeekVolume={loadData?.previousWeekVolume || 0} 
          isOverloaded={loadData?.isOverloaded || false} 
        />
      </section>

      {/* Recent Activities */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-300">Sincronização Recente</h3>
          <button className="text-xs font-semibold text-blue-500 flex items-center gap-1">
            <RefreshCw size={12} /> Sincronizar Strava
          </button>
        </div>
        <ActivityCard 
          name="Treino de Intervalos 4x1000m" 
          distance={8400} 
          duration="42:15" 
          pace="5:02" 
          date="Hoje" 
        />
        <ActivityCard 
          name="Longão de Domingo" 
          distance={16200} 
          duration="1:28:40" 
          pace="5:28" 
          date="Ontem" 
        />
      </section>

      {/* Achievements (Mock) */}
      <section>
        <h3 className="font-bold text-slate-300 mb-4">Suas Medalhas</h3>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center opacity-40">
              <Award size={24} className="text-slate-600" />
            </div>
          ))}
          <div className="aspect-square bg-blue-500/20 border border-blue-500/50 rounded-xl flex items-center justify-center">
            <Award size={24} className="text-blue-400 drop-shadow-lg" />
          </div>
        </div>
      </section>
    </main>
  );
}
