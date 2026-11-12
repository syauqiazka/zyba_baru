/**
 * WCAG 2.1 Contrast Ratio Verification Script for ZYBA v2
 * Evaluates color pairs defined in DESIGN.md §2.2 & PALETTE_LOCK.md
 */

function hexToRgb(hex) {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function srgbToLin(colorChannel) {
  const c = colorChannel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function getLuminance(hex) {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * srgbToLin(r) +
    0.7152 * srgbToLin(g) +
    0.0722 * srgbToLin(b)
  );
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const colors = {
  cream: "#F7F2E7",
  brown900: "#3B2A20",
  brown700: "#5A4636",
  orange500: "#F2884B",
  orange100: "#FCE3D3",
  green500: "#8FAE5D",
  green100: "#E4EED2",
  white: "#FFFFFF",
};

console.log("=== ZYBA WCAG 2.1 CONTRAST AUDIT ===");

const pairs = [
  {
    name: "brown-900 on cream (Teks Utama)",
    fg: colors.brown900,
    bg: colors.cream,
    minRatio: 4.5,
    expectedPass: true,
  },
  {
    name: "brown-700 on cream (Teks Sekunder)",
    fg: colors.brown700,
    bg: colors.cream,
    minRatio: 4.5,
    expectedPass: true,
  },
  {
    name: "brown-900 on orange-500 (Tombol Warm / CTA)",
    fg: colors.brown900,
    bg: colors.orange500,
    minRatio: 4.5,
    expectedPass: true,
  },
  {
    name: "white on orange-500 (DILARANG KERAS)",
    fg: colors.white,
    bg: colors.orange500,
    minRatio: 4.5,
    expectedPass: false, // Must fail!
  },
  {
    name: "brown-900 on green-100 (Tombol Sekunder / Active Dock)",
    fg: colors.brown900,
    bg: colors.green100,
    minRatio: 4.5,
    expectedPass: true,
  },
  {
    name: "brown-900 on orange-100 (Badge Warm)",
    fg: colors.brown900,
    bg: colors.orange100,
    minRatio: 4.5,
    expectedPass: true,
  },
];

let allPassed = true;

pairs.forEach(({ name, fg, bg, minRatio, expectedPass }) => {
  const ratio = getContrastRatio(fg, bg);
  const rounded = ratio.toFixed(2);
  const passes = ratio >= minRatio;

  if (expectedPass) {
    if (passes) {
      console.log(`[PASS] ${name}: ${rounded}:1 (Memenuhi ambang batas >= ${minRatio}:1)`);
    } else {
      console.error(`[FAIL] ${name}: ${rounded}:1 (Di bawah ambang batas >= ${minRatio}:1)`);
      allPassed = false;
    }
  } else {
    // Expected to fail validation
    if (!passes) {
      console.log(`[VERIFIED REJECTION] ${name}: ${rounded}:1 (Tepat ditolak / tidak memenuhi WCAG)`);
    } else {
      console.error(`[UNEXPECTED] ${name}: ${rounded}:1 lolos padahal seharusnya gagal`);
      allPassed = false;
    }
  }
});

if (!allPassed) {
  console.error("\nAda pengujian kontras yang tidak sesuai spesifikasi!");
  process.exit(1);
} else {
  console.log("\nSeluruh pengujian kontras sesuai dengan DESIGN.md §2.2!");
}

