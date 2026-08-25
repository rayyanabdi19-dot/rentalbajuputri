import React, { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  Clock, 
  Users, 
  Database, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  ShieldCheck, 
  History,
  CheckCircle,
  AlertTriangle,
  KeyRound,
  Lock,
  User,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  Check,
  Plus,
  Pencil,
  Trash2,
  Search,
  Mail,
  Phone,
  UserCheck,
  UserPlus,
  CheckCircle2,
  X,
  BadgeCheck,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppUser, UserRole, UserProfile } from '../../types';

const PRESET_AVATARS = [
  { label: 'Wanita 1 (Batik/Hijab)', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPec32NhmuCPoTE0bFUvb5ueZWJKWdRBq91XlCFzA881JYPYW3-nRoKZ0MABOLIV7ClFYQsLlHGSLHzqaykoqmbjWyNdU9TMg4JxwWnw0I14noE2zIWuiNUbx-KCgxv-hnb-Z2JNf8vLY4zCyU2IyBf7r2L-qIrwsnlSAH21Hwc2S2iHmfFMZS6yCmUotwZ2j1CM61NFPXNGpFsxrW5rG57GAYBNXziB-5C0uyqkngfUlou7OWkcZk' },
  { label: 'Pria 1 (Formal)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { label: 'Wanita 2 (Modern)', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
  { label: 'Pria 2 (Kasual)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { label: 'Wanita 3 (Chic)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { label: 'Pria 3 (Eksekutif)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
];

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    allUsers, 
    currentUser,
    setCurrentUser,
    addUser,
    updateUser,
    deleteUser,
    auditLogs, 
    resetToSampleData, 
    exportDatabaseJSON, 
    importDatabaseJSON,
    authCredentials,
    updateCredentials,
    logout,
    setActiveTab,
    spreadsheetConfig
  } = useApp();

  const [formSettings, setFormSettings] = useState(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'payment' | 'rules' | 'security' | 'users' | 'backup' | 'audit'>('profile');

  // Security & Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(authCredentials.username);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Users & Staff Management State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Staff' as UserRole,
    status: 'Aktif' as 'Aktif' | 'Nonaktif',
    avatarUrl: PRESET_AVATARS[0].url
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [userActionFeedback, setUserActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleOpenCreateUser = () => {
    setEditingUserId(null);
    setUserFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Staff',
      status: 'Aktif',
      avatarUrl: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)].url
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user: UserProfile) => {
    setEditingUserId(user.id);
    setUserFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status || 'Aktif',
      avatarUrl: user.avatarUrl || PRESET_AVATARS[0].url
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.name.trim() || !userFormData.email.trim()) {
      setUserActionFeedback({ type: 'error', message: 'Nama lengkap dan email wajib diisi.' });
      return;
    }

    if (editingUserId) {
      updateUser(editingUserId, {
        name: userFormData.name.trim(),
        email: userFormData.email.trim(),
        phone: userFormData.phone.trim() || undefined,
        role: userFormData.role,
        status: userFormData.status,
        avatarUrl: userFormData.avatarUrl
      });
      setUserActionFeedback({ type: 'success', message: `Profil staf "${userFormData.name}" berhasil diperbarui.` });
    } else {
      addUser({
        name: userFormData.name.trim(),
        email: userFormData.email.trim(),
        phone: userFormData.phone.trim() || undefined,
        role: userFormData.role,
        status: userFormData.status,
        avatarUrl: userFormData.avatarUrl
      });
      setUserActionFeedback({ type: 'success', message: `Pengguna baru "${userFormData.name}" berhasil ditambahkan.` });
    }

    setIsUserModalOpen(false);
    setTimeout(() => setUserActionFeedback(null), 4000);
  };

  const handleOpenDeleteUser = (user: UserProfile) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteUser = () => {
    if (!userToDelete) return;
    const res = deleteUser(userToDelete.id);
    setIsDeleteModalOpen(false);
    if (res.success) {
      setUserActionFeedback({ type: 'success', message: `Pengguna "${userToDelete.name}" berhasil dihapus dari sistem.` });
    } else {
      setUserActionFeedback({ type: 'error', message: res.error || 'Gagal menghapus pengguna.' });
    }
    setUserToDelete(null);
    setTimeout(() => setUserActionFeedback(null), 4000);
  };

  const handleSwitchActiveUser = (user: UserProfile) => {
    setCurrentUser(user);
    setUserActionFeedback({ 
      type: 'success', 
      message: `Profil pengguna aktif berhasil dialihkan ke "${user.name}" (${user.role}).` 
    });
    setTimeout(() => setUserActionFeedback(null), 3000);
  };

  const filteredUsers = allUsers.filter(u => {
    const q = userSearchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q)) ||
      u.role.toLowerCase().includes(q);
    
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUpdateSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityStatus(null);

    if (!currentPassword) {
      setSecurityStatus({ type: 'error', message: 'Masukkan password saat ini untuk memverifikasi identitas Anda.' });
      return;
    }

    if (!newUsername.trim()) {
      setSecurityStatus({ type: 'error', message: 'Username tidak boleh kosong.' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setSecurityStatus({ type: 'error', message: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    const targetPassword = newPassword ? newPassword : currentPassword;
    const res = updateCredentials(currentPassword, newUsername, targetPassword);

    if (res.success) {
      setSecurityStatus({ 
        type: 'success', 
        message: 'Kredensial login berhasil diperbarui! Gunakan username & password baru pada sesi masuk berikutnya.' 
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSecurityStatus(null), 5000);
    } else {
      setSecurityStatus({ type: 'error', message: res.error || 'Gagal memperbarui kredensial.' });
    }
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SewaBaju_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importDatabaseJSON(content);
        if (ok) {
          alert('Database berhasil diimpor!');
        } else {
          alert('Format file cadangan tidak valid.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] tracking-tight">
            Pengaturan Sistem & Butik
          </h2>
          <p className="text-sm text-[#4a4452] mt-1 font-normal">
            Konfigurasi profil usaha, tarif denda sewa, akun login & password, nomor rekening, serta cadangan data.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 py-2 px-3 rounded-xl text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>Pengaturan berhasil disimpan!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'profile', label: 'Profil Butik', icon: Building2 },
          { id: 'security', label: 'Akun & Password', icon: KeyRound },
          { id: 'payment', label: 'Rekening & QRIS', icon: CreditCard },
          { id: 'rules', label: 'Aturan & Denda Sewa', icon: Clock },
          { id: 'users', label: 'Peran & Staf', icon: Users },
          { id: 'backup', label: 'Backup & Restore Data', icon: Database },
          { id: 'audit', label: 'Log Aktivitas (Audit)', icon: History },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSettingsTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSettingsTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#320075] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-2xl border border-[#ccc3d4]/40 shadow-xs p-6 md:p-8">
        {/* Profile Tab */}
        {activeSettingsTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-4 max-w-2xl text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Informasi Profil Butik</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Usaha / Butik *</label>
                <input
                  type="text"
                  required
                  value={formSettings.boutiqueName}
                  onChange={e => setFormSettings({ ...formSettings, boutiqueName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp Usaha *</label>
                <input
                  type="text"
                  required
                  value={formSettings.whatsappNumber}
                  onChange={e => setFormSettings({ ...formSettings, whatsappNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Butik Lengkap</label>
              <textarea
                rows={2}
                value={formSettings.address}
                onChange={e => setFormSettings({ ...formSettings, address: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={formSettings.email}
                  onChange={e => setFormSettings({ ...formSettings, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jam Operasional</label>
                <input
                  type="text"
                  value={formSettings.operatingHours}
                  onChange={e => setFormSettings({ ...formSettings, operatingHours: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-[#320075] text-white font-semibold text-xs hover:bg-[#4a1d96] flex items-center gap-2 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        )}

        {/* Security & Credentials Tab */}
        {activeSettingsTab === 'security' && (
          <div className="space-y-6 max-w-2xl text-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Pengaturan Akun & Password Login</h3>
              <p className="text-slate-500">
                Atur kredensial username dan password yang digunakan untuk masuk ke sistem dashboard butik ini.
              </p>
            </div>

            {/* Current Active Credential Info Badge */}
            <div className="bg-[#f6f2fc] p-4 rounded-2xl border border-[#eaddff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#320075] text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Status Kredensial Login Aktif</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Username saat ini: <span className="font-mono font-bold text-[#320075] bg-white px-2 py-0.5 rounded border border-purple-200">{authCredentials.username}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Apakah Anda ingin keluar (logout) dari sesi dashboard saat ini?')) {
                    logout();
                  }
                }}
                className="py-2 px-3.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar (Logout)</span>
              </button>
            </div>

            {securityStatus && (
              <div className={`p-4 rounded-xl border flex items-start gap-2.5 text-xs font-medium animate-in fade-in ${
                securityStatus.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {securityStatus.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">{securityStatus.message}</div>
              </div>
            )}

            {/* Change Credentials Form */}
            <form onSubmit={handleUpdateSecurity} className="space-y-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
              <div className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#320075]" />
                <span>Formulir Ganti Username & Password</span>
              </div>

              {/* Current Password Verification */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password Saat Ini (Lama) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan password saat ini (cth: admin123)"
                    className="w-full p-2.5 pr-10 bg-white border border-slate-200 rounded-xl focus:border-[#320075] outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Wajib dimasukkan untuk mengesahkan perubahan keamanan.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                {/* New Username */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Username Baru <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                      placeholder="Username baru..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#320075] outline-none text-xs font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Minimal 3 karakter, tanpa spasi.</p>
                </div>

                {/* New Password */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Password Baru (Opsional jika hanya ganti user)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Kosongkan jika tidak ganti password"
                      className="w-full p-2.5 pr-10 bg-white border border-slate-200 rounded-xl focus:border-[#320075] outline-none text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Minimal 5 karakter.</p>
                </div>
              </div>

              {/* Confirm New Password */}
              {newPassword && (
                <div className="animate-in fade-in">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ulangi Password Baru <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      required={!!newPassword}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang password baru Anda..."
                      className="w-full p-2.5 pr-10 bg-white border border-slate-200 rounded-xl focus:border-[#320075] outline-none text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setNewUsername('admin');
                    setNewPassword('admin123');
                    setConfirmPassword('admin123');
                  }}
                  className="text-xs text-[#320075] hover:underline font-semibold cursor-pointer"
                >
                  Kembalikan Kredensial ke Default (admin / admin123)
                </button>

                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-[#320075] text-white font-bold text-xs hover:bg-[#4a1d96] flex items-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Kredensial Baru</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Tab */}
        {activeSettingsTab === 'payment' && (
          <form onSubmit={handleSave} className="space-y-4 max-w-2xl text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Rekening Bank & QRIS Pembayaran</h3>
            <p className="text-xs text-slate-500 mb-4">Informasi ini akan otomatis tercetak pada invoice nota sewa pelanggan.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Bank</label>
                <input
                  type="text"
                  value={formSettings.bankName}
                  onChange={e => setFormSettings({ ...formSettings, bankName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Rekening</label>
                <input
                  type="text"
                  value={formSettings.bankAccountNumber}
                  onChange={e => setFormSettings({ ...formSettings, bankAccountNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Pemilik Rekening (a.n)</label>
              <input
                type="text"
                value={formSettings.bankAccountName}
                onChange={e => setFormSettings({ ...formSettings, bankAccountName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-[#320075] text-white font-semibold text-xs hover:bg-[#4a1d96] flex items-center gap-2 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Rekening</span>
              </button>
            </div>
          </form>
        )}

        {/* Rules & Penalties Tab */}
        {activeSettingsTab === 'rules' && (
          <form onSubmit={handleSave} className="space-y-4 max-w-2xl text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Aturan Durasi & Denda Keterlambatan</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Denda Terlambat / Hari (Rp) *</label>
                <input
                  type="number"
                  required
                  value={formSettings.penaltyPerDay}
                  onChange={e => setFormSettings({ ...formSettings, penaltyPerDay: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:border-[#320075] outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Default Durasi Sewa (Hari)</label>
                <input
                  type="number"
                  value={formSettings.defaultRentalDays}
                  onChange={e => setFormSettings({ ...formSettings, defaultRentalDays: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Default Deposit Jaminan (Rp)</label>
                <input
                  type="number"
                  value={formSettings.defaultDepositAmount}
                  onChange={e => setFormSettings({ ...formSettings, defaultDepositAmount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Teks Syarat & Ketentuan Sewa</label>
              <textarea
                rows={4}
                value={formSettings.termsAndConditions}
                onChange={e => setFormSettings({ ...formSettings, termsAndConditions: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none resize-none font-mono"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-[#320075] text-white font-semibold text-xs hover:bg-[#4a1d96] flex items-center gap-2 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Aturan</span>
              </button>
            </div>
          </form>
        )}

        {/* Users & Roles Tab */}
        {activeSettingsTab === 'users' && (
          <div className="space-y-5">
            {/* Feedback Alert Toast */}
            {userActionFeedback && (
              <div 
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2 duration-200 ${
                  userActionFeedback.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {userActionFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span className="font-medium">{userActionFeedback.message}</span>
                </div>
                <button 
                  onClick={() => setUserActionFeedback(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Header & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#320075]" />
                  <span>Manajemen Profil Pengguna & Hak Akses</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kelola data staf butik, peran operasional (Owner, Admin, Kasir, Staff), kontak, serta status aktif pengguna.
                </p>
              </div>

              <button
                id="btn-add-user"
                onClick={handleOpenCreateUser}
                className="py-2.5 px-4 rounded-xl bg-[#320075] hover:bg-[#4a1d96] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tambah Pengguna Baru</span>
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={e => setUserSearchQuery(e.target.value)}
                  placeholder="Cari nama, email, role, no hp..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#320075] outline-none"
                />
                {userSearchQuery && (
                  <button 
                    onClick={() => setUserSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Role Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {(['ALL', 'Owner', 'Admin', 'Kasir', 'Staff'] as const).map(role => {
                  const count = role === 'ALL' 
                    ? allUsers.length 
                    : allUsers.filter(u => u.role === role).length;

                  return (
                    <button
                      key={role}
                      onClick={() => setUserRoleFilter(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                        userRoleFilter === role
                          ? 'bg-[#320075] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{role === 'ALL' ? 'Semua' : role}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        userRoleFilter === role ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Users Grid */}
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">Tidak ada pengguna ditemukan</p>
                <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter peran.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map(u => {
                  const isCurrentActive = currentUser.id === u.id;
                  const isStatusActive = (u.status ?? 'Aktif') === 'Aktif';

                  return (
                    <div 
                      key={u.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative ${
                        isCurrentActive 
                          ? 'border-[#320075] bg-purple-50/20 ring-2 ring-[#320075]/10 shadow-xs' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Top Card Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="relative">
                            <img 
                              src={u.avatarUrl} 
                              alt={u.name} 
                              className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-xs"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = PRESET_AVATARS[0].url;
                              }}
                            />
                            <span 
                              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                isStatusActive ? 'bg-emerald-500' : 'bg-slate-400'
                              }`}
                              title={isStatusActive ? 'Status: Aktif' : 'Status: Nonaktif'}
                            />
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span 
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                u.role === 'Owner' 
                                  ? 'bg-[#eaddff] text-[#320075] border-[#d0bcff]'
                                  : u.role === 'Admin'
                                  ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                                  : u.role === 'Kasir'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                  : 'bg-sky-100 text-sky-800 border-sky-200'
                              }`}
                            >
                              {u.role}
                            </span>

                            {isCurrentActive && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white flex items-center gap-1">
                                <BadgeCheck className="w-3 h-3" />
                                <span>Profil Aktif</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Name & Contact Details */}
                        <div>
                          <div className="font-bold text-slate-900 text-sm leading-tight">{u.name}</div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{u.email}</span>
                          </div>
                          {u.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-mono text-[11px]">{u.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                        {!isCurrentActive ? (
                          <button
                            onClick={() => handleSwitchActiveUser(u)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#eaddff] text-slate-700 hover:text-[#320075] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Gunakan profil ini sebagai pengguna aktif"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Jadikan Aktif</span>
                          </button>
                        ) : (
                          <div className="text-[11px] text-[#320075] font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Sedang Digunakan</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <button
                            id={`btn-edit-user-${u.id}`}
                            onClick={() => handleOpenEditUser(u)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors cursor-pointer flex items-center gap-1"
                            title="Edit Profil Pengguna"
                          >
                            <Pencil className="w-3.5 h-3.5 text-slate-600" />
                            <span className="hidden sm:inline text-[11px]">Edit</span>
                          </button>

                          <button
                            id={`btn-delete-user-${u.id}`}
                            onClick={() => handleOpenDeleteUser(u)}
                            disabled={allUsers.length <= 1}
                            className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                              allUsers.length <= 1
                                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                                : 'bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer'
                            }`}
                            title={allUsers.length <= 1 ? 'Tidak dapat menghapus satu-satunya pengguna tersisa' : 'Hapus Pengguna'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[11px]">Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* User Form Modal (Tambah / Edit) */}
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {editingUserId ? (
                    <Pencil className="w-5 h-5 text-[#d0bcff]" />
                  ) : (
                    <UserPlus className="w-5 h-5 text-[#d0bcff]" />
                  )}
                  <h3 className="font-bold text-sm">
                    {editingUserId ? 'Edit Profil Pengguna' : 'Tambah Pengguna Baru'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsUserModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSaveUser} className="p-5 overflow-y-auto space-y-4 text-xs">
                {/* Name */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap Staf / Pengguna <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userFormData.name}
                    onChange={e => setUserFormData({ ...userFormData, name: e.target.value })}
                    placeholder="Contoh: Clarissa Putri, S.Ds"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none text-xs"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Resmi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={userFormData.email}
                      onChange={e => setUserFormData({ ...userFormData, email: e.target.value })}
                      placeholder="staf@sewabajupro.id"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      No. WhatsApp / HP (Opsional)
                    </label>
                    <input
                      type="text"
                      value={userFormData.phone}
                      onChange={e => setUserFormData({ ...userFormData, phone: e.target.value })}
                      placeholder="081234567890"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Peran & Hak Akses Operasional <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { role: 'Owner' as UserRole, desc: 'Akses penuh ke semua modul, finansial & sistem' },
                      { role: 'Admin' as UserRole, desc: 'Kelola katalog busana, sewa & master data' },
                      { role: 'Kasir' as UserRole, desc: 'Input nota sewa baru, kas & pengembalian' },
                      { role: 'Staff' as UserRole, desc: 'Cek ketersediaan stok & proses laundry' },
                    ].map(item => (
                      <label
                        key={item.role}
                        className={`p-2.5 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${
                          userFormData.role === item.role
                            ? 'border-[#320075] bg-purple-50/40 ring-1 ring-[#320075]'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">{item.role}</span>
                          <input
                            type="radio"
                            name="userRole"
                            checked={userFormData.role === item.role}
                            onChange={() => setUserFormData({ ...userFormData, role: item.role })}
                            className="text-[#320075] focus:ring-[#320075]"
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 leading-snug">{item.desc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Akun</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="userStatus"
                        checked={userFormData.status === 'Aktif'}
                        onChange={() => setUserFormData({ ...userFormData, status: 'Aktif' })}
                        className="text-[#320075] focus:ring-[#320075]"
                      />
                      <span className="text-xs font-semibold text-emerald-700">Aktif</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="userStatus"
                        checked={userFormData.status === 'Nonaktif'}
                        onChange={() => setUserFormData({ ...userFormData, status: 'Nonaktif' })}
                        className="text-[#320075] focus:ring-[#320075]"
                      />
                      <span className="text-xs font-semibold text-slate-600">Nonaktif</span>
                    </label>
                  </div>
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Pilih Foto Profil / Avatar Staf
                  </label>
                  
                  {/* Preset Avatar Gallery */}
                  <div className="grid grid-cols-6 gap-2 mb-2.5">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setUserFormData({ ...userFormData, avatarUrl: preset.url })}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                          userFormData.avatarUrl === preset.url
                            ? 'border-[#320075] ring-2 ring-[#320075]/30'
                            : 'border-transparent hover:border-slate-300'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full aspect-square rounded-lg object-cover" />
                        {userFormData.avatarUrl === preset.url && (
                          <div className="absolute inset-0 bg-[#320075]/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom Avatar URL Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={userFormData.avatarUrl}
                      onChange={e => setUserFormData({ ...userFormData, avatarUrl: e.target.value })}
                      placeholder="Atau tempel URL foto avatar kustom..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#320075] outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="py-2 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-[#320075] hover:bg-[#4a1d96] text-white font-bold flex items-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingUserId ? 'Simpan Perubahan' : 'Tambah Pengguna'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && userToDelete && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-5 text-center animate-in fade-in zoom-in-95 duration-150 space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">Hapus Pengguna</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Apakah Anda yakin ingin menghapus akun pengguna <strong className="text-slate-800">"{userToDelete.name}"</strong> ({userToDelete.role})?
                </p>
                {currentUser.id === userToDelete.id && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-lg mt-2">
                    ⚠️ Ini adalah profil yang sedang aktif Anda gunakan. Jika dihapus, sistem akan otomatis mengalihkan profil aktif ke pengguna lain.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setUserToDelete(null);
                  }}
                  className="py-2 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 text-xs cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDeleteUser}
                  className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Ya, Hapus Pengguna</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Backup & Restore Tab */}
        {activeSettingsTab === 'backup' && (
          <div className="space-y-6 max-w-2xl text-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Cadangkan & Pulihkan Database</h3>
              <p className="text-slate-500">
                Kelola pencadangan lokal berbasis file JSON atau sambungkan langsung ke Google Spreadsheet sebagai database cloud *real-time*.
              </p>
            </div>

            {/* Google Sheets Integration Featured Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#320075] via-[#4a1d96] to-[#1e004a] text-white space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-bold text-[#eaddff]">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Google Apps Script Cloud Backend</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className={`w-2 h-2 rounded-full ${
                    spreadsheetConfig.syncStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`} />
                  <span className="font-semibold text-purple-200">
                    {spreadsheetConfig.syncStatus === 'connected' ? 'Sheets Terhubung' : 'Belum Terhubung'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white">Integrasi Database Google Spreadsheet</h4>
                <p className="text-purple-100/80 text-xs mt-1 leading-relaxed">
                  Sinkronkan seluruh data koleksi baju, pelanggan, nota transaksi, dan log laundry langsung ke Google Sheets secara gratis, aman, dan tanpa biaya server.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('spreadsheet')}
                  className="py-2.5 px-4 rounded-xl bg-white text-[#320075] font-bold text-xs flex items-center gap-2 hover:bg-purple-50 transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  <span>Buka Menu Integrasi Spreadsheet & GAS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-bold text-slate-800 text-sm">Cadangkan Data Lokal (Backup JSON)</div>
              <p className="text-slate-500">Unduh salinan data lokal (.json) untuk arsip aman Anda.</p>
              <button
                onClick={handleDownloadBackup}
                className="py-2.5 px-4 rounded-xl bg-[#320075] text-white font-semibold flex items-center gap-2 hover:bg-[#4a1d96] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File Cadangan (.JSON)</span>
              </button>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-bold text-slate-800 text-sm">Pulihkan Data Lokal (Restore JSON)</div>
              <p className="text-slate-500">Unggah file .json cadangan untuk memulihkan seluruh data aplikasi.</p>
              <label className="py-2.5 px-4 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold flex items-center gap-2 hover:bg-slate-100 cursor-pointer w-max">
                <Upload className="w-4 h-4" />
                <span>Pilih File Backup (.JSON)</span>
                <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
              </label>
            </div>

            <div className="p-5 bg-red-50/60 rounded-2xl border border-red-200 space-y-3">
              <div className="font-bold text-red-900 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Reset Database Demo</span>
              </div>
              <p className="text-red-700">
                Kembalikan seluruh data transaksi dan katalog baju ke data contoh awal bawaan aplikasi.
              </p>
              <button
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin mereset seluruh database ke data sampel awal?')) {
                    resetToSampleData();
                    alert('Data telah direset ke versi demo awal.');
                  }
                }}
                className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
              >
                Reset ke Data Contoh
              </button>
            </div>
          </div>
        )}

        {/* Audit Log Tab */}
        {activeSettingsTab === 'audit' && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900">Riwayat Log Aktivitas Sistem (Audit Log)</h3>
              <p className="text-slate-500">Merekam setiap tindakan perubahan stok, pembuatan nota, dan pengembalian baju.</p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                    <th className="p-3 pl-4">Waktu</th>
                    <th className="p-3">Pengguna</th>
                    <th className="p-3">Aksi</th>
                    <th className="p-3 pr-4">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 pl-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-3 font-semibold text-slate-800 whitespace-nowrap">{log.user}</td>
                      <td className="p-3">
                        <span className="font-bold text-[#320075] bg-[#eaddff]/60 px-2 py-0.5 rounded text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 pr-4 text-slate-600">{log.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
