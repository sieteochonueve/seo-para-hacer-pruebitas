import React from 'react';
import { AuditReport, ViewState, AuditItem } from '../types';
import ScoreGauge from '../components/ScoreGauge';
import { Shield, Search, Link2, Zap, Brain, X, ArrowRight, Download, User, Bell, ExternalLink, TrendingUp, DollarSign, Target } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
  data: AuditReport;
  onChangeView: (view: ViewState) => void;
  onSelectFinding: (finding: AuditItem) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onChangeView, onSelectFinding }) => {
  // Safe destructuring with fallbacks to prevent "Cannot read properties of undefined"
  const pillars = data?.pillars || {
    technical: { score: 0, subSections: [] },
    onPage: { score: 0, subSections: [] },
    offPage: { score: 0, subSections: [] },
    ux: { score: 0, subSections: [] },
    aiSeo: { score: 0, subSections: [], visibilityMetrics: [], comparison: { currentMonth: 0, lastMonth: 0, trend: 'stable' }, readinessScore: 0 },
  };
  const summary = data?.summary || { criticalFindings: [], quickWins: [] };
  const globalScore = data?.globalScore || 0;

  const comparisonTrendData = [
    { name: 'Mes 1', current: 1000, projected: 1000 },
    { name: 'Mes 2', current: 1100, projected: 1400 },
    { name: 'Mes 3', current: 1200, projected: 1900 },
    { name: 'Mes 4', current: 1300, projected: 2600 },
    { name: 'Mes 5', current: 1400, projected: 3500 },
    { name: 'Mes 6', current: 1550, projected: 4800 },
  ];

  return (
    <div className="space-y-6 view-transition">
      {/* Header Bar */}
      <header className="flex items-center justify-between mb-8 bg-white py-4 px-2 sticky top-0 z-10 border-b border-gray-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-[#F8F8FA] px-4 py-2 rounded-xl border border-gray-100 w-80">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              readOnly 
              value={data?.url || ''} 
              className="bg-transparent text-sm font-semibold text-gray-700 outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
            <ScoreGauge score={globalScore} label="Global" size="sm" />
            <div className="hidden sm:block">
              <p className="text-[10px] font-black text-[#6B72F0] uppercase tracking-widest">Global Score</p>
              <p className="text-xs font-bold text-gray-400 uppercase">Audit Health</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><Bell size={20} /></button>
          <button className="btn-oracle flex items-center gap-2 bg-[#6B72F0] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
            <Download size={16} /> Download
          </button>
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 cursor-pointer hover:border-[#6B72F0] transition-colors">
            <User size={20} className="text-gray-500" />
          </div>
        </div>
      </header>

      {/* Top Row: Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          { id: ViewState.Technical, label: 'Technical', icon: Shield, score: pillars.technical?.score || 0 },
          { id: ViewState.OnPage, label: 'On-Page', icon: Search, score: pillars.onPage?.score || 0 },
          { id: ViewState.OffPage, label: 'Off-Page', icon: Link2, score: pillars.offPage?.score || 0 },
          { id: ViewState.UX, label: 'UX/Biz', icon: Zap, score: pillars.ux?.score || 0 },
          { id: ViewState.AI, label: 'IA SEO', icon: Brain, score: pillars.aiSeo?.score || 0 },
        ].map((p) => (
          <div 
            key={p.id}
            onClick={() => onChangeView(p.id)}
            className="oracle-card p-6 flex flex-col items-center cursor-pointer transition-all rounded-[24px]"
          >
            <div className="flex items-center gap-2 w-full mb-4">
              <p.icon size={16} className="text-[#6B72F0]" />
              <span className="text-sm font-bold text-[#334155]">{p.label}</span>
            </div>
            <ScoreGauge 
              score={p.score} 
              label={p.label} 
              size="sm" 
              onClick={() => onChangeView(p.id)} 
            />
          </div>
        ))}
      </div>

      {/* Second Row: Critical Findings & Traffic Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="oracle-card p-8 rounded-[24px] bg-[#F8F9FB]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-extrabold text-[#1E293B] tracking-tight uppercase">HALLAZGOS CRÍTICOS PRIORITARIOS</h3>
            <button 
              onClick={() => onChangeView(ViewState.IssuesMatrix)}
              className="text-[#6B72F0] text-xs font-bold hover:underline"
            >
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {(summary?.criticalFindings || []).slice(0, 4).map((finding, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white rounded-[20px] border border-gray-100 group hover:border-[#6B72F0]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${finding.status === 'failed' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'} rounded-lg flex items-center justify-center`}>
                    <X size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{finding.impact || 'Critical Error'}</p>
                    <p className="text-sm font-bold text-[#334155]">{finding.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onSelectFinding(finding)}
                  className="btn-oracle px-4 py-2 bg-[#6B72F0] text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-sm"
                >
                  Ver Solución
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="oracle-card p-8 flex flex-col rounded-[24px] bg-[#F8F9FB]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-extrabold text-[#1E293B] tracking-tight uppercase">Impacto de Tráfico</h3>
            <div className="text-right">
              <p className="text-2xl font-black text-[#6B72F0]">+24%</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Potencial Estimado</p>
            </div>
          </div>
          
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={comparisonTrendData}>
                <defs>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B72F0" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6B72F0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#94A3B8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="transparent"
                  name="Tendencia Actual"
                />
                <Area 
                  type="monotone" 
                  dataKey="projected" 
                  stroke="#6B72F0" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorProjected)" 
                  name="Crecimiento Proyectado"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 border-t border-gray-100 pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[#6B72F0] mb-1">
                <TrendingUp size={14} />
                <span className="text-sm font-black">12x</span>
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">ROI Proyectado</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[#6B72F0] mb-1">
                <DollarSign size={14} />
                <span className="text-sm font-black">$45k</span>
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Equiv. PPC</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-[#6B72F0] mb-1">
                <Target size={14} />
                <span className="text-sm font-black">+18%</span>
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Conversion Uplift</p>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-6 leading-relaxed bg-white/50 p-3 rounded-xl border border-gray-100">
            <strong>Contextual Insight:</strong> Fixing Technical Debt and AI-SEO tags will drive a 24% increase in Generative Search visibility within 90 days.
          </p>
        </div>
      </div>

      {/* Third Row: AI-SEO & Roadmap Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        <div className="oracle-card p-8 rounded-[24px] bg-[#F8F9FB]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-extrabold text-[#1E293B] tracking-tight uppercase">IA SEO Readiness</h3>
            <div className="px-3 py-1 bg-[#6B72F0]/10 text-[#6B72F0] rounded-full text-[10px] font-bold uppercase">SGE Verified</div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Visibilidad por Modelo</p>
              <div className="space-y-4">
                {[
                  { name: 'ChatGPT', val: 85 },
                  { name: 'Gemini', val: 72 },
                  { name: 'Claude', val: 64 },
                  { name: 'Perplexity', val: 91 },
                ].map((m) => (
                  <div key={m.name} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-[#334155] uppercase">
                      <span>{m.name}</span>
                      <span>{m.val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-[#6B72F0] h-full rounded-full" style={{ width: `${m.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center bg-white p-6 rounded-2xl border border-gray-100">
               <ScoreGauge score={pillars.aiSeo?.readinessScore || 0} label="Readiness" size="lg" />
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">Semantic Clarity</p>
            </div>
          </div>
        </div>

        <div className="oracle-card p-8 rounded-[24px] bg-[#F8F9FB]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-extrabold text-[#1E293B] tracking-tight uppercase">Roadmap Estratégico</h3>
            <button onClick={() => onChangeView(ViewState.Roadmap)} className="btn-oracle flex items-center gap-2 text-[#6B72F0] text-xs font-bold hover:underline">
              Ir a ejecución <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {(data?.roadmap || []).slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white rounded-[20px] border border-gray-100 hover:shadow-sm transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">
                    {i + 1}
                  </div>
                  <span className="text-sm font-semibold text-[#334155]">{item.task}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                    item.impact === 'Alto' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {item.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
