import { createServer, IncomingMessage, ServerResponse } from "node:http";

const PORT = 3000;

const ALLOWED_ORIGINS = new Set([
  "http://localhost:8080",
  "http://127.0.0.1:8080",
]);

function requestHandler(req: IncomingMessage, res: ServerResponse) {
  const method = req.method ?? "GET";
  const url = req.url ?? "/";
  console.log(method, url, "origin:", req.headers.origin ?? "(none)");

  if (url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello, World!");
    return;
  }

  if (method === "OPTIONS") {
    res.writeHead(200, {
      "access-control-allow-origin": "http://127.0.0.1:8080",
      "access-control-allow-headers": "Content-Type",
      "acces-cool-allow-methods": "GET, POST",
    });
    res.end();
    return;
  }

  if (url === "/api" && method === "POST") {
    res.writeHead(200, {
      "access-control-allow-origin": "http://127.0.0.1:8080",
      "Content-Type": "text/plain",
    });
    res.end("Hello, from API");
    return;
  }

  if (url === "/api" && method === "POST") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello, from API" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
}

function main() {
  const server = createServer(requestHandler);

  server.on("error", (e: NodeJS.ErrnoException) => {
    console.error(e);
  });

  server.listen(PORT, () => {
    console.log("----------------------------------------");
    console.log("Server running on http://localhost:" + PORT);
    console.log("CORS allowed origins: " + [...ALLOWED_ORIGINS].join(", "));
  });
}

main();
