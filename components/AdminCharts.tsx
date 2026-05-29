import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar
} from 'recharts';
import { Lead } from '../types';
import { groupLeadsByWeek, groupByCategory, groupByStatus, calcKPIs } from '../lib/chartUtils';
import { Users, UserPlus, CheckCircle, Activity } from 'lucide-react';

interface AdminChartsProps {
  leads: Lead[];
}

export const AdminCharts: React.FC<AdminChartsProps> = ({ leads }) => {
  const weeklyData = useMemo(() => groupLeadsByWeek(leads), [leads]);
  const categoryData = useMemo(() => groupByCategory(leads), [leads]);
  const statusData = useMemo(() => groupByStatus(leads), [leads]);
  const kpis = useMemo(() => calcKPIs(leads), [leads]);

  const tooltipStyle = {
    background: '#0f172a',
    border: '0.5px solid #334155',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#f8fafc'
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-700 p-5 rounded-xl shadow-lg flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-lg text-cyan-400"><Users className="w-6 h-6" /></div>
          <div>
            <div className="text-xs font-mono text-slate-500 uppercase">Total Leads</div>
            <div className="text-2xl font-bold text-white mt-1">{kpis.total}</div>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-700 p-5 rounded-xl shadow-lg flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-lg text-yellow-400"><UserPlus className="w-6 h-6" /></div>
          <div>
            <div className="text-xs font-mono text-slate-500 uppercase">Novos Hoje</div>
            <div className="text-2xl font-bold text-white mt-1">{kpis.hoje}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 p-5 rounded-xl shadow-lg flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-lg text-blue-400"><Activity className="w-6 h-6" /></div>
          <div>
            <div className="text-xs font-mono text-slate-500 uppercase">Taxa Resposta</div>
            <div className="text-2xl font-bold text-white mt-1">{kpis.taxaResposta}%</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 p-5 rounded-xl shadow-lg flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-lg text-green-400"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <div className="text-xs font-mono text-slate-500 uppercase">Taxa Resolução</div>
            <div className="text-2xl font-bold text-white mt-1">{kpis.taxaResolucao}%</div>
          </div>
        </div>
      </div>

      {/* Complex Charts - Hidden on mobile */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        
        {/* Area Chart */}
        <div className="col-span-2 bg-slate-900 border border-slate-700 p-5 rounded-xl shadow-lg">
          <h3 className="text-sm font-bold text-white mb-4">Volume de Leads (Últimas 8 Semanas)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#1E293B', opacity: 0.4 }} />
                <Area type="monotone" dataKey="count" stroke="#00E5FF" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="col-span-1 bg-slate-900 border border-slate-700 p-5 rounded-xl shadow-lg">
          <h3 className="text-sm font-bold text-white mb-4">Intenção IA</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="col-span-3 bg-slate-900 border border-slate-700 p-5 rounded-xl shadow-lg">
          <h3 className="text-sm font-bold text-white mb-4">Funil de Estados</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#1E293B' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24} label={{ position: 'right', fill: '#94A3B8', fontSize: 11 }}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
