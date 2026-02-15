
import React, { useState, useEffect } from 'react';
import { Security } from '../services/security';

interface UserRecord {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  createdAt: string;
  lastLogin: string;
  xp: number;
}

interface DatabaseViewProps {
  users: UserRecord[];
  onExport: () => void;
  currentUserEmail: string;
}

const MASTER_EMAIL = "f28901442@gmail.com";

const DatabaseView: React.FC<DatabaseViewProps> = ({ users, onExport, currentUserEmail }) => {
  const [filter, setFilter] = useState('');
  const isMaster = currentUserEmail === MASTER_EMAIL;

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(filter.toLowerCase()) || 
    u.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="px-6 md:px-14 lg:px-24 pt-32 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter border-l-8 border-[#00D1FF] pl-8">
            Gestão de <span className="text-gray-600">Usuários</span>
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 ml-10">
            Painel Administrativo MONTFLIX
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={filter}
            onChange={(e) => setFilter(Security.sanitize(e.target.value))}
            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold w-full sm:w-80 focus:outline-none focus:border-[#00D1FF] transition-all"
          />
          {isMaster && (
            <button 
              onClick={onExport}
              className="bg-[#00D1FF] text-black font-black px-8 py-4 rounded-2xl uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-3"
            >
              Exportar Backup
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem]">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Total de Usuários</p>
          <h3 className="text-5xl font-black text-white">{users.length}</h3>
        </div>
        <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem]">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Média de XP</p>
          <h3 className="text-3xl font-black text-[#00D1FF]">
            {users.length > 0 ? Math.floor(users.reduce((acc, u) => acc + (u.xp || 0), 0) / users.length) : 0}
          </h3>
        </div>
        <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem]">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Status do Sistema</p>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <h3 className="text-3xl font-black text-white uppercase italic">Online</h3>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Nome</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">E-mail</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Patente (XP)</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Último Acesso</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                <td className="px-8 py-6 font-black text-sm">{u.name}</td>
                <td className="px-8 py-6 text-sm text-gray-400">{u.email}</td>
                <td className="px-8 py-6 font-black text-[#00D1FF]">{u.xp} XP</td>
                <td className="px-8 py-6 text-[10px] text-gray-500">{u.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatabaseView;
