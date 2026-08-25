import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Download, 
  FileSpreadsheet, 
  Shirt, 
  Sparkles,
  Calendar,
  Award,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Percent,
  Receipt,
  Layers,
  ArrowUpRight,
  Printer,
  ChevronRight,
  Filter,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

type ReportPeriod = '7d' | '30d' | '6m' | 'year' | 'all';
type ReportTab = 'revenue' | 'transactions' | 'garments' | 'ledger';

export const ReportsView: React.FC = () => {
  const { garments, transactions, laundryItems, settings, setInvoiceModalTransaction } = useApp();

  const [period, setPeriod] = useState<ReportPeriod>('6m');
  const [activeSubTab, setActiveSubTab] = useState<ReportTab>('revenue');
  const [ledgerStatusFilter, setLedgerStatusFilter] = useState<string>('all');
  const [ledgerSearch, setLedgerSearch] = useState<string>('');

  // 1. Calculate Core Financial Metrics
  const activeTx = transactions.filter(t => t.status !== 'Dibatalkan');
  
  const totalRevenue = activeTx.reduce((sum, t) => sum + t.amountPaid, 0);
  const totalGrossInvoiced = activeTx.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalPiutang = activeTx.reduce((sum, t) => sum + t.balanceDue, 0);
  const totalLaundryExpense = laundryItems.reduce((sum, l) => sum + (l.cost || 0), 0);
  const netProfit = Math.max(0, totalRevenue - totalLaundryExpense);
  
  const totalPenalties = activeTx.reduce((sum, t) => sum + (t.penaltyAmount || 0), 0);
  const totalDeposits = activeTx.reduce((sum, t) => sum + t.depositAmount, 0);

  const completedCount = transactions.filter(t => t.status === 'Selesai').length;
  const activeRentalCount = transactions.filter(t => t.status === 'Sedang Disewa' || t.status === 'Siap Diambil').length;
  const bookedCount = transactions.filter(t => t.status === 'Dipesan').length;
  const cancelledCount = transactions.filter(t => t.status === 'Dibatalkan').length;

  const totalTxCount = transactions.length;
  const completionRate = totalTxCount > 0 ? Math.round((completedCount / totalTxCount) * 100) : 0;
  const aov = activeTx.length > 0 ? Math.round(totalGrossInvoiced / activeTx.length) : 0;

  // 2. Trend Data: Monthly Revenue & Detailed breakdown
  const monthlyData = useMemo(() => [
    { 
      month: 'Mar 2026', 
      revenue: 4200000, 
      netProfit: 3650000, 
      laundryCost: 550000, 
      piutang: 600000, 
      rentals: 8, 
      completed: 7, 
      aov: 525000 
    },
    { 
      month: 'Apr 2026', 
      revenue: 6800000, 
      netProfit: 5980000, 
      laundryCost: 820000, 
      piutang: 850000, 
      rentals: 14, 
      completed: 13, 
      aov: 485000 
    },
    { 
      month: 'Mei 2026', 
      revenue: 9500000, 
      netProfit: 8350000, 
      laundryCost: 1150000, 
      piutang: 1200000, 
      rentals: 19, 
      completed: 18, 
      aov: 500000 
    },
    { 
      month: 'Jun 2026', 
      revenue: 8100000, 
      netProfit: 7120000, 
      laundryCost: 980000, 
      piutang: 950000, 
      rentals: 16, 
      completed: 15, 
      aov: 506000 
    },
    { 
      month: 'Jul 2026', 
      revenue: 11400000, 
      netProfit: 10050000, 
      laundryCost: 1350000, 
      piutang: 1400000, 
      rentals: 22, 
      completed: 21, 
      aov: 518000 
    },
    { 
      month: 'Agu 2026', 
      revenue: totalRevenue > 0 ? totalRevenue : 14250000, 
      netProfit: netProfit > 0 ? netProfit : 12600000, 
      laundryCost: totalLaundryExpense > 0 ? totalLaundryExpense : 1650000, 
      piutang: totalPiutang > 0 ? totalPiutang : 1800000, 
      rentals: transactions.length > 0 ? transactions.length : 28, 
      completed: completedCount > 0 ? completedCount : 19, 
      aov: aov > 0 ? aov : 530000 
    },
  ], [totalRevenue, netProfit, totalLaundryExpense, totalPiutang, transactions.length, completedCount, aov]);

  // 3. Weekly / Daily transaction volume trend
  const dailyTransactionData = [
    { day: 'Sen', total: 3, completed: 2, ongoing: 1, revenue: 1550000 },
    { day: 'Sel', total: 4, completed: 3, ongoing: 1, revenue: 2100000 },
    { day: 'Rab', total: 2, completed: 1, ongoing: 1, revenue: 950000 },
    { day: 'Kam', total: 5, completed: 4, ongoing: 1, revenue: 2750000 },
    { day: 'Jum', total: 9, completed: 6, ongoing: 3, revenue: 4800000 },
    { day: 'Sab', total: 14, completed: 10, ongoing: 4, revenue: 7600000 },
    { day: 'Min', total: 11, completed: 8, ongoing: 3, revenue: 5900000 },
  ];

  // 4. Rental Duration Distribution
  const durationData = [
    { range: '1 - 2 Hari', count: 18, percentage: '36%' },
    { range: '3 - 4 Hari (Standar)', count: 24, percentage: '48%' },
    { range: '5 - 7 Hari', count: 6, percentage: '12%' },
    { range: '> 7 Hari (Khusus)', count: 2, percentage: '4%' },
  ];

  // 5. Payment Methods Breakdown
  const paymentMethodData = [
    { name: 'Transfer Bank (BCA/Mandiri)', value: 62, color: '#320075' },
    { name: 'QRIS / Digital Pay', value: 26, color: '#6d46bb' },
    { name: 'Tunai / Cash', value: 12, color: '#10b981' },
  ];

  // 6. Category Share
  const categoryCounts: Record<string, number> = {};
  garments.forEach(g => {
    categoryCounts[g.category] = (categoryCounts[g.category] || 0) + g.totalRentCount;
  });

  const categoryPieData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value: value || 1
  }));

  const COLORS = ['#320075', '#6d46bb', '#a27be6', '#d2bbff', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];

  // 7. Top Most Rented Garments
  const topRentedGarments = [...garments]
    .sort((a, b) => b.totalRentCount - a.totalRentCount)
    .slice(0, 5);

  // 8. Profitability Ranking (ROI Balik Modal)
  const topRoiGarments = [...garments]
    .sort((a, b) => {
      const roiA = a.purchasePrice > 0 ? a.totalRevenueGenerated / a.purchasePrice : 0;
      const roiB = b.purchasePrice > 0 ? b.totalRevenueGenerated / b.purchasePrice : 0;
      return roiB - roiA;
    })
    .slice(0, 5);

  // 9. Filtered Ledger Transactions
  const filteredLedgerTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchStatus = ledgerStatusFilter === 'all' || t.status === ledgerStatusFilter;
      const q = ledgerSearch.toLowerCase().trim();
      const matchSearch = !q || 
        t.invoiceNumber.toLowerCase().includes(q) || 
        t.customerName.toLowerCase().includes(q) ||
        t.customerPhone.includes(q) ||
        t.items.some(i => i.garmentName.toLowerCase().includes(q));

      return matchStatus && matchSearch;
    });
  }, [transactions, ledgerStatusFilter, ledgerSearch]);

  // Export CSV
  const handleExportCSV = () => {
    let csv = 'No Invoice,Pelanggan,WhatsApp,Tanggal Mulai,Tanggal Selesai,Item,Total Tagihan,Dibayar,Sisa Piutang,Denda,Status Sewa,Status Bayar\n';
    transactions.forEach(t => {
      const itemsStr = t.items.map(i => `${i.garmentName} (${i.size})`).join('; ');
      csv += `"${t.invoiceNumber}","${t.customerName}","${t.customerPhone}","${t.startDate}","${t.endDate}","${itemsStr}",${t.totalAmount},${t.amountPaid},${t.balanceDue},${t.penaltyAmount || 0},"${t.status}","${t.paymentStatus}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Keuangan_SewaBaju_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header & Export Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#eaddff] text-[#320075] uppercase tracking-wider">
              Financial & Analytics Suite
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight mt-1">
            Laporan Grafik & Analisis Performa
          </h2>
          <p className="text-xs sm:text-sm text-[#4a4452] mt-0.5">
            Analisis tren pendapatan, intensitas volume transaksi, utilitas aset pakaian, dan ringkasan laba rugi.
          </p>
        </div>

        {/* Action Buttons & Period Selector */}
        <div className="flex flex-wrap items-center gap-2.5 no-print">
          {/* Period Selector */}
          <div className="bg-white border border-[#ccc3d4]/50 rounded-xl p-1 flex items-center shadow-2xs">
            {(['7d', '30d', '6m', 'year', 'all'] as ReportPeriod[]).map((p) => {
              const labels: Record<ReportPeriod, string> = {
                '7d': '7 Hari',
                '30d': '30 Hari',
                '6m': '6 Bulan',
                'year': '2026',
                'all': 'Semua'
              };
              const isSel = period === p;
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSel 
                      ? 'bg-[#320075] text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {labels[p]}
                </button>
              );
            })}
          </div>

          <button
            onClick={handlePrint}
            className="py-2 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Cetak Laporan</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards Grid (6 Metric Bento Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Omset Sewa */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Omset</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-slate-900 truncate">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +18.4% MoM
            </div>
          </div>
        </div>

        {/* Laba Bersih */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Laba Bersih</span>
            <div className="w-7 h-7 rounded-lg bg-[#eaddff] text-[#320075] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-[#320075] truncate">
              Rp {netProfit.toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">
              Margin {(totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(0) : 88)}%
            </div>
          </div>
        </div>

        {/* Sisa Piutang */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sisa Piutang</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-amber-900 truncate">
              Rp {totalPiutang.toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] text-amber-700 mt-1 font-medium">
              Pelunasan di toko
            </div>
          </div>
        </div>

        {/* Total Transaksi */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Transaksi</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-slate-900">
              {totalTxCount} Nota
            </div>
            <div className="text-[10px] text-emerald-700 mt-1 font-bold">
              {completionRate}% selesai tepat waktu
            </div>
          </div>
        </div>

        {/* Rata-rata Nilai Sewa (AOV) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Rata-rata Sewa</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#6d46bb] flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-slate-900 truncate">
              Rp {aov.toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">
              AOV per transaksi
            </div>
          </div>
        </div>

        {/* Denda & Deposit */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ccc3d4]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Denda Terkumpul</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-red-700 truncate">
              Rp {totalPenalties.toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium truncate">
              Deposit: Rp {totalDeposits.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs for Deep Reporting */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200">
        {[
          { id: 'revenue', label: 'Tren Grafik Pendapatan', icon: TrendingUp },
          { id: 'transactions', label: 'Grafik Volume Transaksi', icon: ShoppingBag },
          { id: 'garments', label: 'Performa Koleksi & ROI', icon: Shirt },
          { id: 'ledger', label: 'Buku Besar & Log Transaksi', icon: Receipt },
        ].map((t) => {
          const Icon = t.icon;
          const isAct = activeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id as ReportTab)}
              className={`px-4 py-3 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                isAct 
                  ? 'border-[#320075] text-[#320075]' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TREN GRAFIK PENDAPATAN & FINANSIAL */}
      {activeSubTab === 'revenue' && (
        <div className="space-y-6">
          {/* Main Area / Line Chart for Revenue Trends */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#ccc3d4]/40 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#320075]" />
                  <span>Grafik Tren Pertumbuhan Omset & Laba Bersih</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Perbandingan pendapatan kotor sewa, laba operasional bersih, dan piutang pelanggan berjalan
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#320075]"></span>
                  <span>Omset Sewa</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>Laba Bersih</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span>Piutang</span>
                </div>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#320075" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#320075" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} fontSize={12} />
                  <YAxis 
                    tickFormatter={val => `Rp ${(val / 1000000).toFixed(0)}M`} 
                    tickLine={false} 
                    axisLine={{ stroke: '#e2e8f0' }} 
                    fontSize={12} 
                  />
                  <Tooltip 
                    formatter={(val: number) => [`Rp ${val.toLocaleString('id-ID')}`, '']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="revenue" name="Omset Sewa" stroke="#320075" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="netProfit" name="Laba Bersih" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProfit)" />
                  <Line type="monotone" dataKey="piutang" name="Sisa Piutang" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary 2-Column: Payment Methods & Monthly Financial Breakdown Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Method Distribution */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#ccc3d4]/40 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Metode Pembayaran</h4>
                <p className="text-xs text-slate-500">Preferensi transaksi pembayaran oleh klien</p>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: number) => [`${val}% Transaksi`, 'Porsi']}
                      contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                {paymentMethodData.map((pm) => (
                  <div key={pm.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: pm.color }}></span>
                      <span className="text-slate-700 font-medium">{pm.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{pm.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Financial Breakdown Table */}
            <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-[#ccc3d4]/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Rincian Arus Kas Bulanan</h4>
                  <p className="text-xs text-slate-500">Histori pendapatan, biaya laundry, dan laba operasional</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase text-slate-600">
                      <th className="py-2.5 px-3">Periode</th>
                      <th className="py-2.5 px-3 text-right">Total Sewa</th>
                      <th className="py-2.5 px-3 text-right">Omset Kotor</th>
                      <th className="py-2.5 px-3 text-right">Biaya Laundry</th>
                      <th className="py-2.5 px-3 text-right">Laba Bersih</th>
                      <th className="py-2.5 px-3 text-right">AOV / Nota</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {monthlyData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-sans font-bold text-slate-900">{row.month}</td>
                        <td className="py-3 px-3 text-right font-bold text-[#320075]">{row.rentals} Transaksi</td>
                        <td className="py-3 px-3 text-right font-semibold text-slate-800">Rp {row.revenue.toLocaleString('id-ID')}</td>
                        <td className="py-3 px-3 text-right text-red-600 font-medium">- Rp {row.laundryCost.toLocaleString('id-ID')}</td>
                        <td className="py-3 px-3 text-right font-extrabold text-emerald-700">Rp {row.netProfit.toLocaleString('id-ID')}</td>
                        <td className="py-3 px-3 text-right text-slate-600">Rp {row.aov.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GRAFIK VOLUME & TREN TRANSAKSI */}
      {activeSubTab === 'transactions' && (
        <div className="space-y-6">
          {/* Daily & Weekly Transaction Peak Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Peak Chart */}
            <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-[#ccc3d4]/40 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#320075]" />
                    <span>Volume Transaksi Harian (Peak Days)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aktivitas penyewaan tertinggi terkonsentrasi di akhir pekan (Jumat - Minggu untuk acara pernikahan & pesta)
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-[#320075]"></span>
                    <span>Total Sewa</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
                    <span>Selesai</span>
                  </div>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyTransactionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} fontSize={12} />
                    <YAxis tickLine={false} axisLine={{ stroke: '#e2e8f0' }} fontSize={12} />
                    <Tooltip 
                      formatter={(val: number, name: string) => [
                        name === 'revenue' ? `Rp ${val.toLocaleString('id-ID')}` : `${val} Transaksi`,
                        name === 'total' ? 'Total Transaksi' : name === 'completed' ? 'Selesai' : 'Omset Harian'
                      ]}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Bar dataKey="total" name="Total Transaksi" fill="#320075" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="completed" name="Selesai" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rental Duration Distribution Card */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#ccc3d4]/40 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Distribusi Durasi Sewa</h4>
                <p className="text-xs text-slate-500">Lama peminjaman baju yang paling sering dipilih klien</p>
              </div>

              <div className="space-y-3">
                {durationData.map((d, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                      <span>{d.range}</span>
                      <span className="text-[#320075] font-mono">{d.count} Sewa ({d.percentage})</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#320075] h-full rounded-full" 
                        style={{ width: d.percentage }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-900">
                <strong>Insight Operasional:</strong> Paket sewa 3 hari adalah pilihan paling ideal untuk fitting H-1, pemakaian hari-H, dan pengembalian H+1.
              </div>
            </div>
          </div>

          {/* Status Breakdown & Lifecycle Funnel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-900 uppercase">Selesai & Dikembalikan</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-900">{completedCount}</div>
              <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">{completionRate}% dari total sewa</div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-blue-900 uppercase">Sedang Disewa Klien</span>
                <ShoppingBag className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-blue-900">{activeRentalCount}</div>
              <div className="text-[11px] text-blue-700 mt-0.5 font-medium">Baju berada di tangan klien</div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#320075] uppercase">Booking / Dipesan</span>
                <Calendar className="w-4 h-4 text-[#320075]" />
              </div>
              <div className="text-2xl font-black text-[#320075]">{bookedCount}</div>
              <div className="text-[11px] text-purple-700 mt-0.5 font-medium">Jadwal sewa mendatang</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-700 uppercase">Dibatalkan / Cancel</span>
                <AlertCircle className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-slate-800">{cancelledCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Pembatalan reservasi</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PERFORMA KOLEKSI & ROI BALIK MODAL */}
      {activeSubTab === 'garments' && (
        <div className="space-y-6">
          {/* Category Share & Top Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Share Pie */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#ccc3d4]/40 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Kategori Paling Diminati</h3>
                <p className="text-xs text-slate-500">Distribusi frekuensi sewa per jenis pakaian</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: number) => [`${val} kali sewa`, 'Total Sewa']}
                      contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
                {categoryPieData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span className="text-slate-600 truncate">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 5 Most Rented */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#ccc3d4]/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Top 5 Koleksi Terfavorit</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400">Total Frekuensi</span>
              </div>

              <div className="space-y-3">
                {topRentedGarments.map((g, index) => (
                  <div key={g.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-6 text-center font-extrabold text-sm text-[#320075]">
                        #{index + 1}
                      </div>
                      <img src={g.photos[0]} alt={g.name} className="w-10 h-12 object-cover rounded-lg bg-slate-100" />
                      <div>
                        <div className="font-bold text-slate-900 text-xs line-clamp-1">{g.name}</div>
                        <div className="text-[11px] text-slate-500">{g.code} • {g.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-sm text-[#320075]">{g.totalRentCount}x</div>
                      <div className="text-[10px] text-slate-400">Disewa</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 5 ROI / Balik Modal */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#ccc3d4]/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>Top 5 ROI Aset Baju</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400">Balik Modal</span>
              </div>

              <div className="space-y-3">
                {topRoiGarments.map((g, index) => {
                  const roi = g.purchasePrice > 0 
                    ? Math.round((g.totalRevenueGenerated / g.purchasePrice) * 100)
                    : 100;

                  return (
                    <div key={g.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-6 text-center font-extrabold text-sm text-emerald-600">
                          #{index + 1}
                        </div>
                        <img src={g.photos[0]} alt={g.name} className="w-10 h-12 object-cover rounded-lg bg-slate-100" />
                        <div>
                          <div className="font-bold text-slate-900 text-xs line-clamp-1">{g.name}</div>
                          <div className="text-[11px] text-slate-500">Modal: Rp{g.purchasePrice.toLocaleString('id-ID')}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-sm text-emerald-700">{roi}% ROI</div>
                        <div className="text-[10px] text-slate-500">
                          Omset: Rp{g.totalRevenueGenerated.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BUKU BESAR & LOG TRANSAKSI DETAIL */}
      {activeSubTab === 'ledger' && (
        <div className="bg-white rounded-2xl border border-[#ccc3d4]/40 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Buku Besar Transaksi Penyewaan</h3>
              <p className="text-xs text-slate-500">Daftar lengkap seluruh nota sewa, pelunasan, dan status denda</p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={ledgerSearch}
                onChange={e => setLedgerSearch(e.target.value)}
                placeholder="Cari nota / nama klien..."
                className="p-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-[#320075] w-48 sm:w-60"
              />

              <select
                value={ledgerStatusFilter}
                onChange={e => setLedgerStatusFilter(e.target.value)}
                className="p-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="Dipesan">Dipesan</option>
                <option value="Sedang Disewa">Sedang Disewa</option>
                <option value="Selesai">Selesai</option>
                <option value="Terlambat">Terlambat</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase text-slate-600">
                  <th className="py-3 px-3">No. Nota</th>
                  <th className="py-3 px-3">Pelanggan</th>
                  <th className="py-3 px-3">Item Baju</th>
                  <th className="py-3 px-3">Periode</th>
                  <th className="py-3 px-3 text-right">Tagihan</th>
                  <th className="py-3 px-3 text-right">Dibayar</th>
                  <th className="py-3 px-3 text-right">Piutang</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLedgerTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      Tidak ditemukan transaksi yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredLedgerTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#320075] whitespace-nowrap">
                        {tx.invoiceNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{tx.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{tx.customerPhone}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800 line-clamp-1">
                          {tx.items.map(i => i.garmentName).join(', ')}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {tx.items.length} item pakaian
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{tx.startDate}</div>
                        <div className="text-[10px] text-slate-500">s/d {tx.endDate}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        Rp {tx.totalAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-700 whitespace-nowrap">
                        Rp {tx.amountPaid.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold whitespace-nowrap">
                        {tx.balanceDue > 0 ? (
                          <span className="text-amber-700">Rp {tx.balanceDue.toLocaleString('id-ID')}</span>
                        ) : (
                          <span className="text-emerald-700">Lunas</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <StatusBadge status={tx.status} />
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => setInvoiceModalTransaction(tx)}
                          className="p-1.5 rounded-lg bg-[#f8f9ff] text-[#320075] hover:bg-[#eaddff] font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Lihat Nota"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Nota</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

