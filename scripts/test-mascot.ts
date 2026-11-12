import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Mascot, MascotHero, getMascotFilePath } from "../src/components/ui/Mascot";
import mascotPoses from "../src/lib/mascotPoses.json";
import { MASCOT_NAME } from "../src/lib/brand";

function runMascotTests() {
  console.log("=== MEMULAI TEST INTEGRASI MASKOT RESMI ZYBA ===");
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

  const rootDir = path.resolve(__dirname, "..");

  // Test 1: Brand Mascot Constant
  assert(
    typeof MASCOT_NAME === "string" && MASCOT_NAME.length > 0,
    `MASCOT_NAME terdefinisi: "${MASCOT_NAME}"`
  );

  // Test 2: Hero Asset Exists
  const heroPath = path.join(rootDir, "public", "mascot", "hero.png");
  assert(fs.existsSync(heroPath), `public/mascot/hero.png ditemukan pada filesystem`);

  // Test 3: Pose Map Verification & Uniform Files
  const poses = Object.keys(mascotPoses) as Array<keyof typeof mascotPoses>;
  assert(poses.length >= 6, `Terdapat minimal 6 pose utama terdaftar (total: ${poses.length})`);

  for (const pose of poses) {
    const fileBase = mascotPoses[pose];
    const filePath = path.join(rootDir, "public", "mascot", "uniform", `${fileBase}.png`);
    const exists = fs.existsSync(filePath);
    assert(exists, `Pose "${pose}" -> public/mascot/uniform/${fileBase}.png valid & ada`);
  }

  // Test 4: getMascotFilePath helper
  for (const pose of poses) {
    const p = getMascotFilePath(pose);
    assert(
      p === `/mascot/uniform/${mascotPoses[pose]}.png`,
      `getMascotFilePath("${pose}") menghasilkan "${p}"`
    );
  }

  // Test 5: React SSR Rendering - Decorative vs Non-Decorative
  const decorativeHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Mascot, { pose: "default", decorative: true, size: 160 })
  );
  assert(
    decorativeHtml.includes('aria-hidden="true"') && decorativeHtml.includes('alt=""'),
    `Mascot (decorative=true) merender aria-hidden="true" dan alt=""`
  );

  const nonDecorativeHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Mascot, { pose: "default", decorative: false, size: 160 })
  );
  assert(
    nonDecorativeHtml.includes(`alt="Maskot ZYBA, ${MASCOT_NAME}"`) &&
      !nonDecorativeHtml.includes('aria-hidden="true"'),
    `Mascot (decorative=false) merender alt="Maskot ZYBA, ${MASCOT_NAME}" tanpa aria-hidden`
  );

  // Test 6: Size Clamping enforcement (Max 197 for uniform, Max 348 for Hero)
  const oversizedMascot = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Mascot, { pose: "default", size: 300 })
  );
  assert(
    oversizedMascot.includes("width:197px") && !oversizedMascot.includes("width:300px"),
    `Mascot dengan request size=300px dibatasi clamp maksimal ke 197px (Aturan Keras 3)`
  );

  const oversizedHero = ReactDOMServer.renderToStaticMarkup(
    React.createElement(MascotHero, { size: 500, decorative: false })
  );
  assert(
    oversizedHero.includes("width:348px") && !oversizedHero.includes("width:500px"),
    `MascotHero dengan request size=500px dibatasi clamp maksimal ke 348px (Aturan Keras 3)`
  );

  // Test 7: Render All Poses Without Error
  for (const pose of poses) {
    try {
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(Mascot, { pose, size: 120 })
      );
      assert(html.length > 50, `Render pose "${pose}" berhasil tanpa exception`);
    } catch (e: any) {
      assert(false, `Render pose "${pose}" gagal: ${e.message}`);
    }
  }

  console.log(`\n=== RINGKASAN TEST: ${passed} PASS, ${failed} FAIL ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runMascotTests();

