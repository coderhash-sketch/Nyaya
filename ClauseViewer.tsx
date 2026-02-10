
import React from 'react';
import { Clause, RiskLevel } from '../types';

interface Props {
  clauses: Clause[];
}

const ClauseViewer: React.FC<Props> = ({ clauses }) => {
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE: return 'bg-green-50 text-green-700 border-green-200';
      case RiskLevel.CAUTION: return 'bg-amber-50 text-amber-700 border-amber-200';
      case RiskLevel.DANGER: return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE: return (
        <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
      );
      case RiskLevel.CAUTION: return (
        <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      );
      case RiskLevel.DANGER: return (
        <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      );
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
          <h3 className="text-3xl font-serif font-bold text-slate-800 mb-2">Clause Analysis</h3>
          <p className="text-slate-500 font-medium">Deep diving into your document's architecture.</p>
        </div>
      </div>

      <div className="space-y-12">
        {clauses.map((clause, index) => (
          <div 
            key={clause.id} 
            className="group grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Left side: Original text */}
            <div className="p-10 bg-slate-50/40 border-b lg:border-b-0 lg:border-r border-slate-200 transition-colors group-hover:bg-slate-50/80">
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clause Reference: {clause.id}</span>
                </div>
                <div className={`flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getRiskColor(clause.riskLevel)}`}>
                  {getRiskIcon(clause.riskLevel)} {clause.riskLevel}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-0 w-1 h-full bg-slate-200 rounded-full opacity-30"></div>
                <p className="text-sm font-mono text-slate-500 leading-relaxed whitespace-pre-wrap selection:bg-indigo-100 selection:text-indigo-900">
                  {clause.originalText}
                </p>
              </div>
            </div>

            {/* Right side: Simple explanation */}
            <div className="p-10 flex flex-col justify-center bg-white relative">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 block mb-6">NYAYA Translation</span>
              <p className="text-slate-800 text-xl font-serif font-medium leading-relaxed mb-10 selection:bg-indigo-100 selection:text-indigo-900">
                {clause.simpleExplanation}
              </p>
              
              <div className="space-y-8 pt-8 border-t border-slate-100">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1 h-full bg-slate-200/50"></div>
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Neural Justification</h5>
                  <p className="text-sm text-slate-600 font-medium italic leading-relaxed">"{clause.riskJustification}"</p>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  {clause.obligations.length > 0 && (
                    <div>
                      <h5 className="text-[11px] font-black text-red-500 uppercase tracking-widest mb-4 flex items-center">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                        OBLIGATIONS
                      </h5>
                      <ul className="text-xs space-y-2.5 text-slate-600 font-medium">
                        {clause.obligations.map((o, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-red-300 mr-2 flex-shrink-0">•</span>
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {clause.rights.length > 0 && (
                    <div>
                      <h5 className="text-[11px] font-black text-green-600 uppercase tracking-widest mb-4 flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                        RIGHTS
                      </h5>
                      <ul className="text-xs space-y-2.5 text-slate-600 font-medium">
                        {clause.rights.map((r, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-300 mr-2 flex-shrink-0">+</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClauseViewer;
