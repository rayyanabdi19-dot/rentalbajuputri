import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  QrCode, 
  Sparkles, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  DollarSign, 
  TrendingUp, 
  Shirt, 
  Calendar,
  AlertCircle,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GarmentItem, GarmentCategory, GarmentStatus, GarmentCondition } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const CollectionView: React.FC = () => {
  const { 
    garments, 
    addGarment, 
    updateGarment, 
    deleteGarment, 
    addLaundryItem, 
    setQrModalData,
    selectedGarmentId,
    setSelectedGarmentId,
    setIsNewRentalModalOpen
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Add / Edit Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGarment, setEditingGarment] = useState<GarmentItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Kebaya Modern' as GarmentCategory,
    color: '',
    size: 'M',
    stock: 1,
    rentalPricePerDay: 250000,
    depositAmount: 100000,
    purchasePrice: 1500000,
    brand: '',
    notes: '',
    photos: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80'],
    status: 'Tersedia' as GarmentStatus,
    condition: 'Baik' as GarmentCondition
  });

  const categories: GarmentCategory[] = [
    'Kebaya Modern', 
    'Gaun Malam', 
    'Jas Pria', 
    'Baju Adat', 
    'Gaun Pengantin', 
    'Baju Anak', 
    'Aksesoris'
  ];

  // Open add garment form
  const handleOpenAdd = () => {
    const nextNum = garments.length + 1;
    const generatedCode = `KB-${String(nextNum).padStart(3, '0')}`;
    setEditingGarment(null);
    setFormData({
      code: generatedCode,
      name: '',
      category: 'Kebaya Modern',
      color: '',
      size: 'M',
      stock: 1,
      rentalPricePerDay: 250000,
      depositAmount: 100000,
      purchasePrice: 1500000,
      brand: '',
      notes: '',
      photos: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80'],
      status: 'Tersedia',
      condition: 'Baik'
    });
    setIsAddModalOpen(true);
  };

  // Open edit garment form
  const handleOpenEdit = (g: GarmentItem) => {
    setEditingGarment(g);
    setFormData({
      code: g.code,
      name: g.name,
      category: g.category,
      color: g.color,
      size: g.size,
      stock: g.stock,
      rentalPricePerDay: g.rentalPricePerDay,
      depositAmount: g.depositAmount,
      purchasePrice: g.purchasePrice,
      brand: g.brand || '',
      notes: g.notes || '',
      photos: g.photos.length > 0 ? g.photos : ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80'],
      status: g.status,
      condition: g.condition
    });
    setIsAddModalOpen(true);
  };

  const handleSaveGarment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      alert('Mohon isi nama baju dan kode baju');
      return;
    }

    if (editingGarment) {
      updateGarment(editingGarment.id, {
        code: formData.code,
        name: formData.name,
        category: formData.category,
        color: formData.color,
        size: formData.size,
        stock: Number(formData.stock),
        rentalPricePerDay: Number(formData.rentalPricePerDay),
        depositAmount: Number(formData.depositAmount),
        purchasePrice: Number(formData.purchasePrice),
        brand: formData.brand,
        notes: formData.notes,
        photos: formData.photos,
        status: formData.status,
        condition: formData.condition
      });
    } else {
      addGarment({
        code: formData.code,
        name: formData.name,
        category: formData.category,
        color: formData.color,
        size: formData.size,
        stock: Number(formData.stock),
        rentalPricePerDay: Number(formData.rentalPricePerDay),
        depositAmount: Number(formData.depositAmount),
        purchasePrice: Number(formData.purchasePrice),
        brand: formData.brand,
        notes: formData.notes,
        photos: formData.photos,
        status: formData.status,
        condition: formData.condition
      });
    }

    setIsAddModalOpen(false);
  };

  // Filter logic
  const filteredGarments = garments.filter(g => {
    const matchCat = categoryFilter === 'Semua' || g.category === categoryFilter;
    const matchStatus = statusFilter === 'Semua' || g.status === statusFilter;
    const q = searchFilter.toLowerCase().trim();
    const matchSearch = !q || 
      g.name.toLowerCase().includes(q) || 
      g.code.toLowerCase().includes(q) || 
      g.color.toLowerCase().includes(q) ||
      (g.brand && g.brand.toLowerCase().includes(q));

    return matchCat && matchStatus && matchSearch;
  });

  const selectedGarment = garments.find(g => g.id === selectedGarmentId);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
            Koleksi Pakaian Butik
          </h2>
          <p className="text-sm text-[#4a4452] mt-1 font-normal">
            Kelola stok baju pesta, kebaya, jas, baju adat, gaun pengantin, serta status ketersediaan.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-add-garment"
            onClick={handleOpenAdd}
            className="py-2.5 px-4 bg-[#320075] hover:bg-[#4a1d96] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Baju</span>
          </button>
        </div>
      </div>

      {/* Categories Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setCategoryFilter('Semua')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
            categoryFilter === 'Semua'
              ? 'bg-[#320075] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          Semua Kategori ({garments.length})
        </button>
        {categories.map(cat => {
          const count = garments.filter(g => g.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#320075] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Search & Status Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Cari nama, kode KB-..., warna..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#320075]/20 focus:border-[#320075]"
          />
          {searchFilter && (
            <button onClick={() => setSearchFilter('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto justify-end">
          {/* Status Dropdown Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 outline-none cursor-pointer"
          >
            <option value="Semua">Semua Status</option>
            <option value="Tersedia">🟢 Tersedia</option>
            <option value="Dipesan">🔵 Dipesan</option>
            <option value="Sedang Disewa">🟠 Sedang Disewa</option>
            <option value="Sedang Dicuci">🟣 Sedang Dicuci</option>
            <option value="Perbaikan">⚫ Perbaikan</option>
          </select>

          {/* Grid / List Switcher */}
          <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-0.5 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-white text-[#320075] font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'list' ? 'bg-white text-[#320075] font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Garments Grid / List */}
      {filteredGarments.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Shirt className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Tidak ada baju yang cocok</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau reset filter kategori & status baju.
          </p>
          <button
            onClick={() => {
              setCategoryFilter('Semua');
              setStatusFilter('Semua');
              setSearchFilter('');
            }}
            className="text-xs font-bold text-[#320075] hover:underline"
          >
            Reset Filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredGarments.map((g) => {
            const isRoi = g.totalRevenueGenerated >= g.purchasePrice;
            const roiPercent = g.purchasePrice > 0 
              ? Math.round((g.totalRevenueGenerated / g.purchasePrice) * 100)
              : 100;

            return (
              <div
                key={g.id}
                onClick={() => setSelectedGarmentId(g.id)}
                className="bg-white rounded-2xl border border-[#ccc3d4]/40 shadow-xs overflow-hidden hover:border-[#320075]/40 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Photo with Overlay Badges */}
                  <div className="relative aspect-3/4 bg-slate-100 overflow-hidden">
                    <img
                      src={g.photos[0] || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80'}
                      alt={g.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <StatusBadge status={g.status} />
                    </div>

                    <div className="absolute top-3 right-3 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQrModalData({
                            title: g.name,
                            code: g.code,
                            type: 'garment',
                            extra: `Rp ${g.rentalPricePerDay.toLocaleString('id-ID')}/hari`
                          });
                        }}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:bg-white flex items-center justify-center shadow-xs transition-colors"
                        title="QR Code & Tag"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                      Size: {g.size}
                    </div>
                  </div>

                  {/* Info Body */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-mono font-bold text-[#320075] bg-[#eaddff]/60 px-2 py-0.5 rounded-md">
                        {g.code}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {g.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-[#320075] transition-colors">
                      {g.name}
                    </h3>

                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-base font-extrabold text-[#0b1c30]">
                          Rp {g.rentalPricePerDay.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[11px] text-slate-500">/hari</span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {g.totalRentCount}x sewa
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Balik Modal Tracker */}
                <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className={`w-3.5 h-3.5 ${isRoi ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className={`text-[11px] font-semibold ${isRoi ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {isRoi ? `Untung (${roiPercent}%)` : `ROI ${roiPercent}%`}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">
                    Kondisi: <span className="font-bold text-slate-700">{g.condition}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View (Table) */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-4 pl-6">Foto & Nama</th>
                  <th className="p-4">Kode</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Size / Warna</th>
                  <th className="p-4">Harga Sewa</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Total Sewa</th>
                  <th className="p-4 pr-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredGarments.map((g) => (
                  <tr 
                    key={g.id}
                    onClick={() => setSelectedGarmentId(g.id)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={g.photos[0]} 
                          alt={g.name} 
                          className="w-10 h-12 object-cover rounded-lg bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{g.name}</div>
                          {g.brand && <div className="text-[11px] text-slate-400">{g.brand}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-xs text-[#320075]">{g.code}</td>
                    <td className="p-4 text-slate-600">{g.category}</td>
                    <td className="p-4 text-slate-600">
                      <span className="font-semibold">{g.size}</span> • {g.color}
                    </td>
                    <td className="p-4 font-extrabold text-slate-900">
                      Rp {g.rentalPricePerDay.toLocaleString('id-ID')}/hr
                    </td>
                    <td className="p-4">
                      <StatusBadge status={g.status} />
                    </td>
                    <td className="p-4 text-slate-600 font-semibold">{g.totalRentCount}x</td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenEdit(g)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#320075] hover:bg-slate-100"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus baju ${g.name}?`)) {
                              deleteGarment(g.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Garment Detail Modal */}
      {selectedGarment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#f8f9ff]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#320075] bg-[#eaddff] px-2.5 py-1 rounded-md">
                  {selectedGarment.code}
                </span>
                <StatusBadge status={selectedGarment.status} />
              </div>
              <button
                onClick={() => setSelectedGarmentId(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Photo Gallery */}
                <div className="space-y-2">
                  <div className="aspect-3/4 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={selectedGarment.photos[0]}
                      alt={selectedGarment.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedGarment.photos.length > 1 && (
                    <div className="flex gap-2">
                      {selectedGarment.photos.map((ph, idx) => (
                        <div key={idx} className="w-14 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                          <img src={ph} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase">{selectedGarment.category}</span>
                    <h3 className="text-xl font-extrabold text-slate-900 leading-tight mt-0.5">
                      {selectedGarment.name}
                    </h3>
                    {selectedGarment.brand && (
                      <p className="text-xs text-slate-500 mt-1">Brand / Desainer: <span className="font-semibold text-slate-700">{selectedGarment.brand}</span></p>
                    )}
                  </div>

                  {/* Pricing Cards */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <div className="text-slate-400 font-medium">Harga Sewa / Hari</div>
                      <div className="font-extrabold text-sm text-[#320075]">
                        Rp {selectedGarment.rentalPricePerDay.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-medium">Uang Jaminan (Deposit)</div>
                      <div className="font-extrabold text-sm text-slate-700">
                        Rp {selectedGarment.depositAmount.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg border border-slate-200">
                      <div className="text-slate-400">Ukuran (Size)</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedGarment.size}</div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200">
                      <div className="text-slate-400">Warna Utama</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedGarment.color}</div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200">
                      <div className="text-slate-400">Kondisi Fisik</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedGarment.condition}</div>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200">
                      <div className="text-slate-400">Jumlah Stok</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedGarment.stock} Pcs</div>
                    </div>
                  </div>

                  {/* Profitability / ROI Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 p-3.5 rounded-xl border border-purple-100 space-y-2 text-xs">
                    <div className="font-bold text-[#320075] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" /> Analisis Profit Baju
                      </span>
                      <span>{selectedGarment.totalRentCount} Kali Disewa</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-slate-500">Harga Modal Beli:</span>
                        <div className="font-semibold text-slate-700">
                          Rp {selectedGarment.purchasePrice.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Total Omset Didapat:</span>
                        <div className="font-extrabold text-emerald-700">
                          Rp {selectedGarment.totalRevenueGenerated.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedGarment.notes && (
                    <div className="text-xs text-slate-600 bg-amber-50/50 border border-amber-100 p-3 rounded-xl">
                      <span className="font-bold text-amber-800">Catatan Khusus: </span>
                      {selectedGarment.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setQrModalData({
                      title: selectedGarment.name,
                      code: selectedGarment.code,
                      type: 'garment',
                      extra: `Rp ${selectedGarment.rentalPricePerDay.toLocaleString('id-ID')}/hari`
                    });
                  }}
                  className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-white flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Cetak Barcode</span>
                </button>

                {selectedGarment.status !== 'Sedang Dicuci' && (
                  <button
                    onClick={() => {
                      addLaundryItem(selectedGarment.id);
                      setSelectedGarmentId(null);
                    }}
                    className="py-2 px-3 rounded-xl bg-purple-50 text-[#320075] border border-purple-200 font-semibold text-xs hover:bg-purple-100 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Kirim Laundry</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleOpenEdit(selectedGarment);
                    setSelectedGarmentId(null);
                  }}
                  className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-white flex items-center gap-1.5"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Data</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedGarmentId(null);
                    setIsNewRentalModalOpen(true);
                  }}
                  className="py-2 px-4 rounded-xl bg-[#320075] text-white font-semibold text-xs hover:bg-[#4a1d96] flex items-center gap-1.5 shadow-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Sewa Baju Ini</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Garment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#f8f9ff]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#320075] text-white flex items-center justify-center font-bold">
                  <Shirt className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">
                  {editingGarment ? 'Edit Data Pakaian' : 'Tambah Pakaian Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGarment} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Baju *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:border-[#320075] outline-none"
                    placeholder="Contoh: KB-001"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as GarmentCategory })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Pakaian / Model *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                  placeholder="Contoh: Kebaya Brokat Rose Gold Mewah"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ukuran (Size)</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={e => setFormData({ ...formData, size: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                    placeholder="S / M / L / XL"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Warna</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                    placeholder="Rose Gold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stok Pcs</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harga Sewa / Hari (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={formData.rentalPricePerDay}
                    onChange={e => setFormData({ ...formData, rentalPricePerDay: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Uang Jaminan/Deposit (Rp)</label>
                  <input
                    type="number"
                    value={formData.depositAmount}
                    onChange={e => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harga Modal Beli (Rp)</label>
                  <input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={e => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL Foto Baju</label>
                <input
                  type="text"
                  value={formData.photos[0]}
                  onChange={e => setFormData({ ...formData, photos: [e.target.value] })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none text-xs"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Ketersediaan</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as GarmentStatus })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Dipesan">Dipesan</option>
                    <option value="Sedang Disewa">Sedang Disewa</option>
                    <option value="Sedang Dicuci">Sedang Dicuci</option>
                    <option value="Perbaikan">Perbaikan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kondisi</label>
                  <select
                    value={formData.condition}
                    onChange={e => setFormData({ ...formData, condition: e.target.value as GarmentCondition })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                  >
                    <option value="Baik">Baik (Sempurna)</option>
                    <option value="Rusak Ringan">Rusak Ringan (Perlu jahit)</option>
                    <option value="Kotor">Kotor (Perlu Laundry)</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan / Detail Ukuran</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Contoh: Lingkar dada 92cm, panjang gaun 140cm, termasuk obi belt..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#320075] text-white font-semibold hover:bg-[#4a1d96] shadow-xs"
                >
                  {editingGarment ? 'Simpan Perubahan' : 'Tambahkan Baju'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
