// A tiny guestbook web app. No libraries needed: only what comes with Node.js.
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

const PORT = 3000;
const TITLE = process.env.TITLE || "Guestbook";
const COLOR = process.env.COLOR || "#2F5F9E";
const DATA_FILE = path.join(__dirname, "data", "messages.json");

// Messages are saved in a file, so we can see where data lives in Docker
function readMessages() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveMessages(messages) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
}

function sendJson(res, data, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  // The web page
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(fs.readFileSync(path.join(__dirname, "index.html")));

  // Read all messages, plus the settings and the container's name
  } else if (req.method === "GET" && req.url === "/api/messages") {
    sendJson(res, {
      title: TITLE,
      color: COLOR,
      servedBy: os.hostname(),
      messages: readMessages(),
    });

  // Add a new message
  } else if (req.method === "POST" && req.url === "/api/messages") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      let input = {};
      try {
        input = JSON.parse(body);
      } catch {}
      const name = String(input.name || "").trim().slice(0, 40);
      const text = String(input.text || "").trim().slice(0, 280);
      if (!name || !text) {
        return sendJson(res, { error: "Name and message are required" }, 400);
      }
      const messages = readMessages();
      messages.push({ name, text, time: new Date().toISOString() });
      saveMessages(messages);
      console.log(`New message from ${name}: ${text}`);
      sendJson(res, { ok: true }, 201);
    });

  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`${TITLE} is running on port ${PORT}`);
});

// Stop right away when Docker asks (docker stop) or when you press Ctrl+C
process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
