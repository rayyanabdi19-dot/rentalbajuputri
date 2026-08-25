import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginView: React.FC = () => {
  const { login, authCredentials, settings } = useApp();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = login(username, password);
      setIsLoading(false);

      if (!result.success) {
        setErrorMessage(result.error || 'Username atau password tidak sesuai.');
      }
    }, 400);
  };

  const handleFillDemoCreds = () => {
    setUsername(authCredentials.username);
    setPassword(authCredentials.password);
    setErrorMessage(null);
    setAutoFilled(true);
    setTimeout(() => setAutoFilled(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9ff] flex flex-col justify-between items-center p-4 sm:p-6 md:p-10 text-[#0b1c30] relative overflow-hidden">
      {/* Subtle Luxury Ambient Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#eaddff]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#d0bcff]/30 blur-3xl pointer-events-none" />

      {/* Top Boutique Brand Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#320075] text-white flex items-center justify-center font-extrabold text-base shadow-sm tracking-tight">
            SBP
          </div>
          <div>
            <span className="font-bold text-base text-[#320075] tracking-tight block">
              {settings.boutiqueName}
            </span>
            <span className="text-[11px] text-[#7b7484] font-medium block">
              Sistem Manajemen Butik & Penyewaan Busana
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#4a4452] bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sistem Terenkripsi & Terlindungi</span>
        </div>
      </header>

      {/* Center Login Container */}
      <main className="w-full max-w-md my-auto py-8 z-10">
        <div className="bg-white rounded-3xl border border-[#ccc3d4]/50 shadow-lg p-6 sm:p-8 space-y-6">
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#eaddff]/70 text-[#320075] mb-1">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#0b1c30] tracking-tight">
              Selamat Datang Kembali
            </h1>
            <p className="text-xs text-[#4a4452]">
              Silakan masuk dengan akun pengelola butik untuk mengakses dashboard transaksi dan koleksi busana.
            </p>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="bg-gradient-to-br from-[#f6f2fc] to-[#eff4ff] p-3.5 rounded-2xl border border-[#eaddff] text-xs space-y-2.5">
            <div className="flex items-center justify-between font-bold text-[#320075]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#320075]" />
                Kredensial Akses Demo
              </span>
              <button
                type="button"
                onClick={handleFillDemoCreds}
                className="text-[11px] font-bold text-[#320075] hover:text-[#4a1d96] underline hover:no-underline cursor-pointer flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-[#eaddff] shadow-2xs transition-all active:scale-95"
              >
                {autoFilled ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Terisi!</span>
                  </>
                ) : (
                  <span>Isi Otomatis</span>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/70 backdrop-blur-sm p-2 rounded-xl border border-slate-200/60 font-mono text-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans font-medium uppercase">Username</span>
                <span className="font-bold text-[#320075]">{authCredentials.username}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans font-medium uppercase">Password</span>
                <span className="font-bold text-[#320075]">{authCredentials.password}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-700 font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">
                Username Akun <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Masukkan username (cth: admin)"
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-[#320075] focus:ring-2 focus:ring-[#eaddff] outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-700">
                  Password <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Masukkan password akun..."
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:border-[#320075] focus:ring-2 focus:ring-[#eaddff] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Help */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 text-xs font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#320075] accent-[#320075] focus:ring-0 cursor-pointer"
                />
                <span>Ingat Sesi Login</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  alert(`Panduan Pemulihan Akses:\n\nUsername saat ini: ${authCredentials.username}\nPassword saat ini: ${authCredentials.password}\n\nAnda dapat mengganti kredensial ini kapan saja di menu Pengaturan > Keamanan & Password setelah login.`);
                }}
                className="text-xs font-semibold text-[#320075] hover:underline cursor-pointer flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Bantuan Akun?</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#320075] hover:bg-[#4a1d96] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Additional Notes */}
          <div className="pt-2 text-center border-t border-slate-100">
            <p className="text-[11px] text-slate-400 font-medium">
              Kredensial dapat diubah sewaktu-waktu di menu <b>Pengaturan</b> dalam dashboard.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl py-3 text-center text-xs text-slate-400 z-10 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200/60">
        <div>
          © {new Date().getFullYear()} {settings.boutiqueName}. Hak Cipta Dilindungi.
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
          <span>Versi Sistem 2.4-Pro</span>
          <span>•</span>
          <span>Bantuan CS: {settings.whatsappNumber}</span>
        </div>
      </footer>
    </div>
  );
};
