'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface WeeklyLoadChartProps {
  currentWeekVolume: number;
  previousWeekVolume: number;
  isOverloaded: boolean;
}

export function WeeklyLoadChart({ currentWeekVolume, previousWeekVolume, isOverloaded }: WeeklyLoadChartProps) {
  const data = [
    { name: 'Semana Anterior', volume: previousWeekVolume },
    { name: 'Semana Atual', volume: currentWeekVolume },
  ];

  return (
    <div className="h-64 w-full bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
      <h3 className="text-slate-400 text-sm font-medium mb-4">Volume Semanal (km)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
          />
          <Bar dataKey="volume" radius={[6, 6, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 1 && isOverloaded ? '#ef4444' : '#3b82f6'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
