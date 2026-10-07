import { readFile } from "fs";
import { createServer } from "http";

const PORT = 3000;

function sendFavicon(res) {
  readFile("./favicon.ico", (e, data) => {
    if (e) {
      console.error(
        "Following error occured while retrieving the icon file\n",
        e,
      );
      if (e.code === "ENOENT") {
        res.writeHead(404);
        res.end(`icon not found`);
      } else {
        res.writeHead(500);
        res.end(`Internal Server Error: ${e.message}`);
      }
      return;
    }

    res.writeHead(200, { "Content-Type": "image/x-icon" });
    res.end(data);
    console.log("Sent the favicon.ico file");
  });
}

function handlePostRequest(req, res) {
  let chunks = [];
  if (!req.headers["content-type"].includes("application/json")) {
    res.writeHead(400);
    res.end("Invalid Content-Type");
    return null;
  }

  req.on("data", (chunk) => {
    chunks.push(chunk);
  });

  req.on("end", () => {
    chunks = Buffer.concat(chunks).toString();

    let parsed;
    try {
      parsed = JSON.parse(chunks);
    } catch {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Invalid JSON");
      return null;
    }
    if (parsed === null) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          ok: false,
          error: "Invalid JSON - null is not allowed",
        }),
      );
      return null;
    }

    console.log("Got Name <-", parsed.name);
    console.log("Got Message <-", parsed.message);

    if (parsed.name === undefined || parsed.message === undefined) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          ok: false,
          error: "name and message are required field in JSON",
        }),
      );
      return null;
    }

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, data: parsed }));
    console.log("Sent ->", parsed);
  });
}

const server = createServer((req, res) => {
  console.log("request", req.url, req.method);

  if (req.url === "/" && req.method === "GET") {
    res.end("Hello, World!");
  } else if (req.url === "/favicon.ico" && req.method === "GET") {
    sendFavicon(res);
  } else if (req.url === "/data" && req.method === "POST") {
    if (handlePostRequest(req, res) === null) return;
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error("Port " + PORT + " is already in use");
    console.log("trying another port..");
    portError = true;
    server.listen(PORT + 1, () => {
      console.log("Listening on http://localhost:" + (PORT + 1));
    });
  }
});

server.listen(PORT, () => {
  console.log("---------------------------------------------");
  console.log("Listening on http://localhost:" + PORT);
});
