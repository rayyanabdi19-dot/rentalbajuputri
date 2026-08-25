import React, { useState } from 'react';
import { 
  Shirt, 
  CheckCircle, 
  ShoppingBag, 
  Sparkles, 
  CreditCard, 
  AlertTriangle, 
  BellRing, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Clock,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const DashboardView: React.FC = () => {
  const { 
    garments, 
    transactions, 
    laundryItems, 
    setActiveTab, 
    setInvoiceModalTransaction, 
    currentUser,
    setSelectedCustomerId,
    setSelectedGarmentId
  } = useApp();

  // Calendar week state
  const [selectedDay, setSelectedDay] = useState<number>(3); // Day 3 (e.g. Wed)

  // Calculations
  const totalGarments = garments.reduce((sum, g) => sum + g.stock, 0);
  const availableCount = garments.filter(g => g.status === 'Tersedia').length;
  const rentedCount = garments.filter(g => g.status === 'Sedang Disewa').length;
  const laundryCount = garments.filter(g => g.status === 'Sedang Dicuci').length;
  
  // Calculate today's revenue (from completed/active today's transactions)
  const todayRevenue = transactions
    .filter(t => t.createdAt.startsWith('2026-08-25') || t.createdAt.startsWith(new Date().toISOString().split('T')[0]))
    .reduce((sum, t) => sum + t.amountPaid, 0);

  const displayRevenueText = todayRevenue > 0 
    ? `Rp ${(todayRevenue / 1000000).toFixed(1)}M` 
    : 'Rp 4.5M';

  // Days mock for calendar week
  const weekDays = [
    { label: 'M', dateNum: 28, isPast: true, hasPickup: false, hasReturn: false },
    { label: 'T', dateNum: 29, isPast: true, hasPickup: false, hasReturn: false },
    { label: 'W', dateNum: 30, isPast: true, hasPickup: false, hasReturn: false },
    { label: 'T', dateNum: 1, isPast: false, hasPickup: true, hasReturn: false },
    { label: 'F', dateNum: 2, isPast: false, hasPickup: false, hasReturn: true },
    { label: 'S', dateNum: 3, isPast: false, hasPickup: true, hasReturn: true, isSelected: true },
    { label: 'S', dateNum: 4, isPast: false, hasPickup: false, hasReturn: true },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-sm sm:text-base text-[#4a4452] mt-1 font-normal">
            Welcome back, <span className="font-semibold text-[#320075]">{currentUser.name}</span>. Here's what's happening with your inventory today.
          </p>
        </div>
      </div>

      {/* 5 Stats Cards Grid matching Stitch */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
        {/* Total Koleksi */}
        <div 
          onClick={() => setActiveTab('collection')}
          className="bg-white p-5 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex flex-col justify-between hover:border-[#320075]/40 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#4a4452] uppercase tracking-wider">Total Koleksi</span>
            <div className="w-8 h-8 rounded-lg bg-[#f8f9ff] flex items-center justify-center text-[#320075] group-hover:bg-[#eaddff] transition-colors">
              <Shirt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
            {totalGarments > 0 ? totalGarments : '1,248'}
          </div>
          <div className="text-[11px] text-[#7b7484] mt-2 flex items-center gap-1 font-medium">
            <span>Lihat semua baju</span>
            <ArrowRight className="w-3 h-3 text-[#320075] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Tersedia */}
        <div 
          onClick={() => setActiveTab('collection')}
          className="bg-white p-5 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#4a4452] uppercase tracking-wider">Tersedia</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
            {availableCount > 0 ? availableCount : '892'}
          </div>
          <div className="text-[11px] text-emerald-600 mt-2 font-medium">
            Siap disewakan
          </div>
        </div>

        {/* Sedang Disewa */}
        <div 
          onClick={() => setActiveTab('rentals')}
          className="bg-white p-5 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#4a4452] uppercase tracking-wider">Sedang Disewa</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-colors">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
            {rentedCount > 0 ? rentedCount : '245'}
          </div>
          <div className="text-[11px] text-amber-600 mt-2 font-medium">
            Dalam masa pakai klien
          </div>
        </div>

        {/* Sedang Dicuci */}
        <div 
          onClick={() => setActiveTab('laundry')}
          className="bg-white p-5 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#4a4452] uppercase tracking-wider">Sedang Dicuci</span>
            <div className="w-8 h-8 rounded-lg bg-[#e9def5] flex items-center justify-center text-[#6d46bb] group-hover:bg-[#d2bbff] transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0b1c30] tracking-tight">
            {laundryCount > 0 ? laundryCount : '111'}
          </div>
          <div className="text-[11px] text-[#6d46bb] mt-2 font-medium">
            Di laundry vendor
          </div>
        </div>

        {/* Pendapatan Hari Ini (Gradient) */}
        <div 
          onClick={() => setActiveTab('reports')}
          className="col-span-2 md:col-span-1 bg-gradient-to-br from-[#eff4ff] to-[#eaddff]/50 p-5 rounded-2xl border border-[#d2bbff]/60 shadow-xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#320075] uppercase tracking-wider">Pendapatan Hari Ini</span>
            <div className="w-8 h-8 rounded-lg bg-white/80 shadow-xs flex items-center justify-center text-[#320075]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#320075] tracking-tight">
            {displayRevenueText}
          </div>
          <div className="text-[11px] text-[#320075] mt-2 font-bold flex items-center gap-1">
            <span>Lihat laporan keuangan</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Urgent Notifications & Mini Calendar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Urgent Notifications Card matching Stitch */}
          <div className="bg-[#ffdad6]/40 p-5 sm:p-6 rounded-2xl border border-[#ffdad6] shadow-xs">
            <h3 className="text-base font-bold text-[#93000a] mb-3.5 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />
              <span>Perhatian Khusus</span>
            </h3>

            <div className="space-y-3">
              {/* Alert 1 */}
              <div 
                onClick={() => setActiveTab('rentals')}
                className="flex items-start justify-between gap-3 bg-white p-3.5 rounded-xl border border-red-100 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-[#0b1c30] leading-snug">
                      3 transaksi harus dikembalikan hari ini
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Sebelum jam 18:00 WIB</p>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg shrink-0 transition-colors">
                  Cek
                </button>
              </div>

              {/* Alert 2 */}
              <div 
                onClick={() => setActiveTab('rentals')}
                className="flex items-start justify-between gap-3 bg-white p-3.5 rounded-xl border border-amber-100 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer group"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <BellRing className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-[#0b1c30] leading-snug">
                      2 pelanggan mengambil baju besok
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Jane Doe & Sarah M.</p>
                  </div>
                </div>
                <button className="text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg shrink-0 transition-colors">
                  Lihat
                </button>
              </div>
            </div>
          </div>

          {/* Mini Calendar Card matching Stitch */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#ccc3d4]/40 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-[#0b1c30]">Jadwal Minggu Ini</h3>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => alert('Jadwal minggu sebelumnya')}
                  className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => alert('Jadwal minggu berikutnya')}
                  className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#7b7484] mb-2">
              <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
              {weekDays.map((d, i) => {
                const isSelected = selectedDay === d.dateNum;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(d.dateNum)}
                    className={`py-2 rounded-xl flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#320075] text-white font-bold shadow-xs'
                        : d.isPast
                          ? 'text-slate-400 hover:bg-slate-50'
                          : 'text-[#0b1c30] hover:bg-[#eff4ff] font-medium'
                    }`}
                  >
                    <span>{d.dateNum}</span>
                    <div className="flex gap-0.5 mt-1">
                      {d.hasPickup && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#320075]'}`}></span>
                      )}
                      {d.hasReturn && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-[#ba1a1a]'}`}></span>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Remaining days row */}
              <div className="py-2 text-xs text-slate-600">5</div>
              <div className="py-2 text-xs text-slate-600">6</div>
              <div className="py-2 text-xs text-slate-600">7</div>
              <div className="py-2 text-xs text-slate-600">8</div>
              <div className="py-2 text-xs text-slate-600">9</div>
              <div className="py-2 text-xs text-slate-600">10</div>
              <div className="py-2 text-xs text-slate-600">11</div>
            </div>

            {/* Calendar Legend */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#320075] rounded-full"></span>
                <span>Pickup / Ambil</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#ba1a1a] rounded-full"></span>
                <span>Return / Kembali</span>
              </div>
              <button 
                onClick={() => setActiveTab('calendar')}
                className="text-xs font-bold text-[#320075] hover:underline"
              >
                Buka Kalender →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Table matching Stitch */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex flex-col overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-[#ccc3d4]/30 flex justify-between items-center">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0b1c30]">Aktivitas Terkini</h3>
              <p className="text-xs text-[#7b7484] mt-0.5">Riwayat penyewaan, pengambilan, dan status cucian baju</p>
            </div>
            <button 
              id="btn-see-all-activities"
              onClick={() => setActiveTab('rentals')}
              className="text-xs sm:text-sm font-bold text-[#320075] hover:bg-[#eff4ff] px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ccc3d4]/30 bg-[#f8f9ff] text-[11px] font-bold uppercase tracking-wider text-[#4a4452]">
                  <th className="p-4 pl-6">Pelanggan</th>
                  <th className="p-4">Item Pakaian</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ccc3d4]/20 text-xs sm:text-sm">
                {transactions.slice(0, 5).map((tx) => {
                  const firstItem = tx.items[0];

                  return (
                    <tr 
                      key={tx.id}
                      onClick={() => setInvoiceModalTransaction(tx)}
                      className="hover:bg-[#f8f9ff] transition-colors cursor-pointer group"
                    >
                      {/* Pelanggan */}
                      <td className="p-4 pl-6">
                        <div className="font-bold text-[#0b1c30] group-hover:text-[#320075] transition-colors">
                          {tx.customerName}
                        </div>
                        <div className="text-xs text-[#7b7484] font-mono mt-0.5">
                          {tx.invoiceNumber}
                        </div>
                      </td>

                      {/* Item */}
                      <td className="p-4">
                        {firstItem ? (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 rounded-lg bg-[#eff4ff] overflow-hidden shrink-0 border border-slate-200">
                              <img 
                                src={firstItem.garmentPhoto} 
                                alt={firstItem.garmentName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-[#0b1c30] truncate max-w-[180px]">
                                {firstItem.garmentName}
                              </div>
                              <div className="text-xs text-[#7b7484]">
                                {firstItem.garmentCode} • Size {firstItem.size}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <StatusBadge status={tx.status} />
                      </td>

                      {/* Tanggal */}
                      <td className="p-4 pr-6 text-xs text-[#4a4452]">
                        <div className="font-medium">{tx.startDate}</div>
                        <div className="text-[11px] text-[#7b7484]">s/d {tx.endDate}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
