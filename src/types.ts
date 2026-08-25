export type GarmentStatus = 
  | 'Tersedia' 
  | 'Dipesan' 
  | 'Sedang Disewa' 
  | 'Dikembalikan' 
  | 'Sedang Dicuci' 
  | 'Perbaikan' 
  | 'Hilang' 
  | 'Tidak Aktif';

export type GarmentCategory = 
  | 'Kebaya' 
  | 'Kebaya Modern'
  | 'Jas' 
  | 'Jas Pria'
  | 'Gaun' 
  | 'Gaun Malam'
  | 'Baju Adat' 
  | 'Pakaian Adat'
  | 'Baju Pengantin' 
  | 'Gaun Pengantin'
  | 'Baju Anak' 
  | 'Kostum' 
  | 'Aksesoris';

export type GarmentCondition = 
  | 'Baik' 
  | 'Kotor' 
  | 'Rusak Ringan' 
  | 'Rusak Berat' 
  | 'Hilang';

export interface GarmentItem {
  id: string;
  code: string;
  name: string;
  category: GarmentCategory;
  subType?: string;
  size: string;
  color: string;
  brand?: string;
  purchasePrice: number;
  rentalPricePerDay: number;
  depositAmount: number;
  photos: string[];
  description: string;
  condition: GarmentCondition;
  status: GarmentStatus;
  storageLocation: string; // e.g. "Rak A-02", "Gantungan 14"
  stock: number;
  totalRentCount: number;
  totalRevenueGenerated: number;
  maintenanceCost: number;
  notes?: string;
  createdAt: string;
}

export type CustomerTier = 'Regular' | 'Silver' | 'Gold' | 'VIP';

export interface CustomerPenaltyRecord {
  id: string;
  date: string;
  reason: string;
  amount: number;
  status: 'Unpaid' | 'Resolved' | 'Waived';
}

export interface CustomerRecentRental {
  id: string;
  rentalId: string;
  garmentName: string;
  garmentPhoto: string;
  garmentCode: string;
  returnDateText: string;
  rentalPrice: number;
}

export interface BodyMeasurements {
  bust?: number;
  waist?: number;
  hips?: number;
  height?: number;
  notes?: string;
}

export interface Customer {
  id: string;
  code: string; // CUS-001
  name: string;
  whatsapp: string;
  phone?: string;
  identityType?: string; // KTP, SIM, Paspor
  identityNumber: string;
  email?: string;
  instagram?: string;
  address: string;
  birthDate?: string;
  notes?: string;
  tier: CustomerTier;
  bodyMeasurements?: BodyMeasurements;
  totalRentals: number;
  totalSpent: number;
  piutang: number;
  penalties: CustomerPenaltyRecord[];
  recentRentals: CustomerRecentRental[];
  avatarUrl?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export type RentalStatus = 
  | 'Dipesan'
  | 'Sedang Disewa'
  | 'Selesai'
  | 'Dibatalkan'
  | 'Draft' 
  | 'Booking' 
  | 'DP' 
  | 'Lunas' 
  | 'Siap Diambil' 
  | 'Menunggu Pengembalian';

export type PaymentMethod = 'Tunai' | 'Transfer Bank' | 'QRIS' | 'E-Wallet';
export type PaymentStatus = 'Belum Bayar' | 'DP' | 'Sebagian' | 'Lunas' | 'Refund';

export interface RentalGarmentItem {
  garmentId: string;
  garmentCode: string;
  garmentName: string;
  garmentPhoto: string;
  category: GarmentCategory;
  size: string;
  color: string;
  pricePerDay: number;
  days: number;
  subtotal: number;
}

export type RentalTransactionItem = RentalGarmentItem;

export interface RentalTransaction {
  id: string;
  invoiceNumber: string; // TRX-20260825-001
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerWhatsapp?: string;
  customerTier: CustomerTier;
  items: RentalGarmentItem[];
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  actualPickupDate?: string;
  actualReturnDate?: string;
  durationDays: number;
  subtotal: number;
  depositAmount: number;
  discount?: number;
  discountAmount?: number;
  additionalFees?: number;
  penaltyAmount?: number;
  penaltyReason?: string;
  totalAmount: number;
  downPaymentAmount?: number;
  amountPaid: number;
  balanceDue: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: RentalStatus;
  notes?: string;
  eventDetails?: string;
  fittingNotes?: string;
  pickupNotes?: string;
  pickupStaffName?: string;
  returnCondition?: GarmentCondition;
  returnNotes?: string;
  depositRefundedAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export type LaundryStatus = 'Menunggu Dicuci' | 'Sedang Dicuci' | 'Selesai' | 'Siap Digunakan';

export interface LaundryItem {
  id: string;
  rentalId?: string;
  rentalInvoiceNumber?: string;
  garmentId: string;
  garmentCode: string;
  garmentName: string;
  garmentPhoto: string;
  sentDate: string;
  estimatedDoneDate: string;
  actualDoneDate?: string;
  status: LaundryStatus;
  vendorName: string;
  cost: number;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entityType?: string;
  entityId?: string;
  detail: string;
}

export interface AppSettings {
  boutiqueName: string;
  tagline: string;
  address: string;
  whatsappNumber: string;
  email: string;
  instagram?: string;
  logoUrl?: string;
  invoiceFooter?: string;
  operatingHours?: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  penaltyPerDay: number;
  defaultRentalDays?: number;
  minRentalDays?: number;
  defaultDeposit?: number;
  defaultDepositAmount?: number;
  termsAndConditions?: string;
  qrisImageUrl?: string;
}

export type BoutiqueSettings = AppSettings;

export interface NotificationItem {
  id: string;
  type: 'warning' | 'info' | 'success' | 'urgent';
  title: string;
  message: string;
  date: string;
  isRead?: boolean;
  read?: boolean;
  linkTab?: string;
}

export type UserRole = 'Owner' | 'Admin' | 'Kasir' | 'Staff';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  phone?: string;
  status?: 'Aktif' | 'Nonaktif';
  createdAt?: string;
}

export type AppUser = UserProfile;

export interface AuthCredentials {
  username: string;
  password: string;
  lastUpdated?: string;
}

export interface SpreadsheetConfig {
  webAppUrl: string;
  sheetId?: string;
  apiKey?: string;
  autoSyncEnabled: boolean;
  lastSyncTime?: string;
  syncStatus: 'disconnected' | 'connected' | 'syncing' | 'error';
  lastError?: string;
}

export interface SpreadsheetSyncLog {
  id: string;
  timestamp: string;
  type: 'PUSH' | 'PULL' | 'TEST' | 'SETUP';
  status: 'SUCCESS' | 'FAILED' | 'IN_PROGRESS';
  message: string;
  recordsCount?: {
    garments?: number;
    customers?: number;
    transactions?: number;
    laundry?: number;
    users?: number;
  };
}
