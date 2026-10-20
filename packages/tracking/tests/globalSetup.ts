import { execSync } from "child_process";

export default function globalSetup(): void {
  require("./env");
  execSync("npx prisma migrate reset --force --skip-seed --skip-generate", {
    cwd: __dirname + "/..",
    env: process.env,
    stdio: "inherit",
  });
}
