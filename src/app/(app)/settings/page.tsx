"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  Bell,
  Database,
  Info,
  Check,
  AlertTriangle,
  Download,
  Trash2,
  Lock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  PhoneCall,
  X,
  Loader2,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  bio: string;
  avatarUrl: string;
  companionPersona: string;
  role: string;
  companionNotif: boolean;
  wellnessNotif: boolean;
  communityNotif: boolean;
  zybaScore: number;
}

const MASCOT_AVATARS = [
  { id: "senang", label: "Tenang Bahagia", url: "/mascot/uniform/senang.png" },
  { id: "semangat", label: "Penuh Harapan", url: "/mascot/uniform/semangat.png" },
  { id: "penasaran", label: "Reflektif Ingin Tahu", url: "/mascot/uniform/penasaran.png" },
  { id: "depan", label: "Hadir Sepenuhnya", url: "/mascot/uniform/depan.png" },
  { id: "tiga_perempat", label: "Menatap Damai", url: "/mascot/uniform/tiga_perempat.png" },
  { id: "tidur", label: "Istirahat Batin", url: "/mascot/uniform/tidur.png" },
];

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "privacy" | "about">("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/mascot/uniform/senang.png");

  // Notification states
  const [companionNotif, setCompanionNotif] = useState(true);
  const [wellnessNotif, setWellnessNotif] = useState(true);
  const [communityNotif, setCommunityNotif] = useState(false);

  // Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Export state
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);

        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          const tabParam = urlParams.get("tab") as any;
          if (tabParam && ["profile", "security", "notifications", "privacy", "about"].includes(tabParam)) {
            setActiveTab(tabParam);
          }
          if (urlParams.get("action") === "delete") {
            setActiveTab("privacy");
            setShowDeleteModal(true);
          }
        }

        const res = await fetch("/api/settings/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile(data.profile);
            setName(data.profile.name || "");
            setUsername(data.profile.username || "");
            setBio(data.profile.bio || "");
            setAvatarUrl(data.profile.avatarUrl || "/mascot/uniform/senang.png");
            setCompanionNotif(data.profile.companionNotif ?? true);
            setWellnessNotif(data.profile.wellnessNotif ?? true);
            setCommunityNotif(data.profile.communityNotif ?? false);
          }
        }
      } catch (err) {
        console.error("Gagal memuat profil settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMessage(null);
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim(),
          bio: bio.trim(),
          avatarUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan perubahan");
      }

      showToast("Profil suaka berhasil diperbarui");
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kendala saat menyimpan profil");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async (newPrefs: {
    companionNotif?: boolean;
    wellnessNotif?: boolean;
    communityNotif?: boolean;
  }) => {
    try {
      setErrorMessage(null);
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrefs),
      });

      if (!res.ok) {
        throw new Error("Gagal memperbarui notifikasi");
      }

      showToast("Preferensi notifikasi tersimpan");
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal memperbarui notifikasi");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("Kata sandi baru minimal 8 karakter.");
      return;
    }

    try {
      setPasswordLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memperbarui kata sandi");
      }

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Kata sandi berhasil diperbarui dengan aman");
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mengubah kata sandi");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDownloadExport = async () => {
    try {
      setExporting(true);
      const res = await fetch("/api/settings/export");
      if (!res.ok) throw new Error("Gagal mengunduh berkas ekspor");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `zyba-data-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast("Arsip data JSON berhasil diunduh ke perangkatmu");
    } catch (err) {
      console.error(err);
      setErrorMessage("Gagal mengunduh arsip data");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim() !== "HAPUS") {
      setDeleteError("Harap ketik kata 'HAPUS' dengan tepat.");
      return;
    }

    try {
      setDeleting(true);
      setDeleteError(null);
      const res = await fetch("/api/settings/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmationText: deleteConfirmText.trim(),
          password: deletePassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menghapus akun");
      }

      // Berhasil hapus, alihkan ke landing page
      router.push("/");
    } catch (err: any) {
      setDeleteError(err.message || "Gagal memproses penghapusan akun");
      setDeleting(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profil Suaka", icon: User },
    { id: "security", label: "Keamanan & Sandi", icon: Shield },
    { id: "notifications", label: "Notifikasi", icon: Bell },
    { id: "privacy", label: "Privasi & Ekspor Data", icon: Database },
    { id: "about", label: "Tentang & Bantuan", icon: Info },
  ] as const;

  return (
    <div className="min-h-screen pb-28 pt-8">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#1B241E] px-5 py-2.5 text-sm text-[#F5F8F5] shadow-lg animate-in fade-in slide-in-from-top-4">
          <Check className="h-4 w-4 text-[#3E7B54]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header Bersih */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#2D3E33]/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#3E7B54] uppercase mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Pusat Kendali Pengguna</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#1B241E] sm:text-4xl">
              Pengaturan & Suaka Data
            </h1>
            <p className="mt-1 text-sm text-[#2D3E33]/70">
              Kelola privasi, profil, keamanan kata sandi, dan kepemilikan data pribadimu dengan tenang.
            </p>
          </div>

          {profile?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-[#3E7B54]/30 bg-[#E8F2EC] px-4 py-2 text-xs font-medium text-[#3E7B54] hover:bg-[#3E7B54] hover:text-white transition-colors"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Buka Panel Moderasi Admin</span>
            </Link>
          )}
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-[#FDF4F1] border border-[#F28C6E]/30 p-4 text-sm text-[#1B241E]">
            <AlertTriangle className="h-5 w-5 text-[#F28C6E] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Perhatian</p>
              <p className="text-[#2D3E33]/80">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-[#2D3E33]/50 hover:text-[#1B241E]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Layout 2 Kolom: Tab Navigasi Kiri + Konten Utama Kanan */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Kolom Navigasi Tab */}
          <nav className="md:col-span-4 flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all text-left whitespace-nowrap ${
                    isActive
                      ? "bg-[#1B241E] text-[#F5F8F5] shadow-sm"
                      : "text-[#2D3E33]/80 hover:bg-[#E8F2EC]/60 hover:text-[#1B241E]"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#3E7B54]" : "text-[#2D3E33]/60"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Kolom Konten Utama */}
          <main className="md:col-span-8">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#3E7B54]" />
              </div>
            ) : (
              <>
                {/* TAB 1: PROFIL SUAKA */}
                {activeTab === "profile" && (
                  <form onSubmit={handleSaveProfile} className="space-y-8">
                    {/* Pilih Avatar Maskot Zibi */}
                    <div>
                      <label className="block text-sm font-medium text-[#1B241E] mb-2">
                        Ekspresi Maskot Teman (Avatar)
                      </label>
                      <p className="text-xs text-[#2D3E33]/70 mb-4">
                        Pilih wujud Zibi yang mewakili ritme batinmu hari ini.
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {MASCOT_AVATARS.map((m) => {
                          const isSelected = avatarUrl === m.url;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setAvatarUrl(m.url)}
                              className={`flex flex-col items-center gap-1.5 rounded-2xl p-2.5 transition-all text-center ${
                                isSelected
                                  ? "bg-[#E8F2EC] ring-2 ring-[#3E7B54]"
                                  : "bg-white/70 hover:bg-white hover:shadow-xs"
                              }`}
                            >
                              <div className="relative h-12 w-12 shrink-0">
                                <Image
                                  src={m.url}
                                  alt={m.label}
                                  fill
                                  sizes="48px"
                                  className="object-contain"
                                />
                              </div>
                              <span className="text-[11px] leading-tight text-[#2D3E33]/80">
                                {m.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Data Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1B241E] uppercase tracking-wider mb-1.5">
                          Nama Lengkap / Panggilan
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full rounded-2xl border border-[#2D3E33]/15 bg-white px-4 py-3 text-sm text-[#1B241E] placeholder:text-[#2D3E33]/40 focus:border-[#3E7B54] focus:outline-none focus:ring-1 focus:ring-[#3E7B54]"
                          placeholder="Nama panggilanmu..."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#1B241E] uppercase tracking-wider mb-1.5">
                            Nama Pengguna (Username)
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-4 text-sm text-[#2D3E33]/40">@</span>
                            <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="w-full rounded-2xl border border-[#2D3E33]/15 bg-white pl-8 pr-4 py-3 text-sm text-[#1B241E] placeholder:text-[#2D3E33]/40 focus:border-[#3E7B54] focus:outline-none focus:ring-1 focus:ring-[#3E7B54]"
                              placeholder="username"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#1B241E] uppercase tracking-wider mb-1.5">
                            Alamat Email (Terkunci)
                          </label>
                          <input
                            type="email"
                            value={profile?.email || ""}
                            disabled
                            className="w-full rounded-2xl border border-[#2D3E33]/10 bg-[#E8F2EC]/40 px-4 py-3 text-sm text-[#2D3E33]/60 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1B241E] uppercase tracking-wider mb-1.5">
                          Bio Suaka (Refleksi Diri)
                        </label>
                        <textarea
                          rows={3}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          maxLength={250}
                          className="w-full rounded-2xl border border-[#2D3E33]/15 bg-white p-4 text-sm text-[#1B241E] placeholder:text-[#2D3E33]/40 focus:border-[#3E7B54] focus:outline-none focus:ring-1 focus:ring-[#3E7B54]"
                          placeholder="Tuliskan satu kalimat yang mengingatkanmu untuk melangkah pelan..."
                        />
                        <p className="mt-1 text-right text-xs text-[#2D3E33]/50">
                          {bio.length}/250 karakter
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-full bg-[#1B241E] px-6 py-3 text-sm font-medium text-[#F5F8F5] hover:bg-[#2D3E33] transition-colors disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-[#3E7B54]" />
                            <span>Menyimpan...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 text-[#3E7B54]" />
                            <span>Simpan Perubahan Profil</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB 2: KEAMANAN & SANDI */}
                {activeTab === "security" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-base font-semibold text-[#1B241E] mb-1">
                        Perbarui Kata Sandi
                      </h2>
                      <p className="text-xs text-[#2D3E33]/70 mb-4">
                        Gunakan kombinasi minimal 8 karakter untuk menjaga privasi jurnal batinmu.
                      </p>

                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#1B241E] uppercase tracking-wider mb-1.5">
                            Kata Sandi Saat Ini
                          </label>
                          <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            className="w-full rounded-2xl border border-[#2D3E33]/15 bg-white px-4 py-3 text-sm text-[#1B241E] focus:border-[#3E7B54] focus:outline-none focus:ring-1 focus:ring-[#3E7B54]"
                            placeholder="••••••••"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#1B241E] uppercase tracking-wider mb-1.5">
                              Kata Sandi Baru
                            </label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                              minLength={8}
                              className="w-full rounded-2xl border border-[#2D3E33]/15 bg-white px-4 py-3 text-sm text-[#1B241E] focus:border-[#3E7B54] focus:outline-none focus:ring-1 focus:ring-[#3E7B54]"
                              placeholder="Minimal 8 karakter"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#1B241E] uppercase tracking-wider mb-1.5">
                              Konfirmasi Kata Sandi Baru
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                              minLength={8}
                              className="w-full rounded-2xl border border-[#2D3E33]/15 bg-white px-4 py-3 text-sm text-[#1B241E] focus:border-[#3E7B54] focus:outline-none focus:ring-1 focus:ring-[#3E7B54]"
                              placeholder="Ulangi kata sandi baru"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            disabled={passwordLoading}
                            className="inline-flex items-center gap-2 rounded-full bg-[#1B241E] px-6 py-3 text-sm font-medium text-[#F5F8F5] hover:bg-[#2D3E33] transition-colors disabled:opacity-50"
                          >
                            {passwordLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin text-[#3E7B54]" />
                                <span>Menyimpan Sandi...</span>
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 text-[#3E7B54]" />
                                <span>Perbarui Kata Sandi</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="border-t border-[#2D3E33]/10 pt-6">
                      <h3 className="text-sm font-semibold text-[#1B241E] mb-2">
                        Standar Keamanan Sesi Suaka
                      </h3>
                      <div className="space-y-3 text-xs text-[#2D3E33]/80">
                        <div className="flex items-start gap-2.5">
                          <Check className="h-4 w-4 text-[#3E7B54] shrink-0 mt-0.5" />
                          <span>
                            Sesi tersimpan melalui HTTP-Only cookie terenkripsi standar industri (JWT HS256) selama 30 hari.
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Check className="h-4 w-4 text-[#3E7B54] shrink-0 mt-0.5" />
                          <span>
                            Kata sandi di-hash menggunakan algoritma <strong>bcrypt cost 12</strong> tanpa pernah disimpan dalam bentuk teks terbuka.
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Check className="h-4 w-4 text-[#3E7B54] shrink-0 mt-0.5" />
                          <span>
                            Pemisahan 3 basis data independen untuk mengisolasi identitas akun dari riwayat percakapan Zibi dan linimasa komunitas.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: NOTIFIKASI */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-base font-semibold text-[#1B241E] mb-1">
                        Preferensi Notifikasi
                      </h2>
                      <p className="text-xs text-[#2D3E33]/70">
                        Kendalikan ritme pengingat tanpa tekanan. ZYBA tidak pernah mengirimkan pesan panik atau streak bersalah.
                      </p>
                    </div>

                    <div className="divide-y divide-[#2D3E33]/10">
                      {/* Companion Notif */}
                      <div className="flex items-start justify-between py-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-[#1B241E]">
                            Sapaan & Pengingat Refleksi Zibi
                          </p>
                          <p className="text-xs text-[#2D3E33]/70 mt-0.5">
                            Pemberitahuan lembut di pagi atau malam hari saat kamu membutuhkan ruang bertukar cerita.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const val = !companionNotif;
                            setCompanionNotif(val);
                            handleSaveNotifications({ companionNotif: val });
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            companionNotif ? "bg-[#3E7B54]" : "bg-[#2D3E33]/20"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              companionNotif ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Wellness Notif */}
                      <div className="flex items-start justify-between py-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-[#1B241E]">
                            Ajakan Check-In Harian & Ruang Sehat
                          </p>
                          <p className="text-xs text-[#2D3E33]/70 mt-0.5">
                            Pengingat harian untuk meninjau ritme tidur, energi, dan catatan batin secara berkala.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const val = !wellnessNotif;
                            setWellnessNotif(val);
                            handleSaveNotifications({ wellnessNotif: val });
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            wellnessNotif ? "bg-[#3E7B54]" : "bg-[#2D3E33]/20"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              wellnessNotif ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Community Notif */}
                      <div className="flex items-start justify-between py-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-[#1B241E]">
                            Interaksi Komunitas Suaka
                          </p>
                          <p className="text-xs text-[#2D3E33]/70 mt-0.5">
                            Kabar saat ada teman yang menyukai tulisanmu atau mengirimkan balasan hangat di linimasa.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const val = !communityNotif;
                            setCommunityNotif(val);
                            handleSaveNotifications({ communityNotif: val });
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            communityNotif ? "bg-[#3E7B54]" : "bg-[#2D3E33]/20"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              communityNotif ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: PRIVASI & DATA */}
                {activeTab === "privacy" && (
                  <div className="space-y-8">
                    {/* Ekspor Data */}
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3E7B54] mb-1">
                        <Download className="h-3.5 w-3.5" />
                        <span>Kedaulatan & Portabilitas Data</span>
                      </div>
                      <h2 className="text-base font-semibold text-[#1B241E] mb-1">
                        Unduh Salinan Data Lengkap (JSON)
                      </h2>
                      <p className="text-xs text-[#2D3E33]/70 mb-4 max-w-xl">
                        Seluruh rekaman check-in, jurnal refleksi, riwayat percakapan dengan Zibi, dan aktivitas suaka milikmu seutuhnya. Kamu berhak mengekspornya kapan saja tanpa batasan.
                      </p>

                      <button
                        type="button"
                        id="btn-export-json"
                        onClick={handleDownloadExport}
                        disabled={exporting}
                        className="inline-flex items-center gap-2 rounded-full border border-[#1B241E] bg-white px-5 py-2.5 text-xs font-medium text-[#1B241E] hover:bg-[#E8F2EC] transition-colors disabled:opacity-50"
                      >
                        {exporting ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3E7B54]" />
                            <span>Menyiapkan Berkas JSON...</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-3.5 w-3.5 text-[#3E7B54]" />
                            <span>Unduh Arsip Data (.json)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Hapus Akun Permanen */}
                    <div className="border-t border-[#2D3E33]/10 pt-8">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F28C6E] mb-1">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Tindakan Permanen</span>
                      </div>
                      <h2 className="text-base font-semibold text-[#1B241E] mb-1">
                        Hapus Akun & Seluruh Jejak Data
                      </h2>
                      <p className="text-xs text-[#2D3E33]/70 mb-4 max-w-xl">
                        Menghapus akun akan membersihkan data secara bertahap dan menyeluruh di ketiga database independen ZYBA: Komunitas, Pendamping Zibi, dan Akun Utama. Aksi ini tidak dapat dibatalkan.
                      </p>

                      <button
                        type="button"
                        id="btn-delete-account"
                        onClick={() => {
                          setShowDeleteModal(true);
                          setDeleteConfirmText("");
                          setDeletePassword("");
                          setDeleteError(null);
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-[#F28C6E]/40 bg-[#FDF4F1] px-5 py-2.5 text-xs font-medium text-[#F28C6E] hover:bg-[#F28C6E] hover:text-white transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus Akun Permanen</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 5: TENTANG & BANTUAN */}
                {activeTab === "about" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-base font-semibold text-[#1B241E] mb-1">
                        Tentang ZYBA Sanctuary
                      </h2>
                      <p className="text-xs text-[#2D3E33]/70">
                        Pendamping kesehatan mental, fisik, dan sosial berbasis kecerdasan sadar untuk generasi muda.
                      </p>
                    </div>

                    <div className="space-y-4 text-xs text-[#2D3E33]/85 leading-relaxed">
                      <div className="p-4 rounded-2xl bg-white/70 border border-[#2D3E33]/10">
                        <h3 className="font-semibold text-sm text-[#1B241E] mb-1 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-[#3E7B54]" />
                          <span>100% Gratis & Terbuka untuk Semua</span>
                        </h3>
                        <p>
                          ZYBA tidak memungut biaya langganan, tidak menerapkan fitur berbayar semu, dan tidak membatasi wawasan kesejahteraan batin. Seluruh fitur suaka dirancang setara untuk setiap jiwa yang membutuhkan ruang berteduh.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/70 border border-[#2D3E33]/10">
                        <h3 className="font-semibold text-sm text-[#1B241E] mb-1 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-[#3E7B54]" />
                          <span>Etika Privasi & Suaka AI</span>
                        </h3>
                        <p>
                          Zibi dan seluruh model kecerdasan ZYBA berfungsi sebagai sahabat reflektif yang mendengarkan tanpa menghakimi. ZYBA <strong>bukan pengganti tenaga medis profesional</strong>, psikolog klinis, atau psikiater. Kami tidak pernah menjual atau memonetisasi data pribadimu.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#FDF4F1] border border-[#F28C6E]/30">
                        <h3 className="font-semibold text-sm text-[#1B241E] mb-1 flex items-center gap-2 text-[#F28C6E]">
                          <PhoneCall className="h-4 w-4" />
                          <span>Bantuan Darurat & Hotline Krisis</span>
                        </h3>
                        <p className="mb-2 text-[#2D3E33]/90">
                          Jika kamu atau orang terdekat berada dalam situasi darurat, bahaya diri, atau krisis batin berat, jangan ragu untuk menghubungi layanan bantuan profesional segera:
                        </p>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <span className="font-semibold text-[#1B241E]">Hotline Darurat Kemenkes: 119 Ext. 8</span>
                          <span className="text-[#2D3E33]/40">•</span>
                          <Link
                            href="/guidebook"
                            className="inline-flex items-center gap-1 font-medium text-[#3E7B54] hover:underline"
                          >
                            <span>Buka Panduan & Direktori Krisis</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS AKUN 3 DB */}
      {showDeleteModal && (
        <div id="modal-delete-account" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B241E]/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-[#2D3E33]/15">
            <div className="flex items-center justify-between pb-3 border-b border-[#2D3E33]/10">
              <div className="flex items-center gap-2 text-[#F28C6E]">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-base font-semibold text-[#1B241E]">
                  Konfirmasi Hapus Akun
                </h3>
              </div>
              <button
                type="button"
                id="btn-cancel-delete"
                onClick={() => setShowDeleteModal(false)}
                className="text-[#2D3E33]/50 hover:text-[#1B241E]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-[#2D3E33]/80">
              <p>
                Tindakan ini akan <strong>menghapus permanen</strong> akunmu di 3 basis data ZYBA:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#2D3E33]/70">
                <li>Seluruh unggahan, like, komentar, dan pesan komunitas.</li>
                <li>Seluruh percakapan dan memori reflektif bersama Zibi.</li>
                <li>Seluruh riwayat check-in, skor Zyba, dan data profil.</li>
              </ul>

              {deleteError && (
                <div className="rounded-xl bg-[#FDF4F1] p-3 text-xs text-[#F28C6E]">
                  {deleteError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-[#1B241E] mb-1">
                  Kata Sandi Akun (Opsional jika login Google)
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full rounded-xl border border-[#2D3E33]/20 bg-white px-3 py-2 text-xs text-[#1B241E] focus:outline-none focus:border-[#F28C6E]"
                  placeholder="Masukkan kata sandi saat ini"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1B241E] mb-1">
                  Ketik kata &quot;HAPUS&quot; untuk mengonfirmasi
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full rounded-xl border border-[#2D3E33]/20 bg-white px-3 py-2 text-xs text-[#1B241E] focus:outline-none focus:border-[#F28C6E]"
                  placeholder="Ketik HAPUS di sini"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#2D3E33]/10">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="rounded-full px-4 py-2 text-xs font-medium text-[#2D3E33]/70 hover:text-[#1B241E]"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText.trim() !== "HAPUS"}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#F28C6E] px-5 py-2 text-xs font-medium text-white hover:bg-[#e07556] transition-colors disabled:opacity-40"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Menghapus 3 DB...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus Selamanya</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
