const fs = require("fs");
const path = require("path");

const screenshotDir = "e:\\syauqi\\zyba_baru\\screenshots\\p1-auth";
const artifactDir = "C:\\Users\\user\\.gemini\\antigravity\\brain\\5d3a96b3-8079-4892-abbc-61555dec3330\\p1-auth";

fs.mkdirSync(screenshotDir, { recursive: true });
fs.mkdirSync(artifactDir, { recursive: true });

async function sendCommand(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (msg) => {
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
  const tabsRes = await fetch("http://127.0.0.1:9222/json");
  const tabs = await tabsRes.json();
  const pageTab = tabs.find((t) => t.type === "page");
  if (!pageTab) {
    console.error("Tab not found");
    process.exit(1);
  }

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise((resolve) => (ws.onopen = resolve));

  const pages = [
    { url: "http://localhost:3005/onboarding", slug: "onboarding" },
    { url: "http://localhost:3005/login", slug: "login" },
    { url: "http://localhost:3005/guidebook", slug: "guidebook" },
    { url: "http://localhost:3005/assessment", slug: "assessment" },
  ];

  const viewports = [
    { name: "375-mobile", width: 375, height: 667, mobile: true },
    { name: "768-tablet", width: 768, height: 1024, mobile: false },
    { name: "1280-desktop", width: 1280, height: 800, mobile: false },
  ];

  for (const p of pages) {
    console.log(`Navigating to ${p.url}...`);
    await sendCommand(ws, "Page.navigate", { url: p.url });
    await new Promise((r) => setTimeout(r, 800));

    for (const vp of viewports) {
      await sendCommand(ws, "Emulation.setDeviceMetricsOverride", {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile,
      });

      await new Promise((r) => setTimeout(r, 400));

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
  console.log("All P1 page screenshots captured!");
  process.exit(0);
}

capture().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

