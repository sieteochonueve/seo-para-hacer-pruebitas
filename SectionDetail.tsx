import React, { useState, useMemo, useRef } from 'react';
import { PillarData, AuditItem } from '../types';
import { 
  CheckCircle, AlertCircle, XCircle, ChevronDown, ChevronUp, 
  Zap, HelpCircle, Rocket, Filter, AlertTriangle, Info,
  Search, ArrowRight, ScatterChart as ScatterIcon, X, ExternalLink, Sparkles, Copy
} from 'lucide-react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  ReferenceArea 
} from 'recharts';

interface SectionDetailProps {
  title: string;
  data: PillarData;
  icon: React.ElementType;
}

const mapValue = (v: string | undefined) => {
  switch (v) {
    case 'Low': return 1;
    case 'Medium': return 2;
    case 'High': return 3;
    default: return 1;
  }
};

const getStatusColor = (status: AuditItem['status']) => {
  switch (status) {
    case 'passed': return '#10B981';
    case 'warning': return '#F59E0B';
    case 'failed': return '#EF4444';
    default: return '#6B72F0';
  }
};

const StatusIcon = ({ status }: { status: AuditItem['status'] }) => {
  switch (status) {
    case 'passed': return <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><CheckCircle size={14} /></div>;
    case 'warning': return <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><AlertCircle size={14} /></div>;
    case 'failed': return <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600"><XCircle size={14} /></div>;
  }
};

const SectionDetail: React.FC<SectionDetailProps> = ({ title, data, icon: Icon }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<'all' | 'failed' | 'warning' | 'passed' | 'quick-win'>('all');
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);
  const [sidePanelItem, setSidePanelItem] = useState<AuditItem | null>(null);
  
  const allItems = useMemo(() => {
    return data.subSections.flatMap((s, sIdx) => 
      s.items.map((item, iIdx) => ({
        ...item,
        id: `item-${sIdx}-${iIdx}`,
        effortVal: mapValue(item.effort),
        impactVal: mapValue(item.impact)
      }))
    );
  }, [data]);

  const filteredItems = useMemo(() => {
    switch (filter) {
      case 'failed': return allItems.filter(i => i.status === 'failed');
      case 'warning': return allItems.filter(i => i.status === 'warning');
      case 'passed': return allItems.filter(i => i.status === 'passed');
      case 'quick-win': return allItems.filter(i => i.impact === 'High' && i.effort === 'Low');
      default: return allItems;
    }
  }, [filter, allItems]);

  const counts = useMemo(() => ({
    all: allItems.length,
    failed: allItems.filter(i => i.status === 'failed').length,
    warning: allItems.filter(i => i.status === 'warning').length,
    passed: allItems.filter(i => i.status === 'passed').length,
    quickWins: allItems.filter(i => i.impact === 'High' && i.effort === 'Low').length
  }), [allItems]);

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const scrollToItem = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setExpanded(prev => ({ ...prev, [id]: true }));
    }
  };

  const copyAIPrompt = (item: AuditItem) => {
    const prompt = `I am getting an SEO error regarding "${item.title}". My website is built on [User Input CMS/Framework]. Please provide the exact code or steps to fix this. Context: ${item.description}`;
    navigator.clipboard.writeText(prompt);
    alert('AI Prompt copied to clipboard!');
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xl z-[1000] min-w-[150px]">
          <p className="text-xs font-black text-slate-800 mb-2">{item.title}</p>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-slate-400">
                <span>Impacto:</span>
                <span className="text-indigo-600">{item.impact}</span>
            </div>
            <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-slate-400">
                <span>Esfuerzo:</span>
                <span className="text-amber-600">{item.effort}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 view-transition max-w-6xl mx-auto pb-24 relative">
      {/* Header Panel */}
      <div className="oracle-card p-10 flex flex-col md:flex-row items-center justify-between border-b-4 border-b-[#6B72F0] gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#6B72F0]/10 text-[#6B72F0] rounded-[24px] flex items-center justify-center">
            <Icon size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-[#1E293B] tracking-tighter uppercase">{title}</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Enterprise Audit Framework • Phase 2.1</p>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <div className="text-right">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Compliance</p>
             <p className="text-4xl font-black text-[#1E293B] leading-none">{data.score}%</p>
          </div>
        </div>
      </div>

      {/* Strategic Priority Matrix */}
      <div className="oracle-card p-8 bg-white relative overflow-hidden shadow-sm group/matrix">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover/matrix:opacity-10 transition-opacity">
          <ScatterIcon size={120} className="text-[#6B72F0]" />
        </div>
        
        {/* Corner Labels */}
        <div className="absolute top-16 left-16 pointer-events-none text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Quick Wins</div>
        <div className="absolute top-16 right-16 pointer-events-none text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Major Projects</div>
        <div className="absolute bottom-16 left-16 pointer-events-none text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Fill-ins</div>
        <div className="absolute bottom-16 right-16 pointer-events-none text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Thankless Tasks</div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em] flex items-center gap-3">
              <Zap size={16} className="text-amber-500" />
              Strategic Priority Matrix
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Effort vs Impact Mapping</p>
          </div>
          <div className="flex gap-4">
             {['failed', 'warning', 'passed'].map((st) => (
                <div key={st} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: getStatusColor(st as any) }}></div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{st}</span>
                </div>
             ))}
          </div>
        </div>

        <div className="h-80 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" opacity={0.1} />
              <XAxis 
                type="number" 
                dataKey="effortVal" 
                name="Esfuerzo" 
                domain={[0.5, 3.5]} 
                ticks={[1, 2, 3]}
                tickFormatter={(v) => v === 1 ? 'BAJO' : v === 2 ? 'MEDIO' : 'ALTO'}
                fontSize={9}
                fontWeight={800}
                stroke="#E2E8F0"
              />
              <YAxis 
                type="number" 
                dataKey="impactVal" 
                name="Impacto" 
                domain={[0.5, 3.5]} 
                ticks={[1, 2, 3]}
                tickFormatter={(v) => v === 1 ? 'BAJO' : v === 2 ? 'MEDIO' : 'ALTO'}
                fontSize={9}
                fontWeight={800}
                stroke="#E2E8F0"
              />
              <ZAxis type="number" range={[150, 600]} />
              <ReferenceArea x1={0.5} x2={1.5} y1={2.5} y2={3.5} fill="#6B72F0" fillOpacity={0.03} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#CBD5E1' }} />
              <Scatter 
                data={allItems} 
                onClick={(e) => scrollToItem(e.id)} 
                onMouseEnter={(e) => setHoveredDot(e.id)}
                onMouseLeave={() => setHoveredDot(null)}
                className="cursor-pointer"
              >
                {allItems.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getStatusColor(entry.status)} 
                    strokeWidth={hoveredDot === entry.id ? 4 : 2}
                    stroke={hoveredDot === entry.id ? '#1E293B' : 'transparent'}
                    className={`transition-all duration-300 ${hoveredDot === entry.id ? 'scale-150 shadow-lg' : ''}`}
                    style={{ 
                        filter: entry.impact === 'High' && entry.effort === 'Low' ? 'drop-shadow(0 0 8px rgba(107, 114, 240, 0.4))' : 'none',
                        pointerEvents: 'auto'
                    }}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Smart Sticky Filter Bar */}
      <div className="sticky top-0 z-20 py-4 bg-white/90 backdrop-blur-md -mx-4 px-4 border-b border-slate-50">
        <div className="oracle-card p-2 rounded-full flex items-center justify-between gap-2 shadow-sm border-slate-100 bg-white">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setFilter('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                filter === 'all' ? 'bg-[#1E293B] text-white shadow-md' : 'text-slate-400 hover:bg-slate-100'
              }`}
            >
              <Filter size={14} /> All ({counts.all})
            </button>
            <button 
              onClick={() => setFilter('failed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                filter === 'failed' ? 'bg-red-500 text-white shadow-md' : 'text-red-500/60 hover:bg-red-50'
              }`}
            >
              <XCircle size={14} /> Críticos ({counts.failed})
            </button>
            <button 
              onClick={() => setFilter('warning')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                filter === 'warning' ? 'bg-amber-500 text-white shadow-md' : 'text-amber-500/60 hover:bg-amber-50'
              }`}
            >
              <AlertTriangle size={14} /> Avisos ({counts.warning})
            </button>
            <button 
              onClick={() => setFilter('passed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                filter === 'passed' ? 'bg-emerald-500 text-white shadow-md' : 'text-emerald-500/60 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle size={14} /> Aprobados ({counts.passed})
            </button>
          </div>
          <button 
            onClick={() => setFilter('quick-win')}
            className={`btn-oracle flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all mr-1 ${
              filter === 'quick-win' ? 'bg-[#6B72F0] text-white shadow-md glow-neon' : 'bg-[#6B72F0]/10 text-[#6B72F0] hover:bg-[#6B72F0]/20'
            }`}
          >
            <Rocket size={14} /> Quick Wins ({counts.quickWins})
          </button>
        </div>
      </div>

      {/* Audit Item List */}
      <div className="space-y-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isOpen = expanded[item.id!];
            const isDotHovered = hoveredDot === item.id;
            return (
              <div 
                key={item.id} 
                id={item.id}
                className={`oracle-card overflow-hidden transition-all duration-500 ${
                  isOpen ? 'ring-2 ring-[#6B72F0]/20 bg-white' : ''
                } ${isDotHovered ? 'border-[#6B72F0] shadow-lg shadow-blue-50 ring-1 ring-blue-100' : ''}`}
              >
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer group"
                  onClick={() => toggle(item.id!)}
                >
                  <div className="flex items-center gap-4">
                    <StatusIcon status={item.status} />
                    <div>
                       <span className="font-black text-sm text-[#1E293B] group-hover:text-[#6B72F0] transition-colors">{item.title}</span>
                       <div className="flex gap-2 mt-1">
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{item.effort} Effort</span>
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">•</span>
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{item.impact} Impact</span>
                       </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {item.impact === 'High' && item.effort === 'Low' && (
                      <span className="px-2 py-1 bg-blue-50 text-[#6B72F0] rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Rocket size={10} /> Quick Win
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                      item.impact === 'High' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.impact}
                    </span>
                    {isOpen ? <ChevronUp size={18} className="text-[#6B72F0]" /> : <ChevronDown size={18} className="text-gray-400 group-hover:text-slate-600" />}
                  </div>
                </div>
                
                {isOpen && (
                  <div className="px-16 pb-8 bg-slate-50/30 animate-fadeIn">
                    <div className="pt-4 space-y-4 border-t border-gray-100">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <Info size={12} /> Observation
                          </p>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.description}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                          <p className="text-[10px] font-black text-[#6B72F0] uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Zap size={14} /> Optimization Protocol
                          </p>
                          <p className="text-sm text-[#1E293B] font-bold leading-relaxed">{item.recommendation}</p>
                        </div>
                      </div>
                      
                      {item.proTip && (
                        <div className="flex items-start gap-4 bg-[#1E293B]/5 p-5 rounded-[20px] border border-[#1E293B]/10">
                          <div className="w-8 h-8 rounded-xl bg-[#1E293B] flex items-center justify-center text-white shrink-0">
                             <HelpCircle size={16} />
                          </div>
                          <p className="text-xs text-slate-700 italic leading-relaxed font-bold">
                             <span className="text-[#1E293B] uppercase tracking-widest mr-2">Oracle Perspective:</span> 
                             {item.proTip}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex justify-end pt-4">
                         <button 
                            onClick={() => setSidePanelItem(item)}
                            className="btn-oracle px-6 py-2 bg-[#6B72F0] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2"
                         >
                            Fix Solution Details <ArrowRight size={14} />
                         </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="oracle-card p-20 flex flex-col items-center justify-center text-center bg-slate-50/30">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <Search size={32} />
             </div>
             <h4 className="text-lg font-black text-slate-400 uppercase tracking-widest">No match detected</h4>
             <p className="text-sm text-slate-400 mt-2">Adjust your filters to scan other areas of the audit.</p>
          </div>
        )}
      </div>

      {/* Side-Panel Slide Over */}
      {sidePanelItem && (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"
                onClick={() => setSidePanelItem(null)}
            />
            <div className="relative w-full max-w-xl bg-white shadow-2xl h-full animate-slideInRight flex flex-col">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-extrabold text-[#1E293B] uppercase tracking-tighter">Solution Panel</h3>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                sidePanelItem.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                                {sidePanelItem.status}
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-[#6B72F0] uppercase tracking-[0.2em]">Deployment Readiness Guide</p>
                    </div>
                    <button onClick={() => setSidePanelItem(null)} className="p-2 hover:bg-slate-200 rounded-full transition-all">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-12">
                    <section>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Issue Definition</h4>
                        <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-100">
                            <p className="text-sm font-black text-[#1E293B] mb-2">{sidePanelItem.title}</p>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{sidePanelItem.description}</p>
                        </div>
                    </section>

                    <section>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                           <Zap size={14} className="text-amber-500" /> Optimization Protocol
                        </h4>
                        <div className="space-y-4">
                            {(sidePanelItem.fixSteps || [
                                "1. Access your site's configuration/hosting panel.",
                                "2. Locate the specific file or meta-tag setting.",
                                "3. Update the values according to best practices.",
                                "4. Clear server-side cache and verify with GSC."
                            ]).map((step, i) => (
                                <div key={i} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl group hover:border-blue-200 transition-all shadow-sm">
                                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black group-hover:bg-[#6B72F0] group-hover:text-white transition-all">{i + 1}</div>
                                    <p className="text-xs text-slate-700 font-bold leading-relaxed">{step}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="p-8 rounded-[32px] bg-[#6B72F0] text-white relative overflow-hidden group">
                            <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                                <Sparkles size={100} />
                            </div>
                            <h4 className="text-lg font-black mb-2 uppercase tracking-tight">AI Toolbox</h4>
                            <p className="text-xs text-blue-100 mb-6 font-medium leading-relaxed">¿Necesitas código específico? Genera el prompt para tu asistente de IA.</p>
                            <button 
                                onClick={() => copyAIPrompt(sidePanelItem)}
                                className="w-full flex items-center justify-center gap-3 bg-white text-[#6B72F0] py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95"
                            >
                                <Copy size={16} /> Generar código con IA
                            </button>
                        </div>
                    </section>
                </div>

                <div className="p-8 border-t border-slate-100 bg-white">
                    <a 
                        href={sidePanelItem.docLink || "https://developers.google.com/search/docs"} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn-oracle flex items-center justify-center gap-3 w-full border-2 border-slate-100 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:text-[#6B72F0] hover:border-[#6B72F0]"
                    >
                        <ExternalLink size={16} /> Ver documentación oficial
                    </a>
                </div>
            </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInRight { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glow-neon { box-shadow: 0 0 15px rgba(107, 114, 240, 0.4); }
      `}</style>
    </div>
  );
};

export default SectionDetail;
