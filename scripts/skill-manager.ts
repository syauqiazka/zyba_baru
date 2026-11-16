import fs from "fs";
import path from "path";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const ACTIVE_SKILLS_DIR = path.join(PROJECT_ROOT, ".agents", "skills");
const LIBRARY_DIR = path.join(
  PROJECT_ROOT,
  ".agents",
  "skills_library",
  "agentic-awesome-skills"
);
const INDEX_FILE = path.join(LIBRARY_DIR, "skills_index.json");

interface SkillEntry {
  id: string;
  name: string;
  category: string;
  description: string;
  path: string;
}

function loadIndex(): SkillEntry[] {
  if (!fs.existsSync(INDEX_FILE)) {
    console.error("File indeks skills_index.json tidak ditemukan di:", INDEX_FILE);
    process.exit(1);
  }
  const raw = fs.readFileSync(INDEX_FILE, "utf-8");
  return JSON.parse(raw);
}

function searchSkills(query: string) {
  const index = loadIndex();
  const q = query.toLowerCase();
  const matches = index.filter(
    (s) =>
      s.id.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q))
  );

  console.log(`\n🔍 Ditemukan ${matches.length} skill yang cocok dengan "${query}":\n`);
  matches.slice(0, 15).forEach((m, idx) => {
    console.log(`${idx + 1}. [${m.id}] (${m.category})`);
    console.log(`   ${m.description.slice(0, 120)}...`);
    console.log(`   Instal: pnpm run skills:install ${m.id}\n`);
  });

  if (matches.length > 15) {
    console.log(`... dan ${matches.length - 15} skill lainnya.`);
  }
}

function installSkill(skillIds: string[]) {
  if (!fs.existsSync(ACTIVE_SKILLS_DIR)) {
    fs.mkdirSync(ACTIVE_SKILLS_DIR, { recursive: true });
  }

  for (const id of skillIds) {
    const sourceDir = path.join(LIBRARY_DIR, "skills", id);
    const targetDir = path.join(ACTIVE_SKILLS_DIR, id);

    if (!fs.existsSync(sourceDir)) {
      console.error(`❌ Skill "${id}" tidak ditemukan di library.`);
      continue;
    }

    fs.cpSync(sourceDir, targetDir, { recursive: true });
    console.log(`✔ Berhasil menginstal skill "${id}" ke .agents/skills/${id}`);
  }
}

function removeSkill(skillId: string) {
  const targetDir = path.join(ACTIVE_SKILLS_DIR, skillId);
  if (!fs.existsSync(targetDir)) {
    console.log(`ℹ Skill "${skillId}" tidak terpasang di .agents/skills/`);
    return;
  }
  fs.rmSync(targetDir, { recursive: true, force: true });
  console.log(`✔ Berhasil mencopot skill "${skillId}" dari .agents/skills/`);
}

function listActiveSkills() {
  if (!fs.existsSync(ACTIVE_SKILLS_DIR)) {
    console.log("Belum ada skill yang terpasang di .agents/skills/");
    return;
  }

  const items = fs.readdirSync(ACTIVE_SKILLS_DIR, { withFileTypes: true });
  const skills = items.filter((i) => i.isDirectory()).map((i) => i.name);

  console.log(`\n📋 Daftar Skill Aktif (${skills.length} terpasang di .agents/skills/):\n`);
  skills.sort().forEach((name, idx) => {
    const skillMd = path.join(ACTIVE_SKILLS_DIR, name, "SKILL.md");
    let desc = "";
    if (fs.existsSync(skillMd)) {
      const content = fs.readFileSync(skillMd, "utf-8");
      const match = content.match(/description:\s*([^\n\r]+)/);
      if (match) desc = match[1].trim();
    }
    console.log(`${idx + 1}. ${name} ${desc ? "— " + desc.slice(0, 80) + "..." : ""}`);
  });
  console.log("");
}

// CLI Arg Parsing
const [command, ...args] = process.argv.slice(2);

switch (command) {
  case "search":
    if (!args[0]) {
      console.log("Penggunaan: pnpm run skills:search <kata-kunci>");
    } else {
      searchSkills(args.join(" "));
    }
    break;

  case "install":
  case "add":
    if (args.length === 0) {
      console.log("Penggunaan: pnpm run skills:install <skill-id-1> [skill-id-2] ...");
    } else {
      installSkill(args);
    }
    break;

  case "remove":
  case "rm":
    if (!args[0]) {
      console.log("Penggunaan: pnpm run skills:remove <skill-id>");
    } else {
      removeSkill(args[0]);
    }
    break;

  case "list":
  case "ls":
  default:
    listActiveSkills();
    break;
}
