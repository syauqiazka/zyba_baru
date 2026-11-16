import fs from "fs";
import path from "path";

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

  console.log("Navigating to http://localhost:3005/...");
  await sendCommand(ws, "Page.navigate", { url: "http://localhost:3005/" });
  await new Promise((r) => setTimeout(r, 2000));

  const viewports = [
    { name: "landing-hero-375-mobile", width: 375, height: 812, mobile: true },
    { name: "landing-hero-768-tablet", width: 768, height: 1024, mobile: false },
    { name: "landing-hero-1280-desktop", width: 1280, height: 850, mobile: false },
  ];

  for (const vp of viewports) {
    console.log(`Capturing ${vp.name} (${vp.width}x${vp.height})...`);
    await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile,
    });

    await new Promise((r) => setTimeout(r, 1000));

    const { data } = await sendCommand(ws, "Page.captureScreenshot", {
      format: "png",
    });

    const localFile = path.join(screenshotDir, `${vp.name}.png`);
    const artifactFile = path.join(artifactDir, `${vp.name}.png`);

    fs.writeFileSync(localFile, Buffer.from(data, "base64"));
    fs.writeFileSync(artifactFile, Buffer.from(data, "base64"));

    console.log(`Saved screenshot: ${localFile}`);
  }

  ws.close();
  console.log("All screenshots captured successfully!");
}

run();
