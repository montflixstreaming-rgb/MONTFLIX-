
import React, { useState, useRef, useEffect } from 'react';
import { sendVerificationEmail } from '../services/emailService';
import { Security } from '../services/security';

interface AuthScreenProps {
  onLogin: (user: { email: string; avatar: string | null }) => void;
  onStartPairing: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  
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
      const safeEmail = Security.sanitize(email);

      if (isRegistering) {
        const newCode = generateNewCode();
        setGeneratedCode(newCode);
        const sent = await sendVerificationEmail(safeEmail, newCode);
        setIsLoading(false);
        if (sent) {
          setShowVerification(true);
          setResendTimer(60);
        } else {
          alert("Falha ao enviar código. Verifique sua conexão.");
        }
      } else {
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
    const safeEmail = Security.sanitize(email);
    const newCode = generateNewCode();
    setGeneratedCode(newCode);
    await sendVerificationEmail(safeEmail, newCode);
    setIsLoading(false);
    setResendTimer(60);
    setVerificationCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const completeLogin = () => {
    const safeEmail = Security.sanitize(email);
    const userData = { 
      email: safeEmail, 
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${safeEmail.split('@')[0]}`,
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
    if (verificationCode.join('') === generatedCode) {
      setIsLoading(true);
      setTimeout(completeLogin, 800);
    } else {
      alert("Código incorreto.");
      setVerificationCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black font-sans overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-20 scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=2073&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black" />
      </div>

      <div className="relative z-10 w-full max-w-[450px] px-8 py-16 bg-black/40 rounded-[3rem] backdrop-blur-3xl border border-white/10 shadow-2xl">
        {!showVerification ? (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-4xl font-black text-[#00D1FF] tracking-tighter mb-10 text-center">MONTFLIX</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="E-mail" 
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#00D1FF] transition-all" 
              />
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Senha" 
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#00D1FF] transition-all" 
              />
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-[#00D1FF] text-black font-black py-5 rounded-2xl uppercase text-xs tracking-[0.3em] shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isLoading ? 'Carregando...' : (isRegistering ? 'Criar Conta' : 'Entrar')}
              </button>
            </form>
            <button 
              onClick={() => setIsRegistering(!isRegistering)} 
              className="w-full mt-8 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              {isRegistering ? 'Já tenho conta' : 'Novo por aqui? Criar conta'}
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 text-center">
             <h2 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">Verificação</h2>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-10">Enviamos um código para seu e-mail</p>
             <div className="flex justify-between gap-2 mb-10">
                {verificationCode.map((digit, idx) => (
                  <input 
                    key={idx} 
                    ref={(el) => { inputRefs.current[idx] = el; }} 
                    type="text" 
                    value={digit} 
                    onChange={(e) => handleCodeChange(idx, e.target.value)} 
                    onKeyDown={(e) => handleKeyDown(idx, e)} 
                    className="w-12 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black text-[#00D1FF] focus:outline-none focus:border-[#00D1FF] shadow-inner" 
                  />
                ))}
             </div>
             <button 
              onClick={handleVerify} 
              disabled={isLoading} 
              className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase text-xs tracking-[0.4em] transition-all"
             >
              Verificar Código
             </button>
             <button 
              onClick={handleResend} 
              disabled={resendTimer > 0} 
              className="mt-8 text-gray-500 text-[10px] uppercase font-black tracking-widest hover:text-white"
             >
              {resendTimer > 0 ? `Reenviar em ${resendTimer}s` : 'Reenviar código'}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
