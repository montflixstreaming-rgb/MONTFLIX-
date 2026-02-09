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
            ? `Olá, ${userName}! Sou o Alex, o curador oficial da MONTFLIX. Estou aqui para te ajudar a encontrar o filme perfeito no nosso catálogo gratuito. O que vamos assistir hoje?` 
            : `Hello, ${userName}! I'm Alex, MONTFLIX's curator. I'm here to help you find the perfect movie. What shall we watch today?` 
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
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex justify-end">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-[#0a0a0b] border-l border-white/5 h-full flex flex-col shadow-2xl animate-in slide-in-from-right">
        <div className="p-8 border-b border-white/5 bg-[#0d0d0f] flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-3xl border border-white/10 ring-2 ring-[#00D1FF]/40">👨‍💼</div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white font-black text-xl uppercase">Alex</h2>
                <span className="bg-[#00D1FF] text-black text-[8px] font-black px-2 py-0.5 rounded uppercase">Curador</span>
              </div>
              <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Especialista em Cinema</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-5 text-sm ${
                m.role === 'user' ? 'bg-[#00D1FF] text-black font-bold' : 'bg-[#141417] text-gray-300 border border-white/5'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && <div className="text-[10px] font-black text-[#00D1FF] animate-pulse">ALEX ESTÁ PENSANDO...</div>}
        </div>

        <div className="p-8 bg-[#0d0d0f] border-t border-white/5">
          <div className="flex gap-3 bg-black/40 p-3 rounded-2xl border border-white/5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder='O que vamos assistir hoje?'
              className="flex-1 bg-transparent border-none px-4 text-white focus:outline-none font-bold"
            />
            <button onClick={handleSend} className="bg-[#00D1FF] text-black p-3 rounded-xl">➤</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISearch;