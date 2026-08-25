import React from 'react';
import { 
  LayoutDashboard, 
  Shirt, 
  Users, 
  ShoppingBag, 
  Sparkles, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  CalendarDays,
  Plus,
  LogOut,
  FileSpreadsheet
} from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';

export const SideNavBar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsNewRentalModalOpen, 
    laundryItems,
    transactions,
    settings,
    spreadsheetConfig,
    logout
  } = useApp();

  const activeLaundryCount = laundryItems.filter(l => l.status === 'Sedang Dicuci' || l.status === 'Menunggu Dicuci').length;
  const activeRentalsCount = transactions.filter(t => t.status === 'Sedang Disewa' || t.status === 'Siap Diambil').length;

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number; isCloud?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'collection', label: 'Collection', icon: Shirt },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'rentals', label: 'Rentals', icon: ShoppingBag, badge: activeRentalsCount },
    { id: 'calendar', label: 'Kalender', icon: CalendarDays },
    { id: 'laundry', label: 'Laundry', icon: Sparkles, badge: activeLaundryCount },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'spreadsheet', label: 'Database Sheets', icon: FileSpreadsheet, isCloud: true },
  ];

  return (
    <aside className="bg-white border-r border-[#ccc3d4]/40 fixed h-screen w-[280px] left-0 top-0 flex flex-col py-6 px-3 z-50 shadow-xs hidden md:flex">
      {/* Brand Header */}
      <div className="px-3 mb-6 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-[#eaddff] text-[#320075] flex items-center justify-center font-bold text-base shadow-xs shrink-0 tracking-tight">
          SBP
        </div>
        <div className="min-w-0">
          <h1 className="font-bold text-lg text-[#320075] tracking-tight leading-tight truncate">
            {settings.boutiqueName.replace(' Boutique', '')}
          </h1>
          <p className="text-xs text-[#4a4452] font-medium truncate">Luxury Rental Mgmt</p>
        </div>
      </div>

      {/* Main CTA Button */}
      <button 
        id="btn-new-rental-sidebar"
        onClick={() => setIsNewRentalModalOpen(true)}
        className="mx-1 mb-6 bg-[#320075] hover:bg-[#4a1d96] text-white rounded-xl py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>+ New Rental</span>
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer text-left ${
                isActive
                  ? 'bg-[#e9def5] text-[#320075] border-l-4 border-[#320075] shadow-xs'
                  : 'text-[#4a4452] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#320075]' : 'text-[#7b7484]'}`} />
                <span>{item.label}</span>
              </div>
              {item.isCloud && (
                <span className={`w-2 h-2 rounded-full ${
                  spreadsheetConfig.syncStatus === 'connected' 
                    ? 'bg-emerald-500 shadow-xs' 
                    : 'bg-slate-300'
                }`} title={spreadsheetConfig.syncStatus === 'connected' ? 'Sheets Terhubung' : 'Sheets Belum Terhubung'} />
              )}
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-[#320075] text-white' : 'bg-[#e5eeff] text-[#320075]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Navigation */}
      <div className="mt-auto pt-4 border-t border-[#ccc3d4]/40 flex flex-col gap-1">
        <button
          id="nav-link-settings"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${
            activeTab === 'settings'
              ? 'bg-[#e9def5] text-[#320075] font-semibold'
              : 'text-[#4a4452] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
          }`}
        >
          <Settings className="w-5 h-5 text-[#7b7484]" />
          <span>Settings</span>
        </button>

        <button
          id="nav-link-support"
          onClick={() => {
            alert('SewaBaju Pro Support:\nHubungi tim bantuan via WhatsApp di 0812-3456-7890 atau email support@sewabajupro.id');
          }}
          className="flex items-center gap-3 text-[#4a4452] hover:bg-[#eff4ff] hover:text-[#0b1c30] px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left"
        >
          <HelpCircle className="w-5 h-5 text-[#7b7484]" />
          <span>Support</span>
        </button>

        <button
          id="nav-link-logout"
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin keluar (logout)?')) {
              logout();
            }
          }}
          className="flex items-center gap-3 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left mt-1"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
