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
  const token = await createToken({
    sub: "user-test-completed",
    userId: "user-test-completed",
    email: "syauqi@zyba.id",
    name: "Syauqi",
    role: "USER",
    onboardingCompleted: true,
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

  // Set auth cookie
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

  console.log("Navigating to http://localhost:3005/activity...");
  await sendCommand(ws, "Page.navigate", { url: "http://localhost:3005/activity" });
  await new Promise((r) => setTimeout(r, 2000));

  const viewports = [
    { name: "activity-375-mobile", width: 375, height: 812, mobile: true },
    { name: "activity-768-tablet", width: 768, height: 1024, mobile: false },
    { name: "activity-1280-desktop", width: 1280, height: 850, mobile: false },
  ];

  for (const vp of viewports) {
    console.log(`Capturing ${vp.name} (${vp.width}x${vp.height})...`);
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

    const localFile = path.join(screenshotDir, `${vp.name}.png`);
    const artifactFile = path.join(artifactDir, `${vp.name}.png`);

    fs.writeFileSync(localFile, Buffer.from(data, "base64"));
    fs.writeFileSync(artifactFile, Buffer.from(data, "base64"));

    console.log(`Saved screenshot: ${localFile}`);
  }

  // Also capture scrolled-down mobile state to prove bottom clearance above BottomSanctuary
  console.log("Capturing activity-375-mobile-bottom-scrolled...");
  await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
    width: 375,
    height: 812,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await sendCommand(ws, "Runtime.evaluate", {
    expression: "window.scrollTo(0, document.body.scrollHeight);",
  });
  await new Promise((r) => setTimeout(r, 800));

  const { data: bottomData } = await sendCommand(ws, "Page.captureScreenshot", {
    format: "png",
  });
  const bottomLocal = path.join(screenshotDir, "activity-375-mobile-bottom-scrolled.png");
  const bottomArtifact = path.join(artifactDir, "activity-375-mobile-bottom-scrolled.png");
  fs.writeFileSync(bottomLocal, Buffer.from(bottomData, "base64"));
  fs.writeFileSync(bottomArtifact, Buffer.from(bottomData, "base64"));
  console.log(`Saved screenshot: ${bottomLocal}`);

  ws.close();
  console.log("All activity screenshots captured successfully!");
}

run();
