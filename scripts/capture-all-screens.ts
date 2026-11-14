import fs from "fs";
import path from "path";
import { createToken } from "../src/lib/jwt";

const screenshotDir = "e:\\syauqi\\zyba_baru\\screenshots\\overhaul";
const artifactDir =
  "C:\\Users\\user\\.gemini\\antigravity\\brain\\5d3a96b3-8079-4892-abbc-61555dec3330\\overhaul";

fs.mkdirSync(screenshotDir, { recursive: true });
fs.mkdirSync(artifactDir, { recursive: true });

async function sendCommand(ws: WebSocket, method: string, params: Record<string, any> = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (msg: MessageEvent) => {
      const data = JSON.parse(msg.data);
      if (data.id === id) {
        ws.removeEventListener("message", handler);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function capture() {
  const tokenCompleted = await createToken({
    sub: "user-test-completed",
    userId: "user-test-completed",
    email: "syauqi@zyba.id",
    name: "Syauqi",
    role: "ADMIN",
    onboardingCompleted: true,
  });

  const tokenAdmin = await createToken({
    sub: "user-test-completed",
    userId: "user-test-completed",
    email: "syauqi@zyba.id",
    name: "Syauqi Admin",
    role: "ADMIN",
    onboardingCompleted: true,
  });

  const tokenIncomplete = await createToken({
    sub: "user-test-new",
    userId: "user-test-new",
    email: "baru@zyba.id",
    name: "Pengguna Baru",
    role: "USER",
    onboardingCompleted: false,
  });

  const tabsRes = await fetch("http://127.0.0.1:9225/json");
  const tabs = (await tabsRes.json()) as any[];
  const pageTab = tabs.find((t) => t.type === "page");
  if (!pageTab) {
    console.error("Tab not found");
    process.exit(1);
  }

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise((resolve) => (ws.onopen = () => resolve(true)));

  await sendCommand(ws, "Network.enable");
  await sendCommand(ws, "Storage.enable").catch(() => {});

  const clearAllCookies = async () => {
    // 1. Delete all cookies via Network.getCookies
    try {
      const { cookies } = await sendCommand(ws, "Network.getCookies", {
        urls: ["http://localhost:3005"],
      });
      if (cookies && Array.isArray(cookies)) {
        for (const c of cookies) {
          await sendCommand(ws, "Network.deleteCookies", {
            name: c.name,
            url: "http://localhost:3005",
          });
          await sendCommand(ws, "Network.deleteCookies", {
            name: c.name,
            domain: "localhost",
          });
        }
      }
    } catch (e) {}

    await sendCommand(ws, "Network.clearBrowserCookies").catch(() => {});
    await sendCommand(ws, "Storage.clearDataForOrigin", {
      origin: "http://localhost:3005",
      storageTypes: "cookies,local_storage",
    }).catch(() => {});
    await sendCommand(ws, "Network.setExtraHTTPHeaders", { headers: {} });
  };

  const setCookie = async (tokenVal: string | null) => {
    await clearAllCookies();
    if (tokenVal) {
      await sendCommand(ws, "Network.setCookie", {
        name: "zyba_token",
        value: tokenVal,
        url: "http://localhost:3005",
        domain: "localhost",
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      });
      await sendCommand(ws, "Network.setExtraHTTPHeaders", {
        headers: { Authorization: `Bearer ${tokenVal}` },
      });
    }
  };

  const pages = [
    { url: "http://localhost:3005/", slug: "landing", auth: "none" },
    { url: "http://localhost:3005/onboarding", slug: "onboarding", auth: "none" },
    { url: "http://localhost:3005/login", slug: "login", auth: "none" },
    { url: "http://localhost:3005/assessment", slug: "assessment", auth: "incomplete" },
    { url: "http://localhost:3005/dashboard", slug: "dashboard", auth: "completed" },
    { url: "http://localhost:3005/mood-check-in", slug: "mood-check-in", auth: "completed" },
    { url: "http://localhost:3005/companion", slug: "companion", auth: "completed" },
    { url: "http://localhost:3005/community", slug: "community", auth: "completed" },
    { url: "http://localhost:3005/activity", slug: "activity", auth: "completed" },
    { url: "http://localhost:3005/wellness-journey", slug: "wellness-journey", auth: "completed" },
    { url: "http://localhost:3005/resources", slug: "resources", auth: "completed" },
    { url: "http://localhost:3005/resources?article=res-1", slug: "resources-article-detail", auth: "completed" },
    { url: "http://localhost:3005/settings", slug: "settings", auth: "completed" },
    { url: "http://localhost:3005/admin", slug: "admin", auth: "admin" },
    { url: "http://localhost:3005/admin?tab=articles", slug: "admin-articles", auth: "admin" },
  ];

  const viewports = [
    { name: "375-mobile", width: 375, height: 667, mobile: true },
    { name: "768-tablet", width: 768, height: 1024, mobile: false },
    { name: "1280-desktop", width: 1280, height: 800, mobile: false },
  ];

  for (const p of pages) {
    console.log(`Setting auth for ${p.slug} (${p.auth})...`);
    if (p.auth === "completed") {
      await setCookie(tokenCompleted);
    } else if (p.auth === "admin") {
      await setCookie(tokenAdmin);
    } else if (p.auth === "incomplete") {
      await setCookie(tokenIncomplete);
    } else {
      await setCookie(null);
    }

    console.log(`Navigating to ${p.url}...`);
    await sendCommand(ws, "Page.navigate", { url: p.url });

    // Wait until content renders
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 300));
      const isLoaded = await sendCommand(ws, "Runtime.evaluate", {
        expression: "Boolean(document.querySelector('h1') || document.querySelector('h2')) && !Boolean(document.querySelector('.animate-pulse:not(svg)')) && !Boolean(document.querySelector('.animate-spin'))",
        returnByValue: true,
      });
      if (isLoaded?.result?.value) {
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 600));

    const loc = await sendCommand(ws, "Runtime.evaluate", {
      expression: "window.location.href",
      returnByValue: true,
    });
    console.log(`Current page location: ${loc?.result?.value}`);

    for (const vp of viewports) {
      await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile,
      });

      // Pastikan posisi scroll kembali ke (0, 0) agar tidak ada offset horizontal
      await sendCommand(ws, "Runtime.evaluate", {
        expression: "window.scrollTo(0, 0)",
      });

      await new Promise((r) => setTimeout(r, 500));

      const { data } = await sendCommand(ws, "Page.captureScreenshot", {
        format: "png",
      });

      const fileName = `${p.slug}-${vp.name}.png`;
      const outPath = path.join(screenshotDir, fileName);
      const artPath = path.join(artifactDir, fileName);
      const buffer = Buffer.from(data, "base64");

      fs.writeFileSync(outPath, buffer);
      fs.writeFileSync(artPath, buffer);
      console.log(`Captured: ${fileName}`);
    }

    if (p.slug === "landing") {
      // Capture alur section
      await sendCommand(ws, "Runtime.evaluate", {
        expression: "document.querySelector('#alur')?.scrollIntoView({ behavior: 'instant' })",
      });
      await new Promise((r) => setTimeout(r, 600));
      const { data: alurData } = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(screenshotDir, "landing-alur-desktop.png"), Buffer.from(alurData, "base64"));
      fs.writeFileSync(path.join(artifactDir, "landing-alur-desktop.png"), Buffer.from(alurData, "base64"));
      console.log("Captured: landing-alur-desktop.png");

      // Capture ekosistem section
      await sendCommand(ws, "Runtime.evaluate", {
        expression: "document.querySelector('#ekosistem')?.scrollIntoView({ behavior: 'instant' })",
      });
      await new Promise((r) => setTimeout(r, 600));
      const { data: ekoData } = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(screenshotDir, "landing-ekosistem-desktop.png"), Buffer.from(ekoData, "base64"));
      fs.writeFileSync(path.join(artifactDir, "landing-ekosistem-desktop.png"), Buffer.from(ekoData, "base64"));
      console.log("Captured: landing-ekosistem-desktop.png");

      // Capture nilai section
      await sendCommand(ws, "Runtime.evaluate", {
        expression: "document.querySelector('#nilai')?.scrollIntoView({ behavior: 'instant' })",
      });
      await new Promise((r) => setTimeout(r, 600));
      const { data: nilaiData } = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(screenshotDir, "landing-nilai-desktop.png"), Buffer.from(nilaiData, "base64"));
      fs.writeFileSync(path.join(artifactDir, "landing-nilai-desktop.png"), Buffer.from(nilaiData, "base64"));
      console.log("Captured: landing-nilai-desktop.png");
    }

    // Khusus Community: Uji klik tombol "+" mengambang untuk membuka floating compose card (AGENTS.md 7.6)
    if (p.slug === "community") {
      console.log("Menguji klik tombol floating compose '+'...");
      const clickResult = await sendCommand(ws, "Runtime.evaluate", {
        expression: `
          (() => {
            const btn = document.querySelector('#floating-compose-button');
            if (!btn) return { success: false, reason: "Tombol floating compose tidak ditemukan" };
            btn.click();
            return { success: true };
          })()
        `,
        returnByValue: true,
      });

      await new Promise((r) => setTimeout(r, 600));

      const cardResult = await sendCommand(ws, "Runtime.evaluate", {
        expression: `
          (() => {
            const card = document.querySelector('#floating-compose-card');
            return {
              isRendered: Boolean(card),
              hasTextarea: Boolean(card?.querySelector('textarea')),
              hasSubmitBtn: Boolean(card?.querySelector('button[type="submit"]'))
            };
          })()
        `,
        returnByValue: true,
      });
      console.log("Hasil uji klik floating compose card:", JSON.stringify(cardResult?.result?.value));
      if (cardResult?.result?.value?.isRendered) {
        console.log("[VERIFIED] Floating compose card berhasil terbuka nyata setelah tombol '+' diklik!");
        // Capture screenshot saat floating compose card terbuka
        const { data: composeData } = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
        const composeFileName = "community-floating-compose-open.png";
        fs.writeFileSync(path.join(screenshotDir, composeFileName), Buffer.from(composeData, "base64"));
        fs.writeFileSync(path.join(artifactDir, composeFileName), Buffer.from(composeData, "base64"));
        console.log(`Captured: ${composeFileName}`);
      }
    }

    // Khusus Admin: Tunggu sampai laporan selesai dimuat
    if (p.slug === "admin") {
      for (let i = 0; i < 25; i++) {
        await new Promise((r) => setTimeout(r, 200));
        const ready = await sendCommand(ws, "Runtime.evaluate", {
          expression: "Boolean(document.querySelector('#admin-reports-container') || document.querySelector('#admin-reports-empty'))",
          returnByValue: true,
        });
        if (ready?.result?.value) break;
      }
      await new Promise((r) => setTimeout(r, 500));
    }

    // Khusus Settings: Uji buka tab Privasi dan modal hapus akun 3 DB
    if (p.slug === "settings") {
      console.log("Menguji navigasi tab Privasi dan pembukaan modal hapus akun 3 DB...");
      await sendCommand(ws, "Page.navigate", { url: "http://localhost:3005/settings?action=delete" });
      await new Promise((r) => setTimeout(r, 1200));

      const { data: modalData } = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
      const modalFileName = "settings-delete-modal-open.png";
      fs.writeFileSync(path.join(screenshotDir, modalFileName), Buffer.from(modalData, "base64"));
      fs.writeFileSync(path.join(artifactDir, modalFileName), Buffer.from(modalData, "base64"));
      console.log(`Captured: ${modalFileName}`);
    }

    // Khusus Admin: Uji buka modal tindakan moderasi
    if (p.slug === "admin") {
      console.log("Menguji pembukaan modal tindakan moderasi admin...");
      await sendCommand(ws, "Page.navigate", { url: "http://localhost:3005/admin?modal=action" });
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 200));
        const hasModal = await sendCommand(ws, "Runtime.evaluate", {
          expression: "Boolean(document.querySelector('#modal-admin-action'))",
          returnByValue: true,
        });
        if (hasModal?.result?.value) break;
      }
      await new Promise((r) => setTimeout(r, 400));

      const { data: adminModalData } = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
      const adminModalFileName = "admin-moderation-modal-open.png";
      fs.writeFileSync(path.join(screenshotDir, adminModalFileName), Buffer.from(adminModalData, "base64"));
      fs.writeFileSync(path.join(artifactDir, adminModalFileName), Buffer.from(adminModalData, "base64"));
      console.log(`Captured: ${adminModalFileName}`);
    }
  }

  // Verifikasi prefers-reduced-motion
  console.log("Memverifikasi prefers-reduced-motion pada maskot...");
  await setCookie(null);
  await sendCommand(ws, "Page.navigate", { url: "http://localhost:3005/" });
  await new Promise((r) => setTimeout(r, 1000));
  await sendCommand(ws, "Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  const motionCheck = await sendCommand(ws, "Runtime.evaluate", {
    expression: `
      (() => {
        const el = document.querySelector('.animate-mascot-breathe');
        if (!el) return { found: false, error: "Element not found" };
        const comp = window.getComputedStyle(el);
        return {
          found: true,
          animation: comp.animation,
          animationName: comp.animationName
        };
      })()
    `,
    returnByValue: true,
  });
  console.log("Reduced motion evaluation result:", JSON.stringify(motionCheck?.result?.value));
  if (
    motionCheck?.result?.value?.animationName === "none" ||
    motionCheck?.result?.value?.animation?.includes("none")
  ) {
    console.log("[VERIFIED] prefers-reduced-motion: reduce mematikan animasi maskot (animationName: none)");
  } else {
    console.warn("[CHECK] Animation result:", motionCheck?.result?.value);
  }

  ws.close();
  console.log("All overhauled screenshots captured successfully!");
  process.exit(0);
}

capture().catch((err) => {
  console.error("Error in capture script:", err);
  process.exit(1);
});
