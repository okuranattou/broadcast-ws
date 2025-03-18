// WebSocket 中継サーバ（debounce付き）
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("✅ WebSocket Broadcast Server with Debounce running on ws://localhost:8080");
});

let latestPayload = null;
let debounceTimer = null;
const DEBOUNCE_MS = 200;

wss.on("connection", (ws) => {
  console.log("🔌 New client connected");

  ws.on("message", (message) => {
    try {
      latestPayload = message.toString();
      console.log("message receive");

      if (!debounceTimer) {
        debounceTimer = setTimeout(() => {
          broadcast(latestPayload);
          debounceTimer = null;
        }, DEBOUNCE_MS);
      }
    } catch (e) {
      console.error("❌ Error parsing message:", e.message);
    }
  });

  ws.on("close", () => {
    console.log("❎ Client disconnected");
  });

  ws.on("error", (err) => {
    console.error("⚠ WebSocket error:", err.message);
  });
});

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

