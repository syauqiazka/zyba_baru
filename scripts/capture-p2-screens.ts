import fs from "fs";
import path from "path";
import { createToken } from "../src/lib/jwt";

const screenshotDir = "e:\\syauqi\\zyba_baru\\screenshots\\p2-dashboard";
const artifactDir =
  "C:\\Users\\user\\.gemini\\antigravity\\brain\\5d3a96b3-8079-4892-abbc-61555dec3330\\p2-dashboard";

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
  const token = await createToken({
    sub: "user-test-p2",
    userId: "user-test-p2",
    email: "syauqi@zyba.id",
    name: "Syauqi",
    role: "USER",
    onboardingCompleted: true,
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

  // Enable Network and set authentication cookie + header
  await sendCommand(ws, "Network.enable");
  await sendCommand(ws, "Network.setCookie", {
    name: "zyba_token",
    value: token,
    url: "http://localhost:3005",
    domain: "localhost",
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });
  await sendCommand(ws, "Network.setExtraHTTPHeaders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("Authentication credentials set successfully!");

  const pages = [
    { url: "http://localhost:3005/dashboard", slug: "dashboard" },
    { url: "http://localhost:3005/mood-check-in", slug: "mood-check-in" },
  ];

  const viewports = [
    { name: "375-mobile", width: 375, height: 667, mobile: true },
    { name: "768-tablet", width: 768, height: 1024, mobile: false },
    { name: "1280-desktop", width: 1280, height: 800, mobile: false },
  ];

  for (const p of pages) {
    console.log(`Navigating to ${p.url}...`);
    await sendCommand(ws, "Page.navigate", { url: p.url });
    
    // Tunggu hingga skeleton loading selesai dan konten nyata ter-render
    console.log("Waiting for content to render (clearing loading skeletons)...");
    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 400));
      const isLoaded = await sendCommand(ws, "Runtime.evaluate", {
        expression: "Boolean(document.querySelector('h1')) && !Boolean(document.querySelector('.animate-pulse'))",
        returnByValue: true,
      });
      if (isLoaded?.result?.value) {
        console.log(`Page ${p.slug} content fully rendered!`);
        break;
      }
    }

    for (const vp of viewports) {
      await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile,
      });

      await new Promise((r) => setTimeout(r, 800));

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
  console.log("All P2 dashboard and check-in screenshots captured!");
  process.exit(0);
}

capture().catch((err) => {
  console.error("Error in capture script:", err);
  process.exit(1);
});
