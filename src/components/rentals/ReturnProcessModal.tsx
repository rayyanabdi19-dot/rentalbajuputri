import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  DollarSign, 
  Clock, 
  RotateCcw,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GarmentCondition } from '../../types';

export const ReturnProcessModal: React.FC = () => {
  const { 
    returnModalTransaction, 
    setReturnModalTransaction, 
    processReturn, 
    calculateLateDaysAndPenalty,
    settings,
    setWhatsappModalData
  } = useApp();

  if (!returnModalTransaction) return null;

  const tx = returnModalTransaction;
  const todayStr = new Date().toISOString().split('T')[0];

  // State
  const [actualReturnDate, setActualReturnDate] = useState<string>(todayStr);
  const [condition, setCondition] = useState<GarmentCondition>('Baik');
  const [customPenalty, setCustomPenalty] = useState<number>(0);
  const [penaltyReason, setPenaltyReason] = useState<string>('');
  const [sendToLaundry, setSendToLaundry] = useState<boolean>(true);
  const [returnNotes, setReturnNotes] = useState<string>('Baju dikembalikan dalam kondisi baik & lengkap.');

  // Calculate late penalty
  const { lateDays, penaltyAmount: latePenaltyAmount } = calculateLateDaysAndPenalty(tx.endDate, actualReturnDate);
  const totalPenalty = latePenaltyAmount + Number(customPenalty || 0);

  // Calculate deposit refund
  const depositRefund = Math.max(0, tx.depositAmount - totalPenalty);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullReason = lateDays > 0 
      ? `Terlambat ${lateDays} hari${penaltyReason ? ` + ${penaltyReason}` : ''}`
      : penaltyReason;

    processReturn(
      tx.id,
      actualReturnDate,
      condition,
      totalPenalty,
      fullReason,
      depositRefund,
      sendToLaundry,
      returnNotes
    );

    setReturnModalTransaction(null);

    // Optionally notify customer on WhatsApp
    if (totalPenalty > 0 || depositRefund > 0) {
      const msg = `*BUKTI PENGEMBALIAN & REFUND DEPOSIT* ✨\n*${settings.boutiqueName}*\n----------------------------------------\nNo. Transaksi: *${tx.invoiceNumber}*\nPelanggan: ${tx.customerName}\nTanggal Pengembalian: ${actualReturnDate}\nKondisi Pakaian: ${condition}\n\n*Rincian Deposit & Denda:*\n- Total Deposit Awal: Rp${tx.depositAmount.toLocaleString('id-ID')}\n- Total Denda: Rp${totalPenalty.toLocaleString('id-ID')} ${fullReason ? `(${fullReason})` : ''}\n*Sisa Deposit Dikembalikan: Rp${depositRefund.toLocaleString('id-ID')}*\n\nTerima kasih telah menyewa pakaian di butik kami! 🙏`;

      setWhatsappModalData({
        title: `Kirim Bukti Pengembalian ke ${tx.customerName}`,
        phone: tx.customerPhone,
        message: msg
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-[#f8f9ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                Proses Pengembalian Pakaian
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {tx.invoiceNumber} • {tx.customerName}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setReturnModalTransaction(null)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Item Preview */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider">Item Yang Dikembalikan:</div>
            {tx.items.map((it, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-100">
                <img src={it.garmentPhoto} alt={it.garmentName} className="w-9 h-11 object-cover rounded bg-slate-100 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800">{it.garmentName}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{it.garmentCode} • Size {it.size}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Dates & Late Detection */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500">Jadwal Pengembalian:</span>
              <div className="font-bold text-slate-800 text-sm mt-0.5">{tx.endDate}</div>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tanggal Real Pengembalian:</label>
              <input
                type="date"
                required
                value={actualReturnDate}
                onChange={e => setActualReturnDate(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900 outline-none"
              />
            </div>
          </div>

          {/* Late Alert */}
          {lateDays > 0 && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-900">
              <Clock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Terlambat {lateDays} Hari!</strong>
                <p className="text-[11px] text-red-700 mt-0.5">
                  Denda otomatis keterlambatan ({lateDays} hari x Rp{settings.penaltyPerDay.toLocaleString('id-ID')}): <strong className="font-bold">Rp {latePenaltyAmount.toLocaleString('id-ID')}</strong>
                </p>
              </div>
            </div>
          )}

          {/* Garment Condition Check */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Kondisi Fisik Baju Saat Diterima:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Baik', 'Kotor', 'Rusak Ringan', 'Rusak Berat'] as GarmentCondition[]).map(cond => (
                <button
                  type="button"
                  key={cond}
                  onClick={() => setCondition(cond)}
                  className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-colors cursor-pointer ${
                    condition === cond
                      ? 'bg-[#320075] text-white border-[#320075] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Damage Penalty */}
          {condition !== 'Baik' && (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-bold text-amber-900">Biaya Denda Kerusakan / Noda (Rp):</label>
                <input
                  type="number"
                  value={customPenalty}
                  onChange={e => setCustomPenalty(Number(e.target.value))}
                  className="w-36 p-1.5 bg-white border border-amber-300 rounded-lg text-right font-extrabold text-amber-900"
                />
              </div>
              <input
                type="text"
                value={penaltyReason}
                onChange={e => setPenaltyReason(e.target.value)}
                placeholder="Alasan denda (contoh: Noda wine di bagian rok bawah / robek payet)..."
                className="w-full p-2 bg-white border border-amber-200 rounded-lg text-xs outline-none"
              />
            </div>
          )}

          {/* Route to Laundry Toggle */}
          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#320075]" />
              <div>
                <div className="font-bold text-slate-800">Kirim ke Laundry Otomatis</div>
                <div className="text-[11px] text-slate-500">Status baju akan beralih ke "Sedang Dicuci"</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={sendToLaundry}
              onChange={e => setSendToLaundry(e.target.checked)}
              className="w-4 h-4 text-[#320075] rounded focus:ring-[#320075]"
            />
          </div>

          {/* Deposit Settlement Calculation */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Uang Jaminan (Deposit) Awal:</span>
              <span className="font-semibold text-slate-800">Rp {tx.depositAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Potongan Total Denda:</span>
              <span className="font-semibold">- Rp {totalPenalty.toLocaleString('id-ID')}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-sm text-slate-900">
              <span>Sisa Deposit Dikembalikan ke Klien:</span>
              <span className="text-emerald-700 text-base">Rp {depositRefund.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Catatan Pengembalian</label>
            <textarea
              rows={2}
              value={returnNotes}
              onChange={e => setReturnNotes(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setReturnModalTransaction(null)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-xs flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Selesaikan Pengembalian</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
