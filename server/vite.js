import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function log(message) {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  console.log(`\x1b[90m${formattedTime}\x1b[0m \x1b[36m[express]\x1b[0m ${message}`);
}

export async function setupVite(app, server) {
  const vite = await (await import("vite")).createServer({
    server: { middlewareMode: true },
    appType: "custom",
    root: path.resolve(__dirname, "../"),
  });

  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);
}

export function serveStatic(app) {
  const distPath = path.resolve(__dirname, "../dist");
  const htmlPath = path.resolve(distPath, "index.html");
  const htmlContent = fs.readFileSync(htmlPath, "utf-8");

  app.use("/assets", express.static(path.resolve(distPath, "assets")));

  app.get("*", (_req, res) => {
    res.send(htmlContent);
  });
}