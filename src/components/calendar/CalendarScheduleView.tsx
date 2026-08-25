import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  ShoppingBag, 
  CheckCircle, 
  Clock, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const CalendarScheduleView: React.FC = () => {
  const { 
    transactions, 
    garments, 
    setIsNewRentalModalOpen, 
    setInvoiceModalTransaction 
  } = useApp();

  // Current month state
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed (7 = August)
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-08-25');

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Generate days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Active rentals on selected date
  const activeRentalsOnSelectedDate = transactions.filter(t => {
    if (t.status === 'Dibatalkan') return false;
    return selectedDateStr >= t.startDate && selectedDateStr <= t.endDate;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
            Kalender Jadwal Sewa
          </h2>
          <p className="text-sm text-[#4a4452] mt-1 font-normal">
            Visualisasi kalender pemesanan pakaian, jadwal serah terima, dan pencegahan bentrok jadwal.
          </p>
        </div>

        <button
          onClick={() => setIsNewRentalModalOpen(true)}
          className="py-2.5 px-4 bg-[#320075] hover:bg-[#4a1d96] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Booking Tanggal Ini</span>
        </button>
      </div>

      {/* Main Grid: Calendar on Left, Selected Date Schedule on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#ccc3d4]/40 shadow-xs p-5 sm:p-6 space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="w-9 h-9 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setCurrentYear(2026);
                  setCurrentMonth(7);
                  setSelectedDateStr('2026-08-25');
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
              >
                Hari Ini
              </button>
              <button
                onClick={handleNextMonth}
                className="w-9 h-9 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#7b7484] pb-2 border-b border-slate-100">
            <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots for previous month */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-20 bg-slate-50/50 rounded-xl p-1.5 border border-slate-100/50 opacity-40"></div>
            ))}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = selectedDateStr === dateStr;
              const isToday = dateStr === '2026-08-25';

              // Find rentals active on this day
              const dayRentals = transactions.filter(t => {
                if (t.status === 'Dibatalkan') return false;
                return dateStr >= t.startDate && dateStr <= t.endDate;
              });

              const hasPickup = transactions.some(t => t.startDate === dateStr && t.status !== 'Dibatalkan');
              const hasReturn = transactions.some(t => t.endDate === dateStr && t.status !== 'Dibatalkan');

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`min-h-20 rounded-xl p-2 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#320075] bg-[#eff4ff] ring-2 ring-[#320075]/20 shadow-xs'
                      : isToday
                        ? 'border-[#d2bbff] bg-[#f8f9ff]'
                        : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday ? 'bg-[#320075] text-white' : isSelected ? 'text-[#320075]' : 'text-slate-700'
                    }`}>
                      {dayNum}
                    </span>

                    {/* Indicator dots */}
                    <div className="flex gap-1">
                      {hasPickup && <span className="w-1.5 h-1.5 rounded-full bg-[#320075]" title="Ada Pengambilan"></span>}
                      {hasReturn && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Ada Pengembalian"></span>}
                    </div>
                  </div>

                  {/* Day Rental Chips */}
                  <div className="space-y-1 mt-1">
                    {dayRentals.slice(0, 2).map((r, idx) => (
                      <div
                        key={idx}
                        className="text-[10px] truncate px-1.5 py-0.5 rounded bg-[#eaddff]/70 text-[#320075] font-semibold"
                        title={`${r.customerName} - ${r.items.map(it => it.garmentName).join(', ')}`}
                      >
                        {r.customerName.split(' ')[0]}: {r.items[0]?.garmentName.split(' ')[0]}
                      </div>
                    ))}
                    {dayRentals.length > 2 && (
                      <div className="text-[9px] font-bold text-slate-400 pl-1">
                        +{dayRentals.length - 2} lagi
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#320075]"></span>
              <span>Jadwal Pengambilan (Pickup)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Jadwal Pengembalian (Return)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#eaddff] border border-[#d2bbff]"></span>
              <span>Baju Sedang Dipakai</span>
            </div>
          </div>
        </div>

        {/* Right Col: Selected Date Schedule Details */}
        <div className="bg-white rounded-2xl border border-[#ccc3d4]/40 shadow-xs p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wider text-[#320075]">Detail Jadwal Tanggal</div>
              <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">{selectedDateStr}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeRentalsOnSelectedDate.length} transaksi sewa aktif pada hari ini
              </p>
            </div>

            {activeRentalsOnSelectedDate.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                <div className="font-bold text-slate-700 text-xs">Semua Koleksi Bebas Booking</div>
                <p className="text-[11px] text-slate-400">
                  Tidak ada jadwal sewa pada tanggal ini. Siap untuk disewakan kepada pelanggan baru.
                </p>
                <button
                  onClick={() => setIsNewRentalModalOpen(true)}
                  className="mt-2 text-xs font-bold text-[#320075] hover:underline block mx-auto"
                >
                  + Buat Sewa Untuk Tanggal Ini
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[450px] overflow-y-auto">
                {activeRentalsOnSelectedDate.map(tx => (
                  <div
                    key={tx.id}
                    onClick={() => setInvoiceModalTransaction(tx)}
                    className="p-3.5 rounded-xl border border-slate-200 bg-[#f8f9ff] hover:border-[#320075]/40 transition-colors cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{tx.customerName}</span>
                      <StatusBadge status={tx.status} />
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono">
                      {tx.invoiceNumber} • {tx.startDate} s/d {tx.endDate}
                    </div>

                    <div className="space-y-1 pt-1 border-t border-slate-200">
                      {tx.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <img src={it.garmentPhoto} alt="" className="w-6 h-7 rounded object-cover" />
                          <span className="font-semibold text-slate-800 truncate">{it.garmentName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({it.garmentCode})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsNewRentalModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-[#320075] hover:bg-[#4a1d96] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Sewa Pakaian Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
