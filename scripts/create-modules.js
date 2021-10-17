const fs = require("fs");

const modules = ["auth", "database", "firestore", "messaging", "storage"];
for (const module of modules) {
    const packageJson = {
        main: `../lib/cjs/${module}/index.js`,
        module: `../lib/esm/${module}/index.js`,
        types: `../lib/types/${module}/index.d.ts`,
        sideEffects: false,
    };

    if (!fs.existsSync(module)) {
        fs.mkdirSync(module);
    }
    fs.writeFileSync(`${module}/package.json`, JSON.stringify(packageJson, undefined, 4));
}
