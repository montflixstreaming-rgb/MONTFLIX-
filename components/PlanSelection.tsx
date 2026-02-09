
import React, { useState } from 'react';
import PaymentModal from './PaymentModal';

interface PlanSelectionProps {
  onSelectPlan: (plan: 'essencial' | 'premium') => void;
  userEmail: string;
  onLogout: () => void;
}

const PlanSelection: React.FC<PlanSelectionProps> = ({ onSelectPlan, userEmail, onLogout }) => {
  const [selected, setSelected] = useState<'essencial' | 'premium'>('premium');
  const [showCheckout, setShowCheckout] = useState(false);

  const handleOpenCheckout = () => {
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    onSelectPlan(selected);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#E50914] selection:text-white">
      {/* Header Profissional */}
      <nav className="px-8 md:px-14 py-6 flex justify-between items-center border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="text-3xl font-black tracking-tighter text-[#E50914] cursor-default">
          MONTFLIX
        </div>
        <button 
          onClick={onLogout} 
          className="text-lg font-bold text-gray-700 hover:underline transition-all"
        >
          Sair
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <div className="mb-12 text-center md:text-left">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Passo 2 de 3</p>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">Escolha o plano ideal para sua experiência</h1>
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-start gap-4">
              <span className="text-[#E50914] text-2xl mt-1">✓</span>
              <p className="text-lg text-gray-700 font-medium">Acesso ilimitado a todos os filmes e séries do catálogo.</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-[#E50914] text-2xl mt-1">✓</span>
              <p className="text-lg text-gray-700 font-medium">Sem anúncios ou interrupções em nenhum momento.</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-[#E50914] text-2xl mt-1">✓</span>
              <p className="text-lg text-gray-700 font-medium">Experiência imersiva com 4K HDR e Áudio Espacial.</p>
            </div>
          </div>
        </div>

        {/* Seletor de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div 
            onClick={() => setSelected('essencial')}
            className={`cursor-pointer group relative p-10 rounded-2xl border-2 transition-all duration-300 ${
              selected === 'essencial' 
                ? 'border-[#E50914] bg-white ring-4 ring-[#E50914]/10' 
                : 'border-gray-200 hover:border-gray-300 opacity-60'
            }`}
          >
            <h3 className="text-2xl font-black mb-2">Essencial</h3>
            <p className="text-gray-500 font-bold text-sm mb-6 uppercase tracking-widest">Resolução HD (1080p)</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">R$ 15,00</span>
              <span className="text-gray-400 font-bold">/mês</span>
            </div>
          </div>

          <div 
            onClick={() => setSelected('premium')}
            className={`cursor-pointer group relative p-10 rounded-2xl border-2 transition-all duration-300 ${
              selected === 'premium' 
                ? 'border-[#E50914] bg-white ring-4 ring-[#E50914]/10' 
                : 'border-gray-200 hover:border-gray-300 opacity-60'
            }`}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#E50914] text-white text-[10px] font-black px-6 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Premium 4K</div>
            <h3 className="text-2xl font-black mb-2">Ultra 4K</h3>
            <p className="text-gray-500 font-bold text-sm mb-6 uppercase tracking-widest">Resolução 4K + HDR</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">R$ 20,00</span>
              <span className="text-gray-400 font-bold">/mês</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleOpenCheckout}
          className="w-full bg-[#E50914] text-white font-black py-6 rounded-lg text-xl shadow-2xl hover:bg-[#c10710] transition-all transform active:scale-[0.98] shadow-[#E50914]/20"
        >
          Próximo
        </button>

        <p className="text-center text-gray-400 text-xs mt-10 max-w-lg mx-auto leading-relaxed">
          Ao clicar em próximo, você terá acesso às opções de pagamento via PIX ou Cartão de Crédito. Seus dados são processados de forma criptografada e segura.
        </p>
      </div>

      {showCheckout && (
        <PaymentModal 
          planName={selected === 'premium' ? 'Ultra 4K' : 'Essencial'} 
          price={selected === 'premium' ? 20 : 15}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
};

export default PlanSelection;
