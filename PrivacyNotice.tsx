
import React, { useState } from 'react';

interface Props {
  className?: string;
}

const PrivacyNotice: React.FC<Props> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 left-6 right-6 md:left-auto md:w-80 bg-slate-900 text-white p-5 rounded-2xl shadow-2xl z-[60] animate-in slide-in-from-left-4 duration-500 ${className || ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.9L10 1.154l7.834 3.746v5.203c0 5.06-3.357 9.511-7.834 10.748-4.477-1.237-7.834-5.688-7.834-10.748V4.9zM10 5a1 1 0 011 1v3a1 1 0 11-2 0V6a1 1 0 011-1zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Privacy Guarantee</span>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed mb-4">
        Your document stays yours. We do not store, save, or train on your files. Data is processed temporarily and discarded instantly.
      </p>
      <div className="flex items-center text-[10px] font-bold text-slate-500 space-x-3 uppercase">
        <span className="flex items-center">
          <span className="w-1 h-1 bg-green-500 rounded-full mr-1"></span> No Cookies
        </span>
        <span className="flex items-center">
          <span className="w-1 h-1 bg-green-500 rounded-full mr-1"></span> No Accounts
        </span>
        <span className="flex items-center">
          <span className="w-1 h-1 bg-green-500 rounded-full mr-1"></span> SSL Encrypted
        </span>
      </div>
    </div>
  );
};

export default PrivacyNotice;