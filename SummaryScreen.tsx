
import React from 'react';
import { DocumentSummary } from '../types';

interface Props {
  summary: DocumentSummary;
}

const SummaryScreen: React.FC<Props> = ({ summary }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-serif font-bold text-slate-800 mb-4">Executive Summary</h3>
        <p className="text-slate-600 leading-relaxed text-lg italic border-l-4 border-indigo-200 pl-6 mb-8">
          "{summary.overview}"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold">!</div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wide">Primary Risks</h4>
            </div>
            <ul className="space-y-3">
              {summary.keyRisks.map((risk, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-slate-600 text-sm">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">→</div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wide">Suggested Actions</h4>
            </div>
            <ul className="space-y-3">
              {summary.suggestedActions.map((action, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-slate-600 text-sm">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {summary.criticalClauses && summary.criticalClauses.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Critical Clauses to Re-read
            </h4>
            <div className="flex flex-wrap gap-2">
              {summary.criticalClauses.map((clauseId, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                  {clauseId}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center no-print">
        <button 
          onClick={() => window.print()}
          className="flex items-center space-x-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Save/Print Smart Summary</span>
        </button>
      </div>
    </div>
  );
};

export default SummaryScreen;