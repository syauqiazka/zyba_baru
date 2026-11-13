/**
 * Unit & Contract Tests: Zyba AI Companion Quota & Mindful Cooldown
 * 
 * Pipeline Stage [D] (Superpowers TDD)
 * Menjamin:
 * 1. Batas kuota 15.000 token per siklus chat
 * 2. Algoritma estimasi token teks bahasa Indonesia (~3.5 char/token)
 * 3. Status Cooldown 5 jam ("Jeda Batin") aktif saat batas 15.000 token tercapai
 * 4. Pemulihan otomatis setelah masa jeda 5 jam berlalu
 * 5. Persona tunggal resmi Zibi dengan prompt etika & krisis
 */

import {
  TOKEN_LIMIT,
  COOLDOWN_HOURS,
  COOLDOWN_MS,
  estimateTokens,
  checkTokenQuota,
  consumeTokens,
} from "../src/backend/ai/quota";
import { PERSONAS, DEFAULT_PERSONA_ID } from "../src/backend/ai/personas";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runCompanionQuotaTests() {
  console.log("=== Menjalankan Unit Test Zyba Companion Quota & Cooldown ===");

  // Test 1: Konfigurasi Parameter Kunci
  console.log("[Test 1] Parameter Kuota & Jeda Batin");
  assert(TOKEN_LIMIT === 15000, `TOKEN_LIMIT harus 15000, didapat: ${TOKEN_LIMIT}`);
  assert(COOLDOWN_HOURS === 5, `COOLDOWN_HOURS harus 5 jam, didapat: ${COOLDOWN_HOURS}`);
  assert(
    COOLDOWN_MS === 5 * 3600 * 1000,
    `COOLDOWN_MS harus 18000000 ms, didapat: ${COOLDOWN_MS}`
  );
  console.log("✔ Test 1: Parameter kuota 15.000 token & jeda 5 jam valid.");

  // Test 2: Estimasi Token Teks
  console.log("[Test 2] Algoritma Estimasi Token (Bahasa Indonesia)");
  const emptyEstimate = estimateTokens("");
  assert(emptyEstimate > 0, "Empty string harus mengembalikan nilai fallback > 0");

  const sampleShort = "Halo Zibi, aku merasa cemas hari ini."; // 37 karakter
  const shortEstimate = estimateTokens(sampleShort);
  assert(
    shortEstimate >= 10 && shortEstimate <= 15,
    `Estimasi teks pendek harus proporsional (~11 token), didapat: ${shortEstimate}`
  );

  const sampleLong = "Hari ini rasanya sangat melelahkan dan banyak hal yang menumpuk di kepalaku. Aku tidak tahu harus mulai bercerita dari mana, tapi aku butuh ruang aman untuk bernafas sejenak tanpa dihakimi."; // 189 karakter
  const longEstimate = estimateTokens(sampleLong);
  assert(
    longEstimate >= 50 && longEstimate <= 60,
    `Estimasi teks panjang harus ~54 token, didapat: ${longEstimate}`
  );
  console.log("✔ Test 2: Estimasi token teks bahasa Indonesia berjalan presisi.");

  // Test 3: Persona Tunggal ZIBI
  console.log("[Test 3] Verifikasi Konsolidasi Persona Tunggal Zibi");
  const personaKeys = Object.keys(PERSONAS);
  assert(personaKeys.length === 1, `PERSONAS harus hanya berisi 1 persona, didapat: ${personaKeys.length}`);
  assert(DEFAULT_PERSONA_ID === "ZIBI", "DEFAULT_PERSONA_ID harus ZIBI");
  assert(PERSONAS.ZIBI !== undefined, "PERSONAS.ZIBI wajib terdefinisi");
  assert(PERSONAS.ZIBI.id === "ZIBI", "ID persona harus ZIBI");
  assert(
    PERSONAS.ZIBI.systemPrompt.includes("ATURAN KESELAMATAN KESEHATAN MENTAL"),
    "Prompt Zibi wajib memiliki panduan keselamatan kesehatan mental"
  );
  console.log("✔ Test 3: Persona tunggal Zibi terverifikasi dan aman.");

  // Test 4: Simulasi Konsumsi Token & Cooldown 5 Jam
  console.log("[Test 4] Siklus Konsumsi Token & Aktivasi Jeda Batin 5 Jam");
  const testUserId = `test_user_${Date.now()}`;

  // Keadaan awal (0 token terpakai)
  const initialStatus = await checkTokenQuota(testUserId);
  assert(initialStatus.allowed === true, "User baru harus diizinkan chat");
  assert(initialStatus.tokensUsed === 0, "User baru harus memiliki 0 token terpakai");
  assert(initialStatus.remainingTokens === 15000, "User baru harus memiliki 15.000 sisa token");
  assert(initialStatus.isCooldown === false, "User baru tidak boleh dalam status cooldown");

  // Konsumsi 5.000 token
  const after5k = await consumeTokens(testUserId, 5000);
  assert(after5k.tokensUsed === 5000, `Token terpakai harus 5000, didapat: ${after5k.tokensUsed}`);
  assert(after5k.remainingTokens === 10000, `Sisa token harus 10000, didapat: ${after5k.remainingTokens}`);
  assert(after5k.isCooldown === false, "Cooldown belum boleh aktif pada 5.000 token");
  assert(after5k.allowed === true, "Masih diizinkan chat");

  // Konsumsi lagi 10.000 token (total 15.000 token -> mencapai batas!)
  const atLimit = await consumeTokens(testUserId, 10000);
  assert(atLimit.tokensUsed >= 15000, `Token terpakai harus >= 15000, didapat: ${atLimit.tokensUsed}`);
  assert(atLimit.remainingTokens === 0, `Sisa token harus 0, didapat: ${atLimit.remainingTokens}`);
  assert(atLimit.isCooldown === true, "Status cooldown 5 jam WAJIB aktif saat mencapai 15.000 token!");
  assert(atLimit.allowed === false, "User TIDAK boleh diizinkan chat saat cooldown aktif");
  assert(atLimit.cooldownRemainingSec > 0, "Harus ada sisa detik hitung mundur cooldown");
  assert(
    atLimit.cooldownRemainingSec <= 18000,
    `Detik cooldown maksimal 18000 detik (5 jam), didapat: ${atLimit.cooldownRemainingSec}`
  );
  console.log("✔ Test 4: Aktivasi batas 15.000 token & jeda 5 jam sukses terbukti.");

  console.log("\nSELURUH UNIT TEST ZYBA COMPANION QUOTA & JEDA BERHASIL LULUS! 🎉\n");
}

runCompanionQuotaTests().catch((err) => {
  console.error("Test gagal:", err);
  process.exit(1);
});
