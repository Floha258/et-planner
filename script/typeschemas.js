const { compileFromFile } = require('json-schema-to-typescript');
const fs = require('fs');

try {
    const files = fs.readdirSync('./types');
    const filesProcessed = [];

    files.forEach((file) => {
        if (file.match('.json$', 'i')) {
            const fileName = file.replace(/.json$/, '');
            console.log(fileName);
            filesProcessed.push(fileName);
            compileFromFile(`./types/${fileName}.json`, {cwd:'./types'}).then(ts => fs.writeFileSync(`./types/${fileName}.d.ts`, ts));
        }
    });

    const index = [];
    filesProcessed.forEach((file) => {
        index.push(`export * from './${file}';`);
    });

} catch (err) {
    console.log('no schemas');
}
