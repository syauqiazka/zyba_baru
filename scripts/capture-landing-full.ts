import fs from "fs";
import path from "path";

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

  await sendCommand(ws, "Page.navigate", { url: "http://localhost:3005/" });
  await new Promise((r) => setTimeout(r, 1500));

  await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Capture full page screenshot
  const { data } = await sendCommand(ws, "Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
  });

  const outPath = path.join("screenshots/overhaul", "landing-full-page.png");
  fs.writeFileSync(outPath, Buffer.from(data, "base64"));
  console.log("Full page captured:", outPath);
  ws.close();
}

run();
