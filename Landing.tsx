
import React, { useRef, useState, useEffect } from 'react';
import { DocumentSource } from '../types';

interface Props {
  onUpload: (source: DocumentSource) => void;
  isAnalyzing: boolean;
}

const Landing: React.FC<Props> = ({ onUpload, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    "Securely uploading binary data...",
    "Scanning for legal structure...",
    "Gemini is translating clauses...",
    "Applying grounding protocols...",
    "Almost there, finalizing JSON...",
    "Verifying verbatim quotes..."
  ];

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Please use a file smaller than 8MB for a faster response.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const parts = base64String.split(',');
      if (parts.length >= 2) {
        onUpload({
          data: parts[1],
          mimeType: file.type || 'application/pdf'
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    if (isAnalyzing) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="py-12 md:py-24 flex flex-col items-center text-center relative overflow-hidden min-h-[80vh] justify-center">
      {/* Background Animated Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-10 pointer-events-none opacity-40">
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="mb-6 px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest rounded-full inline-block border border-indigo-100 shadow-sm">
          Privacy-First Legal Translation
        </div>
        
        <h2 className="text-4xl md:text-7xl font-serif font-bold text-slate-900 mb-8 max-w-4xl leading-[1.1]">
          Legal documents aren’t written for people. <br/>
          <span className="italic text-indigo-600 relative inline-block">
            We change that.
            <svg className="absolute -bottom-2 left-0 w-full h-2 text-indigo-200" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </span>
        </h2>
        
        <p className="text-lg md:text-2xl text-slate-500 mb-16 max-w-3xl leading-relaxed mx-auto px-4">
          NYAYA AI translates complex contracts into human language, flags hidden risks, and empowers you to understand before you sign. 
        </p>
      </div>

      <div className="w-full max-w-2xl relative z-10 px-4">
        {isAnalyzing ? (
          <div className="bg-white p-12 rounded-[3rem] border-2 border-indigo-100 shadow-2xl shadow-indigo-100 flex flex-col items-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-scan shadow-[0_0_15px_rgba(79,70,229,0.5)] z-20"></div>
            
            <div className="relative mb-8">
              <div className="w-24 h-24 border-4 border-indigo-50 rounded-[2.5rem] flex items-center justify-center bg-indigo-50/30">
                <svg className="w-12 h-12 text-indigo-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-2 font-serif transition-all duration-500">
              {loadingMessages[loadingMessageIndex]}
            </h3>
            <p className="text-slate-500 italic max-w-sm font-medium">NYAYA is active. Do not close this tab.</p>
            
            <div className="mt-10 flex gap-3">
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
            </div>
          </div>
        ) : (
          <div 
            onClick={triggerUpload}
            className="group relative bg-white p-12 md:p-16 rounded-[3rem] border-2 border-dashed border-slate-200 hover:border-indigo-400 cursor-pointer transition-all duration-700 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 overflow-hidden shadow-sm"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="application/pdf,text/plain"
            />
            
            <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none" style={{backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 mb-8 shadow-inner ring-4 ring-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 transition-transform duration-700 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 font-serif">Select Legal Document</h3>
              <p className="text-slate-500 mb-10 text-lg font-medium">PDF or TXT supported</p>
              
              <div className="relative group/btn">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl blur opacity-20 group-hover/btn:opacity-60 transition duration-1000 group-hover/btn:duration-200"></div>
                <div className="relative bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all flex items-center space-x-3">
                  <span>Start Secure Analysis</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Landing;
