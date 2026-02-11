
import React, { useRef, useMemo } from 'react';
import { Language } from '../translations';

interface UserRecord {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: string;
  lastLogin: string;
  xp?: number;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserRecord;
  onUpdateAvatar: (newAvatar: string) => void;
  onLogout: () => void;
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  onShowToast: (msg: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, user, onUpdateAvatar, onLogout
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fanStats = useMemo(() => {
    const xp = user.xp || 150; 
    let level = "Espectador Bronze";
    let color = "#CD7F32";
    let progress = (xp % 100);
    
    if (xp > 1000) { level = "Lenda do Cinema"; color = "#FFD700"; progress = 100; }
    else if (xp > 600) { level = "Mestre Platina"; color = "#E5E4E2"; progress = ((xp - 600) / 400) * 100; }
    else if (xp > 300) { level = "Cineasta Ouro"; color = "#FFD700"; progress = ((xp - 300) / 300) * 100; }
    else if (xp > 100) { level = "Crítico Prata"; color = "#C0C0C0"; progress = ((xp - 100) / 200) * 100; }

    return { level, color, progress, xp };
  }, [user.xp]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdateAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative w-full h-full sm:h-[90vh] sm:max-w-[550px] bg-[#0c0c0e] text-white sm:rounded-[3rem] shadow-2xl border border-white/5 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 bg-zinc-900/20">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00D1FF]">Meu Perfil</h2>
            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">Estatísticas & Conta</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
          
          <section className="bg-gradient-to-br from-white/[0.03] to-transparent p-8 rounded-[2.5rem] border border-white/5 flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-[1.5rem] bg-zinc-900 flex items-center justify-center text-4xl overflow-hidden ring-2 ring-[#00D1FF]/20 cursor-pointer shrink-0 relative group"
              >
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span>👤</span>}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <span className="text-[8px] font-black uppercase text-white">Trocar</span>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-black tracking-tighter truncate">{user.name}</h3>
                <p className="text-xs text-gray-500 font-medium truncate">{user.email}</p>
              </div>
            </div>

            {/* Nível de Fã - Gamificação */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Patente Atual</p>
                  <p className="text-sm font-black uppercase tracking-tighter" style={{ color: fanStats.color }}>{fanStats.level}</p>
                </div>
                <p className="text-[10px] font-mono font-bold text-[#00D1FF]">{fanStats.xp} XP</p>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00D1FF] to-[#0055FF] shadow-[0_0_15px_rgba(0,209,255,0.4)] transition-all duration-1000"
                  style={{ width: `${fanStats.progress}%` }}
                />
              </div>
              <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest text-center italic">Quanto mais você assiste, mais rápido evolui!</p>
            </div>
          </section>

          <section className="pt-6 border-t border-white/5">
            <button onClick={onLogout} className="w-full py-6 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-[0.5em] rounded-3xl transition-all">Encerrar Sessão</button>
          </section>
        </div>
        
        <div className="p-8 bg-zinc-900/40 border-t border-white/5 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.3em]">
              Sistemas de Dados MONTFLIX 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
