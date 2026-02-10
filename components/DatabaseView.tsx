import React, { useState } from 'react';

interface UserRecord {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: string;
  lastLogin: string;
}

interface DatabaseViewProps {
  users: UserRecord[];
  onExport: () => void;
  currentUserEmail: string;
}

const DatabaseView: React.FC<DatabaseViewProps> = ({ users, onExport, currentUserEmail }) => {
  const [filter, setFilter] = useState('');

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(filter.toLowerCase()) || 
    u.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="px-6 md:px-14 lg:px-24 pt-32 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter border-l-8 border-[#00D1FF] pl-8">
            Banco de Dados <span className="text-gray-600 italic">Core</span>
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 ml-10">
            Monitoramento de Registros e Segurança de Acesso
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <input 
              type="text"
              placeholder="Buscar por e-mail ou nome..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold w-full sm:w-80 focus:outline-none focus:border-[#00D1FF] transition-all"
            />
          </div>
          <button 
            onClick={onExport}
            className="bg-[#00D1FF] text-black font-black px-8 py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,209,255,0.3)]"
          >
            Baixar Backup .JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-center">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Total de Cadastros</p>
          <h3 className="text-5xl font-black text-white">{users.length}</h3>
        </div>
        <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-center">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Administradores</p>
          <h3 className="text-5xl font-black text-[#00D1FF]">1</h3>
        </div>
        <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-center">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Status da Rede</p>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <h3 className="text-3xl font-black text-white uppercase italic">Online</h3>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Avatar</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Nome de Exibição</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">E-mail Cadastrado</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">UUID (ID Único)</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Data de Cadastro</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Último Acesso</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors group ${u.email === currentUserEmail ? 'bg-[#00D1FF]/5' : ''}`}>
                <td className="px-8 py-6">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
                    {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : <span>👤</span>}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="font-black text-sm">{u.name}</span>
                  {u.email === currentUserEmail && <span className="ml-3 text-[8px] font-black bg-[#00D1FF] text-black px-2 py-0.5 rounded uppercase">VOCÊ</span>}
                </td>
                <td className="px-8 py-6 text-sm text-gray-400 font-medium">{u.email}</td>
                <td className="px-8 py-6 font-mono text-[9px] text-gray-600">{u.id}</td>
                <td className="px-8 py-6 text-xs text-gray-500">{u.createdAt}</td>
                <td className="px-8 py-6 text-xs text-[#00D1FF] font-bold">{u.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-600 font-black uppercase tracking-widest text-xs">Nenhum registro encontrado para "{filter}"</p>
          </div>
        )}
      </div>

      <div className="mt-12 p-8 bg-zinc-900/30 rounded-3xl border border-white/5 flex items-center gap-6">
        <div className="w-12 h-12 bg-[#00D1FF]/10 rounded-2xl flex items-center justify-center text-2xl">🛡️</div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#00D1FF]">Aviso de Segurança</h4>
          <p className="text-xs text-gray-500 mt-1">Os dados exibidos são armazenados via Protocolo Local-Core. Recomenda-se realizar o backup semanal para evitar perda em caso de limpeza de cache do navegador.</p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseView;