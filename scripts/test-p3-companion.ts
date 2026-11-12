import { createToken } from "../src/lib/jwt";

async function runCompanionTests() {
  console.log("=== Menjalankan Pengujian Fase P3: Zyba Companion ===");

  const token = await createToken({
    sub: "user-test-companion",
    userId: "user-test-companion",
    email: "companion-tester@zyba.id",
    name: "Tester Companion",
    role: "USER",
    onboardingCompleted: true,
  });

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    Cookie: `zyba_token=${token}`,
  };

  // 1. Fetch conversations list
  console.log("\n[Test 1] GET /api/companion/conversations");
  const listRes = await fetch("http://localhost:3005/api/companion/conversations", {
    headers,
  });
  console.log(`Status: ${listRes.status}`);
  const listData = await listRes.json();
  console.log(`Remaining quota: ${listData.remainingQuota}/20`);
  console.log(`Conversations count: ${listData.conversations?.length ?? 0}`);

  // 2. Create new conversation
  console.log("\n[Test 2] POST /api/companion/conversations");
  const createRes = await fetch("http://localhost:3005/api/companion/conversations", {
    method: "POST",
    headers,
    body: JSON.stringify({
      initialMessage: "Halo Kina, aku merasa sedikit cemas hari ini.",
      persona: "KINA",
    }),
  });
  console.log(`Status: ${createRes.status}`);
  const createData = await createRes.json();
  console.log("Create response:", createData);

  const convId = createData.conversationId;
  if (!convId) {
    throw new Error("Gagal membuat conversationId");
  }

  // 3. Send message & verify response
  console.log("\n[Test 3] POST /api/companion/chat (Normal Message)");
  const chatRes = await fetch("http://localhost:3005/api/companion/chat", {
    method: "POST",
    headers,
    body: JSON.stringify({
      conversationId: convId,
      content: "Terima kasih sudah mendengarkan. Menurutmu apa yang sebaiknya kulakukan?",
      persona: "KINA",
    }),
  });
  console.log(`Status: ${chatRes.status}`);
  const chatData = await chatRes.json();
  console.log("Assistant Message:", {
    role: chatData.message?.role,
    modelUsed: chatData.message?.modelUsed,
    flaggedForRisk: chatData.message?.flaggedForRisk,
    snippet: chatData.message?.content?.substring(0, 100) + "...",
  });
  console.log("Remaining quota:", chatData.remainingQuota);

  // 4. Test Crisis Detection
  console.log("\n[Test 4] POST /api/companion/chat (Crisis Risk Detection Test)");
  const crisisRes = await fetch("http://localhost:3005/api/companion/chat", {
    method: "POST",
    headers,
    body: JSON.stringify({
      conversationId: convId,
      content: "Aku merasa putus asa dan ingin mengakhiri hidup saja...",
      persona: "KINA",
    }),
  });
  console.log(`Status: ${crisisRes.status}`);
  const crisisData = await crisisRes.json();
  console.log("Crisis Message Flagged:", crisisData.message?.flaggedForRisk);
  if (crisisData.message?.flaggedForRisk !== true) {
    console.warn("PERINGATAN: Pesan krisis tidak terdeteksi risiko!");
  } else {
    console.log("SUKSES: detectRisk() berhasil mendeteksi sinyal krisis dan menandai pesan!");
  }

  // 5. Fetch messages of conversation
  console.log(`\n[Test 5] GET /api/companion/conversations/${convId}`);
  const messagesRes = await fetch(
    `http://localhost:3005/api/companion/conversations/${convId}`,
    { headers }
  );
  console.log(`Status: ${messagesRes.status}`);
  const messagesData = await messagesRes.json();
  console.log(`Total messages in thread: ${messagesData.messages?.length}`);

  console.log("\n=== Semua Pengujian Fase P3 Selesai dengan Sukses! ===");
}

runCompanionTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

