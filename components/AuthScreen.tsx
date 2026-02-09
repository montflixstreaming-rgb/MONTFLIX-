
import React, { useState, useRef, useEffect } from 'react';
import { sendVerificationEmail } from '../services/emailService';

interface AuthScreenProps {
  onLogin: (user: { email: string; avatar: string | null }) => void;
  onStartPairing: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onStartPairing }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [alexStatus, setAlexStatus] = useState('Enviei um código de 6 dígitos no seu e-mail!');
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: number;
    if (resendTimer > 0) {
      interval = window.setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const generateNewCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      
      if (isRegistering) {
        const newCode = generateNewCode();
        setGeneratedCode(newCode);
        
        // Disparo REAL do e-mail
        const sent = await sendVerificationEmail(email, newCode);
        
        setIsLoading(false);
        if (sent) {
          setShowVerification(true);
          setResendTimer(60);
          setAlexStatus(`Código enviado para ${email}!`);
        } else {
          alert("Erro ao enviar e-mail. Verifique se o endereço está correto.");
        }
      } else {
        // Simulação de login simples
        setTimeout(() => {
          setIsLoading(false);
          completeLogin();
        }, 1200);
      }
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    const newCode = generateNewCode();
    setGeneratedCode(newCode);
    
    const sent = await sendVerificationEmail(email, newCode);
    setIsLoading(false);
    
    if (sent) {
      setResendTimer(60);
      setVerificationCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setAlexStatus("Novo código enviado! Verifique seu e-mail.");
    }
  };

  const completeLogin = () => {
    const userData = { 
      email, 
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email.split('@')[0]}`,
    };
    onLogin(userData);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && verificationCode[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const userInput = verificationCode.join('');
    if (userInput === generatedCode) {
      setIsLoading(true);
      setTimeout(() => {
        completeLogin();
      }, 1000);
    } else {
      setAlexStatus("Código incorreto. Tente novamente.");
      setVerificationCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black font-sans overflow-hidden">
      {/* Background Cinematográfico */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-25 scale-105 transition-opacity duration-1000"
          style={{ backgroundImage: 'url("https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bca1-0746f3a15291/89914619-f5-4428-b2ca-1087859e2183/BR-pt-20241106-TRIFECTA-perspective_2c021c1a-2831-4824-9f7a-853112a9c339_large.jpg")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black" />
      </div>

      <header className="absolute top-0 left-0 w-full p-8 md:px-16 z-20 flex justify-center md:justify-start items-center">
        <div className="text-4xl md:text-5xl font-black tracking-tighter cursor-default select-none">
          <span className="bg-gradient-to-r from-white to-[#00D1FF] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,209,255,0.4)]">MONTFLIX</span>
        </div>
      </header>

      <div className="relative z-10 w-full max-w-[500px] px-8 md:px-14 py-16 bg-black/40 rounded-[3rem] backdrop-blur-3xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {!showVerification ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-3 mb-12">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                {isRegistering ? 'Criar Conta' : 'Boas-vindas'}
              </h1>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest opacity-60">
                {isRegistering ? 'Cadastre-se para começar' : 'Entre na sua conta MONTFLIX'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group relative">
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 pt-7 pb-3 bg-white/5 border border-white/10 rounded-2xl text-white text-base focus:outline-none focus:border-[#00D1FF] transition-all peer placeholder-transparent"
                  placeholder="E-mail" id="email" disabled={isLoading}
                />
                <label htmlFor="email" className="absolute left-6 top-2 text-gray-500 text-[10px] font-black uppercase tracking-widest transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:font-bold peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-black peer-focus:uppercase pointer-events-none">E-mail</label>
              </div>

              <div className="group relative">
                <input 
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 pt-7 pb-3 bg-white/5 border border-white/10 rounded-2xl text-white text-base focus:outline-none focus:border-[#00D1FF] transition-all peer placeholder-transparent"
                  placeholder="Senha" id="password" disabled={isLoading}
                />
                <label htmlFor="password" className="absolute left-6 top-2 text-gray-500 text-[10px] font-black uppercase tracking-widest transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:font-bold peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-black peer-focus:uppercase pointer-events-none">Sua Senha</label>
              </div>

              <button 
                type="submit" disabled={isLoading}
                className="w-full bg-[#00D1FF] text-black font-black py-5 rounded-2xl mt-4 hover:bg-white transition-all transform active:scale-95 shadow-[0_20px_40px_rgba(0,209,255,0.2)] flex items-center justify-center"
              >
                {isLoading ? <div className="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin" /> : 
                <span className="uppercase tracking-[0.2em] text-xs font-black">{isRegistering ? 'Confirmar Cadastro' : 'Acessar Catálogo'}</span>}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-white/5 text-center">
              <button onClick={() => setIsRegistering(!isRegistering)} className="text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
                {isRegistering ? 'Já tem conta? Entrar' : 'Novo por aqui? Criar conta'}
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-700 text-center">
             <div className="mb-10 inline-flex items-center gap-4 bg-[#00D1FF]/10 p-4 rounded-3xl border border-[#00D1FF]/20">
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl shadow-lg ring-2 ring-[#00D1FF]/50">👨‍💼</div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-[#00D1FF] uppercase tracking-widest">Alex da MONTFLIX</p>
                  <p className="text-[11px] text-gray-300 font-bold leading-tight">{alexStatus}</p>
                </div>
             </div>

             <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">Verifique seu E-mail</h2>
             <p className="text-gray-500 text-xs font-bold mb-10 leading-relaxed uppercase tracking-widest">Digite o código enviado para <br/> <span className="text-white">{email}</span></p>
             
             <div className="flex justify-between gap-2 mb-10">
                {verificationCode.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    value={digit}
                    onChange={(e) => handleCodeChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-16 md:w-14 md:h-20 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black text-[#00D1FF] focus:outline-none focus:border-[#00D1FF] focus:ring-4 focus:ring-[#00D1FF]/20 transition-all"
                  />
                ))}
             </div>

             <button 
               onClick={handleVerify}
               disabled={isLoading || verificationCode.some(d => d === '')}
               className="w-full bg-white text-black font-black py-5 rounded-2xl shadow-2xl hover:bg-[#00D1FF] transition-all transform active:scale-95 disabled:opacity-20"
             >
               {isLoading ? <div className="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin mx-auto" /> : 
               <span className="uppercase tracking-[0.2em] text-xs font-black">Validar Acesso</span>}
             </button>

             <div className="mt-8 flex flex-col items-center gap-4">
               <button 
                 onClick={handleResend}
                 disabled={resendTimer > 0 || isLoading}
                 className={`text-[10px] font-black uppercase tracking-widest transition-colors ${resendTimer > 0 ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}
               >
                 {resendTimer > 0 ? `Reenviar código em ${resendTimer}s` : 'Não recebi o e-mail'}
               </button>
               
               <button 
                 onClick={() => setShowVerification(false)}
                 className="text-gray-700 hover:text-white text-[9px] font-black uppercase tracking-[0.2em] transition-colors"
               >
                 Voltar e corrigir e-mail
               </button>
             </div>
          </div>
        )}
      </div>

      <footer className="absolute bottom-0 w-full p-10 flex flex-col items-center gap-6">
        <div className="flex gap-8 text-[9px] text-white/10 font-black uppercase tracking-[0.3em]">
           <span>SMTP REAL ENGINE</span>
           <span>SECURE OTP FLOW</span>
           <span>2026 NATIVE SUPPORT</span>
        </div>
      </footer>
    </div>
  );
};

export default AuthScreen;
