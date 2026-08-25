import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Search, 
  CheckCircle, 
  Clock, 
  Truck, 
  DollarSign, 
  Shirt, 
  X,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LaundryItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const LaundryView: React.FC = () => {
  const { 
    laundryItems, 
    garments, 
    addLaundryItem, 
    updateLaundryStatus, 
    finishLaundry 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'washing' | 'ready'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Laundry Modal State
  const [selectedGarmentId, setSelectedGarmentId] = useState('');
  const [vendorName, setVendorName] = useState('Royal Dry Clean & Boutique Care');
  const [cost, setCost] = useState(75000);
  const [notes, setNotes] = useState('Dry clean premium khusus kebaya / payet');

  const filteredItems = laundryItems.filter(l => {
    const matchTab = activeTab === 'all' || 
      (activeTab === 'washing' && (l.status === 'Sedang Dicuci' || l.status === 'Menunggu Dicuci')) ||
      (activeTab === 'ready' && l.status === 'Siap Digunakan');

    const q = searchFilter.toLowerCase().trim();
    const matchSearch = !q || 
      l.garmentName.toLowerCase().includes(q) ||
      l.garmentCode.toLowerCase().includes(q) ||
      l.vendorName.toLowerCase().includes(q);

    return matchTab && matchSearch;
  });

  const totalInLaundry = laundryItems.filter(l => l.status === 'Sedang Dicuci' || l.status === 'Menunggu Dicuci').length;
  const totalCost = laundryItems.reduce((sum, l) => sum + (l.cost || 0), 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGarmentId) {
      alert('Pilih baju yang akan dicuci');
      return;
    }
    addLaundryItem(selectedGarmentId, undefined, vendorName, cost, notes);
    setIsAddModalOpen(false);
    setSelectedGarmentId('');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
            Manajemen Laundry & Dry Clean
          </h2>
          <p className="text-sm text-[#4a4452] mt-1 font-normal">
            Pantau proses pencucian busana pasca sewa, estimasi selesai, dan kembalikan otomatis ke stok tersedia.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="py-2.5 px-4 bg-[#320075] hover:bg-[#4a1d96] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Kirim Baju ke Laundry</span>
        </button>
      </div>

      {/* Laundry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#e9def5] text-[#6d46bb] flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Sedang Di Laundry</div>
            <div className="text-2xl font-black text-slate-900">{totalInLaundry} Pcs</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Siap Digunakan Kembali</div>
            <div className="text-2xl font-black text-slate-900">
              {laundryItems.filter(l => l.status === 'Siap Digunakan').length} Pcs
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase">Total Biaya Perawatan</div>
            <div className="text-2xl font-black text-slate-900">Rp {totalCost.toLocaleString('id-ID')}</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'all' ? 'bg-[#320075] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({laundryItems.length})
          </button>
          <button
            onClick={() => setActiveTab('washing')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'washing' ? 'bg-[#320075] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sedang Dicuci ({totalInLaundry})
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'ready' ? 'bg-[#320075] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Selesai / Bersih
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Cari baju, vendor laundry..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#320075]"
          />
        </div>
      </div>

      {/* Laundry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const isDone = item.status === 'Siap Digunakan';

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#ccc3d4]/40 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.garmentPhoto}
                      alt={item.garmentName}
                      className="w-12 h-14 object-cover rounded-xl bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div>
                      <span className="font-mono text-[11px] font-bold text-[#320075] bg-[#eaddff] px-2 py-0.5 rounded">
                        {item.garmentCode}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1 leading-snug line-clamp-1">
                        {item.garmentName}
                      </h4>
                      {item.rentalInvoiceNumber && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Dari Nota: {item.rentalInvoiceNumber}
                        </div>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={item.status === 'Siap Digunakan' ? 'Selesai' : 'Sedang Dicuci'} />
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Vendor:</span>
                    <span className="font-semibold text-slate-800">{item.vendorName}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tgl Kirim:</span>
                    <span>{item.sentDate}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimasi Selesai:</span>
                    <span className="font-semibold text-[#320075]">{item.estimatedDoneDate}</span>
                  </div>
                  {item.cost && (
                    <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                      <span>Biaya Cuci:</span>
                      <span className="font-bold text-slate-900">Rp {item.cost.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                </div>

                {item.notes && (
                  <p className="text-[11px] text-slate-500 italic bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                    {item.notes}
                  </p>
                )}
              </div>

              {!isDone ? (
                <button
                  onClick={() => finishLaundry(item.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Selesai Cuci & Kembalikan ke Stok</span>
                </button>
              ) : (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-semibold text-center border border-emerald-200 flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Telah Kembali ke Stok (Tersedia)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Laundry Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#f8f9ff]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#320075]" />
                <h3 className="font-bold text-slate-800 text-base">Kirim Pakaian ke Laundry</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Baju *</label>
                <select
                  required
                  value={selectedGarmentId}
                  onChange={e => setSelectedGarmentId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:border-[#320075]"
                >
                  <option value="">-- Pilih Baju dari Katalog --</option>
                  {garments.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.code}) - {g.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Vendor Laundry</label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={e => setVendorName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-[#320075]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimasi Biaya Cuci (Rp)</label>
                <input
                  type="number"
                  value={cost}
                  onChange={e => setCost(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:bg-white focus:border-[#320075]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Cuci / Perawatan Khusus</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white resize-none"
                  placeholder="Contoh: Jangan disikat, khusus dry clean..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#320075] text-white font-semibold hover:bg-[#4a1d96]"
                >
                  Kirim ke Laundry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
