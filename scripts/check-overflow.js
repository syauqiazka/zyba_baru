async function run() {
  const tabsRes = await fetch("http://127.0.0.1:9222/json");
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.url.includes("dashboard"));
  if (!pageTab) {
    console.log("No page tab found", tabs);
    return;
  }
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
      id: 1,
      method: "Runtime.evaluate",
      params: {
        expression: `(() => {
          try {
            const results = [];
            const width = window.innerWidth;
            document.querySelectorAll('*').forEach(el => {
              const rect = el.getBoundingClientRect();
              if (rect.right > width + 1) {
                results.push({ tag: el.tagName, class: el.className ? el.className.toString() : '', right: rect.right, width: rect.width });
              }
            });
            return {
              innerWidth: width,
              clientWidth: document.documentElement.clientWidth,
              scrollWidth: document.documentElement.scrollWidth,
              overflowCount: results.length,
              overflowElements: results.slice(0, 10)
            };
          } catch(err) {
            return { error: err.message, stack: err.stack };
          }
        })()`,
        returnByValue: true
      }
    }));
  };
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.id === 1) {
      const val = data.result?.result?.value ?? data.result;
      console.log("RESULT:", JSON.stringify(val, null, 2));
      process.exit(0);
    }
  };
}
run().catch(console.error);
