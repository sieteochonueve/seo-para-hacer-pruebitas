import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import SectionDetail from './views/SectionDetail';
import RoadmapView from './views/RoadmapView';
import CompetitiveView from './views/CompetitiveView';
import AISeoView from './views/AISeoView';
import { ViewState, AuditReport, AuditItem } from './types';
import { analyzeUrl } from './services/geminiService';
import { Shield, Search, Link2, Zap, Brain, Trophy, ClipboardList, Loader2, Globe, X, ExternalLink, ChevronRight, AlertTriangle, Lightbulb } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.Input);
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<AuditReport | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<AuditItem | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    setLoading(true);
    setError(null);
    setView(ViewState.Loading);

    try {
      const data = await analyzeUrl(urlInput);
      setAuditData(data);
      setView(ViewState.Dashboard);
    } catch (err: any) {
      console.error(err);
      setError('Error en el protocolo de análisis. Verifica la URL e intenta de nuevo.');
      setView(ViewState.Input);
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setAuditData(null);
    setUrlInput('');
    setView(ViewState.Input);
    setSelectedFinding(null);
  };

  const renderContent = () => {
    if (view === ViewState.Input) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-50/30 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

          <div className="w-full max-w-lg oracle-card p-12 bg-white/80 backdrop-blur-sm shadow-xl rounded-[32px] border border-slate-100">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-4 bg-[#6B72F0]/10 rounded-[24px] mb-6">
                  <Shield size={40} className="text-[#6B72F0]" />
              </div>
              <h1 className="text-4xl font-extrabold text-[#1E293B] tracking-tighter mb-4">
                SEO & Tech Oracle
              </h1>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Enterprise AI Analysis HUD</p>
            </div>
            
            <form onSubmit={handleAudit} className="space-y-6">
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="url"
                  required
                  placeholder="https://dominio-enterprise.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F8FA] border border-gray-100 focus:border-[#6B72F0] focus:ring-1 focus:ring-[#6B72F0] text-[#1E293B] text-sm font-bold outline-none transition-all"
                />
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-xs font-black rounded-xl border border-red-100 uppercase tracking-widest text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-oracle w-full bg-[#6B72F0] text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-100 disabled:opacity-50 text-sm uppercase tracking-widest"
              >
                Launch Oracle Analysis
              </button>
            </form>
            
            <div className="mt-12 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
               <span>SGE Optimization</span>
               <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
               <span>Tech Compliance</span>
               <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
               <span>AI Readiness</span>
            </div>
          </div>
        </div>
      );
    }

    if (view === ViewState.Loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
          <div className="relative mb-8">
            <Loader2 className="animate-spin text-[#6B72F0]" size={64} />
          </div>
          <h2 className="text-xl font-extrabold text-[#1E293B] tracking-tight uppercase">Oracle Analysis in Progress</h2>
          <p className="text-slate-400 mt-2 font-black text-[10px] uppercase tracking-widest">Parsing: {urlInput}</p>
          <div className="w-64 h-1.5 bg-gray-100 rounded-full mt-12 overflow-hidden border border-gray-100 shadow-inner">
            <div className="h-full bg-[#6B72F0] animate-progress"></div>
          </div>
        </div>
      );
    }

    if (!auditData) return null;

    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar currentView={view} onChangeView={setView} onReset={resetApp} />
        <main className="flex-1 p-8 overflow-y-auto h-screen bg-white">
          <div className="max-w-7xl mx-auto">
            {view === ViewState.Dashboard && <Dashboard data={auditData} onChangeView={setView} onSelectFinding={setSelectedFinding} />}
            {view === ViewState.Technical && auditData.pillars?.technical && <SectionDetail title="Technical Infrastructure" data={auditData.pillars.technical} icon={Shield} />}
            {view === ViewState.OnPage && auditData.pillars?.onPage && <SectionDetail title="On-Page Performance" data={auditData.pillars.onPage} icon={Search} />}
            {view === ViewState.OffPage && auditData.pillars?.offPage && <SectionDetail title="Off-Page Equity" data={auditData.pillars.offPage} icon={Link2} />}
            {view === ViewState.UX && auditData.pillars?.ux && <SectionDetail title="Experience & Conversions" data={auditData.pillars.ux} icon={Zap} />}
            {view === ViewState.AI && auditData.pillars?.aiSeo && <AISeoView data={auditData.pillars.aiSeo} />}
            {view === ViewState.Competitive && auditData.competitive && <CompetitiveView data={auditData.competitive} />}
            {view === ViewState.Roadmap && auditData.roadmap && <RoadmapView items={auditData.roadmap} />}
            {view === ViewState.IssuesMatrix && (
              <div className="view-transition pb-20">
                <header className="mb-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-extrabold text-[#1E293B] uppercase tracking-tighter">Issues Matrix</h2>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Full consolidated audit findings</p>
                  </div>
                  <button onClick={() => setView(ViewState.Dashboard)} className="btn-oracle text-[#6B72F0] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">
                    Back to Dashboard <ChevronRight size={14} />
                  </button>
                </header>
                <div className="grid gap-6">
                  {[
                    ...(auditData.summary?.criticalFindings || []),
                    ...(auditData.pillars?.technical?.subSections?.flatMap(s => s.items.filter(i => i.status !== 'passed')) || []),
                    ...(auditData.pillars?.onPage?.subSections?.flatMap(s => s.items.filter(i => i.status !== 'passed')) || []),
                    ...(auditData.pillars?.offPage?.subSections?.flatMap(s => s.items.filter(i => i.status !== 'passed')) || [])
                  ].map((item, idx) => (
                    <div key={idx} className="oracle-card p-6 flex flex-col gap-4 hover:border-blue-200 transition-all bg-slate-50/50">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            <AlertTriangle size={20} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.impact || 'System'} Finding</p>
                            <h4 className="text-sm font-black text-slate-800">{item.title}</h4>
                          </div>
                        </div>
                        <button onClick={() => setSelectedFinding(item)} className="btn-oracle px-6 py-2 bg-white border border-slate-200 text-[#6B72F0] rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">
                          Ver Solución
                        </button>
                      </div>

                      <div className="pt-4 border-t border-slate-100/50">
                         <div className="flex items-start gap-3 bg-white/60 p-4 rounded-2xl border border-slate-100">
                            <Lightbulb size={16} className="text-[#6B72F0] flex-shrink-0 mt-0.5" />
                            <div>
                               <p className="text-[9px] font-black text-[#6B72F0] uppercase tracking-widest mb-1">Oracle Pro-Tip</p>
                               <p className="text-xs text-slate-600 font-bold leading-relaxed">
                                  {item.proTip || `Prioriza la corrección de este hallazgo para mitigar el impacto negativo en el rastreo y mejorar la indexación semántica del sitio.`}
                               </p>
                            </div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Modal Overlay (Dashboard Finding Modal) */}
        {selectedFinding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end animate-fadeIn bg-slate-900/40 backdrop-blur-sm">
            <div className="h-full w-full max-w-lg bg-white shadow-2xl animate-slideInRight flex flex-col">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-xl font-extrabold text-[#1E293B] uppercase tracking-tighter">Fix Strategy</h3>
                  <p className="text-[10px] font-black text-[#6B72F0] uppercase tracking-[0.2em] mt-1">Resolution Protocol</p>
                </div>
                <button 
                  onClick={() => setSelectedFinding(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10">
                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Finding & Severity</h4>
                  <div className={`p-6 rounded-[24px] border ${selectedFinding.status === 'failed' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                    <h5 className="font-black text-lg mb-2">{selectedFinding.title}</h5>
                    <p className="text-sm leading-relaxed font-bold opacity-80">{selectedFinding.description}</p>
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Why it matters</h4>
                  <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 text-slate-700">
                    <p className="text-sm leading-relaxed font-bold">
                      {selectedFinding.whyItMatters || "Este hallazgo impacta directamente en la visibilidad orgánica y la experiencia del usuario final."}
                    </p>
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Step-by-Step Fix</h4>
                  <div className="space-y-3">
                    {(selectedFinding.fixSteps || [
                      "Analizar el impacto técnico inicial.",
                      "Implementar correcciones en el entorno de pruebas.",
                      "Verificar la resolución con Google Search Console.",
                      "Desplegar a producción."
                    ]).map((step, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl group hover:border-blue-200 transition-all shadow-sm">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black group-hover:bg-blue-600 group-hover:text-white transition-all">{i+1}</div>
                        <p className="text-xs text-slate-700 font-bold leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-8 border-t border-slate-100 bg-white">
                <a 
                  href={selectedFinding.docLink || "https://developers.google.com/search/docs"} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-oracle flex items-center justify-center gap-3 w-full bg-[#6B72F0] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100"
                >
                  <ExternalLink size={16} /> Documentation Guide
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
          .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
          .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes progress {
            0% { transform: translateX(-100%); width: 30%; }
            50% { transform: translateX(50%); width: 100%; }
            100% { transform: translateX(100%); width: 30%; }
          }
          .animate-progress { animation: progress 2s ease-in-out infinite; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .glow-neon { box-shadow: 0 0 15px rgba(107, 114, 240, 0.4); }
        `}</style>
      </div>
    );
  };

  return <div className="font-sans text-[#334155]">{renderContent()}</div>;
};

export default App;
