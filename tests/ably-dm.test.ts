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

import { createAblyTokenRequest, publishDirectMessage } from "../src/backend/realtime/ablyServer";
import { directMessageRepo } from "../src/backend/db/directMessageRepo";

async function runAblyDmTests() {
  console.log("=== Menjalankan Unit Test Realtime DM via Ably (Fase P4) ===");

  // 1. Uji Pembuatan Token Request Ably
  const testUserId = "user-test-ably-" + Date.now();
  console.log(`[Test 1] Membuat Ably Token Request untuk client: ${testUserId}...`);
  const tokenRequest = await createAblyTokenRequest(testUserId);
  console.log("[Test 1] Token request berhasil dibuat:", {
    keyName: tokenRequest.keyName,
    clientId: tokenRequest.clientId,
    capability: tokenRequest.capability,
  });

  if (!tokenRequest.keyName || tokenRequest.clientId !== testUserId) {
    throw new Error("Token request Ably tidak sesuai dengan clientId penguji");
  }
  console.log("✔ Test 1: Ably Token Request otentikasi realtime valid.");

  // 2. Uji Publikasi Realtime Event Ably
  const testConvId = "conv-test-" + Date.now();
  console.log(`[Test 2] Mempublikasikan pesan realtime ke channel direct:${testConvId}...`);
  await publishDirectMessage(testConvId, {
    id: "msg-test-1",
    conversationId: testConvId,
    senderId: testUserId,
    senderName: "Penguji ZYBA",
    content: "Halo dari unit test realtime Ably!",
    createdAt: new Date().toISOString(),
  });
  console.log("✔ Test 2: Publikasi event realtime Ably berhasil tanpa error.");

  // 3. Uji Repository Percakapan DM
  console.log("[Test 3] Mengambil daftar percakapan langsung...");
  const convList = await directMessageRepo.listConversations(testUserId);
  console.log(`[Test 3] Ditemukan ${convList.length} percakapan.`);
  if (!Array.isArray(convList)) {
    throw new Error("Daftar percakapan bukan array");
  }
  console.log("✔ Test 3: Pengambilan daftar percakapan sukses.");

  // 4. Uji Pengiriman Pesan DM & Sinkronisasi Realtime
  console.log("[Test 4] Menginisialisasi percakapan nyata dan mengirim pesan langsung...");
  const partnerId = "user-partner-ably-" + Date.now();
  const realConvId = await directMessageRepo.getOrCreateConversation(testUserId, partnerId);
  console.log(`[Test 4] Percakapan siap dengan ID: ${realConvId}`);

  const sentMsg = await directMessageRepo.sendMessage(
    realConvId,
    testUserId,
    "Penguji ZYBA",
    "Pesan uji coba saling mendukung di ZYBA Community."
  );
  console.log("[Test 4] Pesan berhasil terkirim:", sentMsg.id);
  if (!sentMsg.content.includes("saling mendukung")) {
    throw new Error("Konten pesan tidak sesuai");
  }

  const messages = await directMessageRepo.listMessages(realConvId, testUserId);
  console.log(`[Test 4] Total pesan dalam percakapan: ${messages.length}`);
  if (messages.length === 0) {
    throw new Error("Pesan yang baru dikirim tidak ditemukan dalam daftar pesan");
  }
  console.log("✔ Test 4: Siklus pengiriman dan pembacaan pesan langsung sukses.");

  console.log("\n=== SELURUH UNIT TEST REALTIME DM & ABLY BERHASIL LULUS! 🎉 ===");
}

runAblyDmTests().catch((err) => {
  console.error("Test gagal:", err);
  process.exit(1);
});
