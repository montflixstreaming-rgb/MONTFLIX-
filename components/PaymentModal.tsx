
import React, { useState, useEffect } from 'react';

interface PaymentModalProps {
  planName: string;
  price: number;
  onSuccess: () => void;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ planName, price, onSuccess, onClose }) => {
  const [method, setMethod] = useState<'pix' | 'card'>('pix');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');

  const MINHA_CHAVE_PIX = "f28901442@gmail.com";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(MINHA_CHAVE_PIX);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateProcess = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => onSuccess(), 2000);
    }, 3000);
  };

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/95 backdrop-blur-xl">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 border-4 border-white/10 border-t-[#00D1FF] rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <h2 className="text-white font-black text-xl uppercase tracking-widest">Processando</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Sincronizando assinatura...</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/95 backdrop-blur-xl">
        <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.4)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-white font-black text-3xl uppercase tracking-tighter">Ativado!</h2>
            <p className="text-green-500 text-xs font-black uppercase tracking-[0.3em]">Experiência Pro Liberada</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full h-full sm:h-auto sm:max-w-[480px] bg-[#121214] rounded-none sm:rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden flex flex-col text-white">
        
        <div className="bg-[#18181b] p-6 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E50914] rounded-xl flex items-center justify-center font-black text-xs">M</div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest">Checkout Pro</h2>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Pagamento 100% Seguro</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">✕</button>
        </div>

        <div className="px-8 py-6 bg-white/[0.02] flex justify-between items-center border-b border-white/5">
          <div>
            <span className="text-[10px] font-black text-[#E50914] uppercase tracking-widest">Plano</span>
            <h3 className="text-xl font-black tracking-tighter">{planName}</h3>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-white tracking-tighter">R$ {price.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-4 flex gap-2">
          <button 
            onClick={() => setMethod('pix')}
            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${method === 'pix' ? 'bg-[#00D1FF] text-black shadow-[0_10px_20px_rgba(0,209,255,0.2)]' : 'bg-white/5 text-gray-400 border border-white/5'}`}
          >
            PIX
          </button>
          <button 
            onClick={() => setMethod('card')}
            className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${method === 'card' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 border border-white/5'}`}
          >
            Cartão
          </button>
        </div>

        <div className="flex-1 p-8 space-y-6 overflow-y-auto min-h-[350px]">
          {method === 'pix' ? (
            <div className="flex flex-col items-center space-y-6 animate-in fade-in duration-500">
              <div className="p-4 bg-white rounded-3xl shadow-2xl">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(MINHA_CHAVE_PIX)}`}
                  alt="QR Code PIX"
                  className="w-40 h-40"
                />
              </div>
              <div className="w-full space-y-4">
                <div className="relative">
                  <input 
                    readOnly
                    value={MINHA_CHAVE_PIX}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-gray-400 focus:outline-none"
                  />
                  <button 
                    onClick={handleCopyPix}
                    className={`absolute right-2 top-2 bottom-2 px-6 rounded-xl font-black text-[10px] uppercase transition-all ${copied ? 'bg-green-500 text-white' : 'bg-[#00D1FF] text-black'}`}
                  >
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>
              <button 
                onClick={simulateProcess}
                className="w-full py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em]"
              >
                Confirmar Pagamento
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-500">
              <input placeholder="Número do Cartão" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold" />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="MM/AA" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold" />
                <input placeholder="CVV" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold" />
              </div>
              <button 
                onClick={simulateProcess}
                className="w-full py-6 bg-[#E50914] text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl"
              >
                Ativar Agora
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
