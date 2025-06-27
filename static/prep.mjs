import fs from "fs";
import { minify } from "terser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swPath = path.resolve(__dirname, "../public/sw.js");
const minPath = path.resolve(__dirname, "../public/sw.min.js");

if (fs.existsSync(swPath)) {
  let code = fs.readFileSync(swPath, "utf-8");

  // Replace placeholders with environment variables
  const replacements = {
    __API_KEY__: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    __AUTH_DOMAIN__: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    __PROJECT_ID__: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    __STORAGE_BUCKET__: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    __MESSAGING_SENDER_ID__: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    __APP_ID__: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    __MEASUREMENT_ID__: process.env.NEXT_PUBLIC_GA_ID,
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    if (!value) {
      console.warn(`Warning: Environment variable for ${placeholder} is missing.`);
    }
    const regex = new RegExp(placeholder, "g");
    code = code.replace(regex, value || "");
  }

  // Minify
  const result = await minify(code, {
    compress: true,
    mangle: true,
  });

  fs.writeFileSync(minPath, result.code);

  // Delete original sw.js
  fs.unlinkSync(swPath);
}

const staticDir = path.resolve(__dirname, "./");
fs.rmSync(staticDir, { recursive: true, force: true });
