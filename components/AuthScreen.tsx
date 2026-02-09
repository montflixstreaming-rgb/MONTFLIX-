import React, { useState, useRef, useEffect } from 'react';
import { sendVerificationEmail } from '../services/emailService';

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
  const [systemStatus, setSystemStatus] = useState('Código enviado com sucesso.');
  
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
        const sent = await sendVerificationEmail(email, newCode);
        setIsLoading(false);
        if (sent) {
          setShowVerification(true);
          setResendTimer(60);
          setSystemStatus(`Código enviado para ${email}`);
        } else {
          alert("Erro ao enviar código.");
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
    const newCode = generateNewCode();
    setGeneratedCode(newCode);
    await sendVerificationEmail(email, newCode);
    setIsLoading(false);
    setResendTimer(60);
    setVerificationCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    setSystemStatus("Novo código enviado.");
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
    if (verificationCode.join('') === generatedCode) {
      setIsLoading(true);
      setTimeout(completeLogin, 1000);
    } else {
      setSystemStatus("Código inválido.");
      setVerificationCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black font-sans overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-25 scale-105"
          style={{ backgroundImage: 'url("https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bca1-0746f3a15291/89914619-f5-4428-b2ca-1087859e2183/BR-pt-20241106-TRIFECTA-perspective_2c021c1a-2831-4824-9f7a-853112a9c339_large.jpg")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black" />
      </div>

      <div className="relative z-10 w-full max-w-[500px] px-8 py-16 bg-black/40 rounded-[3rem] backdrop-blur-3xl border border-white/10 shadow-2xl">
        {!showVerification ? (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-black text-white tracking-tighter mb-8">{isRegistering ? 'Criar Conta' : 'Acessar'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#00D1FF]" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#00D1FF]" />
              <button type="submit" disabled={isLoading} className="w-full bg-[#00D1FF] text-black font-black py-5 rounded-2xl uppercase text-xs tracking-widest">{isLoading ? '...' : 'Entrar'}</button>
            </form>
            <button onClick={() => setIsRegistering(!isRegistering)} className="w-full mt-8 text-gray-500 text-xs font-black uppercase tracking-widest">{isRegistering ? 'Voltar para login' : 'Novo por aqui? Criar conta'}</button>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 text-center">
             <div className="mb-10 inline-flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl">🔐</div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Segurança MONTFLIX</p>
                  <p className="text-[11px] text-gray-300 font-bold">{systemStatus}</p>
                </div>
             </div>
             <h2 className="text-3xl font-black text-white mb-10 tracking-tighter">Verificação</h2>
             <div className="flex justify-between gap-2 mb-10">
                {verificationCode.map((digit, idx) => (
                  <input key={idx} ref={(el) => { inputRefs.current[idx] = el; }} type="text" value={digit} onChange={(e) => handleCodeChange(idx, e.target.value)} onKeyDown={(e) => handleKeyDown(idx, e)} className="w-12 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black text-[#00D1FF] focus:outline-none focus:border-[#00D1FF]" />
                ))}
             </div>
             <button onClick={handleVerify} disabled={isLoading} className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase text-xs tracking-widest">Validar</button>
             <button onClick={handleResend} disabled={resendTimer > 0} className="mt-8 text-gray-500 text-[10px] uppercase font-black tracking-widest">{resendTimer > 0 ? `Reenviar em ${resendTimer}s` : 'Reenviar código'}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;