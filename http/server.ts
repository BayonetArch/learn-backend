import { readFile } from "fs";
import { createServer, IncomingMessage, ServerResponse } from "node:http";

const PORT = 3000;

type requestJson = {
  name: string;
  message: string;
};

function sendFavicon(res: ServerResponse) {
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
    console.log("Sent favicon.ico");
  });
}

/* returns null on error */
function handlePostRequest(req: IncomingMessage, res: ServerResponse) {
  let chunks: Buffer[] = [];
  if (!req.headers["content-type"]?.includes("application/json")) {
    res.writeHead(400);
    res.end("Invalid Content-Type");
    return null;
  }

  req.on("data", (chunk: Buffer) => {
    chunks.push(chunk);
  });

  req.on("end", () => {
    const body = Buffer.concat(chunks).toString();

    let parsedData: unknown;
    try {
      parsedData = JSON.parse(body);
    } catch {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Invalid JSON");
      return null;
    }
    if (parsedData === null) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          ok: false,
          error: "Invalid JSON - null is not allowed",
        }),
      );
      return null;
    }

    parsedData;
    console.log(parsedData);

    const data = parsedData as Record<string, unknown>;

    if (typeof data.name !== "string" || typeof data.message !== "string") {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          ok: false,
          error: "name and message are required fields in JSON",
        }),
      );
      return;
    }

    console.log("Got Name <-", data.name);
    console.log("Got Message <-", data.message);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, data }));
    console.log("Sent ->", data);
  });
}

function requestHandler(req: IncomingMessage, res: ServerResponse) {
  console.log(req.method, req.url);

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
}

function main() {
  const server = createServer(requestHandler);

  server.on("error", (e: NodeJS.ErrnoException) => {
    if (e.code === "EADDRINUSE") {
      console.error("Port " + PORT + " is already in use");
      console.log("trying another port..");
      server.listen(PORT + 1, () => {
        console.log("Listening on http://localhost:" + (PORT + 1));
      });
    }
  });

  server.listen(PORT, () => {
    console.log("----------------------------------------");
    console.log("Server running on http://localhost:" + PORT);
  });
}

main();
