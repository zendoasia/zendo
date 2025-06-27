import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = path.resolve(__dirname, "./");
fs.rmSync(staticDir, { recursive: true, force: true });
