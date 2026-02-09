import React, { useRef } from 'react';
import { Language } from '../translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { email: string, avatar: string | null };
  onUpdateAvatar: (newAvatar: string) => void;
  onLogout: () => void;
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  devices: any[];
  onAddDevice: (device: any) => void;
  onRemoveDevice: (id: string) => void;
  activePairingCode: string | null;
  onGeneratePairingCode: () => string;
  onShowToast: (msg: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, user, onUpdateAvatar, onLogout
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full h-full sm:h-auto sm:max-w-[500px] bg-black text-white sm:rounded-[3rem] shadow-2xl border border-white/10 flex flex-col overflow-hidden">
        
        <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 bg-zinc-900/50">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Minha Conta MONTFLIX</h2>
          <button onClick={onClose} className="text-xl opacity-20 hover:opacity-100 transition-opacity">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          <div className="flex flex-col items-center gap-6 p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-[2rem] bg-zinc-900 flex items-center justify-center text-4xl overflow-hidden ring-2 ring-white/10 cursor-pointer"
            >
              {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span className="opacity-20 text-6xl">👤</span>}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-black tracking-tight">{user.email}</h3>
              <span className="text-[#00D1FF] text-[10px] font-black px-4 py-1.5 rounded-full border border-[#00D1FF]/30 uppercase tracking-[0.2em] mt-3 inline-block">Conta Gratuita</span>
            </div>
          </div>

          <div className="space-y-4">
             <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl opacity-50">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Status da Rede</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-sm font-bold">Servidores Online</p>
                </div>
             </div>
          </div>

          <button onClick={onLogout} className="w-full py-6 text-red-500/40 hover:text-red-500 font-black text-[10px] uppercase tracking-[0.5em] transition-all">Sair da MONTFLIX</button>
        </div>
        
        <p className="p-6 text-[8px] text-center text-gray-700 font-bold uppercase tracking-widest border-t border-white/5">
          © 2026 MONTFLIX PRODUCTION
        </p>
      </div>
    </div>
  );
};

export default SettingsModal;