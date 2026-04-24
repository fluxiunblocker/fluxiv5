import express from "express";
import { createServer } from "node:http";
import { publicPath } from "ultraviolet-static";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { join } from "node:path";
import { hostname } from "node:os";
import wisp from "wisp-server-node";

const app = express();

app.get(["/favicon.webp", "/favicon.ico"], (req, res) => {
  res.sendFile(join(process.cwd(), "favicon (1).webp"));
});

// Serve local UV overrides first (config), then package assets.
app.use("/uv/", express.static(join(process.cwd(), "public", "uv")));
app.use("/uv/", express.static(uvPath));

// Serve epoxy transport
app.use("/epoxy/", express.static(epoxyPath));

// Serve baremux worker
app.use("/baremux/", express.static(baremuxPath));

// Serve our custom Fluxi frontend (public/) — takes priority
app.use(express.static("public"));

// Fallback to ultraviolet-static's built-in pages (404 etc)
app.use(express.static(publicPath));

const server = createServer();

server.on("request", (req, res) => {
  // Required headers for SharedArrayBuffer / service workers
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  app(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.end();
  }
});

let port = parseInt(process.env.PORT || "8080");
if (isNaN(port)) port = 8080;

server.listen(port, "0.0.0.0", () => {
  const addr = server.address();
  console.log("\n  ███████╗██╗     ██╗   ██╗██╗  ██╗██╗   ██╗███████╗");
  console.log("  ██╔════╝██║     ██║   ██║╚██╗██╔╝██║   ██║╚════██║");
  console.log("  █████╗  ██║     ██║   ██║ ╚███╔╝ ██║   ██║    ██╔╝");
  console.log("  ██╔══╝  ██║     ██║   ██║ ██╔██╗ ██║   ██║   ██╔╝ ");
  console.log("  ██║     ███████╗╚██████╔╝██╔╝ ██╗╚██████╔╝  ██║   ");
  console.log("  ╚═╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝   ╚═╝   V5\n");
  console.log(`  🟢 Server running at:`);
  console.log(`     http://localhost:${addr.port}`);
  console.log(`     http://${hostname()}:${addr.port}\n`);
});
