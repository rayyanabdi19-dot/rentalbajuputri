import React from 'react';
import { GarmentStatus, RentalStatus, GarmentCondition } from '../../types';

interface StatusBadgeProps {
  status: GarmentStatus | RentalStatus | GarmentCondition | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'sm', 
  showDot = true 
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-3.5 py-1.5'
  }[size];

  // Garment & Transaction status color maps
  switch (status) {
    // Garment Statuses
    case 'Tersedia':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 ${sizeClasses}`}>
          {showDot && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
          Tersedia
        </span>
      );
    case 'Dipesan':
    case 'Booking':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 ${sizeClasses}`}>
          {showDot && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>}
          {status}
        </span>
      );
    case 'Sedang Disewa':
    case 'Disewa':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-[#fcf2ea] text-[#b45309] border border-[#fbd38d]/60 ${sizeClasses}`}>
          {showDot && <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] mr-1.5"></span>}
          Sedang Disewa
        </span>
      );
    case 'Sedang Dicuci':
    case 'Laundry':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-[#e9def5] text-[#4a1d96] border border-[#d2bbff]/60 ${sizeClasses}`}>
          {showDot && <span className="w-1.5 h-1.5 rounded-full bg-[#6d46bb] mr-1.5"></span>}
          {status === 'Laundry' ? 'Laundry' : 'Sedang Dicuci'}
        </span>
      );
    case 'Dikembalikan':
    case 'Menunggu Pengembalian':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 ${sizeClasses}`}>
          {showDot && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5"></span>}
          {status}
        </span>
      );
    case 'Siap Diambil':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 ${sizeClasses}`}>
          {showDot && <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mr-1.5"></span>}
          Siap Diambil
        </span>
      );
    case 'Lunas':
    case 'Selesai':
    case 'Baik':
    case 'Active':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses}`}>
          {showDot && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>}
          {status}
        </span>
      );
    case 'DP':
    case 'Sebagian':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}>
          {showDot && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>}
          {status}
        </span>
      );
    case 'Terlambat':
    case 'Rusak Berat':
    case 'Hilang':
    case 'Dibatalkan':
    case 'Unpaid':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-[#ffdad6] text-[#93000a] border border-[#ffb4ab]/70 ${sizeClasses}`}>
          {showDot && <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] mr-1.5"></span>}
          {status}
        </span>
      );
    case 'Perbaikan':
    case 'Rusak Ringan':
    case 'Kotor':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-orange-50 text-orange-800 border border-orange-200 ${sizeClasses}`}>
          {showDot && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>}
          {status}
        </span>
      );
    case 'Tidak Aktif':
    case 'Inactive':
    case 'Draft':
    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          {showDot && <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>}
          {status}
        </span>
      );
  }
};
