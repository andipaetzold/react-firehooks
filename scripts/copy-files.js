const fs = require("fs");

const filesToCopy = ["README.md", "CHANGELOG.md", "package.json"];
for (const file of filesToCopy) {
    fs.copyFileSync(file, `lib/${file}`);
}

const modules = ["firestore", "storage"];
for (const module of modules) {
    const packageJson = {
        main: `../cjs/${module}/index.js`,
        module: `../esm/${module}/index.js`,
        types: `../types/${module}/index.d.ts`,
    };

    fs.mkdirSync(`lib/${module}`, { recursive: true });
    fs.writeFileSync(`lib/${module}/package.json`, JSON.stringify(packageJson, undefined, 4));
}
