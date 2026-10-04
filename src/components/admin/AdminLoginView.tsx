import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, Mail, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminLoginViewProps {
  onSuccess?: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onSuccess }) => {
  const { adminLogin } = useStore();
  const [loginMethod, setLoginMethod] = useState<'pin' | 'credentials'>('pin');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('admin@rangika.art');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      setErrorMessage('Please enter your 4-digit Master Owner PIN');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    const success = await adminLogin({ pin });
    setIsLoading(false);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please provide both administrator email and password');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    const success = await adminLogin({ email, password });
    setIsLoading(false);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  const quickFillOwnerPin = () => {
    setPin('8822');
    setLoginMethod('pin');
    setErrorMessage('');
  };

  const quickFillCredentials = () => {
    setEmail('admin@rangika.art');
    setPassword('Rangika@Mithila2026');
    setLoginMethod('credentials');
    setErrorMessage('');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-[#FAF7F2]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#E5DAC8] relative overflow-hidden">
        
        {/* Background accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1E2D22] via-[#C85A32] to-[#D4943E]" />

        {/* Brand Icon & Heading */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#1E2D22] text-[#D4943E] mx-auto flex items-center justify-center shadow-lg shadow-[#1E2D22]/10 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1E2D22] tracking-wide">
            RANGIKA Business Studio
          </h3>
          <p className="text-xs text-[#8E7B6C] mt-1">
            Restricted Atelier & Commerce Management Portal
          </p>
        </div>

        {/* Toggle Method */}
        <div className="flex rounded-xl bg-[#F4EFE6] p-1 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setLoginMethod('pin');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              loginMethod === 'pin'
                ? 'bg-white text-[#1E2D22] shadow-xs'
                : 'text-[#8E7B6C] hover:text-[#1E2D22]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Master Owner PIN</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod('credentials');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              loginMethod === 'credentials'
                ? 'bg-white text-[#1E2D22] shadow-xs'
                : 'text-[#8E7B6C] hover:text-[#1E2D22]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email & Password</span>
          </button>
        </div>

        {/* PIN Form */}
        {loginMethod === 'pin' ? (
          <form onSubmit={handlePinSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#3E342B] mb-2 uppercase tracking-wider">
                Enter 4-Digit Owner Security PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••"
                  autoFocus
                  className="w-full text-center text-3xl tracking-[0.5em] font-mono font-bold bg-[#FAF7F2] border-2 border-[#E5DAC8] focus:border-[#C85A32] rounded-2xl py-3 text-[#1E2D22] outline-none transition-all placeholder:text-[#D5C7B0]"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || pin.length < 4}
              className="w-full py-3.5 px-4 bg-[#1E2D22] hover:bg-[#2C3E30] disabled:bg-gray-300 text-white rounded-2xl text-sm font-semibold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Unlock Management Studio</span>
                  <ArrowRight className="w-4 h-4 text-[#D4943E]" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Credentials Form */
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#3E342B] mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rangika.art"
                className="w-full text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DAC8] focus:border-[#C85A32] rounded-xl px-3.5 py-2.5 text-[#1E2D22] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3E342B] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DAC8] focus:border-[#C85A32] rounded-xl px-3.5 py-2.5 text-[#1E2D22] outline-none transition-all"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#1E2D22] hover:bg-[#2C3E30] text-white rounded-2xl text-sm font-semibold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-4 h-4 text-[#D4943E]" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Demo Quick-Fill Helper Box for immediate seamless access */}
        <div className="mt-8 pt-6 border-t border-[#EAE3D5] text-center">
          <span className="text-[11px] uppercase tracking-wider text-[#8E7B6C] font-semibold block mb-2">
            Authorized Owner Credentials
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={quickFillOwnerPin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E5DAC8] text-xs font-medium text-[#1E2D22] transition-colors cursor-pointer"
            >
              <KeyRound className="w-3 h-3 text-[#D4943E]" />
              <span>Use Owner PIN: <strong className="font-mono text-[#C85A32]">8822</strong></span>
            </button>
            <button
              type="button"
              onClick={quickFillCredentials}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E5DAC8] text-xs font-medium text-[#1E2D22] transition-colors cursor-pointer"
            >
              <Mail className="w-3 h-3 text-[#D4943E]" />
              <span>admin@rangika.art</span>
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2.5">
            Encrypted session security · Direct artisan governance
          </p>
        </div>

      </div>
    </div>
  );
};
