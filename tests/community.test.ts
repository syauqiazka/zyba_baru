import { communityRepo } from "../src/backend/db/communityRepo";
import { detectRisk } from "../src/lib/crisisDetection";

async function runCommunityTests() {
  console.log("=== Menjalankan Unit Test Zyba Community (Fase P4) ===");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`);
      failed++;
    }
  }

  // Test 1: Verifikasi Seed Posts Terdaftar & Otentik
  const forYouPosts = await communityRepo.listPosts({ tab: "for-you", limit: 10 });
  assert(forYouPosts.length >= 4, `Seed postingan terisi minimal 4 cerita (aktual: ${forYouPosts.length})`);
  assert(
    forYouPosts.some((p) => p.topicTag === "Pikiran Tenang"),
    `Postingan bertema "Pikiran Tenang" tersedia`
  );
  assert(
    forYouPosts.some((p) => p.isAnonymous === true),
    `Fitur postingan anonim ("Teman Berkelana") terverifikasi`
  );

  // Test 2: Buat Postingan Baru
  const testUser = "user_test_p4";
  const created = await communityRepo.createPost({
    userId: testUser,
    userName: "Syauqi Test",
    title: "Menikmati Sore yang Teduh",
    content: "Setelah hari yang cukup padat, menyempatkan 15 menit duduk tanpa gawai terasa sangat melegakan.",
    topicTag: "Pikiran Tenang",
    isAnonymous: false,
  });
  assert(Boolean(created.post.id), `Postingan baru berhasil dibuat dengan ID: ${created.post.id}`);
  assert(!created.riskAlert, `Postingan netral tidak memicu sensor krisis`);

  // Test 3: Sensor Krisis pada Postingan (AGENTS.md Bagian 8)
  const crisisPost = await communityRepo.createPost({
    userId: testUser,
    userName: "Syauqi Test",
    title: "Merasa sangat putus asa",
    content: "Aku capek hidup dan tidak tahu harus bagaimana lagi.",
    topicTag: "Kisah Pulih",
    isAnonymous: true,
  });
  assert(crisisPost.riskAlert === true, `Teks dengan sinyal bahaya diri berhasil terdeteksi oleh sensor krisis`);

  // Test 4: Toggle Like Postingan
  const targetPostId = forYouPosts[0].id;
  const initialLikes = forYouPosts[0].likesCount;
  const likeRes1 = await communityRepo.toggleLike(targetPostId, testUser);
  assert(likeRes1.isLiked === true, `Toggle like pertama menghasilkan isLiked: true`);

  const likeRes2 = await communityRepo.toggleLike(targetPostId, testUser);
  assert(likeRes2.isLiked === false, `Toggle like kedua menghasilkan isLiked: false`);

  // Test 5: Toggle Bookmark Postingan
  const bookRes1 = await communityRepo.toggleBookmark(targetPostId, testUser);
  assert(bookRes1.isBookmarked === true, `Toggle bookmark pertama menghasilkan isBookmarked: true`);

  const savedPosts = await communityRepo.listPosts({ tab: "saved", userId: testUser });
  assert(
    savedPosts.some((p) => p.id === targetPostId),
    `Postingan yang disimpan muncul pada tab "saved"`
  );

  const bookRes2 = await communityRepo.toggleBookmark(targetPostId, testUser);
  assert(bookRes2.isBookmarked === false, `Toggle bookmark kedua menghasilkan isBookmarked: false`);

  // Test 6: Tambah Komentar & Ambil Daftar Komentar
  const commentRes = await communityRepo.createComment({
    postId: targetPostId,
    userId: testUser,
    userName: "Syauqi Test",
    content: "Komentar hangat untuk saling menguatkan.",
    isAnonymous: false,
  });
  assert(Boolean(commentRes.id), `Komentar baru berhasil ditambahkan`);

  const comments = await communityRepo.listComments(targetPostId);
  assert(
    comments.some((c) => c.content === "Komentar hangat untuk saling menguatkan."),
    `Komentar terdaftar dan berhasil dimuat dalam daftar komentar post`
  );

  // Test 7: Laporkan Konten (Moderasi)
  const reportRes = await communityRepo.createReport({
    reporterId: testUser,
    targetType: "POST",
    targetId: targetPostId,
    postId: targetPostId,
    reportedUserId: forYouPosts[0].userId,
    reason: "spam",
    details: "Konten berulang dan tidak relevan.",
  });
  assert(Boolean(reportRes.id) && reportRes.status === "PENDING", `Laporan konten berhasil dicatat dengan status PENDING`);

  console.log(`\n=== HASIL UNIT TEST COMMUNITY: ${passed} PASS, ${failed} FAIL ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runCommunityTests().catch((err) => {
  console.error("Terjadi error pada test:", err);
  process.exit(1);
});

