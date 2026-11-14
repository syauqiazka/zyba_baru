import fs from "fs";
import path from "path";

function getAllFiles(dir: string, exts = [".ts", ".tsx"]): string[] {
  let res: string[] = [];
  if (!fs.existsSync(dir)) return res;
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (item !== "node_modules" && item !== ".next" && item !== "generated") {
        res = res.concat(getAllFiles(full, exts));
      }
    } else if (exts.includes(path.extname(full))) {
      res.push(full);
    }
  }
  return res;
}

const componentFiles = getAllFiles("src/components");
const allSrcFiles = getAllFiles("src");

const unused: string[] = [];
for (const comp of componentFiles) {
  const baseName = path.basename(comp, path.extname(comp));
  let used = false;
  for (const src of allSrcFiles) {
    if (path.resolve(src) === path.resolve(comp)) continue;
    const content = fs.readFileSync(src, "utf-8");
    if (content.includes(baseName)) {
      used = true;
      break;
    }
  }
  if (!used) {
    unused.push(path.relative(process.cwd(), comp));
  }
}

console.log("=== PEMERIKSAAN DEAD CODE KOMPONEN UI ===");
console.log("Total Komponen :", componentFiles.length);
if (unused.length === 0) {
  console.log("[STATUS] SEMUA KOMPONEN MEMILIKI IMPORTER AKTIF! (0 dead code)");
} else {
  console.log("[PERINGATAN] Komponen tanpa referensi:", unused);
}
