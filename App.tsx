
import React, { useState } from 'react';
import { AnalysisResult, ChatMessage, DocumentSource } from './types';
import { analyzeDocument, chatWithDocument } from './services/geminiService';

// Components
import Header from './components/Header';
import Landing from './components/Landing';
import ClauseViewer from './components/ClauseViewer';
import ChatInterface from './components/ChatInterface';
import SummaryScreen from './components/SummaryScreen';
import PrivacyNotice from './components/PrivacyNotice';
import Modal from './components/Modal';

const App: React.FC = () => {
  const [docSource, setDocSource] = useState<DocumentSource | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [view, setView] = useState<'landing' | 'analysis' | 'chat' | 'summary'>('landing');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);

  const openModal = (title: string, content: React.ReactNode) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFileUpload = async (source: DocumentSource) => {
    setDocSource(source);
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeDocument(source);
      setAnalysis(result);
      setView('analysis');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during processing.");
      setView('landing');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChatRequest = async (question: string) => {
    if (!docSource) return "No document context available.";
    
    const history = chatHistory.map(m => ({ 
      role: m.role, 
      content: m.content 
    }));
    
    return await chatWithDocument(docSource, history, question);
  };

  const resetApp = () => {
    setDocSource(null);
    setIsAnalyzing(false);
    setAnalysis(null);
    setView('landing');
    setChatHistory([]);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const privacyContent = (
    <p className="text-slate-600 leading-relaxed text-lg">
      Your document stays yours. Always. We do not store, save, or train our AI on your files. 
      All data is processed securely in memory and is permanently discarded the moment you close your browser tab. 
      Your privacy is not a feature; it is our foundation.
    </p>
  );

  const comingSoonContent = (
    <p className="text-slate-600 leading-relaxed text-lg">
      Thank you for your interest! This informational page is currently under development and will be available soon. 
      We are working hard to provide transparent and detailed documentation about our processes.
    </p>
  );

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Header onReset={resetApp} className="no-print" />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex justify-between items-center animate-in slide-in-from-top-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">System Error</span>
                <span className="text-sm opacity-80">{error}</span>
              </div>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 transition-colors p-1">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {view === 'landing' && (
          <Landing onUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
        )}

        {analysis && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-700">
            <div className="flex bg-white/70 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-slate-200 self-center md:self-start shadow-xl shadow-slate-200/50 sticky top-24 z-40 transition-all duration-300 no-print">
              <button 
                onClick={() => setView('analysis')}
                className={`px-6 py-3 font-bold text-sm transition-all rounded-2xl flex items-center space-x-2 ${view === 'analysis' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span>Clause Analysis</span>
              </button>
              <button 
                onClick={() => setView('summary')}
                className={`px-6 py-3 font-bold text-sm transition-all rounded-2xl flex items-center space-x-2 ${view === 'summary' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Smart Summary</span>
              </button>
              <button 
                onClick={() => setView('chat')}
                className={`px-6 py-3 font-bold text-sm transition-all rounded-2xl flex items-center space-x-2 ${view === 'chat' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span>Ask Your Contract</span>
              </button>
            </div>

            <div className="transition-all duration-700">
              {view === 'analysis' && <ClauseViewer clauses={analysis.clauses} />}
              {view === 'summary' && <SummaryScreen summary={analysis.summary} />}
              {view === 'chat' && <ChatInterface onChatRequest={handleChatRequest} history={chatHistory} onUpdateHistory={setChatHistory} />}
            </div>
          </div>
        )}
      </main>

      <footer className="py-16 bg-white border-t border-slate-100 no-print">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center space-x-3 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
              </div>
              <span className="font-serif font-bold text-slate-800">NYAYA AI</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm font-semibold text-slate-400">
              <a href="#" onClick={(e) => { e.preventDefault(); openModal("Our Privacy Charter", privacyContent); }} className="hover:text-indigo-600 transition-colors">Privacy Charter</a>
              <a href="#" onClick={(e) => { e.preventDefault(); openModal("Coming Soon", comingSoonContent); }} className="hover:text-indigo-600 transition-colors">Neural Methodology</a>
              <a href="#" onClick={(e) => { e.preventDefault(); openModal("Coming Soon", comingSoonContent); }} className="hover:text-indigo-600 transition-colors">Legal Framework</a>
            </div>
            
            <div className="text-slate-300 text-xs font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} NYAYA • Memory-Only Analysis
            </div>
          </div>
        </div>
      </footer>

      <PrivacyNotice className="no-print" />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent?.title || ''}>
        {modalContent?.content}
      </Modal>
    </div>
  );
};

export default App;
