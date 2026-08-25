import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  Printer, 
  RotateCcw, 
  ShoppingBag, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Calendar,
  X,
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RentalStatus, PaymentStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const RentalsView: React.FC = () => {
  const { 
    transactions, 
    setIsNewRentalModalOpen, 
    setInvoiceModalTransaction, 
    setReturnModalTransaction, 
    setPickupModalTransaction, 
    setWhatsappModalData,
    cancelTransaction,
    settings
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [paymentFilter, setPaymentFilter] = useState<string>('Semua');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const statusOptions = ['Semua', 'Dipesan', 'Sedang Disewa', 'Selesai', 'Dibatalkan'];

  const filteredTransactions = transactions.filter(t => {
    const matchStatus = statusFilter === 'Semua' || t.status === statusFilter;
    const matchPayment = paymentFilter === 'Semua' || t.paymentStatus === paymentFilter;
    const q = searchFilter.toLowerCase().trim();
    const matchSearch = !q ||
      t.invoiceNumber.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.customerPhone.includes(q) ||
      t.items.some(it => it.garmentName.toLowerCase().includes(q) || it.garmentCode.toLowerCase().includes(q));

    return matchStatus && matchPayment && matchSearch;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
            Transaksi Sewa & Booking
          </h2>
          <p className="text-sm text-[#4a4452] mt-1 font-normal">
            Pantau status booking, penyerahan baju, masa pakai klien, dan proses pengembalian.
          </p>
        </div>

        <button
          id="btn-create-rental-view"
          onClick={() => setIsNewRentalModalOpen(true)}
          className="py-2.5 px-4 bg-[#320075] hover:bg-[#4a1d96] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Transaksi Sewa Baru</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {statusOptions.map(st => {
          const count = st === 'Semua' ? transactions.length : transactions.filter(t => t.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#320075] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Search & Secondary Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Cari TRX-..., nama pelanggan, baju..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#320075]/20 focus:border-[#320075]"
          />
          {searchFilter && (
            <button onClick={() => setSearchFilter('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="Semua">Semua Status Bayar</option>
            <option value="Lunas">🟢 Lunas</option>
            <option value="DP">🟡 DP (Uang Muka)</option>
            <option value="Belum Bayar">🔴 Belum Bayar</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-[#ccc3d4]/40 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Tidak ada transaksi sewa yang sesuai dengan filter
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9ff] border-b border-[#ccc3d4]/30 text-[11px] font-bold uppercase tracking-wider text-[#4a4452]">
                  <th className="p-4 pl-6">Invoice & Pelanggan</th>
                  <th className="p-4">Item Pakaian</th>
                  <th className="p-4">Periode Sewa</th>
                  <th className="p-4">Tagihan & Bayar</th>
                  <th className="p-4">Status Sewa</th>
                  <th className="p-4 pr-6 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ccc3d4]/20 text-xs sm:text-sm">
                {filteredTransactions.map((tx) => {
                  const firstItem = tx.items[0];

                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setInvoiceModalTransaction(tx)}
                      className="hover:bg-[#f8f9ff] transition-colors cursor-pointer group"
                    >
                      {/* Invoice & Customer */}
                      <td className="p-4 pl-6">
                        <div className="font-bold text-[#0b1c30] group-hover:text-[#320075]">
                          {tx.customerName}
                        </div>
                        <div className="font-mono text-xs text-[#7b7484] mt-0.5">
                          {tx.invoiceNumber}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {tx.customerPhone}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="p-4">
                        {firstItem ? (
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={firstItem.garmentPhoto} 
                              alt={firstItem.garmentName}
                              className="w-10 h-12 object-cover rounded-lg bg-slate-100 border border-slate-200 shrink-0" 
                            />
                            <div>
                              <div className="font-semibold text-slate-900 line-clamp-1 max-w-[170px]">
                                {firstItem.garmentName}
                              </div>
                              <div className="text-xs text-slate-500 font-mono">
                                {firstItem.garmentCode} • Size {firstItem.size}
                              </div>
                              {tx.items.length > 1 && (
                                <span className="text-[10px] text-[#320075] font-bold">
                                  +{tx.items.length - 1} item lainnya
                                </span>
                              )}
                            </div>
                          </div>
                        ) : '-'}
                      </td>

                      {/* Period */}
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{tx.startDate}</div>
                        <div className="text-[11px] text-slate-500">s/d {tx.endDate}</div>
                        {tx.actualReturnDate && (
                          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                            Kembali: {tx.actualReturnDate}
                          </div>
                        )}
                      </td>

                      {/* Total & Payment */}
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900">
                          Rp {tx.totalAmount.toLocaleString('id-ID')}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <StatusBadge status={tx.paymentStatus} size="sm" showDot={false} />
                          {tx.balanceDue > 0 && (
                            <span className="text-[10px] font-bold text-amber-700">
                              Sisa: Rp{tx.balanceDue.toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Rental Status */}
                      <td className="p-4">
                        <StatusBadge status={tx.status} />
                      </td>

                      {/* Quick Actions */}
                      <td className="p-4 pr-6 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {tx.status === 'Dipesan' && (
                            <button
                              onClick={() => setPickupModalTransaction(tx)}
                              className="py-1.5 px-2.5 rounded-lg bg-[#320075] text-white hover:bg-[#4a1d96] text-xs font-semibold shadow-2xs flex items-center gap-1"
                              title="Proses Serah Terima (Pickup)"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Ambil</span>
                            </button>
                          )}

                          {tx.status === 'Sedang Disewa' && (
                            <button
                              onClick={() => setReturnModalTransaction(tx)}
                              className="py-1.5 px-2.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 text-xs font-semibold shadow-2xs flex items-center gap-1"
                              title="Proses Pengembalian & Denda"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Kembali</span>
                            </button>
                          )}

                          <button
                            onClick={() => setInvoiceModalTransaction(tx)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#320075] hover:bg-slate-100"
                            title="Lihat Nota"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              const waMsg = `*PENGINGAT SEWA BAJU* ✨\n*${settings.boutiqueName}*\n----------------------------------------\nNo. Nota: *${tx.invoiceNumber}*\nPelanggan: ${tx.customerName}\nStatus: *${tx.status}*\nPeriode Sewa: ${tx.startDate} s/d ${tx.endDate}\n\nMohon pastikan pakaian dikembalikan sebelum batas waktu pengembalian. Terima kasih! 🙏`;
                              setWhatsappModalData({
                                title: `Kirim WhatsApp ke ${tx.customerName}`,
                                phone: tx.customerPhone,
                                message: waMsg
                              });
                            }}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                            title="WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          {tx.status !== 'Dibatalkan' && tx.status !== 'Selesai' && (
                            <button
                              onClick={() => {
                                const reason = prompt('Masukkan alasan pembatalan transaksi:');
                                if (reason) {
                                  cancelTransaction(tx.id, reason);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                              title="Batalkan Transaksi"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
