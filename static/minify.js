const fs = require("fs");
const Terser = require("terser");

(async () => {
  const swPath = path.resolve(__dirname, "../public/sw.js");
  const minPath = path.resolve(__dirname, "../public/sw.min.js");

  const code = fs.readFileSync(swPath, "utf-8");
  const result = await Terser.minify(code, {
    compress: true,
    mangle: true,
  });

  fs.writeFileSync(minPath, result.code);
  fs.unlinkSync(swPath);

  // Remove itself
  const staticDir = path.resolve(__dirname, "./static");
  if (fs.existsSync(staticDir)) {
    fs.rmSync(staticDir, { recursive: true, force: true });
  }
})();
