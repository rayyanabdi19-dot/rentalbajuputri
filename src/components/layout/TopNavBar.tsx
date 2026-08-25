import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Calendar as CalendarIcon, 
  X, 
  Shirt, 
  Users, 
  Receipt, 
  Check, 
  ChevronDown,
  UserCheck,
  KeyRound,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopNavBar: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    currentUser, 
    setCurrentUser, 
    allUsers,
    garments,
    customers,
    transactions,
    setSelectedGarmentId,
    setSelectedCustomerId,
    setInvoiceModalTransaction,
    setActiveTab,
    authCredentials,
    logout
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.read);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search matches
  const q = searchQuery.toLowerCase().trim();
  const matchedGarments = q ? garments.filter(g => 
    g.name.toLowerCase().includes(q) || 
    g.code.toLowerCase().includes(q) || 
    g.category.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const matchedCustomers = q ? customers.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.whatsapp.includes(q) || 
    c.code.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const matchedTransactions = q ? transactions.filter(t => 
    t.invoiceNumber.toLowerCase().includes(q) || 
    t.customerName.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const hasMatches = matchedGarments.length > 0 || matchedCustomers.length > 0 || matchedTransactions.length > 0;

  return (
    <header className="bg-white border-b border-[#ccc3d4]/40 sticky top-0 z-40 flex flex-col justify-center w-full px-4 sm:px-6 md:px-8 min-h-[72px] md:h-20 shadow-2xs">
      <div className="flex justify-between items-center w-full gap-2">
        {/* Mobile Title & Global Search Bar */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl" ref={searchRef}>
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#320075] text-white flex items-center justify-center font-bold text-xs shrink-0">
              SBP
            </div>
            <span className="font-bold text-base text-[#320075] truncate max-w-[110px] sm:max-w-none">SewaBaju</span>
          </div>

          <div className="relative flex-1 hidden sm:block">
            <Search className="w-4 h-4 text-[#7b7484] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-global-search"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Cari sewa, pelanggan, baju..."
              className="w-full pl-10 pr-9 py-2 bg-[#f8f9ff] hover:bg-[#eff4ff] focus:bg-white border border-[#ccc3d4]/40 rounded-xl outline-none text-xs sm:text-sm text-[#0b1c30] placeholder-[#7b7484] focus:ring-2 focus:ring-[#320075]/20 focus:border-[#320075] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Quick Instant Search Popup Desktop */}
            {showSearchResults && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 max-h-96 overflow-y-auto">
                {!hasMatches ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Tidak ditemukan hasil untuk "{searchQuery}"
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matchedGarments.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center gap-1">
                          <Shirt className="w-3 h-3" /> Koleksi Baju
                        </div>
                        {matchedGarments.map(g => (
                          <div
                            key={g.id}
                            onClick={() => {
                              setSelectedGarmentId(g.id);
                              setActiveTab('collection');
                              setShowSearchResults(false);
                            }}
                            className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <img src={g.photos[0]} alt={g.name} className="w-8 h-10 object-cover rounded bg-slate-100 shrink-0" />
                              <div>
                                <div className="text-xs font-semibold text-slate-800 line-clamp-1">{g.name}</div>
                                <div className="text-[11px] text-slate-500">{g.code} • Size {g.size} • Rp{g.rentalPricePerDay.toLocaleString('id-ID')}/hari</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                              {g.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {matchedCustomers.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center gap-1">
                          <Users className="w-3 h-3" /> Pelanggan
                        </div>
                        {matchedCustomers.map(c => (
                          <div
                            key={c.id}
                            onClick={() => {
                              setSelectedCustomerId(c.id);
                              setActiveTab('customers');
                              setShowSearchResults(false);
                            }}
                            className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <div>
                              <div className="text-xs font-semibold text-slate-800">{c.name}</div>
                              <div className="text-[11px] text-slate-500">{c.code} • {c.whatsapp}</div>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 shrink-0">
                              {c.tier}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {matchedTransactions.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 flex items-center gap-1">
                          <Receipt className="w-3 h-3" /> Transaksi Sewa
                        </div>
                        {matchedTransactions.map(t => (
                          <div
                            key={t.id}
                            onClick={() => {
                              setInvoiceModalTransaction(t);
                              setShowSearchResults(false);
                            }}
                            className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <div>
                              <div className="text-xs font-semibold text-slate-800">{t.invoiceNumber} • {t.customerName}</div>
                              <div className="text-[11px] text-slate-500">{t.startDate} s/d {t.endDate} • Rp{t.totalAmount.toLocaleString('id-ID')}</div>
                            </div>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 shrink-0">
                              {t.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Controls: Search Mobile Button, Notifications, Calendar, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="sm:hidden w-9 h-9 rounded-xl border border-[#ccc3d4]/30 hover:bg-[#eff4ff] text-[#4a4452] flex items-center justify-center cursor-pointer"
            aria-label="Cari"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              id="btn-notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-[#ccc3d4]/30 hover:bg-[#eff4ff] text-[#4a4452] hover:text-[#320075] flex items-center justify-center relative transition-colors cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-[calc(100vw-32px)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-800">Notifikasi Butik</h4>
                    {unreadNotifs.length > 0 && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        {unreadNotifs.length} Baru
                      </span>
                    )}
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs font-semibold text-[#320075] hover:underline"
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto my-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">Tidak ada notifikasi</div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-3 rounded-xl transition-colors cursor-pointer ${notif.read ? 'bg-white opacity-70' : 'bg-[#eff4ff]/60'}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-xs font-bold ${
                            notif.type === 'urgent' ? 'text-red-700' : notif.type === 'warning' ? 'text-amber-700' : 'text-[#320075]'
                          }`}>
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">{notif.date}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-snug">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Calendar Shortcut */}
          <button
            id="btn-calendar-shortcut"
            onClick={() => setActiveTab('calendar')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-[#ccc3d4]/30 hover:bg-[#eff4ff] text-[#4a4452] hover:text-[#320075] flex items-center justify-center transition-colors cursor-pointer"
            title="Buka Kalender Sewa"
          >
            <CalendarIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* User Profile / Role Switcher */}
          <div className="relative" ref={userRef}>
            <button
              id="btn-user-profile"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-xl hover:bg-[#eff4ff] transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-[#ccc3d4] shadow-xs shrink-0">
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden lg:block text-left pr-1">
                <div className="text-xs font-bold text-[#0b1c30] truncate max-w-[120px] leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-[#4a4452] font-medium flex items-center gap-1">
                  <span>{currentUser.role}</span>
                  <ChevronDown className="w-3 h-3 text-[#7b7484]" />
                </div>
              </div>
            </button>

            {/* User Menu & Role Switcher */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="p-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                  <div className="mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-[#320075]">
                    Role: {currentUser.role}
                  </div>
                </div>

                <div className="mt-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
                    Ganti Akun / Peran (Demo)
                  </div>
                  <div className="space-y-1">
                    {allUsers.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          currentUser.id === u.id ? 'bg-[#e9def5] text-[#320075] font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={u.avatarUrl} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                          <div>
                            <div className="line-clamp-1">{u.name}</div>
                            <div className="text-[10px] text-slate-500 font-normal">{u.role}</div>
                          </div>
                        </div>
                        {currentUser.id === u.id && <Check className="w-4 h-4 text-[#320075]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-[#320075]" />
                    <span>Atur Akun & Password ({authCredentials.username})</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (confirm('Apakah Anda yakin ingin keluar (logout)?')) {
                        logout();
                      }
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Expandable Bar */}
      {mobileSearchOpen && (
        <div className="sm:hidden pt-2 pb-1 animate-in slide-in-from-top-2 duration-150 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-[#7b7484] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              placeholder="Cari baju, pelanggan, invoice..."
              className="w-full pl-9 pr-8 py-2 bg-[#f8f9ff] border border-[#ccc3d4]/50 rounded-xl text-xs text-slate-900 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
