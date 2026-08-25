import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  ShoppingBag, 
  DollarSign, 
  UserCheck, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PickupProcessModal: React.FC = () => {
  const { 
    pickupModalTransaction, 
    setPickupModalTransaction, 
    processPickup,
    currentUser,
    updateTransaction
  } = useApp();

  const [notes, setNotes] = useState('Pakaian telah dicoba/fitting dan diserahkan dalam kondisi lengkap beserta gantungan & cover baju.');
  const [staffName, setStaffName] = useState(currentUser.name);
  const [settleBalance, setSettleBalance] = useState(false);

  if (!pickupModalTransaction) return null;

  const tx = pickupModalTransaction;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (settleBalance && tx.balanceDue > 0) {
      updateTransaction(tx.id, {
        amountPaid: tx.totalAmount,
        balanceDue: 0,
        paymentStatus: 'Lunas'
      });
    }

    processPickup(tx.id, notes, staffName);
    setPickupModalTransaction(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#f8f9ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaddff] text-[#320075] flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                Serah Terima Pakaian (Pickup)
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {tx.invoiceNumber} • {tx.customerName}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setPickupModalTransaction(null)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Items preview */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider">Item Yang Diserahkan:</div>
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

          {/* Payment Status check */}
          {tx.balanceDue > 0 ? (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Pelanggan Memiliki Sisa Piutang: Rp {tx.balanceDue.toLocaleString('id-ID')}</span>
              </div>
              <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={settleBalance}
                  onChange={e => setSettleBalance(e.target.checked)}
                  className="rounded text-[#320075] focus:ring-[#320075] w-4 h-4"
                />
                <span>Tandai Lunas sekarang (Pelanggan telah melunasi sisa tagihan)</span>
              </label>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Tagihan sewa telah LUNAS sepenuhnya.</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Staf Yang Menyerahkan *</label>
            <input
              type="text"
              required
              value={staffName}
              onChange={e => setStaffName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Catatan Serah Terima / Kondisi Awal</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPickupModalTransaction(null)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-[#320075] text-white font-bold hover:bg-[#4a1d96] shadow-xs flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Konfirmasi Penyerahan Baju</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
