import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Send, X, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WhatsAppShareModal: React.FC = () => {
  const { whatsappModalData, setWhatsappModalData, settings } = useApp();
  const [copied, setCopied] = useState(false);

  if (!whatsappModalData) return null;

  const cleanPhone = whatsappModalData.phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') 
    ? '62' + cleanPhone.slice(1) 
    : cleanPhone.startsWith('62') 
      ? cleanPhone 
      : '62' + cleanPhone;

  const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsappModalData.message)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappModalData.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWA = () => {
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#f8f9ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight">{whatsappModalData.title}</h3>
              <p className="text-xs text-slate-500">Kirim template pesan ke {whatsappModalData.phone}</p>
            </div>
          </div>
          <button 
            onClick={() => setWhatsappModalData(null)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Preview Isi Pesan WhatsApp
            </label>
            <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
              {whatsappModalData.message}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs text-slate-600 border border-slate-100">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Nomor WhatsApp Butik: <span className="font-bold">{settings.whatsappNumber}</span>
            </span>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-white flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Teks</span>
              </>
            )}
          </button>

          <button
            onClick={handleSendWA}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm shadow-emerald-200 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Buka di WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
