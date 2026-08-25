import React, { useState } from 'react';
import { 
  Database, 
  RefreshCw, 
  UploadCloud, 
  DownloadCloud, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Code2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Table2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Layers, 
  ArrowRight,
  Send,
  Sliders,
  FileSpreadsheet,
  Zap,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GOOGLE_APPS_SCRIPT_CODE, INSTALLATION_STEPS } from '../../data/gasScriptTemplate';

export const SpreadsheetIntegrationView: React.FC = () => {
  const { 
    spreadsheetConfig, 
    updateSpreadsheetConfig, 
    spreadsheetSyncLogs, 
    testSpreadsheetConnection, 
    syncPushToSpreadsheet, 
    syncPullFromSpreadsheet, 
    setupSpreadsheetHeaders,
    clearSpreadsheetSyncLogs,
    garments,
    customers,
    transactions,
    laundryItems,
    allUsers
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'sync' | 'guide' | 'code'>('sync');
  const [inputUrl, setInputUrl] = useState(spreadsheetConfig.webAppUrl || '');
  const [isTesting, setIsTesting] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const isConnected = spreadsheetConfig.syncStatus === 'connected';

  // Handle Save URL & Test
  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = inputUrl.trim();
    if (!cleanUrl) {
      setActionFeedback({ type: 'error', message: 'Harap masukkan URL Web App Google Apps Script.' });
      return;
    }

    updateSpreadsheetConfig({ webAppUrl: cleanUrl });
    setIsTesting(true);
    setActionFeedback(null);

    const res = await testSpreadsheetConnection(cleanUrl);
    setIsTesting(false);

    if (res.success) {
      setActionFeedback({ 
        type: 'success', 
        message: `Koneksi Berhasil! Terhubung ke Google Spreadsheet (${res.details?.spreadsheetName || 'Database SewaBaju Pro'}).` 
      });
    } else {
      setActionFeedback({ 
        type: 'error', 
        message: res.message || 'Gagal terhubung. Pastikan Web App disetting "Who has access: Anyone".' 
      });
    }
  };

  // Handle Push
  const handlePushData = async () => {
    if (!spreadsheetConfig.webAppUrl) {
      setActionFeedback({ type: 'error', message: 'Harap masukkan URL Web App Google Apps Script terlebih dahulu.' });
      return;
    }

    setIsPushing(true);
    setActionFeedback(null);
    const res = await syncPushToSpreadsheet();
    setIsPushing(false);

    if (res.success) {
      setActionFeedback({
        type: 'success',
        message: 'Seluruh data berhasil disinkronkan dan disimpan di Google Spreadsheet!'
      });
    } else {
      setActionFeedback({
        type: 'error',
        message: res.message || 'Gagal mengirim data ke Google Spreadsheet.'
      });
    }
  };

  // Handle Pull
  const handlePullData = async () => {
    if (!spreadsheetConfig.webAppUrl) {
      setActionFeedback({ type: 'error', message: 'Harap masukkan URL Web App Google Apps Script terlebih dahulu.' });
      return;
    }

    if (!confirm('Tarik data dari Google Spreadsheet akan menimpa data lokal di aplikasi ini dengan isi spreadsheet terbaru. Lanjutkan?')) {
      return;
    }

    setIsPulling(true);
    setActionFeedback(null);
    const res = await syncPullFromSpreadsheet();
    setIsPulling(false);

    if (res.success) {
      setActionFeedback({
        type: 'success',
        message: res.message
      });
    } else {
      setActionFeedback({
        type: 'error',
        message: res.message || 'Gagal menarik data dari Google Spreadsheet.'
      });
    }
  };

  // Handle Setup Format Sheets
  const handleSetupSheets = async () => {
    if (!spreadsheetConfig.webAppUrl) {
      setActionFeedback({ type: 'error', message: 'Harap masukkan URL Web App Google Apps Script terlebih dahulu.' });
      return;
    }

    setIsSettingUp(true);
    setActionFeedback(null);
    const res = await setupSpreadsheetHeaders();
    setIsSettingUp(false);

    if (res.success) {
      setActionFeedback({
        type: 'success',
        message: 'Format 7 sheet dan header Google Spreadsheet berhasil diinisialisasi!'
      });
    } else {
      setActionFeedback({
        type: 'error',
        message: res.message || 'Gagal inisialisasi sheet.'
      });
    }
  };

  // Copy Code to Clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  // Download Code.gs
  const handleDownloadCode = () => {
    const blob = new Blob([GOOGLE_APPS_SCRIPT_CODE], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SewaBajuPro_Backend_Code.gs';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#320075] via-[#4a1d96] to-[#1e004a] text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        {/* Subtle decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-32 h-32 bg-[#eaddff]/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#eaddff]">
              <Database className="w-3.5 h-3.5" />
              <span>Cloud Storage & Google Apps Script Backend</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Integrasi Backend Google Spreadsheet
            </h1>
            <p className="text-sm text-purple-100/80 leading-relaxed">
              Gunakan Google Spreadsheet sebagai database cloud *real-time*, cadangan data otomatis, dan pusat sinkronisasi dua arah untuk seluruh koleksi busana, data pelanggan, transaksi sewa, antrean laundry, dan laporan butik Anda.
            </p>
          </div>

          {/* Quick Status Pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}>
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-purple-200 font-bold">Status Koneksi</div>
                <div className="text-sm font-extrabold">
                  {isConnected ? 'Terhubung (Online)' : 'Belum Terhubung'}
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-white/20 hidden sm:block" />

            <div className="text-xs text-purple-100">
              <div className="text-[11px] text-purple-200">Sinkronisasi Terakhir:</div>
              <div className="font-semibold font-mono">
                {spreadsheetConfig.lastSyncTime 
                  ? new Date(spreadsheetConfig.lastSyncTime).toLocaleDateString('id-ID', {
                      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })
                  : 'Belum Pernah'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-white/15 overflow-x-auto no-scrollbar">
          <button
            id="tab-btn-sync"
            onClick={() => setActiveSubTab('sync')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'sync'
                ? 'bg-white text-[#320075] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${activeSubTab === 'sync' ? 'text-[#320075]' : ''}`} />
            <span>Sinkronisasi Data (Sync Hub)</span>
          </button>

          <button
            id="tab-btn-guide"
            onClick={() => setActiveSubTab('guide')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'guide'
                ? 'bg-white text-[#320075] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Panduan Instalasi & Deployment</span>
          </button>

          <button
            id="tab-btn-code"
            onClick={() => setActiveSubTab('code')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'code'
                ? 'bg-white text-[#320075] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Kode GAS (Code.gs)</span>
          </button>
        </div>
      </div>

      {/* Global Action Feedback Alert */}
      {actionFeedback && (
        <div 
          className={`p-4 rounded-2xl border flex items-start justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-150 ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : actionFeedback.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-indigo-50 border-indigo-200 text-indigo-900'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm">
                {actionFeedback.type === 'success' ? 'Operasi Berhasil' : 'Pemberitahuan Sistem'}
              </div>
              <div className="mt-0.5 font-medium leading-relaxed">{actionFeedback.message}</div>
            </div>
          </div>
          <button 
            onClick={() => setActionFeedback(null)} 
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: SINKRONISASI DATA (SYNC HUB) */}
      {/* ========================================================================= */}
      {activeSubTab === 'sync' && (
        <div className="space-y-6">
          {/* Top Row: Web App URL Configuration */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#320075]" />
                  <span>Konfigurasi Endpoint Google Apps Script (GAS)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Masukkan Web App URL yang Anda dapatkan setelah melakukan *Deploy as Web App* di Google Apps Script.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('guide')}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 text-[#320075] hover:bg-purple-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Lihat Panduan Setup</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveAndTest} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Google Apps Script Web App URL <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="input-gas-url"
                    type="url"
                    required
                    value={inputUrl}
                    onChange={e => setInputUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:border-[#320075] outline-none"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      id="btn-test-connection"
                      type="submit"
                      disabled={isTesting}
                      className="px-4 py-2.5 rounded-xl bg-[#320075] hover:bg-[#4a1d96] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                    >
                      <Zap className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                      <span>{isTesting ? 'Menguji Koneksi...' : 'Simpan & Uji Koneksi'}</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <span>💡</span>
                  <span>URL harus berakhiran <strong className="font-mono text-slate-600">/exec</strong> dan memiliki izin akses <strong className="text-slate-600">"Anyone"</strong>.</span>
                </p>
              </div>
            </form>
          </div>

          {/* Action Cards: Push, Pull & Format */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Push Card */}
            <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#320075] flex items-center justify-center font-bold">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Kirim Data (Push ke Sheets)</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Unggah seluruh data master busana, pelanggan, transaksi sewa, laundry, staf, dan pengaturan ke Google Spreadsheet.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  id="btn-push-sheets"
                  onClick={handlePushData}
                  disabled={isPushing}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#320075] hover:bg-[#4a1d96] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <UploadCloud className={`w-4 h-4 ${isPushing ? 'animate-bounce' : ''}`} />
                  <span>{isPushing ? 'Mengunggah Data...' : 'Kirim Semua Data Sekarang'}</span>
                </button>
              </div>
            </div>

            {/* Pull Card */}
            <div className="bg-white rounded-2xl border border-sky-200 p-5 shadow-xs flex flex-col justify-between hover:border-sky-300 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <DownloadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Tarik Data (Pull dari Sheets)</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Ambil data terbaru yang telah diedit atau diubah langsung di Google Spreadsheet untuk diterapkan ke aplikasi web ini.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  id="btn-pull-sheets"
                  onClick={handlePullData}
                  disabled={isPulling}
                  className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <DownloadCloud className={`w-4 h-4 ${isPulling ? 'animate-spin' : ''}`} />
                  <span>{isPulling ? 'Menarik Data...' : 'Tarik Data dari Spreadsheet'}</span>
                </button>
              </div>
            </div>

            {/* Format & Setup Card */}
            <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Table2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Inisialisasi Tabel & Sheet</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Buat otomatis 7 tab sheet (*Garments, Customers, Rentals, Laundry, Users, Settings, ActivityLogs*) lengkap dengan warna header elegan.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  id="btn-format-sheets"
                  onClick={handleSetupSheets}
                  disabled={isSettingUp}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSettingUp ? 'Mengatur Format...' : 'Format & Inisialisasi Sheet'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Database Summary Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#320075]" />
                <span>Ringkasan Data Siap Disinkronkan</span>
              </h3>
              <span className="text-xs text-slate-500">Database Lokal SewaBaju Pro</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-center">
                <div className="text-lg font-extrabold text-[#320075]">{garments.length}</div>
                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">Koleksi Busana</div>
              </div>

              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
                <div className="text-lg font-extrabold text-blue-700">{customers.length}</div>
                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">Data Pelanggan</div>
              </div>

              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center">
                <div className="text-lg font-extrabold text-indigo-700">{transactions.length}</div>
                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">Nota Sewa</div>
              </div>

              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-center">
                <div className="text-lg font-extrabold text-amber-700">{laundryItems.length}</div>
                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">Antrean Laundry</div>
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center col-span-2 sm:col-span-1">
                <div className="text-lg font-extrabold text-emerald-700">{allUsers.length}</div>
                <div className="text-[11px] font-semibold text-slate-600 mt-0.5">Staf & Pengguna</div>
              </div>
            </div>
          </div>

          {/* Sync History & Logs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#320075]" />
                <h3 className="font-bold text-sm text-slate-900">Riwayat & Log Sinkronisasi</h3>
              </div>

              {spreadsheetSyncLogs.length > 0 && (
                <button
                  onClick={clearSpreadsheetSyncLogs}
                  className="text-xs text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Bersihkan Log</span>
                </button>
              )}
            </div>

            {spreadsheetSyncLogs.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Belum ada aktivitas sinkronisasi tercatat.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-2 max-h-80 overflow-y-auto">
                {spreadsheetSyncLogs.map(log => (
                  <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 mt-0.5 ${
                        log.status === 'SUCCESS' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.type}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-800">{log.message}</div>
                        {log.recordsCount && (
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            Data: Busana ({log.recordsCount.garments ?? '-'}), Pelanggan ({log.recordsCount.customers ?? '-'}), Sewa ({log.recordsCount.transactions ?? '-'})
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PANDUAN INSTALASI LANGKAH-DEMI-LANGKAH */}
      {/* ========================================================================= */}
      {activeSubTab === 'guide' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="max-w-3xl">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#320075]" />
                <span>Panduan Lengkap Pemasangan Database Google Spreadsheet</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Ikuti 6 langkah mudah berikut untuk membuat database Google Spreadsheet gratis tanpa biaya server dan menghubungkannya langsung ke aplikasi SewaBaju Pro.
              </p>
            </div>

            {/* Steps Timeline */}
            <div className="mt-6 space-y-4">
              {INSTALLATION_STEPS.map(item => (
                <div key={item.step} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#320075] text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {item.step}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    {item.tip && (
                      <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-[11px] text-[#320075] whitespace-pre-line font-medium mt-2">
                        💡 <strong>Tips Penting:</strong> {item.tip}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Link Button to Code */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-[#320075]" />
                <span className="text-xs font-bold text-slate-800">
                  Siap menyalin kode Google Apps Script?
                </span>
              </div>

              <button
                onClick={() => setActiveSubTab('code')}
                className="px-4 py-2 rounded-xl bg-[#320075] hover:bg-[#4a1d96] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Buka Editor Kode GAS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* FAQ & Troubleshooting Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Pertanyaan Umum & Solusi Kendala (Troubleshooting)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 mb-1">❓ Muncul pesan "Script function not found" atau "CORS Error"</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Pastikan saat Deploy Anda memilih opsi <strong>"Execute as: Me"</strong> dan <strong>"Who has access: Anyone"</strong>. Jika Anda mengubah kode di editor Apps Script, pastikan untuk membuat <em>Deployment Baru (New Deployment)</em> atau update versi.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 mb-1">❓ Apakah data gambar busana bisa disimpan di Google Sheets?</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Ya! URL foto busana disimpan rapi di kolom "Foto URL" pada tab sheet <em>Garments</em> sehingga gambar tetap tampil sempurna di aplikasi web saat data ditarik kembali (*pull*).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 mb-1">❓ Bisakah saya mengedit data langsung di Google Spreadsheet?</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Tentu saja! Anda bisa mengedit nama busana, harga sewa, nomor WhatsApp pelanggan langsung di Google Sheets, kemudian klik tombol <strong>"Tarik Data (Pull)"</strong> di aplikasi ini untuk memperbarui sistem.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 mb-1">❓ Apakah ada batas kuota Google Apps Script?</div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Google memberikan kuota gratis hingga 20.000 panggilan URL per hari untuk akun Gmail standar dan 100.000 panggilan per hari untuk Google Workspace, yang sangat lebih dari cukup untuk operasional butik sewa.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: KODE GOOGLE APPS SCRIPT (Code.gs) */}
      {/* ========================================================================= */}
      {activeSubTab === 'code' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-[#320075]" />
                  <span>Kode Google Apps Script (Code.gs)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Salin seluruh kode di bawah ini dan tempelkan ke editor Apps Script pada Google Spreadsheet Anda.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  id="btn-download-code"
                  onClick={handleDownloadCode}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Unduh file Code.gs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Unduh File .gs</span>
                </button>

                <button
                  id="btn-copy-code"
                  onClick={handleCopyCode}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                    copiedCode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#320075] hover:bg-[#4a1d96] text-white'
                  }`}
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Kode Berhasil Disalin!' : 'Salin Seluruh Kode'}</span>
                </button>
              </div>
            </div>

            {/* Code Display Area */}
            <div className="mt-4 relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-inner">
              {/* Fake Terminal Header */}
              <div className="px-4 py-2.5 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="font-mono text-slate-300 ml-2">Code.gs — Google Apps Script</span>
                </div>

                <span className="text-[11px] font-mono text-purple-300">JavaScript / GAS V8 Engine</span>
              </div>

              <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[500px] leading-relaxed select-all">
                <code>{GOOGLE_APPS_SCRIPT_CODE}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
