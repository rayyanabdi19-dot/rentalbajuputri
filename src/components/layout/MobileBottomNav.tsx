import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Shirt, 
  ShoppingBag, 
  Users, 
  Plus,
  BarChart3,
  CalendarDays,
  Sparkles,
  Settings,
  MoreHorizontal,
  X,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsNewRentalModalOpen, laundryItems, transactions } = useApp();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const activeLaundryCount = laundryItems.filter(l => l.status === 'Sedang Dicuci' || l.status === 'Menunggu Dicuci').length;
  const activeRentalsCount = transactions.filter(t => t.status === 'Sedang Disewa' || t.status === 'Siap Diambil').length;

  const primaryNavItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'collection', label: 'Koleksi', icon: Shirt },
    { id: 'rentals', label: 'Sewa', icon: ShoppingBag, badge: activeRentalsCount },
    { id: 'reports', label: 'Laporan', icon: BarChart3 },
  ];

  const moreMenuItems: { id: NavigationTab; label: string; icon: React.ElementType; desc: string; badge?: number }[] = [
    { id: 'spreadsheet', label: 'Database Google Sheets', icon: FileSpreadsheet, desc: 'Sinkronisasi awan & backend Google Apps Script' },
    { id: 'calendar', label: 'Kalender Jadwal Sewa', icon: CalendarDays, desc: 'Pantau timeline sewa & jadwal pickup/kembali' },
    { id: 'customers', label: 'Direktori Pelanggan', icon: Users, desc: 'Daftar klien, riwayat sewa, & segmentasi loyalitas' },
    { id: 'laundry', label: 'Status Laundry & Cuci', icon: Sparkles, desc: 'Pelacakan cucian baju & ongkos laundry', badge: activeLaundryCount },
    { id: 'settings', label: 'Pengaturan & Profil', icon: Settings, desc: 'Profil butik, rekening, denda, & cadangan data' },
  ];

  return (
    <div className="md:hidden no-print">
      {/* More Menu Drawer */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
          <div 
            className="fixed inset-0"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="relative bg-white rounded-t-3xl border-t border-slate-200 p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">Menu SewaBaju Pro</h3>
                <p className="text-xs text-slate-500">Pilih menu navigasi lainnya</p>
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {moreMenuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowMoreMenu(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl flex items-center justify-between border transition-all text-left cursor-pointer ${
                      isActive 
                        ? 'bg-[#e9def5] border-[#320075] text-[#320075] shadow-xs' 
                        : 'bg-slate-50/80 border-slate-100 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isActive ? 'bg-[#320075] text-white' : 'bg-white text-slate-700 shadow-xs border border-slate-100'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-2">
                          <span>{item.label}</span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-[#ba1a1a] text-white">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        id="fab-new-rental-mobile"
        onClick={() => setIsNewRentalModalOpen(true)}
        aria-label="Tambah Sewa Baru"
        className="fixed bottom-[86px] right-4 w-13 h-13 bg-[#320075] hover:bg-[#4a1d96] text-white rounded-2xl shadow-lg shadow-[#320075]/30 flex items-center justify-center transition-transform active:scale-95 z-40 cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 w-full h-[70px] bg-white border-t border-[#ccc3d4]/30 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex justify-around items-center px-1 z-40 pb-1">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative cursor-pointer ${
                isActive ? 'text-[#320075]' : 'text-[#4a4452] hover:text-[#0b1c30]'
              }`}
            >
              <div className={`w-11 h-7 rounded-full flex items-center justify-center mb-0.5 transition-all relative ${
                isActive ? 'bg-[#e9def5]' : 'bg-transparent'
              }`}>
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#320075]' : 'text-[#635b6e]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
                )}
              </div>
              <span className={`text-[10px] leading-tight font-medium ${isActive ? 'font-bold text-[#320075]' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMoreMenu(true)}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative cursor-pointer ${
            ['calendar', 'customers', 'laundry', 'settings'].includes(activeTab) ? 'text-[#320075]' : 'text-[#4a4452] hover:text-[#0b1c30]'
          }`}
        >
          <div className={`w-11 h-7 rounded-full flex items-center justify-center mb-0.5 transition-all ${
            ['calendar', 'customers', 'laundry', 'settings'].includes(activeTab) ? 'bg-[#e9def5]' : 'bg-transparent'
          }`}>
            <MoreHorizontal className={`w-4.5 h-4.5 ${['calendar', 'customers', 'laundry', 'settings'].includes(activeTab) ? 'text-[#320075]' : 'text-[#635b6e]'}`} />
          </div>
          <span className={`text-[10px] leading-tight font-medium ${['calendar', 'customers', 'laundry', 'settings'].includes(activeTab) ? 'font-bold text-[#320075]' : ''}`}>
            Lainnya
          </span>
        </button>
      </nav>
    </div>
  );
};

