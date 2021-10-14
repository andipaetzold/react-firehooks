const fs = require("fs");

const modules = ["firestore", "storage"];
for (const module of modules) {
    const packageJson = {
        main: `../lib/cjs/${module}/index.js`,
        module: `../lib/esm/${module}/index.js`,
        types: `../lib/types/${module}/index.d.ts`,
    };

    fs.mkdirSync(module);
    fs.writeFileSync(`${module}/package.json`, JSON.stringify(packageJson, undefined, 4));
}
