import { 
  GarmentItem, 
  Customer, 
  RentalTransaction, 
  LaundryItem, 
  BoutiqueSettings, 
  NotificationItem, 
  AuditLog, 
  AppUser 
} from '../types';

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-1',
    name: 'Clarissa Putri, S.Ds',
    email: 'manager@sewabajupro.id',
    role: 'Owner',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPec32NhmuCPoTE0bFUvb5ueZWJKWdRBq91XlCFzA881JYPYW3-nRoKZ0MABOLIV7ClFYQsLlHGSLHzqaykoqmbjWyNdU9TMg4JxwWnw0I14noE2zIWuiNUbx-KCgxv-hnb-Z2JNf8vLY4zCyU2IyBf7r2L-qIrwsnlSAH21Hwc2S2iHmfFMZS6yCmUotwZ2j1CM61NFPXNGpFsxrW5rG57GAYBNXziB-5C0uyqkngfUlou7OWkcZk'
  },
  {
    id: 'usr-2',
    name: 'Dimas Wicaksono',
    email: 'kasir@sewabajupro.id',
    role: 'Kasir',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-3',
    name: 'Dewi Lestari',
    email: 'staff@sewabajupro.id',
    role: 'Staff',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_GARMENTS: GarmentItem[] = [
  {
    id: 'g-1',
    code: 'KB-001',
    name: 'Kebaya Kutu Baru Sage',
    category: 'Kebaya',
    subType: 'Kutu Baru Modern',
    size: 'M',
    color: 'Sage Green & Gold',
    brand: 'Rumah Busana Clarissa',
    purchasePrice: 2500000,
    rentalPricePerDay: 450000,
    depositAmount: 200000,
    photos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAM49u0cB8Zmm1TEkYNyJqDuYfQWhcDzIwjrPhXasDc-tLW9FUSQbUHmzDwTrp_IZNRxEkMOfmj2OefNzuY_8AOBp6B2MEMUda9Fkqp7haN5DwiHGnrptc9sUAa93b1yHpIfoSEAMi8dhcHMWviCkGXWJISoeSA3wB68_aUcvnhMqDtn90ZvLElblidJ8BzbBEP-5aFgUyq3ac1cruxiaKhhvEbxKfUEiqeVESRWwIfWKJoOYBHAekD'
    ],
    description: 'Kebaya kutu baru bahan brokat premium prada dengan payet tangan halus, dilengkapi obi silk sage dan jarik batik tulis motif parang.',
    condition: 'Baik',
    status: 'Tersedia',
    storageLocation: 'Rak Kebaya A-01',
    stock: 1,
    totalRentCount: 18,
    totalRevenueGenerated: 8100000,
    maintenanceCost: 450000,
    createdAt: '2026-01-10'
  },
  {
    id: 'g-2',
    code: 'JS-042',
    name: 'Classic Black Tuxedo Set',
    category: 'Jas',
    subType: 'Black Tie Tuxedo',
    size: '42 (L)',
    color: 'Jet Black with Satin Lapel',
    brand: 'Savile Row Bespoke',
    purchasePrice: 3800000,
    rentalPricePerDay: 550000,
    depositAmount: 300000,
    photos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0qs6Umkuz3CKTR5HdMWU6EXccLr1n4yWH6mqUN7hcuiGdPidIs-0i6F_9HvjjjwDdoPvd3lBbFEtWIdjnJ1RlKg_k7efNLhE8tn55JslesZds1_ydSChfnbI__Pj-5Wq1DD3LFRXDTLnBO4dTl6HgdR9RsTIQ0rhyrdoXv_6B3usZN1LNksE3huxVW0BS8LdM387VsgUZ9ZyGYevwjSPAQE-vRaJ3SacMJg8aByFx8RAvsteJSHAm'
    ],
    description: 'Setelan jas tuxedo hitam pekat dengan lapel sutra satin premium, rompi dalam, celana bergaris samping, dan dasi kupu-kupu satin hitam.',
    condition: 'Baik',
    status: 'Dipesan',
    storageLocation: 'Gantungan Jas B-04',
    stock: 1,
    totalRentCount: 22,
    totalRevenueGenerated: 12100000,
    maintenanceCost: 600000,
    createdAt: '2026-01-15'
  },
  {
    id: 'g-3',
    code: 'GN-118',
    name: 'Midnight Sparkle Gown',
    category: 'Gaun',
    subType: 'Evening Glamour Gown',
    size: 'S',
    color: 'Midnight Blue & Silver Shimmer',
    brand: 'Atelier Nicole',
    purchasePrice: 4500000,
    rentalPricePerDay: 800000,
    depositAmount: 500000,
    photos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4k3NKLfMHR87lclvTXgH7LuNCRmdKcQZ1K6iWDLJgSYilEp8TLk67nE-n3Us4yGbtb4EYWLp1gNj2DLWbQCIdVnk6bNkQTopWyjoFZhusqz5zxLxaV4mE3HtHANBmGfhm95b2J4131XGm8hx4xEO-qdx7CteNXfM4N7HHKrhpfBNu1WDrf9ncMOzph86AYxMLMRww7KCs5mDuigjmnHAqE_wOyA5-59S8uiX_oBeNdOJo_3LPCYRn'
    ],
    description: 'Gaun malam siluet A-line beraksen glitter perak berkilau di bawah lampu ballroom, punggung model korset tali elegan.',
    condition: 'Baik',
    status: 'Sedang Disewa',
    storageLocation: 'Lemari Gaun VIP C-02',
    stock: 1,
    totalRentCount: 14,
    totalRevenueGenerated: 11200000,
    maintenanceCost: 500000,
    createdAt: '2026-02-01'
  },
  {
    id: 'g-4',
    code: 'KB-089',
    name: 'Kebaya Modern White Bridal',
    category: 'Kebaya',
    subType: 'Kebaya Akad / Prewedding',
    size: 'M',
    color: 'Pure White & Mutiara',
    brand: 'Rumah Busana Clarissa',
    purchasePrice: 3200000,
    rentalPricePerDay: 600000,
    depositAmount: 300000,
    photos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4nXqiHdiPRrgktR_t9RLoAsQb9rJ_7leqYdzTfU7NCOn3h3aEe90WrzWzum1Uf7W99INDVPvPjCUDInrkz4TGrXkAEze519pEWPC1un8JImtLvyMh6SHPgSu569s8SYtK9fJH7Q4WjLXs7WP2D_J782wR93l8QiZyjxMBfnLviMHiyRQCaGg7RRm9XRDXP64EdNhr3rwx2LRm8439GY37-JtsdO69vPj-LqVc5gogZJm3KvhX524n'
    ],
    description: 'Kebaya panjang pengantin putih bersih bertabur payet kristal austria dan bordir Prancis. Ekor panjang 1 meter dapat dilepas.',
    condition: 'Kotor',
    status: 'Sedang Dicuci',
    storageLocation: 'Rak Laundry D-01',
    stock: 1,
    totalRentCount: 19,
    totalRevenueGenerated: 11400000,
    maintenanceCost: 750000,
    createdAt: '2026-02-10'
  },
  {
    id: 'g-5',
    code: 'GN-042',
    name: 'Emerald Silk Evening Gown',
    category: 'Gaun',
    subType: 'Mermaid Silk Gown',
    size: 'M',
    color: 'Emerald Green',
    brand: 'Maison de Rêve',
    purchasePrice: 4200000,
    rentalPricePerDay: 750000,
    depositAmount: 500000,
    photos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAty597-AG1SH3vhJ8VPjs1-xTXqrq6yX29qqhEiVs6C2J9XW6V0csUlrk_DBD01QPEMK0T_sGobk4iCPveuRoNrkAuimwJgHYARMlwDSHp6fMBxymx2VborIUm5b3gyPVxlL78cx2Jmdko9HHkBGqLv2HdH8EiDf-hTLWg6DHuyfqjoxde7hZH52PvLrtm9_gi3LjUyopg5W17tzABCSALitgmr9gxDYRmcFZ2LdbicXqzY-fYcHTl'
    ],
    description: 'Gaun malam sutra emerald dengan aksen drape leher halter neck yang mewah, belahan kaki anggun, sangat cocok untuk red carpet.',
    condition: 'Baik',
    status: 'Tersedia',
    storageLocation: 'Lemari Gaun VIP C-01',
    stock: 1,
    totalRentCount: 16,
    totalRevenueGenerated: 12000000,
    maintenanceCost: 400000,
    createdAt: '2026-02-18'
  },
  {
    id: 'g-6',
    code: 'SUIT-105',
    name: 'Classic Navy Tuxedo Set',
    category: 'Jas',
    subType: 'Italian Slim Fit Navy',
    size: '40 (M)',
    color: 'Deep Navy Blue',
    brand: 'Milano Uomo',
    purchasePrice: 3500000,
    rentalPricePerDay: 1200000,
    depositAmount: 500000,
    photos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDyHQCUIquTbqdB_CjTQe6QDjRXBqlwDY2Ag7S1KFQfeS806YRfa1QTWKyAtIq40g480zAPtVXOcHREvJERlWWHPG9puw3CTAAbzmkB48P3g2SPC1GulJjqlsYAO1WgMd-UiZsDMd5TnMv1p9GpTNffWHQTJGkqhNIbvtjhl_rukQXpoWEI8vAwtOPTFLZvPp_Q9qhvA5n8wARFZuTbc549Jg3BScmIu3Rwa6fBt72KIMaFtXJzHv3S'
    ],
    description: 'Setelan jas navy 3-piece wol super 130s Italia. Lengkap dengan rompi kancing 5 dan dasi sutra eksklusif.',
    condition: 'Baik',
    status: 'Tersedia',
    storageLocation: 'Gantungan Jas B-01',
    stock: 1,
    totalRentCount: 25,
    totalRevenueGenerated: 30000000,
    maintenanceCost: 800000,
    createdAt: '2026-01-05'
  },
  {
    id: 'g-7',
    code: 'KB-021',
    name: 'Kebaya Modern Lilac Brokat',
    category: 'Kebaya',
    subType: 'Kebaya Wisuda & Lamaran',
    size: 'L',
    color: 'Soft Lilac / Lavender',
    brand: 'Rumah Busana Clarissa',
    purchasePrice: 2200000,
    rentalPricePerDay: 400000,
    depositAmount: 200000,
    photos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtp8HHd1AJ7mQX8DjgfBORXcEkctIpMv8MfNia9GgBS5aUiT-7XtychdZBA11ygIq6jCNTR4bHj19olvwUNrSrGrIv9rrsjYI2SYGkgjXYV8bpENh6TSJAfYUF20O9WPKmMymIK3I54q1W89x6uWHQI0G5ishGfpWePGOaWkCPPpdNFxwvIcoRW6-O-D1PY3xwMjYyauCGWvS0FGypapkylM8VVjSGsK7vvjcN2OSfkKCqzv9IPI-Z'
    ],
    description: 'Kebaya modern warna lavender lembut dengan furing silk dan rok span songket palembang tenun benang perak.',
    condition: 'Baik',
    status: 'Sedang Dicuci',
    storageLocation: 'Rak Laundry D-02',
    stock: 1,
    totalRentCount: 21,
    totalRevenueGenerated: 8400000,
    maintenanceCost: 350000,
    createdAt: '2026-03-01'
  },
  {
    id: 'g-8',
    code: 'KB-015',
    name: 'Kebaya Modern Soft Pink Pastel',
    category: 'Kebaya',
    subType: 'Kebaya Kartini Modern',
    size: 'M',
    color: 'Dusty Rose Pink',
    brand: 'Rumah Busana Clarissa',
    purchasePrice: 2600000,
    rentalPricePerDay: 480000,
    depositAmount: 200000,
    photos: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCTNgxkPdIuBMSKpEieg371PnV6B6pN3XPY8i-LKs4XR1lTLY8cngZu42tjKcPmFR-aSV3WBrB012YBQZYiTj2SQhK6Vx2I1D-a-gwB0pr019Oj80uBwj1_bzi_7oGfzJz7C9QH-_xegZNcPXJqx4sqkzmGysPQvGteWrpvj6Y9psqWNgctnmvS38s-CFZJu6MM4gKzFPubwTSJs_S7CMmHpbDfdoVbX3rxKlf_yEEJT9r-HOoSg7-Z'
    ],
    description: 'Kebaya warna dusty rose anggun dengan aksen kancing mutiara, sangat favorit untuk acara wisuda, bridesmaid, dan lamaran.',
    condition: 'Baik',
    status: 'Sedang Disewa',
    storageLocation: 'Rak Kebaya A-03',
    stock: 1,
    totalRentCount: 28,
    totalRevenueGenerated: 13440000,
    maintenanceCost: 520000,
    createdAt: '2026-01-20'
  },
  {
    id: 'g-9',
    code: 'BA-003',
    name: 'Pakaian Adat Minang Suntiang Emas',
    category: 'Baju Adat',
    subType: 'Baju Anak Daro Minangkabau',
    size: 'All Size (M-L)',
    color: 'Merah Marun & Emas 24K',
    brand: 'Sanggar Pusaka Ranah Minang',
    purchasePrice: 7500000,
    rentalPricePerDay: 1500000,
    depositAmount: 750000,
    photos: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Set lengkap baju kurung basiba beludru merah pekat bertabur benang emas, selendang songket balapak, kalung panyaram, dan mahkota suntiang 11 tingkat.',
    condition: 'Baik',
    status: 'Tersedia',
    storageLocation: 'Etalase Adat VIP-01',
    stock: 1,
    totalRentCount: 9,
    totalRevenueGenerated: 13500000,
    maintenanceCost: 900000,
    createdAt: '2026-02-14'
  },
  {
    id: 'g-10',
    code: 'AKS-011',
    name: 'Set Aksesoris Perhiasan Zirconia & Tiara',
    category: 'Aksesoris',
    subType: 'Tiara & Kalung Kristal',
    size: 'All Size',
    color: 'Silver / White Gold Plated',
    brand: 'Royal Palace Jewelry',
    purchasePrice: 1200000,
    rentalPricePerDay: 150000,
    depositAmount: 100000,
    photos: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80'
    ],
    description: 'Tiara pengantin kristal zircon grade AAA lapis emas putih, lengkap dengan kalung choker dan anting gantung.',
    condition: 'Baik',
    status: 'Tersedia',
    storageLocation: 'Brankas Aksesoris BOX-02',
    stock: 2,
    totalRentCount: 30,
    totalRevenueGenerated: 4500000,
    maintenanceCost: 150000,
    createdAt: '2026-01-08'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c-1',
    code: 'CUS-001',
    name: 'Anisa Larasati, M.Psi',
    whatsapp: '+62 812 3456 7890',
    identityNumber: '3171015604920005',
    email: 'anisa.larasati@gmail.com',
    address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan',
    birthDate: '1992-04-16',
    notes: 'Pelanggan VIP Butik, ukuran fit M, menyukai warna emerald dan pastel lilac.',
    tier: 'VIP',
    totalRentals: 12,
    totalSpent: 4500000,
    piutang: 250000,
    penalties: [
      {
        id: 'pen-1',
        date: '2026-08-10',
        reason: 'Late Return (1 Day) - Acara Overrun',
        amount: 50000,
        status: 'Unpaid'
      },
      {
        id: 'pen-2',
        date: '2026-07-22',
        reason: 'Minor Stain di Ujung Gaun (Resolved via Dry Clean)',
        amount: 100000,
        status: 'Resolved'
      }
    ],
    recentRentals: [
      {
        id: 'rr-1',
        rentalId: 'r-101',
        garmentName: 'Emerald Silk Gown',
        garmentCode: 'GN-042',
        garmentPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAty597-AG1SH3vhJ8VPjs1-xTXqrq6yX29qqhEiVs6C2J9XW6V0csUlrk_DBD01QPEMK0T_sGobk4iCPveuRoNrkAuimwJgHYARMlwDSHp6fMBxymx2VborIUm5b3gyPVxlL78cx2Jmdko9HHkBGqLv2HdH8EiDf-hTLWg6DHuyfqjoxde7hZH52PvLrtm9_gi3LjUyopg5W17tzABCSALitgmr9gxDYRmcFZ2LdbicXqzY-fYcHTl',
        returnDateText: 'Returned 2 days ago',
        rentalPrice: 750000
      },
      {
        id: 'rr-2',
        rentalId: 'r-98',
        garmentName: 'Classic Black Tux',
        garmentCode: 'JS-042',
        garmentPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0qs6Umkuz3CKTR5HdMWU6EXccLr1n4yWH6mqUN7hcuiGdPidIs-0i6F_9HvjjjwDdoPvd3lBbFEtWIdjnJ1RlKg_k7efNLhE8tn55JslesZds1_ydSChfnbI__Pj-5Wq1DD3LFRXDTLnBO4dTl6HgdR9RsTIQ0rhyrdoXv_6B3usZN1LNksE3huxVW0BS8LdM387VsgUZ9ZyGYevwjSPAQE-vRaJ3SacMJg8aByFx8RAvsteJSHAm',
        returnDateText: 'Returned 14 days ago',
        rentalPrice: 500000
      }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    createdAt: '2026-01-05'
  },
  {
    id: 'c-2',
    code: 'CUS-002',
    name: 'Budi Santoso',
    whatsapp: '+62 813 9876 5432',
    identityNumber: '3275021208880003',
    email: 'budi.santoso@yahoo.co.id',
    address: 'Cluster Menteng Indah Blok B3, Jakarta Pusat',
    birthDate: '1988-08-12',
    notes: 'Sering sewa jas untuk gala dinner & MC formal.',
    tier: 'Gold',
    totalRentals: 3,
    totalSpent: 1650000,
    piutang: 0,
    penalties: [],
    recentRentals: [
      {
        id: 'rr-3',
        rentalId: 'r-102',
        garmentName: 'Classic Black Tuxedo',
        garmentCode: 'JS-042',
        garmentPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0qs6Umkuz3CKTR5HdMWU6EXccLr1n4yWH6mqUN7hcuiGdPidIs-0i6F_9HvjjjwDdoPvd3lBbFEtWIdjnJ1RlKg_k7efNLhE8tn55JslesZds1_ydSChfnbI__Pj-5Wq1DD3LFRXDTLnBO4dTl6HgdR9RsTIQ0rhyrdoXv_6B3usZN1LNksE3huxVW0BS8LdM387VsgUZ9ZyGYevwjSPAQE-vRaJ3SacMJg8aByFx8RAvsteJSHAm',
        returnDateText: 'Kemarin, 15:45',
        rentalPrice: 550000
      }
    ],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    createdAt: '2026-02-12'
  },
  {
    id: 'c-3',
    code: 'CUS-003',
    name: 'Citra Dewi',
    whatsapp: '+62 856 1122 3344',
    identityNumber: '3172086409950002',
    email: 'citra.dewi@gmail.com',
    address: 'Apartemen Sudirman Park Tower B Lt 18, Jakarta',
    birthDate: '1995-09-24',
    notes: 'Akun baru, tertarik koleksi gaun malam prom.',
    tier: 'Regular',
    totalRentals: 0,
    totalSpent: 0,
    piutang: 0,
    penalties: [],
    recentRentals: [],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Inactive',
    createdAt: '2026-08-20'
  },
  {
    id: 'c-4',
    code: 'CUS-004',
    name: 'Sarah Maharani',
    whatsapp: '+62 811 2233 4455',
    identityNumber: '3174094503930001',
    email: 'sarah.maharani@outlook.com',
    address: 'Pondok Indah Bukit Hijau VII No. 12, Jakarta Selatan',
    birthDate: '1993-03-05',
    notes: 'Langganan gaun pesta designer.',
    tier: 'VIP',
    totalRentals: 8,
    totalSpent: 6400000,
    piutang: 0,
    penalties: [],
    recentRentals: [],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    createdAt: '2026-03-10'
  },
  {
    id: 'c-5',
    code: 'CUS-005',
    name: 'Jane Doe (Gold Member)',
    whatsapp: '+62 812-3456-7890',
    identityNumber: '3175086507940009',
    email: 'jane.doe@example.com',
    address: 'Kuningan City Residence Unit 22A, Jakarta Selatan',
    birthDate: '1994-07-25',
    notes: 'Member diskon 10% Gold Tier.',
    tier: 'Gold',
    totalRentals: 5,
    totalSpent: 5200000,
    piutang: 0,
    penalties: [],
    recentRentals: [],
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    createdAt: '2026-02-01'
  },
  {
    id: 'c-6',
    code: 'CUS-006',
    name: 'Rina Kusuma',
    whatsapp: '+62 878 9988 7766',
    identityNumber: '3276045501900008',
    email: 'rina.kusuma@gmail.com',
    address: 'Jl. Margonda Raya No. 88, Depok',
    birthDate: '1990-01-15',
    notes: 'Terlambat mengembalikan Kebaya Modern Pink.',
    tier: 'Silver',
    totalRentals: 4,
    totalSpent: 2100000,
    piutang: 100000,
    penalties: [
      {
        id: 'pen-3',
        date: '2026-08-25',
        reason: 'Keterlambatan 2 hari pengembalian kebaya',
        amount: 100000,
        status: 'Unpaid'
      }
    ],
    recentRentals: [],
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    status: 'Active',
    createdAt: '2026-04-14'
  }
];

export const INITIAL_TRANSACTIONS: RentalTransaction[] = [
  {
    id: 'trx-0982',
    invoiceNumber: 'TRX-0982',
    customerId: 'c-4',
    customerName: 'Sarah Maharani',
    customerWhatsapp: '+62 811 2233 4455',
    customerTier: 'VIP',
    items: [
      {
        garmentId: 'g-3',
        garmentCode: 'GN-118',
        garmentName: 'Midnight Sparkle Gown',
        garmentPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4k3NKLfMHR87lclvTXgH7LuNCRmdKcQZ1K6iWDLJgSYilEp8TLk67nE-n3Us4yGbtb4EYWLp1gNj2DLWbQCIdVnk6bNkQTopWyjoFZhusqz5zxLxaV4mE3HtHANBmGfhm95b2J4131XGm8hx4xEO-qdx7CteNXfM4N7HHKrhpfBNu1WDrf9ncMOzph86AYxMLMRww7KCs5mDuigjmnHAqE_wOyA5-59S8uiX_oBeNdOJo_3LPCYRn',
        category: 'Gaun',
        size: 'S',
        color: 'Midnight Blue',
        pricePerDay: 800000,
        days: 2,
        subtotal: 1600000
      }
    ],
    startDate: '2026-08-25',
    endDate: '2026-08-27',
    actualPickupDate: '2026-08-25 10:30',
    durationDays: 2,
    subtotal: 1600000,
    depositAmount: 500000,
    discountAmount: 160000, // VIP 10%
    additionalFees: 0,
    penaltyAmount: 0,
    totalAmount: 1940000, // 1600000 + 500000 - 160000
    downPaymentAmount: 1940000,
    amountPaid: 1940000,
    balanceDue: 0,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
    status: 'Sedang Disewa',
    notes: 'Untuk acara Annual Charity Gala di Hotel Mulia.',
    pickupNotes: 'Baju diserahkan dalam kondisi mulus di dalam garment bag anti-debu.',
    pickupStaffName: 'Dimas Wicaksono',
    createdAt: '2026-08-24 14:00',
    updatedAt: '2026-08-25 10:30'
  },
  {
    id: 'trx-0981',
    invoiceNumber: 'TRX-0981',
    customerId: 'c-2',
    customerName: 'Budi Santoso',
    customerWhatsapp: '+62 813 9876 5432',
    customerTier: 'Gold',
    items: [
      {
        garmentId: 'g-2',
        garmentCode: 'JS-042',
        garmentName: 'Classic Black Tuxedo',
        garmentPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0qs6Umkuz3CKTR5HdMWU6EXccLr1n4yWH6mqUN7hcuiGdPidIs-0i6F_9HvjjjwDdoPvd3lBbFEtWIdjnJ1RlKg_k7efNLhE8tn55JslesZds1_ydSChfnbI__Pj-5Wq1DD3LFRXDTLnBO4dTl6HgdR9RsTIQ0rhyrdoXv_6B3usZN1LNksE3huxVW0BS8LdM387VsgUZ9ZyGYevwjSPAQE-vRaJ3SacMJg8aByFx8RAvsteJSHAm',
        category: 'Jas',
        size: '42 (L)',
        color: 'Black',
        pricePerDay: 550000,
        days: 1,
        subtotal: 550000
      }
    ],
    startDate: '2026-08-23',
    endDate: '2026-08-24',
    actualPickupDate: '2026-08-23 11:00',
    actualReturnDate: '2026-08-24 15:45',
    durationDays: 1,
    subtotal: 550000,
    depositAmount: 300000,
    discountAmount: 27500,
    additionalFees: 0,
    penaltyAmount: 0,
    totalAmount: 822500,
    downPaymentAmount: 822500,
    amountPaid: 822500,
    balanceDue: 0,
    paymentMethod: 'Transfer Bank',
    paymentStatus: 'Lunas',
    status: 'Selesai',
    notes: 'Pengembalian tepat waktu, kondisi prima.',
    returnCondition: 'Baik',
    returnNotes: 'Semua kelengkapan (dasi & rompi) lengkap.',
    depositRefundedAmount: 300000,
    createdAt: '2026-08-22 09:00',
    updatedAt: '2026-08-24 15:45'
  },
  {
    id: 'trx-0980',
    invoiceNumber: 'TRX-0980',
    customerId: 'c-1',
    customerName: 'Anisa Larasati',
    customerWhatsapp: '+62 812 3456 7890',
    customerTier: 'VIP',
    items: [
      {
        garmentId: 'g-7',
        garmentCode: 'KB-021',
        garmentName: 'Kebaya Modern Lilac',
        garmentPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtp8HHd1AJ7mQX8DjgfBORXcEkctIpMv8MfNia9GgBS5aUiT-7XtychdZBA11ygIq6jCNTR4bHj19olvwUNrSrGrIv9rrsjYI2SYGkgjXYV8bpENh6TSJAfYUF20O9WPKmMymIK3I54q1W89x6uWHQI0G5ishGfpWePGOaWkCPPpdNFxwvIcoRW6-O-D1PY3xwMjYyauCGWvS0FGypapkylM8VVjSGsK7vvjcN2OSfkKCqzv9IPI-Z',
        category: 'Kebaya',
        size: 'L',
        color: 'Lilac',
        pricePerDay: 400000,
        days: 2,
        subtotal: 800000
      }
    ],
    startDate: '2026-08-22',
    endDate: '2026-08-24',
    actualPickupDate: '2026-08-22 14:00',
    actualReturnDate: '2026-08-24 09:12',
    durationDays: 2,
    subtotal: 800000,
    depositAmount: 200000,
    discountAmount: 80000,
    additionalFees: 0,
    penaltyAmount: 0,
    totalAmount: 920000,
    downPaymentAmount: 920000,
    amountPaid: 920000,
    balanceDue: 0,
    paymentMethod: 'Transfer Bank',
    paymentStatus: 'Lunas',
    status: 'Menunggu Pengembalian',
    notes: 'Baju sudah dikembalikan dan langsung diteruskan ke Laundry.',
    returnCondition: 'Kotor',
    returnNotes: 'Baju perlu dry cleaning standar.',
    depositRefundedAmount: 200000,
    createdAt: '2026-08-21 16:30',
    updatedAt: '2026-08-24 09:12'
  },
  {
    id: 'trx-0979',
    invoiceNumber: 'TRX-0979',
    customerId: 'c-6',
    customerName: 'Rina Kusuma',
    customerWhatsapp: '+62 878 9988 7766',
    customerTier: 'Silver',
    items: [
      {
        garmentId: 'g-8',
        garmentCode: 'KB-015',
        garmentName: 'Kebaya Modern Soft Pink',
        garmentPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTNgxkPdIuBMSKpEieg371PnV6B6pN3XPY8i-LKs4XR1lTLY8cngZu42tjKcPmFR-aSV3WBrB012YBQZYiTj2SQhK6Vx2I1D-a-gwB0pr019Oj80uBwj1_bzi_7oGfzJz7C9QH-_xegZNcPXJqx4sqkzmGysPQvGteWrpvj6Y9psqWNgctnmvS38s-CFZJu6MM4gKzFPubwTSJs_S7CMmHpbDfdoVbX3rxKlf_yEEJT9r-HOoSg7-Z',
        category: 'Kebaya',
        size: 'M',
        color: 'Pink Pastel',
        pricePerDay: 480000,
        days: 2,
        subtotal: 960000
      }
    ],
    startDate: '2026-08-21',
    endDate: '2026-08-23',
    actualPickupDate: '2026-08-21 09:00',
    durationDays: 2,
    subtotal: 960000,
    depositAmount: 200000,
    discountAmount: 0,
    additionalFees: 0,
    penaltyAmount: 100000, // 2 days * 50k
    penaltyReason: 'Terlambat 2 hari dari tanggal 23 Agustus 2026',
    totalAmount: 1260000,
    downPaymentAmount: 500000,
    amountPaid: 1160000,
    balanceDue: 100000,
    paymentMethod: 'Tunai',
    paymentStatus: 'DP',
    status: 'Sedang Disewa',
    notes: 'Terlambat 2 hari! Sudah dihubungi via WA.',
    createdAt: '2026-08-20 11:15',
    updatedAt: '2026-08-25 08:00'
  },
  {
    id: 'trx-0983',
    invoiceNumber: 'TRX-0983',
    customerId: 'c-5',
    customerName: 'Jane Doe',
    customerWhatsapp: '+62 812-3456-7890',
    customerTier: 'Gold',
    items: [
      {
        garmentId: 'g-6',
        garmentCode: 'SUIT-105',
        garmentName: 'Classic Navy Tuxedo Set',
        garmentPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyHQCUIquTbqdB_CjTQe6QDjRXBqlwDY2Ag7S1KFQfeS806YRfa1QTWKyAtIq40g480zAPtVXOcHREvJERlWWHPG9puw3CTAAbzmkB48P3g2SPC1GulJjqlsYAO1WgMd-UiZsDMd5TnMv1p9GpTNffWHQTJGkqhNIbvtjhl_rukQXpoWEI8vAwtOPTFLZvPp_Q9qhvA5n8wARFZuTbc549Jg3BScmIu3Rwa6fBt72KIMaFtXJzHv3S',
        category: 'Jas',
        size: '40 (M)',
        color: 'Navy Blue',
        pricePerDay: 1200000,
        days: 3,
        subtotal: 3600000
      }
    ],
    startDate: '2026-08-26',
    endDate: '2026-08-29',
    durationDays: 3,
    subtotal: 3600000,
    depositAmount: 500000,
    discountAmount: 360000, // Gold 10%
    additionalFees: 0,
    penaltyAmount: 0,
    totalAmount: 3740000,
    downPaymentAmount: 3740000,
    amountPaid: 3740000,
    balanceDue: 0,
    paymentMethod: 'Transfer Bank',
    paymentStatus: 'Lunas',
    status: 'Siap Diambil',
    notes: 'Booking siap diambil besok pagi.',
    createdAt: '2026-08-24 15:30',
    updatedAt: '2026-08-25 09:00'
  }
];

export const INITIAL_LAUNDRY: LaundryItem[] = [
  {
    id: 'lnd-1',
    rentalId: 'trx-0980',
    rentalInvoiceNumber: 'TRX-0980',
    garmentId: 'g-7',
    garmentCode: 'KB-021',
    garmentName: 'Kebaya Modern Lilac Brokat',
    garmentPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtp8HHd1AJ7mQX8DjgfBORXcEkctIpMv8MfNia9GgBS5aUiT-7XtychdZBA11ygIq6jCNTR4bHj19olvwUNrSrGrIv9rrsjYI2SYGkgjXYV8bpENh6TSJAfYUF20O9WPKmMymIK3I54q1W89x6uWHQI0G5ishGfpWePGOaWkCPPpdNFxwvIcoRW6-O-D1PY3xwMjYyauCGWvS0FGypapkylM8VVjSGsK7vvjcN2OSfkKCqzv9IPI-Z',
    sentDate: '2026-08-24',
    estimatedDoneDate: '2026-08-26',
    status: 'Sedang Dicuci',
    vendorName: 'Royal Dry Clean & Boutique Care',
    cost: 75000,
    notes: 'Treatment khusus brokat payet mutiara.'
  },
  {
    id: 'lnd-2',
    rentalId: 'trx-0975',
    rentalInvoiceNumber: 'TRX-0975',
    garmentId: 'g-4',
    garmentCode: 'KB-089',
    garmentName: 'Kebaya Modern White Bridal',
    garmentPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4nXqiHdiPRrgktR_t9RLoAsQb9rJ_7leqYdzTfU7NCOn3h3aEe90WrzWzum1Uf7W99INDVPvPjCUDInrkz4TGrXkAEze519pEWPC1un8JImtLvyMh6SHPgSu569s8SYtK9fJH7Q4WjLXs7WP2D_J782wR93l8QiZyjxMBfnLviMHiyRQCaGg7RRm9XRDXP64EdNhr3rwx2LRm8439GY37-JtsdO69vPj-LqVc5gogZJm3KvhX524n',
    sentDate: '2026-08-23',
    estimatedDoneDate: '2026-08-25',
    status: 'Menunggu Dicuci',
    vendorName: 'Royal Dry Clean & Boutique Care',
    cost: 120000,
    notes: 'Pencucian gaun akad putih bersih, hilangkan bekas noda makeup.'
  }
];

export const INITIAL_SETTINGS: BoutiqueSettings = {
  boutiqueName: 'SewaBaju Pro Boutique',
  tagline: 'Luxury Rental Management & Exclusive Wardrobe',
  whatsappNumber: '6281234567890',
  email: 'concierge@sewabajupro.id',
  address: 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan 12190',
  instagram: '@sewabaju.pro',
  invoiceFooter: 'Terima kasih atas kepercayaan Anda menyewa busana di SewaBaju Pro. Mohon jaga kondisi pakaian dengan baik.',
  penaltyPerDay: 50000,
  defaultDeposit: 200000,
  minRentalDays: 1,
  bankName: 'BCA (Bank Central Asia)',
  bankAccountNumber: '8720-1928-33',
  bankAccountName: 'PT SEWABAJU PRO NUSANTARA',
  qrisImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126580016ID.CO.SEWABAJUPRO01189360091800000102345204581253033605802ID5916SEWABAJUPRO6007JAKARTA61051219062070703A016304E8A2',
  logoUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=100&auto=format&fit=crop&q=80'
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'urgent',
    title: 'Pengembalian Hari Ini',
    message: '3 transaksi harus dikembalikan hari ini sebelum pukul 18:00 WIB.',
    date: 'Hari ini, 08:00',
    read: false
  },
  {
    id: 'notif-2',
    type: 'info',
    title: 'Pengambilan Besok',
    message: '2 pelanggan mengambil baju besok: Jane Doe (Navy Tux) & Sarah M.',
    date: 'Hari ini, 07:30',
    read: false
  },
  {
    id: 'notif-3',
    type: 'warning',
    title: 'Peringatan Keterlambatan',
    message: 'Transaksi TRX-0979 atas nama Rina K. terlambat 2 hari. Denda Rp100.000 berlaku.',
    date: 'Kemarin, 17:00',
    read: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '25/08/2026 10:30',
    user: 'Clarissa Putri (Owner)',
    action: 'Serah Terima Baju',
    detail: 'Menyerahkan baju Midnight Sparkle Gown (GN-118) ke Sarah Maharani (TRX-0982).',
    entityType: 'Rental',
    entityId: 'trx-0982'
  },
  {
    id: 'log-2',
    timestamp: '25/08/2026 09:12',
    user: 'Dimas (Kasir)',
    action: 'Pengembalian Baju',
    detail: 'Menerima kembali Kebaya Modern Lilac (KB-021), status dialihkan ke Laundry.',
    entityType: 'Rental',
    entityId: 'trx-0980'
  },
  {
    id: 'log-3',
    timestamp: '24/08/2026 15:30',
    user: 'Clarissa Putri (Owner)',
    action: 'Booking Dikonfirmasi',
    detail: 'Membuat booking TRX-0983 untuk Jane Doe, pembayaran DP lunas.',
    entityType: 'Rental',
    entityId: 'trx-0983'
  }
];
