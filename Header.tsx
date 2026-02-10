
import React from 'react';

interface Props {
  onReset: () => void;
  className?: string;
}

const Header: React.FC<Props> = ({ onReset, className }) => {
  return (
    <header className={`bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 sticky top-0 z-50 transition-all duration-300 ${className || ''}`}>
      <div className="container mx-auto px-4 max-w-6xl flex justify-between items-center">
        <div 
          onClick={(e) => {
            e.preventDefault();
            onReset();
          }}
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-serif font-bold tracking-tight text-slate-800 leading-none">
              NYAYA <span className="text-indigo-600">AI</span>
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Understand Before You Sign</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-700 border border-green-100 uppercase tracking-tight">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Private Session
          </span>
          <button 
            onClick={(e) => {
              e.preventDefault();
              onReset();
            }}
            className="group flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-all px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Start Fresh</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;