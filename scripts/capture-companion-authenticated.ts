import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { createToken } from "../src/lib/jwt";

const screenshotDir = path.resolve(__dirname, "../screenshots");
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

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

async function getOrSpawnChrome(): Promise<{ wsUrl: string; chromeProc?: any }> {
  try {
    const res = await fetch("http://127.0.0.1:9222/json/version");
    if (res.ok) {
      const data = await res.json();
      return { wsUrl: data.webSocketDebuggerUrl };
    }
  } catch {
    // Not running, spawn it
  }

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  console.log("Spawning headless Chrome on port 9222...");
  const chromeProc = spawn(chromePath, [
    "--headless=new",
    "--remote-debugging-port=9222",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ]);

  // Wait for port 9222 to be ready
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 500));
    try {
      const res = await fetch("http://127.0.0.1:9222/json/version");
      if (res.ok) {
        const data = await res.json();
        return { wsUrl: data.webSocketDebuggerUrl, chromeProc };
      }
    } catch {}
  }
  throw new Error("Gagal memulai Chrome CDP pada port 9222");
}

async function run() {
  console.log("=== Memulai Pengambilan Tangkapan Layar Otentikasi Companion ===");
  const { wsUrl, chromeProc } = await getOrSpawnChrome();

  const token = await createToken({
    sub: "user-test-companion",
    userId: "user-test-companion",
    email: "companion@zyba.id",
    name: "Zidan",
    role: "USER",
    onboardingCompleted: true,
  });

  // Create a new target page
  const newTargetRes = await fetch("http://127.0.0.1:9222/json/new?about:blank", { method: "PUT" });
  const targetData = await newTargetRes.json();
  const pageWsUrl = targetData.webSocketDebuggerUrl;

  const ws = new WebSocket(pageWsUrl);
  await new Promise((resolve) => (ws.onopen = () => resolve(true)));

  console.log("Setting up authentication cookie & Network domain...");
  await sendCommand(ws, "Network.enable");
  await sendCommand(ws, "Network.setCookie", {
    name: "zyba_token",
    value: token,
    url: "http://localhost:30000",
    domain: "localhost",
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });

  console.log("Navigating to http://localhost:30000/companion...");
  await sendCommand(ws, "Page.enable");
  await sendCommand(ws, "Page.navigate", { url: "http://localhost:30000/companion" });

  // Wait 3.5 seconds for React hydration and font rendering
  await new Promise((r) => setTimeout(r, 3500));

  const viewports = [
    { name: "companion-mobile-375.png", width: 375, height: 812, mobile: true },
    { name: "companion-tablet-768.png", width: 768, height: 1024, mobile: false },
    { name: "companion-desktop-1280.png", width: 1280, height: 800, mobile: false },
  ];

  for (const vp of viewports) {
    console.log(`Setting viewport: ${vp.width}x${vp.height} (${vp.name})...`);
    await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile,
    });

    await new Promise((r) => setTimeout(r, 600));

    const { data } = await sendCommand(ws, "Page.captureScreenshot", {
      format: "png",
    });

    const filePath = path.join(screenshotDir, vp.name);
    fs.writeFileSync(filePath, Buffer.from(data, "base64"));
    console.log(`✔ Berhasil disimpan: ${filePath} (${Math.round(data.length / 1024)} KB)`);
  }

  // Cleanup
  ws.close();
  if (chromeProc) {
    chromeProc.kill();
  }

  console.log("=== Selesai mengambil seluruh screenshot 3 viewport! ===");
}

run().catch((err) => {
  console.error("Gagal capture:", err);
  process.exit(1);
});
