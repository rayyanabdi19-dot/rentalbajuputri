import React from 'react';
import { QrCode, Printer, X, Download, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QRCodeModal: React.FC = () => {
  const { qrModalData, setQrModalData, settings } = useApp();

  if (!qrModalData) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrModalData.code)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#f8f9ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#e9def5] text-[#320075] flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-tight">{qrModalData.title}</h3>
              <p className="text-xs text-slate-500 font-mono">{qrModalData.code}</p>
            </div>
          </div>
          <button 
            onClick={() => setQrModalData(null)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Label Card */}
        <div className="p-6 text-center space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50/60 inline-block w-full">
            <div className="text-xs font-bold uppercase tracking-wider text-[#320075] mb-1">
              {settings.boutiqueName}
            </div>
            <div className="text-[11px] text-slate-500 mb-3 flex items-center justify-center gap-1">
              <Tag className="w-3 h-3 text-slate-400" />
              {qrModalData.type === 'garment' ? 'Label Inventaris Pakaian' : 'Barcode Transaksi Sewa'}
            </div>

            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
              <img 
                src={qrImageUrl} 
                alt={`QR Code ${qrModalData.code}`} 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="mt-3">
              <div className="font-mono font-bold text-base text-slate-800 tracking-wider">
                {qrModalData.code}
              </div>
              {qrModalData.extra && (
                <div className="text-xs text-slate-600 mt-0.5">
                  {qrModalData.extra}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#320075] text-white font-semibold text-xs hover:bg-[#4a1d96] flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Tag Label</span>
          </button>

          <a
            href={qrImageUrl}
            download={`QR-${qrModalData.code}.png`}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  );
};
