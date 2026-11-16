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

async function run() {
  const tabsRes = await fetch("http://127.0.0.1:9225/json");
  const tabs = (await tabsRes.json()) as any[];
  const pageTab = tabs.find((t) => t.type === "page");
  if (!pageTab) {
    console.error("Tab not found");
    process.exit(1);
  }

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise((resolve) => (ws.onopen = () => resolve(true)));

  // Use user-e2e-flow-id who has a real check-in today from test-e2e-data-flow.ts
  const token = await createToken({
    sub: "user-e2e-flow-id",
    userId: "user-e2e-flow-id",
    email: "user-e2e-flow@zyba.id",
    name: "Test Flow User",
    role: "USER",
    onboardingCompleted: true,
  });

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

  // 1. CAPTURE /mood-check-in AFTER CHECK-IN (proving alreadyCheckedIn = true upon reload)
  console.log("Navigating to http://localhost:3005/mood-check-in (checking completed state)...");
  await sendCommand(ws, "Page.navigate", { url: "http://localhost:3005/mood-check-in" });
  await new Promise((r) => setTimeout(r, 2500));

  const checkinViewports = [
    { name: "checkin-completed-375-mobile", width: 375, height: 812, mobile: true },
    { name: "checkin-completed-768-tablet", width: 768, height: 1024, mobile: false },
    { name: "checkin-completed-1280-desktop", width: 1280, height: 850, mobile: false },
  ];

  for (const vp of checkinViewports) {
    console.log(`Capturing ${vp.name}...`);
    await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile,
    });
    await new Promise((r) => setTimeout(r, 600));
    const { data } = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(screenshotDir, `${vp.name}.png`), Buffer.from(data, "base64"));
    fs.writeFileSync(path.join(artifactDir, `${vp.name}.png`), Buffer.from(data, "base64"));
  }

  // 2. CAPTURE /wellness-journey (proving data masuk ke Ruang Sehat)
  console.log("Navigating to http://localhost:3005/wellness-journey...");
  await sendCommand(ws, "Page.navigate", { url: "http://localhost:3005/wellness-journey" });
  await new Promise((r) => setTimeout(r, 2500));

  const wellnessViewports = [
    { name: "ruangsehat-realdata-375-mobile", width: 375, height: 812, mobile: true },
    { name: "ruangsehat-realdata-768-tablet", width: 768, height: 1024, mobile: false },
    { name: "ruangsehat-realdata-1280-desktop", width: 1280, height: 850, mobile: false },
  ];

  for (const vp of wellnessViewports) {
    console.log(`Capturing ${vp.name}...`);
    await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile,
    });
    await new Promise((r) => setTimeout(r, 600));
    const { data } = await sendCommand(ws, "Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(screenshotDir, `${vp.name}.png`), Buffer.from(data, "base64"));
    fs.writeFileSync(path.join(artifactDir, `${vp.name}.png`), Buffer.from(data, "base64"));
  }

  ws.close();
  console.log("All flow verification screenshots captured successfully!");
}

run();
