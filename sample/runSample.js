const path = require('path');
const { runLinter } = require('../lib/runLinter');

async function main() {
    const modulesListPath = path.resolve(__dirname, 'modulesList.json');
    const result = await runLinter(modulesListPath);
    console.log(JSON.stringify(result, null, 2));
}

main();
