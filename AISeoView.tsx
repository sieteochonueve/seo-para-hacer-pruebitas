import React from 'react';
import { AIPillarData } from '../types';
import { Cpu, TrendingUp, TrendingDown, Minus, ShieldCheck, Zap, Bot, Search } from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

interface AISeoViewProps {
  data: AIPillarData;
}

const AISeoView: React.FC<AISeoViewProps> = ({ data }) => {
  const comparison = data.comparison || { currentMonth: 0, lastMonth: 0, trend: 'stable' };
  const visibilityMetrics = data.visibilityMetrics || [];
  const readinessScore = data.readinessScore ?? data.score ?? 0;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto view-transition">
      {/* Header HUD */}
      <div className="oracle-card p-10 rounded-[24px] border-l-4 border-l-[#6B72F0] relative overflow-hidden bg-white shadow-sm">
        <div className="absolute top-[-20%] right-[-10%] opacity-5 pointer-events-none">
            <Cpu size={300} className="text-[#6B72F0]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                    <Bot className="text-[#6B72F0]" size={24} />
                    <span className="text-[10px] tracking-[0.4em] font-black text-[#6B72F0] uppercase">SGE / LLM Cognition Profile</span>
                </div>
                <h2 className="text-4xl font-extrabold text-[#1E293B] uppercase mb-4 tracking-tighter">AI Search Optimization</h2>
                <p className="text-slate-600 max-w-xl text-sm leading-relaxed font-medium">
                    Análisis de visibilidad en Large Language Models y capacidad de citación en motores de búsqueda generativa (Search Generative Experience).
                </p>
            </div>
            <div className="flex items-center gap-12 bg-[#F5F3FF] p-8 rounded-[24px] border border-[#DDD6FE] shadow-inner">
                <ScoreGauge score={readinessScore} label="Readiness Index" size="lg" />
                <div className="flex flex-col gap-4 border-l border-[#DDD6FE] pl-10">
                    <div className="text-center">
                        <span className="text-[10px] font-black text-[#6D28D9] block uppercase mb-1">MoM Comparison</span>
                        <div className="flex items-center gap-2 justify-center">
                            {comparison.trend === 'up' ? <TrendingUp size={20} className="text-emerald-600" /> : 
                             comparison.trend === 'down' ? <TrendingDown size={20} className="text-rose-600" /> : 
                             <Minus size={20} className="text-amber-500" />}
                            <span className={`text-2xl font-black ${comparison.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {comparison.trend === 'up' ? '+' : ''}{comparison.currentMonth - comparison.lastMonth}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Model Visibility Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibilityMetrics.map((model, idx) => (
          <div key={idx} className="oracle-card p-6 rounded-[24px] border border-gray-100 group hover:border-[#6B72F0]/30 transition-all bg-[#F8F9FB]">
            <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-[#6B72F0] uppercase tracking-widest">{model.model}</span>
                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    model.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 
                    'bg-amber-50 text-amber-600 border border-amber-200'
                }`}>
                    {model.sentiment}
                </div>
            </div>
            <div className="flex flex-col items-center mb-6">
                <div className="text-4xl font-black text-[#1E293B] mb-1">{model.visibility}%</div>
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Visibility Index</span>
            </div>
            <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Citation Level:</span>
                    <span className="text-[9px] text-[#1E293B] font-black uppercase tracking-widest">{model.mentions}</span>
                </div>
                <div className="mt-3 w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#6B72F0] h-full" style={{ width: `${model.visibility}%` }}></div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tactics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="oracle-card p-8 rounded-[24px] border-t-4 border-t-emerald-400 bg-white">
            <h3 className="text-xs font-black text-emerald-600 mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                <ShieldCheck size={18} />
                AI Optimization Parameters
            </h3>
            <div className="space-y-6">
                {data.subSections?.[0]?.items?.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="p-5 bg-[#F0FDF4] border border-[#DCFCE7] rounded-[20px] transition-all hover:shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.title}</span>
                            <span className={`text-[9px] font-black border px-2 py-0.5 rounded uppercase ${item.status === 'passed' ? 'text-emerald-600 border-emerald-200' : 'text-amber-600 border-amber-200'}`}>
                              {item.status === 'passed' ? 'Passed' : 'Review'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.description}</p>
                    </div>
                )) || <p className="text-slate-500 text-xs uppercase text-center py-10 font-bold">No optimization parameters detected.</p>}
            </div>
        </div>

        <div className="oracle-card p-8 rounded-[24px] border-t-4 border-t-amber-400 bg-white">
            <h3 className="text-xs font-black text-amber-600 mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                <Zap size={18} />
                Critical AI Gap Analysis
            </h3>
            <div className="space-y-4">
                {data.subSections?.[1]?.items?.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="p-5 bg-[#FFFBEB] border border-[#FEF3C7] rounded-[20px] flex items-start gap-4 transition-all hover:shadow-sm">
                        <span className="text-amber-600 font-black text-xs mt-0.5">[!]</span>
                        <div>
                            <span className="text-[10px] font-black text-slate-800 block mb-2 uppercase tracking-widest">{item.title}</span>
                            <p className="text-xs text-slate-600 font-medium mb-4 leading-relaxed">{item.description}</p>
                            {item.proTip && (
                                <div className="text-[9px] text-amber-700 font-black bg-amber-100/50 p-2 rounded-lg border border-amber-200 flex items-center gap-2">
                                    <Search size={10} /> PRO-TIP: {item.proTip}
                                </div>
                            )}
                        </div>
                    </div>
                )) || <p className="text-slate-500 text-xs uppercase text-center py-10 font-bold">No gaps detected.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AISeoView;
