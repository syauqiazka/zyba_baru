import fs from "fs";

// Load .env.local and .env
for (const envFile of [".env.local", ".env"]) {
  if (fs.existsSync(envFile)) {
    const lines = fs.readFileSync(envFile, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const k = trimmed.slice(0, eqIdx).trim();
        const v = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[k]) {
          process.env[k] = v;
        }
      }
    }
  }
}

import { settingsRepo } from "../src/backend/db/settingsRepo";
import { adminRepo } from "../src/backend/db/adminRepo";

async function runPhase6Tests() {
  console.log("=== Menjalankan Unit Test Fase P6 (Settings, Ekspor JSON, Hapus Akun 3 DB, Admin Moderasi) ===");

  const testUserId = "user-p6-test-" + Date.now();

  // 1. Profil & Preferensi Notifikasi
  console.log("[Test 1] Mengambil dan memperbarui profil pengguna...");
  const initialProfile = await settingsRepo.getProfile(testUserId);
  if (!initialProfile || !initialProfile.id) {
    throw new Error("Gagal mengambil profil awal");
  }

  const updateProfRes = await settingsRepo.updateProfile(testUserId, {
    name: "Syauqi Mindful Sanctuary",
    bio: "Menemukan ritme tenang setiap hembusan napas.",
  });
  if (!updateProfRes.success) {
    throw new Error("Gagal memperbarui profil pengguna");
  }

  const updateNotifRes = await settingsRepo.updateNotificationPrefs(testUserId, {
    companionNotif: true,
    wellnessNotif: false,
    communityNotif: true,
  });
  if (!updateNotifRes.success) {
    throw new Error("Gagal memperbarui preferensi notifikasi");
  }

  const updatedProfile = await settingsRepo.getProfile(testUserId);
  if (updatedProfile.name !== "Syauqi Mindful Sanctuary") {
    throw new Error("Nama profil tidak sesuai setelah pembaruan");
  }
  console.log("✓ Profil & preferensi notifikasi berhasil diverifikasi");

  // 2. Ekspor Data JSON
  console.log("[Test 2] Menguji ekspor arsip data pengguna (JSON)...");
  const exported = await settingsRepo.exportUserData(testUserId);
  if (!exported.exportedAt || !exported.platform || !exported.userId) {
    throw new Error("Struktur metadata ekspor data tidak lengkap");
  }
  if (!("account" in exported) || !("companion" in exported) || !("community" in exported)) {
    throw new Error("Arsip ekspor tidak mencakup ketiga basis data");
  }

  // Verifikasi KEAMANAN: passwordHash DILARANG keras ada di berkas ekspor
  const exportedString = JSON.stringify(exported);
  if (exportedString.includes("passwordHash")) {
    throw new Error("PELANGGARAN KEAMANAN: passwordHash ditemukan di berkas ekspor pengguna!");
  }
  console.log("✓ Ekspor JSON lengkap dari 3 DB terverifikasi aman tanpa bocoran passwordHash");

  // 3. Admin Moderasi Komunitas & Log Audit
  console.log("[Test 3] Menguji statistik dan daftar laporan admin...");
  const stats = await adminRepo.getStats();
  if (stats.total === undefined || stats.pending === undefined) {
    throw new Error("Format statistik laporan admin tidak valid");
  }

  const reports = await adminRepo.listReports({ status: "ALL" });
  if (!Array.isArray(reports) || reports.length === 0) {
    throw new Error("Daftar laporan admin kosong");
  }

  const targetReport = reports[0];
  console.log(`[Test 4] Menjalankan aksi moderasi pada laporan '${targetReport.id}'...`);
  const actionRes = await adminRepo.takeAction({
    reportId: targetReport.id,
    adminId: "admin-system-test",
    action: "HIDE_POST",
    reason: "Konten melanggar panduan suaka ketenangan ZYBA.",
    targetUserId: targetReport.reportedUserId,
    targetContentId: targetReport.targetId,
  });
  if (!actionRes.success) {
    throw new Error("Gagal mengeksekusi aksi moderasi admin");
  }
  console.log("✓ Aksi moderasi admin dan pencatatan audit log berhasil");

  // 4. Hapus Akun Lintas 3 DB (Community -> Companion -> Account)
  console.log("[Test 5] Menguji penghapusan akun permanen lintas 3 database...");
  const delRes = await settingsRepo.deleteAccount(testUserId);
  if (!delRes.success) {
    throw new Error("Gagal mengeksekusi penghapusan akun 3 DB");
  }
  if (
    !delRes.deletionLogs.communityDeleted ||
    !delRes.deletionLogs.companionDeleted ||
    !delRes.deletionLogs.accountDeleted
  ) {
    throw new Error("Penghapusan akun tidak mencakup semua ketiga database");
  }
  console.log("✓ Penghapusan akun lintas 3 DB (Community -> Companion -> Account) berhasil 100%");

  console.log("\n=======================================================");
  console.log("SEMUA PENGUJIAN UNIT TEST FASE P6 BERHASIL DILALUI!");
  console.log("=======================================================\n");
}

runPhase6Tests().catch((err) => {
  console.error("Test gagal:", err);
  process.exit(1);
});
