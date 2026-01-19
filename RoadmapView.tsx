import React from 'react';
import { RoadmapItem } from '../types';
import { Target, Clock, Zap, CheckCircle2 } from 'lucide-react';

interface RoadmapViewProps {
  items: RoadmapItem[];
}

const EffortBars = ({ level }: { level: 'Bajo' | 'Medio' | 'Alto' }) => {
  const count = level === 'Bajo' ? 1 : level === 'Medio' ? 2 : 3;
  return (
    <div className="flex justify-center gap-1">
      {[1, 2, 3].map(i => (
        <div 
          key={i} 
          className={`w-1 h-3 rounded-full border border-[#9F7AEA] transition-all duration-300 ${i <= count ? 'bg-[#9F7AEA]' : 'bg-transparent opacity-30'}`}
        />
      ))}
    </div>
  );
};

const RoadmapView: React.FC<RoadmapViewProps> = ({ items }) => {
  return (
    <div className="space-y-8 view-transition max-w-6xl mx-auto pb-12">
      <div className="oracle-card p-10 bg-[#6B72F0] text-white border-none shadow-xl shadow-blue-100">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2">Plan de Acción Estratégico</h2>
        <p className="text-blue-100 font-medium">Cronograma de ejecución prioritario para maximizar el ROI orgánico.</p>
      </div>

      <div className="oracle-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phase / Action</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Impact</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Effort</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Timeframe</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item, idx) => (
              <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                  <p className="font-bold text-sm text-[#333333] mb-1">{item.task}</p>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-md">{item.description}</p>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    item.impact === 'Alto' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {item.impact}
                  </span>
                </td>
                <td className="px-8 py-6 text-center">
                  <EffortBars level={item.effort} />
                </td>
                <td className="px-8 py-6 text-center">
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center justify-center gap-2">
                    <Clock size={12} className="text-gray-400" />
                    {item.timeframe}
                  </span>
                </td>
                <td className="px-8 py-6 text-center">
                  <div className="flex justify-center">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-white transition-colors">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-200"></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoadmapView;
