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
    role: "USER",
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

  const tabsRes = await fetch("http://127.0.0.1:9222/json");
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
        expression: "Boolean(document.querySelector('h1') || document.querySelector('h2')) && !Boolean(document.querySelector('.animate-pulse:not(svg)'))",
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
  }

  ws.close();
  console.log("All overhauled screenshots captured successfully!");
  process.exit(0);
}

capture().catch((err) => {
  console.error("Error in capture script:", err);
  process.exit(1);
});
