
import React from 'react';

interface AdBannerProps {
  type: 'leaderboard' | 'rectangle';
}

const AdBanner: React.FC<AdBannerProps> = ({ type }) => {
  return (
    <div className={`mx-auto my-12 px-6 md:px-12 w-full max-w-7xl animate-in fade-in duration-1000`}>
      <div className={`relative group bg-[#0a0a0b] border border-white/5 rounded-2xl overflow-hidden flex flex-col items-center justify-center transition-all hover:border-[#00D1FF]/20 ${
        type === 'leaderboard' ? 'h-32' : 'h-64'
      }`}>
        {/* Simulação de AdSense Overlay */}
        <div className="absolute top-2 right-2 flex gap-1">
          <div className="w-3 h-3 bg-white/10 rounded-full flex items-center justify-center text-[6px] text-gray-500">i</div>
          <div className="w-3 h-3 bg-white/10 rounded-full flex items-center justify-center text-[6px] text-gray-400">✕</div>
        </div>

        <div className="text-center space-y-2 opacity-30 group-hover:opacity-60 transition-opacity">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Espaço Publicitário</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#00D1FF] text-lg font-black">Google</span>
            <span className="text-white text-lg font-light tracking-tighter">AdSense</span>
          </div>
          <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Aguardando Aprovação do Site</p>
        </div>

        {/* Efeito de brilho de carregamento */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
      <p className="text-[8px] text-center text-gray-700 font-bold uppercase tracking-widest mt-2">Anúncio • O conteúdo continua abaixo</p>
    </div>
  );
};

export default AdBanner;
