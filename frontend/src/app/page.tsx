'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { Activity, Award, RefreshCw, Zap, TrendingUp, ShieldAlert, LogIn, LogOut, Flame, Share2, Calendar, Plus, Bot, Trophy } from 'lucide-react';
import { WeeklyLoadChart } from '@/components/WeeklyLoadChart';
import { ActivityCard } from '@/components/ActivityCard';
import { PlanCard } from '@/components/PlanCard';
import { CreateGoalModal } from '@/components/CreateGoalModal';
import SocialCard, { TemplateType } from '@/components/SocialCard';
import { SocialTemplateSelector } from '@/components/SocialTemplateSelector';
import { toPng } from 'html-to-image';
import { api } from '@/lib/api';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [loadData, setLoadData] = useState<any>(null);
  const [gamificationData, setGamificationData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [records, setRecords] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [adherenceScore, setAdherenceScore] = useState<number>(100);
  const [coachFeedback, setCoachFeedback] = useState<string>('');
  const [showSocialCard, setShowSocialCard] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('weekly');
  const [isTransparent, setIsTransparent] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const userId = session?.user?.email || 'default-user-id';

  useEffect(() => {
    if (status === 'authenticated') {
      async function fetchData() {
        try {
          const [load, gamif, trainingPlans, adherence, coach, yearlyStats, recentActivities, personalRecords] = await Promise.all([
            api.getLoadAnalysis(userId),
            api.getGamificationData(userId),
            api.getPlans(userId),
            api.getAdherenceScore(userId),
            api.getCoachFeedback(userId),
            api.getYearlyStats(userId),
            api.getActivities(userId),
            api.getPersonalRecords(userId)
          ]);
          setLoadData(load);
          setGamificationData(gamif);
          setPlans(trainingPlans);
          setAdherenceScore(adherence.score);
          setCoachFeedback(coach.feedback);
          setStats(yearlyStats);
          setActivities(recentActivities);
          setRecords(personalRecords);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, userId]);

  const downloadSocialCard = async () => {
    const node = document.getElementById('social-card');
    if (node) {
      try {
        const dataUrl = await toPng(node, { 
          cacheBust: true,
          backgroundColor: isTransparent ? 'transparent' : undefined
        });
        const link = document.createElement('a');
        link.download = `runinsight-${selectedTemplate}-${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('oops, something went wrong!', err);
      }
    }
  };

  const handleTemplateSelect = (template: TemplateType, transparent: boolean) => {
    setSelectedTemplate(template);
    setIsTransparent(transparent);
    setShowTemplateSelector(false);
    setShowSocialCard(true);
  };

  const handleCreatePlan = async (data: any) => {
    try {
      await api.createPlan(userId, data);
      // Refresh plans
      const [newPlans, newAdherence] = await Promise.all([
        api.getPlans(userId),
        api.getAdherenceScore(userId)
      ]);
      setPlans(newPlans);
      setAdherenceScore(newAdherence.score);
    } catch (err) {
      console.error('Failed to create plan:', err);
    }
  };

  if (loading || status === 'loading') return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-medium italic">
      <RefreshCw className="animate-spin mr-2" /> Carregando Dashboard...
    </div>
  );

  if (status === 'unauthenticated') {
    return (
      <main className="min-h-screen bg-slate-950 p-5 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Run<span className="text-blue-500">Insight</span></h1>
        <p className="text-slate-400 max-w-md mb-8">
          Sincronize sua evolução, analise seu pace seguro e compartilhe suas conquistas com a comunidade.
        </p>
        <button 
          onClick={() => signIn('strava')}
          className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20"
        >
          <LogIn size={20} /> Conectar com Strava
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-5 text-slate-100">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Run<span className="text-blue-500 underline decoration-blue-500/30 underline-offset-4">Insight</span></h1>
          <p className="text-slate-400 text-sm">Bem-vindo de volta, {session?.user?.name || 'Atleta'}.</p>
        </div>
        <div className="flex items-center gap-4">
          {gamificationData?.streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/20 text-xs font-bold leading-none">
              <Flame className="w-3.5 h-3.5" />
              <span>{gamificationData.streak} DIAS</span>
            </div>
          )}
          <div className="flex gap-2">
            <button 
              onClick={() => setShowTemplateSelector(true)}
              className="h-10 w-10 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors"
              title="Compartilhar Relatório"
            >
              <Share2 size={20} className="text-indigo-400" />
            </button>
            <button 
              onClick={() => signOut()}
              className="h-10 w-10 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors"
              title="Sair"
            >
              <LogOut size={20} className="text-rose-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Yearly Highlights */}
      <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl group hover:border-blue-500/50 transition-all">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Distância Total ({stats?.year})</p>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-black text-white">{stats?.totalDistance || 0}</span>
            <span className="text-[10px] font-bold text-blue-500 mb-1">KM</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl group hover:border-orange-500/50 transition-all">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Melhor Pace</p>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-black text-white">{stats?.bestPace || 'N/A'}</span>
            <span className="text-[10px] font-bold text-orange-500 mb-1">/KM</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl group hover:border-emerald-500/50 transition-all">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total de Treinos</p>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-black text-white">{stats?.totalRuns || 0}</span>
            <span className="text-emerald-500 font-bold mb-1"><Activity size={14} /></span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl group hover:border-indigo-500/50 transition-all">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Rank Atual</p>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-black text-white">Elite</span>
            <span className="text-indigo-500 font-bold mb-1"><Trophy size={14} /></span>
          </div>
        </div>
      </section>

      {/* Adherence & Load Status */}
      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl flex items-center gap-4 ${loadData?.isOverloaded ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-green-500/10 border border-green-500/30 text-green-400'}`}>
          {loadData?.isOverloaded ? <ShieldAlert size={28} /> : <TrendingUp size={28} />}
          <div>
            <h2 className="font-bold text-lg leading-tight">
              {loadData?.isOverloaded ? 'Atenção: Sobrecarga' : 'Pace Seguro'}
            </h2>
            <p className="text-sm opacity-80">
              {loadData?.isOverloaded 
                ? `Aumento de ${loadData.increasePercentage}% detectado.` 
                : 'Sua carga está dentro da margem de segurança.'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 flex items-center gap-4">
          <div className="relative h-12 w-12 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="opacity-20" />
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={126} strokeDashoffset={126 - (126 * adherenceScore) / 100} strokeLinecap="round" />
            </svg>
            <span className="text-xs font-bold">{adherenceScore}%</span>
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Aderência ao Plano</h2>
            <p className="text-sm opacity-80">Seu compromisso com o que planejou.</p>
          </div>
        </div>
      </section>

      {/* Coach Insights */}
      <section className="mb-8">
        <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-indigo-500/20 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-indigo-500/10 w-24 h-24 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="bg-indigo-600 shadow-xl shadow-indigo-600/30 h-14 w-14 rounded-2xl flex items-center justify-center shrink-0">
              <Bot className="text-white w-8 h-8" />
            </div>
            <div>
              <h3 className="text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-1">Insights do Treinador AI</h3>
              <p className="text-slate-200 text-lg leading-relaxed font-medium">
                "{coachFeedback || 'Analisando seus últimos treinos para gerar recomendações personalizadas...'}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Plans & Load Chart */}
      <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WeeklyLoadChart 
            currentWeekVolume={loadData?.currentWeekVolume || 0} 
            previousWeekVolume={loadData?.previousWeekVolume || 0} 
            isOverloaded={loadData?.isOverloaded || false} 
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-300 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-400" /> Próximos Treinos
            </h3>
            <button 
              onClick={() => setIsGoalModalOpen(true)}
              className="text-[10px] bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-indigo-400 px-2 py-1 rounded-md font-bold flex items-center gap-1 transition-all"
            >
              <Plus size={10} /> ADICIONAR META
            </button>
          </div>
          {plans.length > 0 ? (
            plans.slice(0, 3).map((plan: any) => (
              <PlanCard 
                key={plan.id}
                type={plan.type}
                distance={plan.targetDistance}
                scheduledFor={plan.scheduledFor}
                isCompleted={plan.isCompleted}
              />
            ))
          ) : (
            <div className="p-8 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
              <p className="text-sm text-slate-500 italic">Nenhum treino planejado.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Activities */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-300">Sincronização Recente</h3>
          <button 
            onClick={async () => {
              try {
                await api.syncActivities(userId);
                // Refresh data
                window.location.reload(); 
              } catch (err) {
                console.error(err);
              }
            }}
            className="text-xs font-semibold text-blue-500 flex items-center gap-1 hover:text-blue-400 transition-colors"
          >
            <RefreshCw size={12} /> Sincronizar Strava
          </button>
        </div>
        
        {activities.length > 0 ? (
          activities.map((activity: any) => {
            const date = new Date(activity.startDate);
            const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
            const paceValue = activity.averageSpeed > 0 ? 1000 / (activity.averageSpeed * 60) : 0;
            const paceMins = Math.floor(paceValue);
            const paceSecs = Math.round((paceValue - paceMins) * 60);
            const formattedPace = `${paceMins}:${paceSecs.toString().padStart(2, '0')}`;
            
            const durationMins = Math.floor(activity.movingTime / 60);
            const durationSecs = Math.round(activity.movingTime % 60);
            const formattedDuration = `${durationMins}:${durationSecs.toString().padStart(2, '0')}`;

            return (
              <ActivityCard 
                key={activity.id}
                name={activity.name} 
                distance={activity.distance} 
                duration={formattedDuration} 
                pace={formattedPace} 
                date={formattedDate} 
              />
            );
          })
        ) : (
          <div className="p-8 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
            <p className="text-sm text-slate-500 italic">Nenhuma atividade sincronizada.</p>
          </div>
        )}
      </section>

      {/* Achievements */}
      <section>
        <h3 className="font-bold text-slate-300 mb-4">Suas Medalhas</h3>
        <div className="grid grid-cols-4 gap-4">
          {gamificationData?.achievements?.map((achievement: any) => (
            <div key={achievement.id} className="aspect-square bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-center group relative cursor-help">
              <Award size={24} className="text-indigo-400 drop-shadow-lg" />
              <div className="absolute -bottom-2 invisible group-hover:visible bg-slate-900 border border-slate-800 text-[10px] py-1 px-2 rounded-md whitespace-nowrap z-10 shadow-xl">
                {achievement.name}
              </div>
            </div>
          ))}
          {/* Fill empty slots up to 4 */}
          {Array.from({ length: Math.max(0, 4 - (gamificationData?.achievements?.length || 0)) }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center opacity-40">
              <Award size={24} className="text-slate-600" />
            </div>
          ))}
        </div>
      </section>

      {/* Create Goal Modal */}
      <CreateGoalModal 
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSubmit={handleCreatePlan}
      />

      <SocialTemplateSelector 
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelect={handleTemplateSelect}
      />

      {/* Social Card Modal Overlay */}
      {showSocialCard && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-[70] p-4 backdrop-blur-xl">
          <button 
            onClick={() => setShowSocialCard(false)}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors font-black tracking-widest text-xs"
          >
             FECHAR [X]
          </button>
          
          <div className="scale-[0.6] sm:scale-100 transform transition-all duration-500 shadow-2xl rounded-3xl overflow-hidden border border-white/10">
            <SocialCard 
              template={selectedTemplate}
              userName={session?.user?.name || 'Atleta'} 
              transparent={isTransparent}
              data={{
                weeklyVolume: loadData?.currentWeekVolume || 0,
                hasFlashBadge: !loadData?.isOverloaded,
                records: records,
                activity: activities.length > 0 ? {
                  name: activities[0].name,
                  distance: activities[0].distance,
                  pace: '5:02', 
                  date: 'TBT MOMENT'
                } : undefined
              }}
            />
          </div>

          <button 
            onClick={downloadSocialCard}
            className="mt-8 bg-white text-black px-10 py-4 rounded-full font-black hover:bg-slate-200 transition-all flex items-center gap-3 shadow-2xl transform hover:scale-105 active:scale-95"
          >
             BAIXAR PARA INSTAGRAM
          </button>
        </div>
      )}
    </main>
  );
}
