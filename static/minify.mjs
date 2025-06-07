import fs from "fs";
import { minify } from "terser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swPath = path.resolve(__dirname, "../public/sw.js");
const minPath = path.resolve(__dirname, "../public/sw.min.js");

if (fs.existsSync(swPath)) {
  const code = fs.readFileSync(swPath, "utf-8");
  const result = await minify(code, {
    compress: true,
    mangle: true,
  });

  fs.writeFileSync(minPath, result.code);
  fs.unlinkSync(swPath);
}

// Remove itself
const staticDir = path.resolve(__dirname, "./");
fs.rmSync(staticDir, { recursive: true, force: true });
