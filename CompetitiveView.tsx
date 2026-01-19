import React from 'react';
import { CompetitiveAnalysis } from '../types';
import { Target, TrendingUp, Search, Layers, CheckCircle2, ShieldAlert, BarChart3, MinusCircle } from 'lucide-react';

interface CompetitiveViewProps {
  data: CompetitiveAnalysis;
}

const CompetitiveView: React.FC<CompetitiveViewProps> = ({ data }) => {
  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto view-transition pb-20">
      <div className="oracle-card p-10 rounded-[24px] border-l-4 border-l-[#9F7AEA] bg-white shadow-sm">
        <h2 className="text-3xl font-extrabold text-[#1E293B] uppercase mb-2 tracking-tighter">Market Intel HUB</h2>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#9F7AEA] animate-pulse"></div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Competitive Analysis & Benchmark Mode</p>
        </div>
      </div>

      {/* Keyword Gap Matrix */}
      <div className="oracle-card p-8 rounded-[24px] bg-white border border-slate-100 shadow-sm">
          <h3 className="flex items-center gap-3 font-black text-[11px] text-[#9F7AEA] mb-8 uppercase tracking-[0.3em] pb-4 border-b border-slate-50">
              <BarChart3 className="text-[#9F7AEA]" size={18} /> Keyword Gap Matrix
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.competitors.map((comp, idx) => (
                  <div key={idx} className="p-6 bg-slate-50/50 rounded-[20px] border border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-black text-[#1E293B] uppercase">{comp.name}</span>
                          <span className="text-[9px] font-black bg-[#9F7AEA]/10 text-[#9F7AEA] px-2 py-0.5 rounded-full">DA: {comp.da}</span>
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <MinusCircle size={12} className="text-rose-400" /> Oportunidades Perdidas
                      </p>
                      <div className="space-y-2">
                          {(comp.missedKeywords || ['SEO Técnico', 'Auditoría Enterprise', 'Core Web Vitals Fix', 'Content Strategy', 'Link Building']).slice(0, 5).map((kw, kIdx) => (
                              <div key={kIdx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 group hover:border-[#9F7AEA]/30 transition-all cursor-default">
                                  <span className="text-xs font-bold text-slate-600 group-hover:text-[#1E293B] transition-colors">{kw}</span>
                                  <span className="text-[10px] font-black text-[#9F7AEA] opacity-0 group-hover:opacity-100 transition-opacity">TOP 10</span>
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Competitors List */}
        <div className="oracle-card p-8 rounded-[24px] bg-[#EEF2FF] border border-[#E0E7FF]">
            <h3 className="flex items-center gap-3 font-black text-[10px] text-[#4338CA] mb-8 uppercase tracking-[0.3em] pb-4 border-b border-[#C7D2FE]">
                <Target className="text-indigo-600" size={18} /> Market Competitors Detected
            </h3>
            <div className="grid grid-cols-1 gap-4">
                {data.competitors.map((comp, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-[20px] border border-indigo-100 group hover:border-indigo-300 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4 mb-3">
                            <span className="w-8 h-8 flex items-center justify-center bg-indigo-50 text-indigo-600 text-[10px] font-black border border-indigo-200 rounded-lg">{String(idx + 1).padStart(2, '0')}</span>
                            <span className="text-sm text-[#1E293B] uppercase tracking-wider font-extrabold">{comp.name}</span>
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-[9px] font-black text-indigo-600 border border-indigo-200 px-2 py-0.5 rounded-full bg-indigo-50">DA: {comp.da}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-indigo-50">
                            <div>
                                <p className="text-[8px] font-black text-emerald-600 uppercase mb-1">Fortalezas</p>
                                <p className="text-[10px] text-slate-600 font-bold leading-tight">{comp.strengths}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-rose-600 uppercase mb-1">Debilidades</p>
                                <p className="text-[10px] text-slate-600 font-bold leading-tight">{comp.weaknesses}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Strategies */}
        <div className="oracle-card p-8 rounded-[24px] bg-[#F5F3FF] border border-[#EDE9FE]">
            <h3 className="flex items-center gap-3 font-black text-[10px] text-[#6D28D9] mb-8 uppercase tracking-[0.3em] pb-4 border-b border-[#DDD6FE]">
                <TrendingUp className="text-violet-600" size={18} /> Replicable Growth Protocols
            </h3>
            <div className="space-y-4">
                {data.strategies.map((strat, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-5 bg-white border border-violet-100 rounded-[20px] hover:border-violet-300 hover:shadow-sm transition-all group">
                        <CheckCircle2 className="text-violet-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" size={16} />
                        <p className="text-xs text-slate-700 leading-relaxed font-bold">{strat}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Keywords Tag Cloud */}
        <div className="oracle-card p-8 rounded-[24px] border border-gray-100 lg:col-span-1 bg-white">
            <h3 className="flex items-center gap-3 font-black text-[10px] text-slate-500 mb-8 uppercase tracking-[0.3em] pb-4 border-b border-gray-100">
                <Search className="text-blue-500" size={18} /> Strategic High-Volume Keywords
            </h3>
            <div className="flex flex-wrap gap-3">
                {data.sharedKeywords.map((kw, idx) => (
                    <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 cursor-default transition-all shadow-sm">
                        {kw}
                    </span>
                ))}
            </div>
        </div>

        {/* Content Gaps */}
        <div className="oracle-card p-8 rounded-[24px] border border-gray-100 lg:col-span-1 bg-white">
            <h3 className="flex items-center gap-3 font-black text-[10px] text-slate-500 mb-8 uppercase tracking-[0.3em] pb-4 border-b border-gray-100">
                <Layers className="text-amber-500" size={18} /> Critical Content Matrix Gaps
            </h3>
            <div className="space-y-4">
                {data.contentGaps.map((gap, idx) => (
                    <div key={idx} className="text-[11px] p-5 bg-amber-50/50 border border-amber-100 rounded-[20px] text-slate-700 leading-relaxed relative overflow-hidden group hover:border-amber-300 hover:bg-amber-50 transition-all font-bold">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        {gap}
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default CompetitiveView;