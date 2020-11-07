const Bundler = require('parcel-bundler');
const Path = require('path');

const entryFiles = Path.join(__dirname, './index.html');

(async function() {
    await (new Bundler(entryFiles, {
        outDir: './docs',
        outFile: './index.html',
    })).bundle();
})();