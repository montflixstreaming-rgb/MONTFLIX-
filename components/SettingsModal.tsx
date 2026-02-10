import React, { useRef, useState } from 'react';
import { Language } from '../translations';

interface UserRecord {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: string;
  lastLogin: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserRecord;
  allUsers: UserRecord[];
  onExportData: () => void;
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
  isOpen, onClose, user, allUsers, onExportData, onUpdateAvatar, onLogout
}) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
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
      <div className="absolute inset-0 bg-black/98 backdrop-blur-2xl" onClick={onClose} />
      
      <div className="relative w-full h-full sm:h-[90vh] sm:max-w-[700px] bg-[#0c0c0e] text-white sm:rounded-[3rem] shadow-2xl border border-white/5 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header Profissional */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 bg-zinc-900/20">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00D1FF]">Master Control Panel</h2>
            <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-1">Sincronização de Dados de Usuário</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12 scrollbar-hide">
          
          {/* Perfil Principal */}
          <section className="bg-gradient-to-br from-white/[0.03] to-transparent p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-[2rem] bg-zinc-900 flex items-center justify-center text-4xl overflow-hidden ring-4 ring-[#00D1FF]/20 cursor-pointer shrink-0 relative group"
            >
              {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span>👤</span>}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <span className="text-[8px] font-black uppercase tracking-tighter">Editar</span>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>
            <div className="min-w-0">
              <h3 className="text-2xl font-black tracking-tighter truncate">{user.name}</h3>
              <p className="text-sm text-gray-500 font-medium truncate mb-4">{user.email}</p>
              <div className="flex gap-2">
                <span className="text-[8px] font-black px-3 py-1 bg-[#00D1FF] text-black rounded-full uppercase tracking-widest">Ativo</span>
                <span className="text-[8px] font-black px-3 py-1 bg-white/5 text-gray-400 rounded-full uppercase tracking-widest border border-white/5">Desde {user.createdAt.split(' ')[0]}</span>
              </div>
            </div>
          </section>

          {/* Banco de Dados Administrativo */}
          <section className="space-y-6">
            <div className="flex items-end justify-between px-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Banco de Dados Geral</h3>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Registros Vitalícios: {allUsers.length}</p>
              </div>
              <button 
                onClick={onExportData}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all text-[#00D1FF]"
              >
                📥 Exportar Backup
              </button>
            </div>

            <div className="grid gap-3">
              {allUsers.map((record) => (
                <div key={record.id} className="group flex items-center gap-4 p-5 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] hover:border-[#00D1FF]/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                    {record.avatar ? <img src={record.avatar} className="w-full h-full object-cover" /> : <span className="text-xs">👤</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black tracking-tight truncate">{record.name}</p>
                      <span className="text-[7px] text-gray-600 font-mono hidden md:block">{record.id}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium truncate">{record.email}</p>
                    <div className="flex items-center gap-4 mt-1.5">
                      <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Cadastro: <span className="text-gray-500">{record.createdAt}</span></p>
                      <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Último: <span className="text-gray-500">{record.lastLogin}</span></p>
                    </div>
                  </div>
                  {record.email === user.email && (
                     <div className="px-3 py-1 bg-[#00D1FF]/10 border border-[#00D1FF]/30 rounded-lg">
                       <p className="text-[7px] font-black text-[#00D1FF] uppercase tracking-widest">Você</p>
                     </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="pt-10">
            <button onClick={onLogout} className="w-full py-6 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-[0.5em] rounded-3xl transition-all">Desconectar do Dispositivo</button>
          </div>
        </div>
        
        <div className="p-8 bg-zinc-900/40 border-t border-white/5 flex items-center justify-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.3em]">
            Protocolo de Segurança MONTFLIX-AES256 Ativado
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;