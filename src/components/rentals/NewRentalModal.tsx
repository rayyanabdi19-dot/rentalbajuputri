import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Search, 
  Plus, 
  Calendar, 
  Shirt, 
  User, 
  CreditCard, 
  AlertTriangle, 
  Sparkles, 
  DollarSign, 
  CheckCircle,
  MessageSquare,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Customer, GarmentItem, RentalTransactionItem, PaymentStatus, PaymentMethod, RentalStatus } from '../../types';

export const NewRentalModal: React.FC = () => {
  const { 
    isNewRentalModalOpen, 
    setIsNewRentalModalOpen, 
    customers, 
    garments, 
    addCustomer,
    createRentalTransaction, 
    checkGarmentAvailability, 
    settings,
    setWhatsappModalData,
    setInvoiceModalTransaction
  } = useApp();

  // Wizard Step: 1 = Customer, 2 = Items, 3 = Dates, 4 = Payment
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  
  // Quick New Customer Inline
  const [isCreatingNewCustomer, setIsCreatingNewCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('08');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const threeDaysLater = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(threeDaysLater);
  const [eventDetails, setEventDetails] = useState('Acara Pesta Pernikahan / Resepsi');
  const [fittingNotes, setFittingNotes] = useState('');

  // Selected Garment Items
  const [selectedItems, setSelectedItems] = useState<{
    garment: GarmentItem;
    quantity: number;
    pricePerDay: number;
    depositAmount: number;
  }[]>([]);

  const [garmentSearch, setGarmentSearch] = useState('');

  // Payment
  const [discount, setDiscount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('DP');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Transfer Bank');
  const [dpAmount, setDpAmount] = useState<number>(500000);
  const [autoSendWhatsApp, setAutoSendWhatsApp] = useState<boolean>(true);

  if (!isNewRentalModalOpen) return null;

  // Calculate rental days
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const rentalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1);

  // Calculations
  const subtotalSewa = selectedItems.reduce((sum, it) => sum + (it.pricePerDay * rentalDays * it.quantity), 0);
  const totalDeposit = selectedItems.reduce((sum, it) => sum + (it.depositAmount * it.quantity), 0);
  const totalAmount = Math.max(0, subtotalSewa + totalDeposit - discount);

  const amountPaid = paymentStatus === 'Lunas' 
    ? totalAmount 
    : paymentStatus === 'DP' 
      ? Math.min(dpAmount, totalAmount) 
      : 0;

  const balanceDue = Math.max(0, totalAmount - amountPaid);

  // Handle Quick Add Customer
  const handleQuickAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;
    const created = addCustomer({
      name: newCustName,
      whatsapp: newCustPhone,
      address: newCustAddress,
      identityType: 'KTP',
      identityNumber: '',
      tier: 'Baru'
    });
    setSelectedCustomer(created);
    setIsCreatingNewCustomer(false);
  };

  // Toggle item selection
  const handleToggleGarment = (garment: GarmentItem) => {
    const exists = selectedItems.find(it => it.garment.id === garment.id);
    if (exists) {
      setSelectedItems(prev => prev.filter(it => it.garment.id !== garment.id));
    } else {
      // Check conflict
      const check = checkGarmentAvailability(garment.id, startDate, endDate);
      if (!check.isAvailable) {
        alert(`⚠️ Peringatan Ketersediaan:\n${check.reason}`);
      }
      setSelectedItems(prev => [
        ...prev,
        {
          garment,
          quantity: 1,
          pricePerDay: garment.rentalPricePerDay,
          depositAmount: garment.depositAmount
        }
      ]);
    }
  };

  // Submit Final Transaction
  const handleSubmitTransaction = () => {
    if (!selectedCustomer) {
      alert('Pilih pelanggan terlebih dahulu');
      setStep(1);
      return;
    }
    if (selectedItems.length === 0) {
      alert('Pilih minimal 1 baju untuk disewa');
      setStep(2);
      return;
    }

    const items: RentalTransactionItem[] = selectedItems.map(it => ({
      garmentId: it.garment.id,
      garmentCode: it.garment.code,
      garmentName: it.garment.name,
      garmentPhoto: it.garment.photos[0],
      size: it.garment.size,
      color: it.garment.color,
      quantity: it.quantity,
      pricePerDay: it.pricePerDay,
      days: rentalDays,
      subtotal: it.pricePerDay * rentalDays * it.quantity,
      depositAmount: it.depositAmount * it.quantity
    }));

    const initialStatus: RentalStatus = (startDate === todayStr) ? 'Sedang Disewa' : 'Dipesan';

    const createdTx = createRentalTransaction({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.whatsapp,
      startDate,
      endDate,
      eventDetails,
      fittingNotes,
      items,
      subtotal: subtotalSewa,
      depositAmount: totalDeposit,
      discount,
      totalAmount,
      amountPaid,
      balanceDue,
      paymentStatus,
      paymentMethod,
      status: initialStatus,
      notes: fittingNotes ? `Fitting: ${fittingNotes}` : ''
    });

    // Fire Confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsNewRentalModalOpen(false);

    // Optionally trigger WhatsApp message modal
    if (autoSendWhatsApp) {
      const waMsg = `*INVOICE PENYEWAAN BAJU* ✨\n*${settings.boutiqueName}*\n----------------------------------------\nNo. Nota: *${createdTx.invoiceNumber}*\nPelanggan: ${createdTx.customerName}\nPeriode: ${createdTx.startDate} s/d ${createdTx.endDate} (${rentalDays} Hari)\n\n*Item Pakaian:*\n${createdTx.items.map(it => `- ${it.garmentName} (${it.garmentCode}) [Size ${it.size}]`).join('\n')}\n\n*Rincian Biaya:*\n- Sewa: Rp${subtotalSewa.toLocaleString('id-ID')}\n- Deposit Jaminan: Rp${totalDeposit.toLocaleString('id-ID')}\n- Diskon: Rp${discount.toLocaleString('id-ID')}\n*Total: Rp${totalAmount.toLocaleString('id-ID')}*\n\nStatus Bayar: *${paymentStatus}*\nDibayar: Rp${amountPaid.toLocaleString('id-ID')}\nSisa Piutang: Rp${balanceDue.toLocaleString('id-ID')}\n\nTerima kasih! Silakan bawa KTP asli saat pengambilan. ✨`;

      setWhatsappModalData({
        title: `Kirim Nota ke ${createdTx.customerName}`,
        phone: createdTx.customerPhone,
        message: waMsg
      });
    } else {
      setInvoiceModalTransaction(createdTx);
    }
  };

  const filteredCustomers = customers.filter(c => 
    !customerSearch || 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
    c.whatsapp.includes(customerSearch) ||
    c.code.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredGarments = garments.filter(g =>
    !garmentSearch ||
    g.name.toLowerCase().includes(garmentSearch.toLowerCase()) ||
    g.code.toLowerCase().includes(garmentSearch.toLowerCase()) ||
    g.category.toLowerCase().includes(garmentSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-[#f8f9ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#320075] text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                Transaksi Penyewaan Baru
              </h3>
              <p className="text-xs text-slate-500">Formulir booking, jadwal sewa, dan penerbitan nota</p>
            </div>
          </div>
          <button 
            onClick={() => setIsNewRentalModalOpen(false)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Steps Indicator Progress Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between text-xs font-semibold">
          <button 
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 cursor-pointer ${step >= 1 ? 'text-[#320075]' : 'text-slate-400'}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 1 ? 'bg-[#320075] text-white' : step > 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {step > 1 ? '✓' : '1'}
            </span>
            <span className="hidden sm:inline">1. Pelanggan</span>
          </button>
          
          <div className={`h-0.5 flex-1 mx-2 ${step > 1 ? 'bg-[#320075]' : 'bg-slate-200'}`} />

          <button 
            onClick={() => selectedCustomer && setStep(2)}
            className={`flex items-center gap-2 cursor-pointer ${step >= 2 ? 'text-[#320075]' : 'text-slate-400'}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 2 ? 'bg-[#320075] text-white' : step > 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {step > 2 ? '✓' : '2'}
            </span>
            <span className="hidden sm:inline">2. Pilih Baju</span>
          </button>

          <div className={`h-0.5 flex-1 mx-2 ${step > 2 ? 'bg-[#320075]' : 'bg-slate-200'}`} />

          <button 
            onClick={() => selectedCustomer && selectedItems.length > 0 && setStep(3)}
            className={`flex items-center gap-2 cursor-pointer ${step >= 3 ? 'text-[#320075]' : 'text-slate-400'}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 3 ? 'bg-[#320075] text-white' : step > 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
            }`}>
              {step > 3 ? '✓' : '3'}
            </span>
            <span className="hidden sm:inline">3. Tanggal & Fitting</span>
          </button>

          <div className={`h-0.5 flex-1 mx-2 ${step > 3 ? 'bg-[#320075]' : 'bg-slate-200'}`} />

          <button 
            onClick={() => selectedCustomer && selectedItems.length > 0 && setStep(4)}
            className={`flex items-center gap-2 cursor-pointer ${step === 4 ? 'text-[#320075]' : 'text-slate-400'}`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step === 4 ? 'bg-[#320075] text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              4
            </span>
            <span className="hidden sm:inline">4. Pembayaran</span>
          </button>
        </div>

        {/* Wizard Step Bodies */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: Select Customer */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Pilih Pelanggan Penyewa</h4>
                  <p className="text-xs text-slate-500">Pilih dari kontak terdaftar atau daftarkan pelanggan baru</p>
                </div>
                <button
                  onClick={() => setIsCreatingNewCustomer(!isCreatingNewCustomer)}
                  className="py-2 px-3 rounded-xl border border-[#320075] text-[#320075] font-semibold text-xs hover:bg-[#eaddff]/40 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreatingNewCustomer ? 'Pilih Yang Ada' : '+ Pelanggan Baru'}</span>
                </button>
              </div>

              {isCreatingNewCustomer ? (
                <form onSubmit={handleQuickAddCustomer} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="font-bold text-slate-800 text-sm">Form Cepat Pelanggan Baru</div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      value={newCustName}
                      onChange={e => setNewCustName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#320075]"
                      placeholder="Contoh: Sarah Melani"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp *</label>
                    <input
                      type="text"
                      required
                      value={newCustPhone}
                      onChange={e => setNewCustPhone(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#320075] font-mono"
                      placeholder="081234567890"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Alamat Domisili</label>
                    <input
                      type="text"
                      value={newCustAddress}
                      onChange={e => setNewCustAddress(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#320075]"
                      placeholder="Jakarta Selatan"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewCustomer(false)}
                      className="py-2 px-3 rounded-lg border border-slate-200 text-slate-600"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 rounded-lg bg-[#320075] text-white font-semibold"
                    >
                      Simpan & Pilih Pelanggan
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customerSearch}
                      onChange={e => setCustomerSearch(e.target.value)}
                      placeholder="Ketik nama pelanggan, CUS-..., nomor WhatsApp..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-[#320075]"
                    />
                  </div>

                  <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto border border-slate-200 rounded-xl">
                    {filteredCustomers.map(c => {
                      const isSelected = selectedCustomer?.id === c.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCustomer(c)}
                          className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#eff4ff]' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#320075] text-white flex items-center justify-center font-bold text-xs">
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 text-xs">{c.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{c.code} • {c.whatsapp}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-[#320075]">
                              {c.tier}
                            </span>
                            {isSelected && <Check className="w-5 h-5 text-[#320075]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Select Garments with Double Booking Check */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Pilih Item Baju / Aksesoris</h4>
                  <p className="text-xs text-slate-500">Sistem otomatis mendeteksi bentrok jadwal penyewaan</p>
                </div>
                <span className="text-xs font-bold text-[#320075] bg-[#eaddff] px-3 py-1 rounded-full">
                  {selectedItems.length} Item Dipilih
                </span>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={garmentSearch}
                  onChange={e => setGarmentSearch(e.target.value)}
                  placeholder="Cari kebaya, gaun, jas, kode..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-[#320075]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
                {filteredGarments.map(g => {
                  const isSelected = selectedItems.some(it => it.garment.id === g.id);
                  const avail = checkGarmentAvailability(g.id, startDate, endDate);

                  return (
                    <div
                      key={g.id}
                      onClick={() => handleToggleGarment(g)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-[#320075] bg-[#eff4ff] ring-1 ring-[#320075]' 
                          : !avail.isAvailable
                            ? 'border-amber-200 bg-amber-50/40 opacity-85'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={g.photos[0]} alt={g.name} className="w-12 h-14 object-cover rounded-lg bg-slate-100 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900 text-xs leading-snug line-clamp-1">{g.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{g.code} • Size {g.size} • {g.color}</div>
                          <div className="text-xs font-extrabold text-[#320075] mt-1">
                            Rp {g.rentalPricePerDay.toLocaleString('id-ID')}/hr
                          </div>
                          {!avail.isAvailable && (
                            <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1 mt-0.5">
                              <AlertTriangle className="w-3 h-3" /> Bentrok jadwal sewa
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                        isSelected ? 'bg-[#320075] text-white' : 'border border-slate-300 bg-white text-transparent'
                      }`}>
                        ✓
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Dates & Duration & Fitting */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 text-base">Jadwal & Catatan Fitting</h4>
                <p className="text-xs text-slate-500">Tentukan rentang tanggal pakai dan detail ukuran fitting</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Mulai Sewa / Pengambilan *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Pengembalian *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
                  />
                </div>
                <div className="col-span-2 flex items-center justify-between text-xs pt-1 text-slate-600 border-t border-slate-200">
                  <span>Durasi Sewa: <strong className="text-[#320075] font-bold text-sm">{rentalDays} Hari</strong></span>
                  <span>Maksimal Pengembalian: <strong>Pukul 18:00 WIB</strong></span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Acara / Keperluan</label>
                <input
                  type="text"
                  value={eventDetails}
                  onChange={e => setEventDetails(e.target.value)}
                  placeholder="Contoh: Resepsi Pernikahan di Hotel Mulia"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Fitting & Permintaan Khusus</label>
                <textarea
                  rows={2}
                  value={fittingNotes}
                  onChange={e => setFittingNotes(e.target.value)}
                  placeholder="Contoh: Pinggang dikecilkan 2cm, manset tangan dinaikkan, pita obi disertakan..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Payment Summary & Confirmation */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 text-base">Ringkasan Pembayaran & Penerbitan Nota</h4>
                <p className="text-xs text-slate-500">Konfirmasi rincian biaya sewa, uang jaminan, dan nominal DP</p>
              </div>

              {/* Rincian Biaya Box */}
              <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#d2bbff]/60 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Sewa ({rentalDays} Hari x {selectedItems.length} Item)</span>
                  <span className="font-semibold text-slate-800">Rp {subtotalSewa.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Deposit Jaminan Kerusakan/Kehilangan</span>
                  <span className="font-semibold text-slate-800">Rp {totalDeposit.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Diskon Promo (Rp)</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={e => setDiscount(Number(e.target.value))}
                    className="w-32 p-1 text-right bg-white border border-slate-200 rounded-lg font-semibold"
                  />
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Tagihan</span>
                  <span className="text-[#320075] text-base">Rp {totalAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Payment Status & Options */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Pembayaran</label>
                  <select
                    value={paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
                  >
                    <option value="DP">DP (Uang Muka)</option>
                    <option value="Lunas">Lunas</option>
                    <option value="Belum Bayar">Belum Bayar (Unpaid)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Metode Pembayaran</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="Transfer Bank">Transfer Bank (BCA / Mandiri)</option>
                    <option value="QRIS">QRIS Statis/Dinamis</option>
                    <option value="Tunai">Tunai / Cash</option>
                    <option value="Kartu Debit">Kartu Debit EDC</option>
                  </select>
                </div>
              </div>

              {paymentStatus === 'DP' && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-amber-900">Nominal DP Yang Diterima (Rp)</label>
                    <span className="text-[11px] text-amber-700">Sisa pelunasan saat serah terima pakaian</span>
                  </div>
                  <input
                    type="number"
                    value={dpAmount}
                    onChange={e => setDpAmount(Number(e.target.value))}
                    className="w-36 p-2 bg-white border border-amber-300 rounded-xl font-extrabold text-amber-900 text-right"
                  />
                </div>
              )}

              {/* Balance Summary */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500">Sisa Pelunasan (Piutang):</span>
                  <div className="font-extrabold text-slate-900 text-sm">Rp {balanceDue.toLocaleString('id-ID')}</div>
                </div>
                <label className="flex items-center gap-2 font-semibold text-emerald-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSendWhatsApp}
                    onChange={e => setAutoSendWhatsApp(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Kirim Invoice via WhatsApp Otomatis</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-white flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          ) : (
            <button
              onClick={() => setIsNewRentalModalOpen(false)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-white"
            >
              Batal
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={() => {
                if (step === 1 && !selectedCustomer) {
                  alert('Pilih pelanggan terlebih dahulu');
                  return;
                }
                if (step === 2 && selectedItems.length === 0) {
                  alert('Pilih minimal 1 baju');
                  return;
                }
                setStep((step + 1) as any);
              }}
              className="py-2.5 px-5 rounded-xl bg-[#320075] text-white font-semibold text-xs hover:bg-[#4a1d96] flex items-center gap-1.5 shadow-xs"
            >
              <span>Lanjut</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitTransaction}
              className="py-2.5 px-6 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center gap-2 shadow-md shadow-emerald-200"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Terbitkan Transaksi & Nota</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
