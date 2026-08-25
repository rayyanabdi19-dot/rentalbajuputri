import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  MessageSquare, 
  Sparkles, 
  CheckCircle, 
  ShieldCheck, 
  CreditCard,
  QrCode,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const InvoiceModal: React.FC = () => {
  const { 
    invoiceModalTransaction, 
    setInvoiceModalTransaction, 
    settings,
    setWhatsappModalData,
    setReturnModalTransaction,
    setPickupModalTransaction
  } = useApp();

  if (!invoiceModalTransaction) return null;

  const tx = invoiceModalTransaction;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const waMsg = `*INVOICE RESMI PENYEWAAN BAJU* ✨\n*${settings.boutiqueName}*\n----------------------------------------\nNo. Invoice: *${tx.invoiceNumber}*\nNama Pelanggan: ${tx.customerName}\nKontak: ${tx.customerPhone}\nPeriode Sewa: ${tx.startDate} s/d ${tx.endDate}\n\n*Item Pakaian Disewa:*\n${tx.items.map(it => `• ${it.garmentName} (${it.garmentCode}) - Size ${it.size} [${it.days} Hari] = Rp${it.subtotal.toLocaleString('id-ID')}`).join('\n')}\n\n*Rincian Tagihan:*\n- Subtotal Sewa: Rp${tx.subtotal.toLocaleString('id-ID')}\n- Deposit Jaminan: Rp${tx.depositAmount.toLocaleString('id-ID')}\n- Diskon: Rp${tx.discount.toLocaleString('id-ID')}\n*Total Tagihan: Rp${tx.totalAmount.toLocaleString('id-ID')}*\n\nStatus Bayar: *${tx.paymentStatus}*\nJumlah Dibayar: Rp${tx.amountPaid.toLocaleString('id-ID')}\n*Sisa Piutang: Rp${tx.balanceDue.toLocaleString('id-ID')}*\n\n*Rekening Pembayaran:*\n${settings.bankName} - ${settings.bankAccountNumber} a.n ${settings.bankAccountName}\n\nTerima kasih telah mempercayakan busana acara Anda kepada kami. ✨`;

    setWhatsappModalData({
      title: `Kirim Invoice ke ${tx.customerName}`,
      phone: tx.customerPhone,
      message: waMsg
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[95vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#f8f9ff] no-print">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-bold text-xs sm:text-sm text-[#320075] bg-[#eaddff] px-2.5 py-1 rounded-md">
              {tx.invoiceNumber}
            </span>
            <StatusBadge status={tx.status} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="py-1.5 px-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 rounded-lg bg-[#320075] text-white hover:bg-[#4a1d96] font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Nota</span>
            </button>
            <button
              onClick={() => setInvoiceModalTransaction(null)}
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div id="printable-invoice" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 bg-white">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#320075] text-white flex items-center justify-center font-bold text-xs">
                  SBP
                </div>
                <h1 className="text-xl font-black tracking-tight text-[#320075] uppercase">
                  {settings.boutiqueName}
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">{settings.address}</p>
              <p className="text-xs text-slate-500 font-mono">WhatsApp: {settings.whatsappNumber} • Email: {settings.email}</p>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Nota Penyewaan</div>
              <div className="text-lg font-mono font-extrabold text-slate-900">{tx.invoiceNumber}</div>
              <div className="text-xs text-slate-500 mt-0.5">Tanggal Terbit: {tx.createdAt}</div>
            </div>
          </div>

          {/* Customer & Schedule Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px]">Data Penyewa</span>
              <div className="font-bold text-sm text-slate-900 mt-0.5">{tx.customerName}</div>
              <div className="text-slate-600 mt-0.5">WhatsApp: <span className="font-mono">{tx.customerPhone}</span></div>
              {tx.eventDetails && <div className="text-slate-500 mt-0.5 italic">Acara: {tx.eventDetails}</div>}
            </div>

            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px]">Jadwal Periode Sewa</span>
              <div className="font-bold text-sm text-[#320075] mt-0.5">{tx.startDate} s/d {tx.endDate}</div>
              <div className="text-slate-600 mt-0.5">
                Pengambilan: <span className="font-semibold">{tx.actualPickupDate || tx.startDate}</span>
              </div>
              <div className="text-slate-600 mt-0.5">
                Pengembalian Maks: <span className="font-semibold">{tx.endDate} (18:00 WIB)</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-100/70 text-[11px] font-bold uppercase text-slate-700">
                  <th className="py-2.5 px-3">Item Pakaian</th>
                  <th className="py-2.5 px-2">Size / Warna</th>
                  <th className="py-2.5 px-2 text-right">Tarif / Hari</th>
                  <th className="py-2.5 px-2 text-center">Durasi</th>
                  <th className="py-2.5 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tx.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={it.garmentPhoto} alt={it.garmentName} className="w-9 h-11 object-cover rounded bg-slate-100 border border-slate-200 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900">{it.garmentName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{it.garmentCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-medium text-slate-700">
                      {it.size} • {it.color}
                    </td>
                    <td className="py-3 px-2 text-right text-slate-700 font-mono">
                      Rp {it.pricePerDay.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-slate-800">
                      {it.days} Hari
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900 font-mono">
                      Rp {it.subtotal.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Financials Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-slate-200">
            <div className="w-full sm:w-1/2 space-y-2 text-xs">
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <span className="font-bold text-[#320075] block mb-1">Informasi Pembayaran / Transfer:</span>
                <p className="text-slate-700 font-medium">{settings.bankName} - <span className="font-mono font-bold">{settings.bankAccountNumber}</span></p>
                <p className="text-slate-600">a.n <span className="font-semibold">{settings.bankAccountName}</span></p>
                <div className="mt-1 text-[11px] text-slate-500">Metode Transaksi: <span className="font-bold">{tx.paymentMethod}</span></div>
              </div>

              {tx.fittingNotes && (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                  <strong>Catatan Fitting: </strong> {tx.fittingNotes}
                </div>
              )}
            </div>

            <div className="w-full sm:w-1/2 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Biaya Sewa:</span>
                <span className="font-mono font-semibold">Rp {tx.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Deposit Jaminan (Akan Direfund):</span>
                <span className="font-mono font-semibold">Rp {tx.depositAmount.toLocaleString('id-ID')}</span>
              </div>
              {tx.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Diskon Promo:</span>
                  <span className="font-mono">- Rp {tx.discount.toLocaleString('id-ID')}</span>
                </div>
              )}
              {tx.penaltyAmount && tx.penaltyAmount > 0 ? (
                <div className="flex justify-between text-red-600 font-bold">
                  <span>Denda ({tx.penaltyReason || 'Keterlambatan'}):</span>
                  <span className="font-mono">+ Rp {tx.penaltyAmount.toLocaleString('id-ID')}</span>
                </div>
              ) : null}

              <div className="pt-2 border-t-2 border-slate-900 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Tagihan:</span>
                <span className="text-[#320075] text-base font-mono">Rp {tx.totalAmount.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex justify-between text-xs text-slate-600 pt-1">
                <span>Jumlah Telah Dibayar ({tx.paymentStatus}):</span>
                <span className="font-mono font-bold text-emerald-700">Rp {tx.amountPaid.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex justify-between text-xs font-bold text-slate-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                <span>Sisa Piutang / Pelunasan:</span>
                <span className="font-mono text-amber-900">Rp {tx.balanceDue.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Terms & Signature */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">Ketentuan Penyewaan:</p>
            <p>1. Pakaian wajib dikembalikan tepat waktu dalam kondisi utuh sebelum batas jam operasional.</p>
            <p>2. Keterlambatan dikenakan denda sebesar <strong>Rp {settings.penaltyPerDay.toLocaleString('id-ID')} / hari</strong>.</p>
            <p>3. Uang jaminan (deposit) akan dikembalikan penuh setelah staf butik memeriksa pakaian tidak ada sobek/rusak.</p>
          </div>

          <div className="pt-6 flex justify-between items-end text-center text-xs text-slate-700">
            <div>
              <p className="text-[11px] text-slate-400 mb-12">Penyewa / Klien</p>
              <p className="font-bold border-t border-slate-400 pt-1">{tx.customerName}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 mb-12">Staf Butik</p>
              <p className="font-bold border-t border-slate-400 pt-1">{settings.boutiqueName}</p>
            </div>
          </div>
        </div>

        {/* Footer Quick Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 no-print">
          <div className="text-xs text-slate-500">
            Status: <span className="font-bold text-slate-800">{tx.status}</span>
          </div>

          <div className="flex items-center gap-2">
            {tx.status === 'Dipesan' && (
              <button
                onClick={() => {
                  setPickupModalTransaction(tx);
                  setInvoiceModalTransaction(null);
                }}
                className="py-2 px-3 rounded-xl bg-[#320075] text-white font-semibold text-xs hover:bg-[#4a1d96] shadow-xs"
              >
                Proses Serah Terima (Pickup)
              </button>
            )}

            {tx.status === 'Sedang Disewa' && (
              <button
                onClick={() => {
                  setReturnModalTransaction(tx);
                  setInvoiceModalTransaction(null);
                }}
                className="py-2 px-3 rounded-xl bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 shadow-xs"
              >
                Proses Pengembalian & Cek Denda
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
