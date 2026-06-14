const { writeFileSync } = require("fs");
writeFileSync("dist/cjs/package.json", JSON.stringify({ type: "commonjs" }));
writeFileSync("dist/esm/package.json", JSON.stringify({ type: "module" }));