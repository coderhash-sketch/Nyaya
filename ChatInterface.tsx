
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface Props {
  onChatRequest: (question: string) => Promise<string>;
  history: ChatMessage[];
  onUpdateHistory: (history: ChatMessage[]) => void;
}

const ChatInterface: React.FC<Props> = ({ onChatRequest, history, onUpdateHistory }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    const currentHistory = [...history, userMessage];
    onUpdateHistory(currentHistory);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await onChatRequest(input);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      };
      onUpdateHistory([...currentHistory, assistantMessage]);
    } catch (err) {
      console.error(err);
      onUpdateHistory([...currentHistory, { 
        role: 'assistant', 
        content: "ERROR: Analysis timed out or document verification failed.", 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "What are my termination rights?",
    "Is there a mention of security deposits?",
    "What is the governing law of this contract?",
    "Are there any specific deadlines mentioned?"
  ];

  return (
    <div className="flex flex-col h-[700px] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl shadow-indigo-100 animate-in slide-in-from-bottom-8 duration-700 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
        <div>
          <h3 className="font-serif font-bold text-xl text-slate-800">Grounded Document Q&A</h3>
          <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest mt-1">Verbatim Protocol Active</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2 px-3 py-1 bg-white border border-indigo-100 rounded-full shadow-sm">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Locked to File</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-8 scroll-smooth bg-white">
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-10 animate-in fade-in zoom-in duration-700">
            <div className="relative">
              <div className="w-28 h-28 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 21a11.955 11.955 0 01-9.618-7.016m14.427-3.39A9.992 9.992 0 0112 19c-4.417 0-8-3.582-8-8s3.583-8 8-8a9.91 9.91 0 016.312 2.251" />
                </svg>
              </div>
            </div>
            
            <div className="max-w-md">
              <h4 className="text-2xl font-serif font-bold text-slate-800 mb-4">Literal Translation Engine</h4>
              <p className="text-slate-500 mb-10 leading-relaxed font-medium">Ask natural questions. NYAYA interprets the actual binary content of your file. No hallucinations permitted.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedQuestions.map((q, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setInput(q)}
                    className="text-left text-[11px] font-bold uppercase tracking-wider p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {history.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`max-w-[90%] md:max-w-[75%] p-6 rounded-[2rem] text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' ? 'bg-slate-900 text-white rounded-br-none' : 'bg-indigo-50 text-slate-800 rounded-bl-none border border-indigo-100'
            }`}>
              <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
              {msg.role === 'assistant' && (
                <div className="mt-6 pt-4 border-t border-indigo-200/50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Context Verified</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem] rounded-bl-none flex flex-col space-y-3">
              <div className="h-4 w-48 bg-indigo-200 rounded-full"></div>
              <div className="h-3 w-32 bg-indigo-100 rounded-full"></div>
              <div className="flex space-x-2 mt-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-slate-50/50 border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="w-full pl-6 pr-12 py-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all placeholder:text-slate-400 shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.03] transition-all flex items-center"
          >
            <span>Scan</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
