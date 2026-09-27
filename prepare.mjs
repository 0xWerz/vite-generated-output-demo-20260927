import fs from "node:fs";

const output = new URL("./generated", import.meta.url);
fs.rmSync(output, { recursive: true, force: true });
fs.writeFileSync(output, "ARC_PULL_STARTUP_CANARY=confirmed\n", { mode: 0o644 });
