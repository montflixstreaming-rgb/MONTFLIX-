
import React, { useState, useEffect, useRef } from 'react';
import { getMovieRecommendation } from '../services/geminiService';
import { Movie, ChatMessage } from '../services/types';
import { Language } from '../translations';

interface AISearchProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: Movie[];
  language: Language;
  userEmail?: string;
}

const AISearch: React.FC<AISearchProps> = ({ isOpen, onClose, catalog, language, userEmail }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const userName = userEmail ? userEmail.split('@')[0] : 'usuário';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { 
          role: 'model', 
          text: language === 'pt' 
            ? `Olá, ${userName}! Sou o Alex, curador oficial da MONTFLIX Pro. Estou aqui para transformar sua experiência. O que você quer assistir hoje ou como posso ajudar com a plataforma?` 
            : `Hello, ${userName}! I'm Alex, MONTFLIX Pro's official curator. I'm here to enhance your experience. What would you like to watch today, or how can I help you with the platform?` 
        }
      ]);
    }
  }, [isOpen, userName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await getMovieRecommendation(userMsg, catalog, language);
    
    // Simular tempo de processamento humano/IA
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex justify-end">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-[#0a0a0b] border-l border-white/5 h-full flex flex-col shadow-[-40px_0_80px_rgba(0,0,0,0.9)] animate-in slide-in-from-right duration-700">
        
        <div className="p-10 border-b border-white/5 bg-[#0d0d0f] flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 flex items-center justify-center text-4xl shadow-2xl border border-white/10 overflow-hidden ring-2 ring-[#00D1FF]/40">
                👨‍💼
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-[#0d0d0f] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-white font-black text-2xl tracking-tighter uppercase">Alex</h2>
                <span className="bg-[#00D1FF] text-black text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-[0_0_15px_rgba(0,209,255,0.4)]">Curador Master</span>
              </div>
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em] mt-2 opacity-60">Suporte Pro & Inteligência de Catálogo</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:scale-110 active:scale-90">✕</button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] rounded-[2.5rem] p-8 text-sm lg:text-base leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-[#00D1FF] text-black font-black rounded-tr-none shadow-[0_15px_40px_rgba(0,209,255,0.2)]' 
                  : 'bg-[#141417] text-gray-300 border border-white/5 rounded-tl-none shadow-2xl'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-4 ml-2 animate-pulse">
               <div className="flex gap-2 p-4 bg-[#141417] rounded-full border border-white/5">
                <div className="w-2 h-2 bg-[#00D1FF] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#00D1FF] rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-[#00D1FF] rounded-full animate-bounce delay-200" />
               </div>
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Alex está digitando...</span>
            </div>
          )}
        </div>

        <div className="p-10 bg-[#0d0d0f] border-t border-white/5 space-y-6">
          <div className="flex gap-4 items-center bg-black/40 p-4 rounded-[2.5rem] border border-white/5 focus-within:border-[#00D1FF]/40 transition-all shadow-inner group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={language === 'pt' ? 'O que vamos assistir hoje?' : 'What shall we watch today?'}
              className="flex-1 bg-transparent border-none px-6 py-3 text-white focus:outline-none text-base placeholder:text-gray-800 font-bold"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="w-14 h-14 bg-[#00D1FF] text-black rounded-full flex items-center justify-center hover:scale-105 transition-all disabled:opacity-20 shadow-[0_10px_20px_rgba(0,209,255,0.3)] active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <div className="flex justify-center gap-4">
             <button onClick={() => setInput('Recomende um filme de ficção científica')} className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[9px] font-black uppercase text-gray-500 hover:text-[#00D1FF] hover:border-[#00D1FF]/30 transition-all">Dica de Sci-Fi</button>
             <button onClick={() => setInput('Como funciona o suporte 24h?')} className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[9px] font-black uppercase text-gray-500 hover:text-[#00D1FF] hover:border-[#00D1FF]/30 transition-all">Suporte Técnico</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISearch;
