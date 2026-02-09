
import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface MercadoPagoModalProps {
  planName: string;
  price: number;
  onSuccess: () => void;
  onClose: () => void;
}

const MercadoPagoModal: React.FC<MercadoPagoModalProps> = ({ planName, price, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const brickController = useRef<any>(null);
  const mpInstance = useRef<any>(null);
  const isMounted = useRef(true);

  // Chave fornecida pelo usuário
  const PUBLIC_KEY = '1c87b6b301010101ddcd92f9bbbb3be2';

  useEffect(() => {
    isMounted.current = true;
    
    const initCheckout = async () => {
      if (!window.MercadoPago) {
        setError("O SDK do Mercado Pago não foi detectado. Verifique sua conexão.");
        setLoading(false);
        return;
      }

      try {
        // Limpeza rigorosa do container para evitar erro de 'Site ID' duplicado
        const container = document.getElementById('paymentBrick_container');
        if (container) {
          container.innerHTML = '';
        }

        // Inicializa a instância se não existir
        if (!mpInstance.current) {
          mpInstance.current = new window.MercadoPago(PUBLIC_KEY, {
            locale: 'pt-BR'
          });
        }

        const bricksBuilder = mpInstance.current.bricks();

        const settings = {
          initialization: {
            amount: price,
            payer: {
              email: "usuario@montflix.com.br",
            },
          },
          customization: {
            visual: {
              style: {
                theme: "default",
              },
            },
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              ticket: "all",
              bankTransfer: ["pix"],
              maxInstallments: 1
            },
          },
          callbacks: {
            onReady: () => {
              if (isMounted.current) setLoading(false);
            },
            onSubmit: ({ selectedPaymentMethod, formData }: any) => {
              console.log("Pagamento enviado:", { selectedPaymentMethod, formData });
              
              // Simulação de processamento bem-sucedido
              return new Promise((resolve) => {
                setTimeout(() => {
                  if (isMounted.current) {
                    onSuccess();
                    resolve(null);
                  }
                }, 2000);
              });
            },
            onError: (err: any) => {
              console.error("Erro no Mercado Pago Brick:", err);
              if (isMounted.current) {
                // Tratamento específico para o erro de chave pública
                if (err?.message?.includes('public_key') || err?.cause?.[0]?.code === 'public_key_not_found') {
                  setError("A chave pública fornecida é inválida ou não foi encontrada no Mercado Pago.");
                } else {
                  setError("Erro ao carregar o formulário de pagamento. Verifique suas credenciais.");
                }
                setLoading(false);
              }
            },
          },
        };

        brickController.current = await bricksBuilder.create(
          'payment',
          'paymentBrick_container',
          settings
        );
      } catch (err: any) {
        console.error("Erro fatal na inicialização:", err);
        if (isMounted.current) {
          setError("Não foi possível conectar ao Mercado Pago com a chave fornecida.");
          setLoading(false);
        }
      }
    };

    // Delay para garantir que o DOM renderizou o container
    const initTimer = setTimeout(initCheckout, 300);

    return () => {
      isMounted.current = false;
      clearTimeout(initTimer);
      if (brickController.current && typeof brickController.current.unmount === 'function') {
        brickController.current.unmount();
      }
      const container = document.getElementById('paymentBrick_container');
      if (container) container.innerHTML = '';
    };
  }, [price, onSuccess]);

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full h-full sm:h-auto sm:max-w-[500px] bg-white rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col text-gray-800 animate-in zoom-in-95 duration-300">
        
        {/* Header MP */}
        <div className="bg-[#009EE3] p-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <img src="https://http2.mlstatic.com/static/org-img/mkt/pdp-mp/images/logo-mp.png" className="h-5 brightness-0 invert" alt="MP" />
            <span className="font-bold text-[10px] uppercase tracking-widest ml-2">Checkout Seguro</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Resumo do Plano */}
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-gray-900 leading-none">{planName}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-widest">Assinatura Mensal MONTFLIX</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-[#009EE3]">R$ {price.toFixed(2)}</span>
          </div>
        </div>

        {/* Área do Checkout */}
        <div className="flex-1 overflow-y-auto min-h-[400px] p-4 relative bg-white">
          {loading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
              <div className="w-10 h-10 border-4 border-gray-100 border-t-[#009EE3] rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Validando Pagamento...</p>
            </div>
          )}

          {error && (
            <div className="p-10 text-center space-y-6">
               <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">!</div>
               <div className="space-y-2">
                 <p className="font-black text-lg text-red-600">Erro de Public Key</p>
                 <p className="text-sm text-gray-500 leading-relaxed">
                   {error}
                 </p>
               </div>
               <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-left">
                  <p className="text-[10px] text-amber-800 font-bold uppercase mb-1">Aviso:</p>
                  <p className="text-[10px] text-amber-700 leading-tight">
                    A chave <code>{PUBLIC_KEY}</code> não parece ser uma <strong>Public Key</strong> padrão do Mercado Pago (geralmente começam com <code>APP_USR-</code> ou <code>TEST-</code>).
                  </p>
               </div>
               <button onClick={onClose} className="w-full py-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-600 transition-all">Voltar</button>
            </div>
          )}

          <div id="paymentBrick_container" className={error ? 'hidden' : 'block'}></div>
        </div>

        {/* Selos de Segurança */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-6 opacity-40 grayscale">
          <img src="https://img.icons8.com/color/48/visa.png" className="h-5" alt="Visa" />
          <img src="https://img.icons8.com/color/48/mastercard.png" className="h-5" alt="Mastercard" />
          <img src="https://img.icons8.com/color/48/pix.png" className="h-5" alt="Pix" />
          <div className="h-4 w-px bg-gray-300" />
          <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none">Proteção<br/>SSL 256-bit</span>
        </div>
      </div>
    </div>
  );
};

export default MercadoPagoModal;
