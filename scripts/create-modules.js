import fs from "fs";

const modules = ["app-check", "auth", "database", "firestore", "messaging", "storage"];
for (const module of modules) {
    const packageJson = {
        main: `../lib/${module}/index.js`,
        types: `../lib/${module}/index.d.ts`,
        sideEffects: false,
    };

    if (!fs.existsSync(module)) {
        fs.mkdirSync(module);
    }
    fs.writeFileSync(`${module}/package.json`, JSON.stringify(packageJson, undefined, 4));
}
