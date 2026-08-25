import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  GarmentItem, 
  Customer, 
  RentalTransaction, 
  LaundryItem, 
  BoutiqueSettings, 
  NotificationItem, 
  AuditLog, 
  AppUser,
  UserProfile,
  AuthCredentials,
  GarmentStatus,
  GarmentCondition,
  RentalStatus,
  PaymentStatus,
  SpreadsheetConfig,
  SpreadsheetSyncLog
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_GARMENTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_LAUNDRY, 
  INITIAL_SETTINGS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from '../data/initialData';

export type NavigationTab = 
  | 'dashboard' 
  | 'collection' 
  | 'customers' 
  | 'rentals' 
  | 'laundry' 
  | 'calendar' 
  | 'reports' 
  | 'settings'
  | 'spreadsheet';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  // User Management
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  allUsers: AppUser[];
  addUser: (user: Omit<UserProfile, 'id'>) => UserProfile;
  updateUser: (id: string, user: Partial<UserProfile>) => void;
  deleteUser: (id: string) => { success: boolean; error?: string };
  
  // Auth & Security
  isAuthenticated: boolean;
  authCredentials: AuthCredentials;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateCredentials: (currentPassword: string, newUsername: string, newPassword: string) => { success: boolean; error?: string };

  // Spreadsheet Database & Backend Integration
  spreadsheetConfig: SpreadsheetConfig;
  updateSpreadsheetConfig: (config: Partial<SpreadsheetConfig>) => void;
  spreadsheetSyncLogs: SpreadsheetSyncLog[];
  testSpreadsheetConnection: (customUrl?: string) => Promise<{ success: boolean; message: string; details?: any }>;
  syncPushToSpreadsheet: () => Promise<{ success: boolean; message: string; recordsUpdated?: any }>;
  syncPullFromSpreadsheet: () => Promise<{ success: boolean; message: string; recordsCount?: number }>;
  setupSpreadsheetHeaders: () => Promise<{ success: boolean; message: string }>;
  clearSpreadsheetSyncLogs: () => void;

  // Data
  garments: GarmentItem[];
  customers: Customer[];
  transactions: RentalTransaction[];
  laundryItems: LaundryItem[];
  settings: BoutiqueSettings;
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  
  // Global search & filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Modals & Active Selections
  isNewRentalModalOpen: boolean;
  setIsNewRentalModalOpen: (open: boolean) => void;
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  selectedGarmentId: string | null;
  setSelectedGarmentId: (id: string | null) => void;
  invoiceModalTransaction: RentalTransaction | null;
  setInvoiceModalTransaction: (tx: RentalTransaction | null) => void;
  returnModalTransaction: RentalTransaction | null;
  setReturnModalTransaction: (tx: RentalTransaction | null) => void;
  pickupModalTransaction: RentalTransaction | null;
  setPickupModalTransaction: (tx: RentalTransaction | null) => void;
  qrModalData: { title: string; code: string; type: 'garment' | 'transaction'; extra?: string } | null;
  setQrModalData: (data: { title: string; code: string; type: 'garment' | 'transaction'; extra?: string } | null) => void;
  whatsappModalData: { phone: string; message: string; title: string } | null;
  setWhatsappModalData: (data: { phone: string; message: string; title: string } | null) => void;
  
  // Actions
  addGarment: (garment: Omit<GarmentItem, 'id' | 'createdAt' | 'totalRentCount' | 'totalRevenueGenerated' | 'maintenanceCost'>) => GarmentItem;
  updateGarment: (id: string, updates: Partial<GarmentItem>) => void;
  deleteGarment: (id: string) => void;
  
  addCustomer: (customer: Omit<Customer, 'id' | 'code' | 'createdAt' | 'totalRentals' | 'totalSpent' | 'piutang' | 'penalties' | 'recentRentals'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  createRentalTransaction: (data: Omit<RentalTransaction, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => RentalTransaction;
  updateTransaction: (id: string, updates: Partial<RentalTransaction>) => void;
  processPickup: (transactionId: string, notes: string, staffName: string) => void;
  processReturn: (
    transactionId: string, 
    actualReturnDate: string, 
    condition: GarmentCondition, 
    penaltyAmount: number, 
    penaltyReason: string, 
    depositRefunded: number, 
    sendToLaundry: boolean, 
    returnNotes: string
  ) => void;
  cancelTransaction: (transactionId: string, reason: string) => void;
  
  // Laundry Actions
  addLaundryItem: (garmentId: string, rentalId?: string, vendorName?: string, cost?: number, notes?: string) => void;
  updateLaundryStatus: (laundryId: string, status: LaundryItem['status']) => void;
  finishLaundry: (laundryId: string) => void;
  
  // Settings
  updateSettings: (newSettings: Partial<BoutiqueSettings>) => void;
  
  // Helpers
  checkGarmentAvailability: (garmentId: string, startDate: string, endDate: string, excludeRentalId?: string) => {
    isAvailable: boolean;
    reason?: string;
    conflictingRental?: RentalTransaction;
    suggestedAlternatives?: GarmentItem[];
  };
  calculateLateDaysAndPenalty: (expectedReturnDate: string, actualReturnDate: string) => { lateDays: number; penaltyAmount: number };
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetToSampleData: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [currentUser, setCurrentUser] = useState<AppUser>(INITIAL_USERS[0]);
  const [allUsers, setAllUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('sewabaju_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Sync users to local storage
  useEffect(() => {
    localStorage.setItem('sewabaju_users', JSON.stringify(allUsers));
  }, [allUsers]);
  
  // Authentication & Security state
  const [authCredentials, setAuthCredentials] = useState<AuthCredentials>(() => {
    const saved = localStorage.getItem('sewabaju_auth_credentials');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse auth credentials', e);
      }
    }
    return {
      username: 'admin',
      password: 'admin123',
      lastUpdated: new Date().toISOString()
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sewabaju_is_authenticated') === 'true';
  });

  // Sync auth credentials to local storage
  useEffect(() => {
    localStorage.setItem('sewabaju_auth_credentials', JSON.stringify(authCredentials));
  }, [authCredentials]);

  // Sync auth session to local storage
  useEffect(() => {
    localStorage.setItem('sewabaju_is_authenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);
  
  // Persistence with LocalStorage
  const [garments, setGarments] = useState<GarmentItem[]>(() => {
    const saved = localStorage.getItem('sewabaju_garments');
    return saved ? JSON.parse(saved) : INITIAL_GARMENTS;
  });
  
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('sewabaju_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  
  const [transactions, setTransactions] = useState<RentalTransaction[]>(() => {
    const saved = localStorage.getItem('sewabaju_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  
  const [laundryItems, setLaundryItems] = useState<LaundryItem[]>(() => {
    const saved = localStorage.getItem('sewabaju_laundry');
    return saved ? JSON.parse(saved) : INITIAL_LAUNDRY;
  });
  
  const [settings, setSettings] = useState<BoutiqueSettings>(() => {
    const saved = localStorage.getItem('sewabaju_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Spreadsheet Database & GAS Integration state
  const [spreadsheetConfig, setSpreadsheetConfig] = useState<SpreadsheetConfig>(() => {
    const saved = localStorage.getItem('sewabaju_spreadsheet_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse spreadsheet config', e);
      }
    }
    return {
      webAppUrl: '',
      sheetId: '',
      apiKey: '',
      autoSyncEnabled: false,
      syncStatus: 'disconnected',
      lastSyncTime: undefined,
      lastError: undefined
    };
  });

  const [spreadsheetSyncLogs, setSpreadsheetSyncLogs] = useState<SpreadsheetSyncLog[]>(() => {
    const saved = localStorage.getItem('sewabaju_spreadsheet_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse spreadsheet logs', e);
      }
    }
    return [
      {
        id: 'log-sync-init',
        timestamp: new Date().toLocaleString('id-ID'),
        type: 'SETUP',
        status: 'SUCCESS',
        message: 'Modul database awan Google Spreadsheet & backend Google Apps Script siap digunakan.',
        recordsCount: {
          garments: 12,
          customers: 8,
          transactions: 6,
          laundry: 3,
          users: 4
        }
      }
    ];
  });

  // Sync spreadsheet config & logs to localStorage
  useEffect(() => {
    localStorage.setItem('sewabaju_spreadsheet_config', JSON.stringify(spreadsheetConfig));
  }, [spreadsheetConfig]);

  useEffect(() => {
    localStorage.setItem('sewabaju_spreadsheet_logs', JSON.stringify(spreadsheetSyncLogs));
  }, [spreadsheetSyncLogs]);
  
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('sewabaju_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('sewabaju_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Global search & UI states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewRentalModalOpen, setIsNewRentalModalOpen] = useState<boolean>(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedGarmentId, setSelectedGarmentId] = useState<string | null>(null);
  const [invoiceModalTransaction, setInvoiceModalTransaction] = useState<RentalTransaction | null>(null);
  const [returnModalTransaction, setReturnModalTransaction] = useState<RentalTransaction | null>(null);
  const [pickupModalTransaction, setPickupModalTransaction] = useState<RentalTransaction | null>(null);
  const [qrModalData, setQrModalData] = useState<{ title: string; code: string; type: 'garment' | 'transaction'; extra?: string } | null>(null);
  const [whatsappModalData, setWhatsappModalData] = useState<{ phone: string; message: string; title: string } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sewabaju_garments', JSON.stringify(garments));
  }, [garments]);

  useEffect(() => {
    localStorage.setItem('sewabaju_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('sewabaju_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sewabaju_laundry', JSON.stringify(laundryItems));
  }, [laundryItems]);

  useEffect(() => {
    localStorage.setItem('sewabaju_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('sewabaju_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sewabaju_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAudit = (action: string, detail: string, entityType: AuditLog['entityType'], entityId?: string) => {
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: dateStr,
      user: `${currentUser.name} (${currentUser.role})`,
      action,
      detail,
      entityType,
      entityId
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Garment Management
  const addGarment = (garmentData: Omit<GarmentItem, 'id' | 'createdAt' | 'totalRentCount' | 'totalRevenueGenerated' | 'maintenanceCost'>): GarmentItem => {
    const newGarment: GarmentItem = {
      ...garmentData,
      id: `g-${Date.now()}`,
      totalRentCount: 0,
      totalRevenueGenerated: 0,
      maintenanceCost: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGarments(prev => [newGarment, ...prev]);
    addAudit('Tambah Koleksi Baju', `Menambahkan baju baru ${newGarment.name} (${newGarment.code}) ke koleksi.`, 'Garment', newGarment.id);
    return newGarment;
  };

  const updateGarment = (id: string, updates: Partial<GarmentItem>) => {
    setGarments(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    addAudit('Update Koleksi Baju', `Memperbarui data baju ID ${id}.`, 'Garment', id);
  };

  const deleteGarment = (id: string) => {
    const target = garments.find(g => g.id === id);
    setGarments(prev => prev.filter(g => g.id !== id));
    addAudit('Hapus Koleksi Baju', `Menghapus baju ${target?.name || id} dari katalog.`, 'Garment', id);
  };

  // Customer Management
  const addCustomer = (customerData: Omit<Customer, 'id' | 'code' | 'createdAt' | 'totalRentals' | 'totalSpent' | 'piutang' | 'penalties' | 'recentRentals'>): Customer => {
    const nextNum = customers.length + 1;
    const code = `CUS-${String(nextNum).padStart(3, '0')}`;
    const newCustomer: Customer = {
      ...customerData,
      id: `c-${Date.now()}`,
      code,
      totalRentals: 0,
      totalSpent: 0,
      piutang: 0,
      penalties: [],
      recentRentals: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [newCustomer, ...prev]);
    addAudit('Tambah Pelanggan', `Mendaftarkan pelanggan baru ${newCustomer.name} (${newCustomer.code}).`, 'Customer', newCustomer.id);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    addAudit('Update Pelanggan', `Memperbarui profil pelanggan ID ${id}.`, 'Customer', id);
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    addAudit('Hapus Pelanggan', `Menonaktifkan / menghapus pelanggan ID ${id}.`, 'Customer', id);
  };

  // Availability & Conflict Checker (Pencegahan Double Booking!)
  const checkGarmentAvailability = (
    garmentId: string, 
    startDate: string, 
    endDate: string, 
    excludeRentalId?: string
  ) => {
    const garment = garments.find(g => g.id === garmentId);
    if (!garment) {
      return { isAvailable: false, reason: 'Baju tidak ditemukan dalam database.' };
    }

    if (garment.status === 'Sedang Dicuci') {
      return { 
        isAvailable: false, 
        reason: `Baju "${garment.name}" sedang dalam proses pencucian (Laundry).` 
      };
    }
    if (garment.status === 'Perbaikan' || garment.status === 'Hilang' || garment.status === 'Tidak Aktif') {
      return { 
        isAvailable: false, 
        reason: `Baju "${garment.name}" sedang berstatus ${garment.status}.` 
      };
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    // Check active transactions
    const conflictingRental = transactions.find(tx => {
      if (excludeRentalId && tx.id === excludeRentalId) return false;
      if (tx.status === 'Selesai' || tx.status === 'Dibatalkan') return false;

      const hasItem = tx.items.some(it => it.garmentId === garmentId);
      if (!hasItem) return false;

      const txStart = new Date(tx.startDate).getTime();
      const txEnd = new Date(tx.endDate).getTime();

      // Check overlap
      return (start <= txEnd && end >= txStart);
    });

    if (conflictingRental) {
      // Find smart alternatives: same category, similar size
      const alternatives = garments.filter(g => 
        g.id !== garmentId && 
        g.category === garment.category && 
        (g.status === 'Tersedia' || g.status === 'Dipesan')
      ).slice(0, 3);

      return {
        isAvailable: false,
        reason: `Baju "${garment.name}" (${garment.code}) sudah dipesan/disewa pada rentang tanggal tersebut (No. Transaksi: ${conflictingRental.invoiceNumber}).`,
        conflictingRental,
        suggestedAlternatives: alternatives
      };
    }

    return { isAvailable: true };
  };

  // Late days & penalty calculation
  const calculateLateDaysAndPenalty = (expectedReturnDate: string, actualReturnDate: string) => {
    const expected = new Date(expectedReturnDate);
    const actual = new Date(actualReturnDate);
    
    // Normalize to date only
    expected.setHours(0, 0, 0, 0);
    actual.setHours(0, 0, 0, 0);

    const diffTime = actual.getTime() - expected.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return {
        lateDays: diffDays,
        penaltyAmount: diffDays * settings.penaltyPerDay
      };
    }
    return { lateDays: 0, penaltyAmount: 0 };
  };

  // Transaction Management
  const createRentalTransaction = (
    data: Omit<RentalTransaction, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>
  ): RentalTransaction => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const countToday = transactions.filter(t => t.createdAt.startsWith(now.toISOString().split('T')[0])).length + 1;
    const invoiceNumber = `TRX-${dateStr}-${String(countToday).padStart(3, '0')}`;
    
    const newTx: RentalTransaction = {
      ...data,
      id: `trx-${Date.now()}`,
      invoiceNumber,
      createdAt: now.toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: now.toISOString().replace('T', ' ').slice(0, 16)
    };

    setTransactions(prev => [newTx, ...prev]);

    // Update garment status
    const initialGarmentStatus: GarmentStatus = (newTx.status === 'Sedang Disewa') ? 'Sedang Disewa' : 'Dipesan';
    setGarments(prev => prev.map(g => {
      const match = newTx.items.find(it => it.garmentId === g.id);
      if (match) {
        return {
          ...g,
          status: initialGarmentStatus,
          totalRentCount: g.totalRentCount + 1,
          totalRevenueGenerated: g.totalRevenueGenerated + match.subtotal
        };
      }
      return g;
    }));

    // Update customer stats
    setCustomers(prev => prev.map(c => {
      if (c.id === newTx.customerId) {
        const newRecent = newTx.items.map(it => ({
          id: `rr-${Date.now()}-${it.garmentId}`,
          rentalId: newTx.id,
          garmentName: it.garmentName,
          garmentPhoto: it.garmentPhoto,
          garmentCode: it.garmentCode,
          returnDateText: `Sewa ${newTx.startDate} s/d ${newTx.endDate}`,
          rentalPrice: it.pricePerDay * it.days
        }));
        return {
          ...c,
          totalRentals: c.totalRentals + 1,
          totalSpent: c.totalSpent + newTx.totalAmount,
          piutang: c.piutang + newTx.balanceDue,
          recentRentals: [...newRecent, ...c.recentRentals].slice(0, 5)
        };
      }
      return c;
    }));

    addAudit('Buat Transaksi Sewa', `Membuat transaksi ${newTx.invoiceNumber} untuk ${newTx.customerName} (${newTx.items.length} item).`, 'Rental', newTx.id);

    return newTx;
  };

  const updateTransaction = (id: string, updates: Partial<RentalTransaction>) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updates, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) } : tx));
    addAudit('Update Transaksi', `Memperbarui data transaksi ID ${id}.`, 'Rental', id);
  };

  const processPickup = (transactionId: string, notes: string, staffName: string) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return;

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        return {
          ...t,
          status: 'Sedang Disewa',
          actualPickupDate: nowStr,
          pickupNotes: notes,
          pickupStaffName: staffName,
          updatedAt: nowStr
        };
      }
      return t;
    }));

    // Update garments status to 'Sedang Disewa'
    setGarments(prev => prev.map(g => {
      if (tx.items.some(it => it.garmentId === g.id)) {
        return { ...g, status: 'Sedang Disewa' };
      }
      return g;
    }));

    addAudit('Serah Terima / Pengambilan', `Menyerahkan baju sewa untuk ${tx.invoiceNumber} (${tx.customerName}). Status baju berubah ke "Sedang Disewa".`, 'Rental', tx.id);
  };

  const processReturn = (
    transactionId: string, 
    actualReturnDate: string, 
    condition: GarmentCondition, 
    penaltyAmount: number, 
    penaltyReason: string, 
    depositRefunded: number, 
    sendToLaundry: boolean, 
    returnNotes: string
  ) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return;

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        return {
          ...t,
          status: 'Selesai',
          actualReturnDate,
          returnCondition: condition,
          penaltyAmount,
          penaltyReason,
          depositRefundedAmount: depositRefunded,
          returnNotes,
          updatedAt: nowStr
        };
      }
      return t;
    }));

    // Handle penalty record for customer
    if (penaltyAmount > 0) {
      setCustomers(prev => prev.map(c => {
        if (c.id === tx.customerId) {
          const newPen: Customer['penalties'][0] = {
            id: `pen-${Date.now()}`,
            date: actualReturnDate.slice(0, 10),
            reason: penaltyReason || 'Denda Pengembalian',
            amount: penaltyAmount,
            status: 'Resolved'
          };
          return {
            ...c,
            penalties: [newPen, ...c.penalties]
          };
        }
        return c;
      }));
    }

    // Update garments status & route to laundry if applicable
    tx.items.forEach(it => {
      if (sendToLaundry) {
        // Create laundry item
        const newLaundry: LaundryItem = {
          id: `lnd-${Date.now()}-${it.garmentId}`,
          rentalId: tx.id,
          rentalInvoiceNumber: tx.invoiceNumber,
          garmentId: it.garmentId,
          garmentCode: it.garmentCode,
          garmentName: it.garmentName,
          garmentPhoto: it.garmentPhoto,
          sentDate: actualReturnDate.slice(0, 10),
          estimatedDoneDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
          status: 'Menunggu Dicuci',
          vendorName: 'Royal Dry Clean & Boutique Care',
          cost: 75000,
          notes: `Dari transaksi ${tx.invoiceNumber}. Kondisi: ${condition}. ${returnNotes}`
        };
        setLaundryItems(prev => [newLaundry, ...prev]);

        setGarments(prev => prev.map(g => {
          if (g.id === it.garmentId) {
            return { ...g, status: 'Sedang Dicuci', condition };
          }
          return g;
        }));
      } else {
        const nextStatus: GarmentStatus = (condition === 'Rusak Berat' || condition === 'Hilang') ? 'Perbaikan' : 'Tersedia';
        setGarments(prev => prev.map(g => {
          if (g.id === it.garmentId) {
            return { ...g, status: nextStatus, condition };
          }
          return g;
        }));
      }
    });

    addAudit('Proses Pengembalian', `Memproses pengembalian ${tx.invoiceNumber}. Denda: Rp${penaltyAmount.toLocaleString('id-ID')}, Refund Deposit: Rp${depositRefunded.toLocaleString('id-ID')}.`, 'Rental', tx.id);
  };

  const cancelTransaction = (transactionId: string, reason: string) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return;

    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        return {
          ...t,
          status: 'Dibatalkan',
          notes: `${t.notes || ''} [Dibatalkan: ${reason}]`,
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
      }
      return t;
    }));

    // Release garments to 'Tersedia'
    setGarments(prev => prev.map(g => {
      if (tx.items.some(it => it.garmentId === g.id)) {
        return { ...g, status: 'Tersedia' };
      }
      return g;
    }));

    addAudit('Batalkan Transaksi', `Membatalkan transaksi sewa ${tx.invoiceNumber}. Alasan: ${reason}.`, 'Rental', tx.id);
  };

  // Laundry Management
  const addLaundryItem = (garmentId: string, rentalId?: string, vendorName?: string, cost?: number, notes?: string) => {
    const garment = garments.find(g => g.id === garmentId);
    if (!garment) return;

    const newLaundry: LaundryItem = {
      id: `lnd-${Date.now()}`,
      rentalId,
      garmentId,
      garmentCode: garment.code,
      garmentName: garment.name,
      garmentPhoto: garment.photos[0] || '',
      sentDate: new Date().toISOString().split('T')[0],
      estimatedDoneDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      status: 'Sedang Dicuci',
      vendorName: vendorName || 'Royal Dry Clean & Boutique Care',
      cost: cost || 75000,
      notes: notes || 'Cuci reguler'
    };

    setLaundryItems(prev => [newLaundry, ...prev]);
    setGarments(prev => prev.map(g => g.id === garmentId ? { ...g, status: 'Sedang Dicuci' } : g));
    addAudit('Kirim ke Laundry', `Mengirim ${garment.name} (${garment.code}) ke laundry vendor ${newLaundry.vendorName}.`, 'Laundry', newLaundry.id);
  };

  const updateLaundryStatus = (laundryId: string, status: LaundryItem['status']) => {
    setLaundryItems(prev => prev.map(item => {
      if (item.id === laundryId) {
        return { ...item, status };
      }
      return item;
    }));
  };

  const finishLaundry = (laundryId: string) => {
    const item = laundryItems.find(l => l.id === laundryId);
    if (!item) return;

    setLaundryItems(prev => prev.map(l => l.id === laundryId ? { ...l, status: 'Siap Digunakan', actualDoneDate: new Date().toISOString().split('T')[0] } : l));
    
    // Set garment back to 'Tersedia' and 'Baik'
    setGarments(prev => prev.map(g => {
      if (g.id === item.garmentId) {
        return { ...g, status: 'Tersedia', condition: 'Baik', maintenanceCost: g.maintenanceCost + (item.cost || 0) };
      }
      return g;
    }));

    addAudit('Laundry Selesai', `Baju ${item.garmentName} (${item.garmentCode}) selesai dicuci dan siap disewakan kembali (Status: Tersedia).`, 'Laundry', laundryId);
  };

  const updateSettings = (newSettings: Partial<BoutiqueSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addAudit('Pengaturan Usaha', 'Memperbarui profil butik dan aturan sewa.', 'Settings');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Auth & Security methods
  const login = (usernameInput: string, passwordInput: string): { success: boolean; error?: string } => {
    const trimmedUser = usernameInput.trim();
    if (!trimmedUser || !passwordInput) {
      return { success: false, error: 'Silakan isi username dan password Anda.' };
    }

    if (
      trimmedUser.toLowerCase() === authCredentials.username.toLowerCase() &&
      passwordInput === authCredentials.password
    ) {
      setIsAuthenticated(true);
      addAudit('Login Berhasil', `Pengguna ${trimmedUser} berhasil masuk ke sistem.`, 'Settings');
      return { success: true };
    }

    return { 
      success: false, 
      error: 'Username atau password salah. Pastikan kredensial yang dimasukkan benar.' 
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sewabaju_is_authenticated');
    addAudit('Logout Sistem', `Pengguna ${authCredentials.username} keluar dari sistem.`, 'Settings');
  };

  const updateCredentials = (
    currentPasswordInput: string,
    newUsernameInput: string,
    newPasswordInput: string
  ): { success: boolean; error?: string } => {
    if (currentPasswordInput !== authCredentials.password) {
      return { success: false, error: 'Password saat ini (lama) tidak sesuai.' };
    }

    const trimmedNewUser = newUsernameInput.trim();
    if (trimmedNewUser.length < 3) {
      return { success: false, error: 'Username baru minimal 3 karakter.' };
    }

    if (newPasswordInput.length < 5) {
      return { success: false, error: 'Password baru minimal 5 karakter.' };
    }

    const updatedCreds: AuthCredentials = {
      username: trimmedNewUser,
      password: newPasswordInput,
      lastUpdated: new Date().toISOString()
    };

    setAuthCredentials(updatedCreds);
    addAudit(
      'Ubah Kredensial Akun', 
      `Kredensial login diperbarui (Username: ${trimmedNewUser}).`, 
      'Settings'
    );

    return { success: true };
  };

  // User CRUD Operations
  const addUser = (userData: Omit<UserProfile, 'id'>): UserProfile => {
    const newUser: UserProfile = {
      ...userData,
      id: `usr-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: userData.status || 'Aktif',
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };

    setAllUsers(prev => [newUser, ...prev]);
    addAudit('Tambah Pengguna', `Menambahkan pengguna baru "${newUser.name}" dengan peran ${newUser.role}.`, 'Settings');
    return newUser;
  };

  const updateUser = (id: string, updatedFields: Partial<UserProfile>) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === id) {
        const updated = { ...u, ...updatedFields };
        if (currentUser.id === id) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));
    addAudit('Update Pengguna', `Memperbarui profil pengguna (ID: ${id}).`, 'Settings');
  };

  const deleteUser = (id: string): { success: boolean; error?: string } => {
    if (allUsers.length <= 1) {
      return { success: false, error: 'Tidak dapat menghapus satu-satunya akun pengguna yang tersisa dalam sistem.' };
    }
    const userToDelete = allUsers.find(u => u.id === id);
    if (!userToDelete) {
      return { success: false, error: 'Pengguna tidak ditemukan.' };
    }

    const remaining = allUsers.filter(u => u.id !== id);
    setAllUsers(remaining);

    // If current logged-in profile is being deleted, switch active profile
    if (currentUser.id === id && remaining.length > 0) {
      setCurrentUser(remaining[0]);
    }

    addAudit('Hapus Pengguna', `Menghapus akun pengguna "${userToDelete.name}" (${userToDelete.role}).`, 'Settings');
    return { success: true };
  };

  const updateSpreadsheetConfig = (config: Partial<SpreadsheetConfig>) => {
    setSpreadsheetConfig(prev => ({ ...prev, ...config }));
  };

  const clearSpreadsheetSyncLogs = () => {
    setSpreadsheetSyncLogs([]);
    localStorage.removeItem('sewabaju_spreadsheet_logs');
  };

  const addSyncLog = (
    type: 'PUSH' | 'PULL' | 'TEST' | 'SETUP',
    status: 'SUCCESS' | 'FAILED' | 'IN_PROGRESS',
    message: string,
    recordsCount?: any
  ) => {
    const newLog: SpreadsheetSyncLog = {
      id: `sync-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      type,
      status,
      message,
      recordsCount
    };
    setSpreadsheetSyncLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const testSpreadsheetConnection = async (customUrl?: string): Promise<{ success: boolean; message: string; details?: any }> => {
    const targetUrl = (customUrl || spreadsheetConfig.webAppUrl || '').trim();
    if (!targetUrl) {
      return { success: false, message: 'URL Google Apps Script Web App belum diisi.' };
    }

    if (!targetUrl.startsWith('https://script.google.com/macros/s/')) {
      return { 
        success: false, 
        message: 'Format URL tidak valid. Pastikan URL diawali dengan "https://script.google.com/macros/s/..." dan berakhiran "/exec".' 
      };
    }

    try {
      updateSpreadsheetConfig({ syncStatus: 'syncing', lastError: undefined });
      const pingUrl = targetUrl.includes('?') ? `${targetUrl}&action=ping` : `${targetUrl}?action=ping`;
      
      const response = await fetch(pingUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`Server Google Apps Script merespons dengan status HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.status === 'success' || result.spreadsheetName || result.message) {
        updateSpreadsheetConfig({
          syncStatus: 'connected',
          lastError: undefined,
          lastSyncTime: new Date().toISOString()
        });
        addSyncLog('TEST', 'SUCCESS', `Koneksi berhasil ke "${result.spreadsheetName || 'Google Spreadsheet'}" (Sheets: ${(result.availableSheets || []).join(', ') || 'OK'})`);
        addAudit('Uji Koneksi Sheets', `Koneksi Google Apps Script berhasil diverifikasi (${result.spreadsheetName || 'Active'}).`, 'Settings');
        return { 
          success: true, 
          message: result.message || 'Koneksi ke Google Apps Script berhasil terhubung!',
          details: result 
        };
      } else {
        throw new Error(result.message || 'Respons dari Apps Script tidak sesuai format.');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal menghubungi Web App Google Apps Script. Pastikan Web App diatur "Who has access: Anyone".';
      updateSpreadsheetConfig({
        syncStatus: 'error',
        lastError: errorMsg
      });
      addSyncLog('TEST', 'FAILED', errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const syncPushToSpreadsheet = async (): Promise<{ success: boolean; message: string; recordsUpdated?: any }> => {
    const targetUrl = (spreadsheetConfig.webAppUrl || '').trim();
    if (!targetUrl) {
      return { success: false, message: 'URL Google Apps Script Web App belum dikonfigurasi.' };
    }

    try {
      updateSpreadsheetConfig({ syncStatus: 'syncing', lastError: undefined });
      
      const payload = {
        action: 'syncAll',
        timestamp: new Date().toISOString(),
        garments,
        customers,
        transactions,
        laundryItems,
        users: allUsers,
        settings
      };

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
        mode: 'cors',
        redirect: 'follow'
      });

      let resData: any = {};
      try {
        resData = await response.json();
      } catch {
        resData = { status: 'success', message: 'Data berhasil dikirim ke Google Spreadsheet.' };
      }

      const syncStats = {
        garments: garments.length,
        customers: customers.length,
        transactions: transactions.length,
        laundry: laundryItems.length,
        users: allUsers.length
      };

      updateSpreadsheetConfig({
        syncStatus: 'connected',
        lastSyncTime: new Date().toISOString(),
        lastError: undefined
      });

      addSyncLog(
        'PUSH',
        'SUCCESS',
        `Berhasil menyinkronkan seluruh database ke Google Spreadsheet.`,
        syncStats
      );

      addAudit('Cloud Sync (Push)', `Sinkronisasi data ke Google Spreadsheet berhasil (${garments.length} busana, ${transactions.length} sewa).`, 'Settings');

      return {
        success: true,
        message: 'Seluruh database SewaBaju Pro berhasil disinkronkan ke Google Spreadsheet!',
        recordsUpdated: syncStats
      };
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal mengirim data ke Google Spreadsheet.';
      updateSpreadsheetConfig({
        syncStatus: 'error',
        lastError: errorMsg
      });
      addSyncLog('PUSH', 'FAILED', errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const syncPullFromSpreadsheet = async (): Promise<{ success: boolean; message: string; recordsCount?: number }> => {
    const targetUrl = (spreadsheetConfig.webAppUrl || '').trim();
    if (!targetUrl) {
      return { success: false, message: 'URL Google Apps Script Web App belum dikonfigurasi.' };
    }

    try {
      updateSpreadsheetConfig({ syncStatus: 'syncing', lastError: undefined });
      const pullUrl = targetUrl.includes('?') ? `${targetUrl}&action=getAllData` : `${targetUrl}?action=getAllData`;

      const response = await fetch(pullUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`Gagal mengambil data dari Google Apps Script (HTTP ${response.status})`);
      }

      const res = await response.json();
      if (!res || !res.data) {
        throw new Error('Format data dari Spreadsheet tidak dikenali atau kosong.');
      }

      const d = res.data;
      let totalUpdated = 0;

      if (Array.isArray(d.garments) && d.garments.length > 0) {
        setGarments(d.garments);
        totalUpdated += d.garments.length;
      }
      if (Array.isArray(d.customers) && d.customers.length > 0) {
        setCustomers(d.customers);
        totalUpdated += d.customers.length;
      }
      if (Array.isArray(d.transactions) && d.transactions.length > 0) {
        setTransactions(d.transactions);
        totalUpdated += d.transactions.length;
      }
      if (Array.isArray(d.laundryItems) && d.laundryItems.length > 0) {
        setLaundryItems(d.laundryItems);
        totalUpdated += d.laundryItems.length;
      }
      if (Array.isArray(d.users) && d.users.length > 0) {
        setAllUsers(d.users);
        if (d.users.length > 0) {
          const matched = d.users.find((u: any) => u.id === currentUser.id);
          if (matched) setCurrentUser(matched);
        }
      }

      updateSpreadsheetConfig({
        syncStatus: 'connected',
        lastSyncTime: new Date().toISOString(),
        lastError: undefined
      });

      const recordsStats = {
        garments: d.garments?.length || 0,
        customers: d.customers?.length || 0,
        transactions: d.transactions?.length || 0,
        laundry: d.laundryItems?.length || 0,
        users: d.users?.length || 0
      };

      addSyncLog('PULL', 'SUCCESS', `Data dari Google Spreadsheet berhasil ditarik dan diterapkan ke aplikasi.`, recordsStats);
      addAudit('Cloud Sync (Pull)', `Menarik data terbaru dari Google Spreadsheet (${totalUpdated} baris diperbarui).`, 'Settings');

      return {
        success: true,
        message: `Berhasil menarik data dari Google Spreadsheet (${totalUpdated} data diperbarui).`,
        recordsCount: totalUpdated
      };
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal menarik data dari Google Spreadsheet.';
      updateSpreadsheetConfig({
        syncStatus: 'error',
        lastError: errorMsg
      });
      addSyncLog('PULL', 'FAILED', errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const setupSpreadsheetHeaders = async (): Promise<{ success: boolean; message: string }> => {
    const targetUrl = (spreadsheetConfig.webAppUrl || '').trim();
    if (!targetUrl) {
      return { success: false, message: 'URL Google Apps Script Web App belum diisi.' };
    }

    try {
      updateSpreadsheetConfig({ syncStatus: 'syncing' });
      const payload = { action: 'setupSheets' };

      await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        mode: 'cors',
        redirect: 'follow'
      });

      updateSpreadsheetConfig({ syncStatus: 'connected', lastError: undefined });
      addSyncLog('SETUP', 'SUCCESS', 'Inisialisasi format tabel dan sheet di Google Spreadsheet berhasil dilakukan.');
      addAudit('Setup Sheet', 'Inisialisasi struktur sheet dan format header Google Spreadsheet berhasil.', 'Settings');

      return {
        success: true,
        message: 'Inisialisasi tab sheet & format header di Google Spreadsheet berhasil!'
      };
    } catch (err: any) {
      const errorMsg = err.message || 'Gagal melakukan inisialisasi sheet.';
      updateSpreadsheetConfig({ syncStatus: 'error', lastError: errorMsg });
      addSyncLog('SETUP', 'FAILED', errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const resetToSampleData = () => {
    setGarments(INITIAL_GARMENTS);
    setCustomers(INITIAL_CUSTOMERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setLaundryItems(INITIAL_LAUNDRY);
    setSettings(INITIAL_SETTINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setAllUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.clear();
    addAudit('Reset Data', 'Mereset database ke data sampel awal.', 'Settings');
  };

  const exportDatabaseJSON = (): string => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      garments,
      customers,
      transactions,
      laundryItems,
      settings,
      auditLogs,
      users: allUsers
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDatabaseJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.garments) setGarments(data.garments);
      if (data.customers) setCustomers(data.customers);
      if (data.transactions) setTransactions(data.transactions);
      if (data.laundryItems) setLaundryItems(data.laundryItems);
      if (data.settings) setSettings(data.settings);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      if (data.users) {
        setAllUsers(data.users);
        if (data.users.length > 0) setCurrentUser(data.users[0]);
      }
      addAudit('Import Database', 'Berhasil mengimpor data cadangan (Backup JSON).', 'Settings');
      return true;
    } catch (e) {
      console.error('Failed to parse backup JSON', e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        allUsers,
        addUser,
        updateUser,
        deleteUser,
        isAuthenticated,
        authCredentials,
        login,
        logout,
        updateCredentials,
        garments,
        customers,
        transactions,
        laundryItems,
        settings,
        notifications,
        auditLogs,
        searchQuery,
        setSearchQuery,
        isNewRentalModalOpen,
        setIsNewRentalModalOpen,
        selectedCustomerId,
        setSelectedCustomerId,
        selectedGarmentId,
        setSelectedGarmentId,
        invoiceModalTransaction,
        setInvoiceModalTransaction,
        returnModalTransaction,
        setReturnModalTransaction,
        pickupModalTransaction,
        setPickupModalTransaction,
        qrModalData,
        setQrModalData,
        whatsappModalData,
        setWhatsappModalData,
        addGarment,
        updateGarment,
        deleteGarment,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        createRentalTransaction,
        updateTransaction,
        processPickup,
        processReturn,
        cancelTransaction,
        addLaundryItem,
        updateLaundryStatus,
        finishLaundry,
        updateSettings,
        checkGarmentAvailability,
        calculateLateDaysAndPenalty,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToSampleData,
        exportDatabaseJSON,
        importDatabaseJSON,
        spreadsheetConfig,
        updateSpreadsheetConfig,
        spreadsheetSyncLogs,
        testSpreadsheetConnection,
        syncPushToSpreadsheet,
        syncPullFromSpreadsheet,
        setupSpreadsheetHeaders,
        clearSpreadsheetSyncLogs
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
