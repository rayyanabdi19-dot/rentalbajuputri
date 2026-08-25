import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Phone, 
  MessageSquare, 
  Instagram, 
  CreditCard, 
  AlertCircle, 
  Check, 
  X, 
  Edit, 
  Trash2, 
  Shirt, 
  Calendar,
  Sparkles,
  User,
  MapPin,
  Ruler,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer, CustomerTier } from '../../types';

export const CustomerDirectoryView: React.FC = () => {
  const { 
    customers, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer, 
    selectedCustomerId, 
    setSelectedCustomerId,
    setWhatsappModalData,
    setIsNewRentalModalOpen
  } = useApp();

  const [searchFilter, setSearchFilter] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('Semua');

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    phone: '',
    email: '',
    instagram: '',
    address: '',
    identityType: 'KTP' as 'KTP' | 'SIM' | 'Paspor',
    identityNumber: '',
    tier: 'Regular' as CustomerTier,
    bodyMeasurements: {
      chest: 88,
      waist: 70,
      hips: 94,
      shoulder: 38,
      height: 165
    },
    notes: ''
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      whatsapp: '08',
      phone: '',
      email: '',
      instagram: '@',
      address: '',
      identityType: 'KTP',
      identityNumber: '',
      tier: 'Regular',
      bodyMeasurements: { chest: 88, waist: 70, hips: 94, shoulder: 38, height: 165 },
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      whatsapp: c.whatsapp,
      phone: c.phone || '',
      email: c.email || '',
      instagram: c.instagram || '@',
      address: c.address,
      identityType: c.identityType,
      identityNumber: c.identityNumber,
      tier: c.tier,
      bodyMeasurements: c.bodyMeasurements || { chest: 88, waist: 70, hips: 94, shoulder: 38, height: 165 },
      notes: c.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.whatsapp.trim()) {
      alert('Mohon lengkapi Nama Pelanggan dan Nomor WhatsApp');
      return;
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name: formData.name,
        whatsapp: formData.whatsapp,
        phone: formData.phone,
        email: formData.email,
        instagram: formData.instagram,
        address: formData.address,
        identityType: formData.identityType,
        identityNumber: formData.identityNumber,
        tier: formData.tier,
        bodyMeasurements: formData.bodyMeasurements,
        notes: formData.notes
      });
    } else {
      addCustomer({
        name: formData.name,
        whatsapp: formData.whatsapp,
        phone: formData.phone,
        email: formData.email,
        instagram: formData.instagram,
        address: formData.address,
        identityType: formData.identityType,
        identityNumber: formData.identityNumber,
        tier: formData.tier,
        bodyMeasurements: formData.bodyMeasurements,
        notes: formData.notes
      });
    }

    setIsModalOpen(false);
  };

  const filteredCustomers = customers.filter(c => {
    const matchTier = tierFilter === 'Semua' || c.tier === tierFilter;
    const q = searchFilter.toLowerCase().trim();
    const matchSearch = !q ||
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.whatsapp.includes(q) ||
      (c.instagram && c.instagram.toLowerCase().includes(q));

    return matchTier && matchSearch;
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
            Customer Directory
          </h2>
          <p className="text-sm text-[#4a4452] mt-1 font-normal">
            Database pelanggan butik, riwayat sewa, ukuran badan fitting, dan integrasi WhatsApp.
          </p>
        </div>

        <button
          id="btn-add-customer"
          onClick={handleOpenAdd}
          className="py-2.5 px-4 bg-[#320075] hover:bg-[#4a1d96] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Pelanggan</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Cari nama, CUS-..., no WhatsApp..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#320075]/20 focus:border-[#320075]"
          />
          {searchFilter && (
            <button onClick={() => setSearchFilter('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500">Tier:</span>
          <div className="flex gap-1 overflow-x-auto">
            {['Semua', 'VIP', 'Loyal', 'Regular', 'Baru'].map(t => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  tierFilter === t ? 'bg-[#320075] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table matching Stitch */}
      <div className="bg-white rounded-2xl border border-[#ccc3d4]/40 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] border-b border-[#ccc3d4]/30 text-[11px] font-bold uppercase tracking-wider text-[#4a4452]">
                <th className="p-4 pl-6">Customer</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Rental Stats</th>
                <th className="p-4">Status / Tier</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ccc3d4]/20 text-xs sm:text-sm">
              {filteredCustomers.map((c) => {
                const isSelected = selectedCustomerId === c.id;

                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomerId(c.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#eff4ff]' : 'hover:bg-[#f8f9ff]'
                    }`}
                  >
                    {/* Customer */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#eaddff] text-[#320075] flex items-center justify-center font-extrabold text-sm shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#0b1c30]">{c.name}</div>
                          <div className="text-xs text-[#7b7484] font-mono">
                            ID: #{c.code}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="p-4">
                      <div className="text-[#0b1c30] font-medium flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.whatsapp}</span>
                      </div>
                      {c.instagram && (
                        <div className="text-xs text-[#7b7484] flex items-center gap-1.5 mt-0.5">
                          <Instagram className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.instagram}</span>
                        </div>
                      )}
                    </td>

                    {/* Rental Stats */}
                    <td className="p-4">
                      <div className="font-bold text-[#0b1c30]">
                        {c.totalRentals} Rentals
                      </div>
                      <div className="text-xs text-[#7b7484]">
                        Rp {c.totalSpent.toLocaleString('id-ID')} spent
                      </div>
                    </td>

                    {/* Status Tier */}
                    <td className="p-4">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                        c.tier === 'VIP' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        c.tier === 'Loyal' ? 'bg-purple-100 text-purple-800' :
                        c.tier === 'Baru' ? 'bg-blue-50 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {c.tier}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setWhatsappModalData({
                              title: `Kirim WhatsApp ke ${c.name}`,
                              phone: c.whatsapp,
                              message: `Halo Kak ${c.name}, terima kasih telah mempercayakan sewa pakaian di butik kami. Ada yang bisa kami bantu? ✨`
                            });
                          }}
                          className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Chat WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-2 rounded-lg text-slate-400 hover:text-[#320075] hover:bg-slate-100 transition-colors"
                          title="Edit Customer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus pelanggan ${c.name}?`)) {
                              deleteCustomer(c.id);
                            }
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Side Panel / Modal matching Stitch */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#f8f9ff]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#320075] text-white flex items-center justify-center font-bold text-lg">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                      {selectedCustomer.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-[#320075]">
                      {selectedCustomer.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">ID: #{selectedCustomer.code} • Bergabung {selectedCustomer.createdAt}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Contact Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-medium">WhatsApp / Telp</span>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedCustomer.whatsapp}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Instagram</span>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedCustomer.instagram || '-'}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-medium">Alamat Domisili</span>
                  <div className="font-medium text-slate-700 mt-0.5">{selectedCustomer.address || 'Belum diisi'}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 font-medium">Identitas ({selectedCustomer.identityType})</span>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">{selectedCustomer.identityNumber || '-'}</div>
                </div>
              </div>

              {/* Body Measurements (Fitting Data) */}
              {selectedCustomer.bodyMeasurements && (
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <div className="font-bold text-[#320075] text-xs flex items-center gap-1.5 mb-2.5">
                    <Ruler className="w-4 h-4" /> Data Ukuran Badan (Fitting)
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    <div className="bg-white p-2 rounded-lg border border-indigo-100">
                      <div className="text-[10px] text-slate-400">Dada (LD)</div>
                      <div className="font-extrabold text-slate-800 mt-0.5">{selectedCustomer.bodyMeasurements.chest} cm</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-indigo-100">
                      <div className="text-[10px] text-slate-400">Pinggang</div>
                      <div className="font-extrabold text-slate-800 mt-0.5">{selectedCustomer.bodyMeasurements.waist} cm</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-indigo-100">
                      <div className="text-[10px] text-slate-400">Pinggul</div>
                      <div className="font-extrabold text-slate-800 mt-0.5">{selectedCustomer.bodyMeasurements.hips} cm</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-indigo-100">
                      <div className="text-[10px] text-slate-400">Bahu</div>
                      <div className="font-extrabold text-slate-800 mt-0.5">{selectedCustomer.bodyMeasurements.shoulder} cm</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-indigo-100">
                      <div className="text-[10px] text-slate-400">Tinggi</div>
                      <div className="font-extrabold text-slate-800 mt-0.5">{selectedCustomer.bodyMeasurements.height} cm</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Rentals */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span>Riwayat Baju Yang Pernah Disewa</span>
                  <span className="text-slate-400 font-normal">{selectedCustomer.recentRentals.length} Baju</span>
                </h4>

                {selectedCustomer.recentRentals.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-400">
                    Belum ada riwayat transaksi sewa
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedCustomer.recentRentals.map(rr => (
                      <div key={rr.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-[#320075]/30">
                        <div className="flex items-center gap-3">
                          <img src={rr.garmentPhoto} alt={rr.garmentName} className="w-10 h-12 object-cover rounded-lg bg-slate-100" />
                          <div>
                            <div className="font-bold text-slate-900">{rr.garmentName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{rr.garmentCode} • {rr.returnDateText}</div>
                          </div>
                        </div>
                        <div className="font-extrabold text-[#320075] text-xs">
                          Rp {rr.rentalPrice.toLocaleString('id-ID')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Penalty History */}
              {selectedCustomer.penalties && selectedCustomer.penalties.length > 0 && (
                <div>
                  <h4 className="font-bold text-red-800 text-xs uppercase tracking-wider mb-2">
                    Riwayat Denda / Masalah
                  </h4>
                  <div className="space-y-1.5">
                    {selectedCustomer.penalties.map(p => (
                      <div key={p.id} className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-red-900">{p.reason}</div>
                          <div className="text-[11px] text-red-600">{p.date}</div>
                        </div>
                        <div className="font-extrabold text-red-800">
                          Rp {p.amount.toLocaleString('id-ID')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setWhatsappModalData({
                    title: `Kirim Pesan ke ${selectedCustomer.name}`,
                    phone: selectedCustomer.whatsapp,
                    message: `Halo Kak ${selectedCustomer.name}, selamat siang dari butik kami. Apakah Kakak berencana menyewa pakaian untuk acara mendatang? ✨`
                  });
                }}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 flex items-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Hubungi via WhatsApp</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleOpenEdit(selectedCustomer);
                    setSelectedCustomerId(null);
                  }}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-white"
                >
                  Edit Profil
                </button>
                <button
                  onClick={() => {
                    setSelectedCustomerId(null);
                    setIsNewRentalModalOpen(true);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-[#320075] text-white font-semibold text-xs hover:bg-[#4a1d96] shadow-xs"
                >
                  + Buat Sewa Baru
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Customer Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#f8f9ff]">
              <h3 className="font-bold text-slate-800 text-base">
                {editingCustomer ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                    placeholder="Contoh: Jessica Iskandar"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none font-mono"
                    placeholder="081234567890"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Instagram (@)</label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Tier</label>
                  <select
                    value={formData.tier}
                    onChange={e => setFormData({ ...formData, tier: e.target.value as CustomerTier })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                  >
                    <option value="Regular">Regular</option>
                    <option value="VIP">VIP</option>
                    <option value="Loyal">Loyal</option>
                    <option value="Baru">Baru</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipe Identitas</label>
                  <select
                    value={formData.identityType}
                    onChange={e => setFormData({ ...formData, identityType: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                  >
                    <option value="KTP">KTP</option>
                    <option value="SIM">SIM</option>
                    <option value="Paspor">Paspor</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Identitas</label>
                  <input
                    type="text"
                    value={formData.identityNumber}
                    onChange={e => setFormData({ ...formData, identityNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:border-[#320075] outline-none"
                    placeholder="3174..."
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none resize-none"
                  placeholder="Jl. Senopati No. 45, Jakarta Selatan"
                />
              </div>

              {/* Body Measurements */}
              <div className="border border-slate-200 p-3.5 rounded-xl bg-slate-50/70 space-y-2">
                <div className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-[#320075]" /> Ukuran Tubuh Fitting (cm)
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500">Dada (LD)</label>
                    <input
                      type="number"
                      value={formData.bodyMeasurements.chest}
                      onChange={e => setFormData({ ...formData, bodyMeasurements: { ...formData.bodyMeasurements, chest: Number(e.target.value) } })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Pinggang</label>
                    <input
                      type="number"
                      value={formData.bodyMeasurements.waist}
                      onChange={e => setFormData({ ...formData, bodyMeasurements: { ...formData.bodyMeasurements, waist: Number(e.target.value) } })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Pinggul</label>
                    <input
                      type="number"
                      value={formData.bodyMeasurements.hips}
                      onChange={e => setFormData({ ...formData, bodyMeasurements: { ...formData.bodyMeasurements, hips: Number(e.target.value) } })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Bahu</label>
                    <input
                      type="number"
                      value={formData.bodyMeasurements.shoulder}
                      onChange={e => setFormData({ ...formData, bodyMeasurements: { ...formData.bodyMeasurements, shoulder: Number(e.target.value) } })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Tinggi</label>
                    <input
                      type="number"
                      value={formData.bodyMeasurements.height}
                      onChange={e => setFormData({ ...formData, bodyMeasurements: { ...formData.bodyMeasurements, height: Number(e.target.value) } })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#320075] text-white font-semibold hover:bg-[#4a1d96] shadow-xs"
                >
                  {editingCustomer ? 'Simpan Perubahan' : 'Simpan Pelanggan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
