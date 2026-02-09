
import React, { useState, useRef } from 'react';
import { Language } from '../translations';
import { sendUpdateEmail } from '../services/emailService';

interface Device {
  id: string;
  name: string;
  type: 'TV' | 'Mobile' | 'Laptop' | 'Tablet';
  lastSync: string;
  isCurrent?: boolean;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { email: string, avatar: string | null };
  onUpdateAvatar: (newAvatar: string) => void;
  onLogout: () => void;
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  devices: Device[];
  onAddDevice: (device: Device) => void;
  onRemoveDevice: (id: string) => void;
  activePairingCode: string | null;
  onGeneratePairingCode: () => string;
  onOpenSupport?: () => void;
  onShowToast: (msg: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, user, onUpdateAvatar, onLogout,
  onOpenSupport, onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'main' | 'devices' | 'notifications'>('main');
  const [notifPrefs, setNotifPrefs] = useState({
    newMovies: true,
    newsletter: false,
    appUpdates: true
  });
  const [isSendingTest, setIsSendingTest] = useState(false);
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

  const toggleNotif = (key: keyof typeof notifPrefs) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    onShowToast("Preferência atualizada!");
  };

  const handleTestEmail = async () => {
    setIsSendingTest(true);
    const success = await sendUpdateEmail(
      user.email, 
      "Novidade na MONTFLIX!", 
      "Olá! Acabamos de adicionar 'Tears of Steel 2' ao catálogo. Venha conferir!"
    );
    setIsSendingTest(false);
    if (success) {
      onShowToast("E-mail de teste enviado com sucesso!");
    } else {
      onShowToast("Erro ao enviar e-mail. Verifique o EmailJS.");
    }
  };

  const Toggle = ({ active, onClick, label, sub }: { active: boolean, onClick: () => void, label: string, sub: string }) => (
    <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] transition-all">
      <div className="space-y-1">
        <p className="font-black text-[11px] uppercase tracking-widest text-white">{label}</p>
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{sub}</p>
      </div>
      <button 
        onClick={onClick}
        className={`w-14 h-7 rounded-full transition-all relative ${active ? 'bg-[#00D1FF]' : 'bg-zinc-800'}`}
      >
        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${active ? 'left-8' : 'left-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full h-full sm:h-auto sm:max-w-[520px] bg-black text-white sm:rounded-[3rem] shadow-2xl border border-white/10 flex flex-col overflow-hidden">
        
        <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 bg-zinc-900/50">
          <div className="flex items-center gap-4">
            {activeTab !== 'main' && (
              <button onClick={() => setActiveTab('main')} className="p-2 text-gray-500 hover:text-[#00D1FF] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
              {activeTab === 'devices' ? 'Aparelhos' : activeTab === 'notifications' ? 'Notificações' : 'Minha Conta'}
            </h2>
          </div>
          <button onClick={onClose} className="text-xl opacity-20 hover:opacity-100 transition-opacity">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {activeTab === 'main' && (
            <>
              <div className="flex flex-col items-center gap-6 p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-[2rem] bg-zinc-900 flex items-center justify-center text-4xl overflow-hidden ring-2 ring-white/10 cursor-pointer transition-all hover:scale-105 active:scale-95 group/avatar"
                >
                  {user.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <span className="opacity-20 text-6xl">👤</span>
                  )}
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white">Alterar</span>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-black tracking-tight">{user.email}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-[#00D1FF] text-[10px] font-black px-4 py-1.5 rounded-full border border-[#00D1FF]/30 uppercase tracking-[0.2em]">Membro MONTFLIX Pro</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setActiveTab('devices')} className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] transition-all text-left group">
                  <p className="font-black text-[9px] text-white/30 group-hover:text-[#00D1FF] transition-colors uppercase tracking-[0.2em] mb-2">Conectados</p>
                  <p className="font-bold text-xs">Aparelhos</p>
                </button>
                <button onClick={() => setActiveTab('notifications')} className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] transition-all text-left group">
                  <p className="font-black text-[9px] text-white/30 group-hover:text-[#00D1FF] transition-colors uppercase tracking-[0.2em] mb-2">Alertas</p>
                  <p className="font-bold text-xs">Notificações</p>
                </button>

                <button onClick={onOpenSupport} className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] transition-all text-left col-span-2 flex items-center justify-between group">
                  <div>
                    <p className="font-black text-[9px] text-white/30 group-hover:text-[#00D1FF] transition-colors uppercase tracking-[0.2em] mb-1">Central Alex</p>
                    <p className="font-bold text-sm">Falar com Suporte</p>
                  </div>
                  <span className="text-xl">👨‍💼</span>
                </button>
              </div>

              <button onClick={onLogout} className="w-full py-6 text-red-500/40 hover:text-red-500 font-black text-[10px] uppercase tracking-[0.5em] transition-all">Encerrar Sessão</button>
            </>
          )}

          {activeTab === 'devices' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl">📱</div>
                  <div>
                    <p className="font-bold text-sm">Dispositivo Atual</p>
                    <p className="text-[10px] text-[#00D1FF] uppercase font-black tracking-widest">Sessão Segura</p>
                  </div>
                </div>
              </div>
              <p className="text-[8px] text-center text-gray-600 font-bold uppercase tracking-widest pt-4">Sua conta permite até 4 acessos simultâneos.</p>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Toggle 
                active={notifPrefs.newMovies} 
                onClick={() => toggleNotif('newMovies')} 
                label="Novos Lançamentos" 
                sub="Avisar sobre novos filmes e séries" 
              />
              <Toggle 
                active={notifPrefs.appUpdates} 
                onClick={() => toggleNotif('appUpdates')} 
                label="Atualizações do App" 
                sub="Melhorias e novas funcionalidades" 
              />
              <Toggle 
                active={notifPrefs.newsletter} 
                onClick={() => toggleNotif('newsletter')} 
                label="Novidades por E-mail" 
                sub="Receba o melhor da MONTFLIX no seu e-mail" 
              />

              <div className="pt-8 border-t border-white/5">
                <button 
                  onClick={handleTestEmail}
                  disabled={isSendingTest}
                  className="w-full py-5 bg-[#00D1FF]/10 hover:bg-[#00D1FF]/20 border border-[#00D1FF]/30 text-[#00D1FF] font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                >
                  {isSendingTest ? (
                    <div className="w-4 h-4 border-2 border-[#00D1FF]/20 border-t-[#00D1FF] rounded-full animate-spin" />
                  ) : (
                    "Testar Envio de Novidade"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        <p className="p-6 text-[8px] text-center text-gray-700 font-bold uppercase tracking-widest border-t border-white/5">
          Versão 2.5.0 • © 2026 MONTFLIX PRODUCTION
        </p>
      </div>
    </div>
  );
};

export default SettingsModal;
