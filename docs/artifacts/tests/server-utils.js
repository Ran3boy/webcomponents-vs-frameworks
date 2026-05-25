import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function writeJson(file, data) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

export function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function directorySizeKb(dir) {
  let total = 0;
  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      if (entry.isFile() && /\.(js|css|html)$/.test(entry.name)) total += fs.statSync(full).size;
    }
  }
  walk(dir);
  return Number((total / 1024).toFixed(2));
}

export function startStaticServer(root, port) {
  const absoluteRoot = path.resolve(root);
  const server = http.createServer((request, response) => {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    const pathname = decodeURIComponent(url.pathname);
    const candidate = pathname === "/" ? "index.html" : pathname.slice(1);
    const filePath = path.resolve(absoluteRoot, candidate);
    const safePath = filePath.startsWith(absoluteRoot) ? filePath : path.join(absoluteRoot, "index.html");
    const finalPath = fs.existsSync(safePath) && fs.statSync(safePath).isFile() ? safePath : path.join(absoluteRoot, "index.html");
    const ext = path.extname(finalPath);
    response.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    response.end(fs.readFileSync(finalPath));
  });

  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

export function stopServer(server) {
  return new Promise((resolve) => server.close(resolve));
}
