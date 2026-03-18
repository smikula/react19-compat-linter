const path = require('path');
const webpack = require('webpack');
const { DependencyModuleListPlugin } = require('../lib/index');
const { runLinter } = require('../lib/runLinter');

(async function main() {
    console.log('Running webpack to generate module list...');
    const modulesListPath = path.resolve(__dirname, 'dist', 'modulesList.json');
    await runWebpack(modulesListPath);

    console.log('Running linter...');
    const result = await runLinter(modulesListPath);
    console.log(JSON.stringify(result, null, 2));
})();

function runWebpack(modulesListPath) {
    return new Promise((resolve, reject) => {
        const config = {
            mode: 'production',
            entry: path.resolve(__dirname, 'index.js'),
            output: {
                path: path.resolve(__dirname, 'dist'),
                filename: 'bundle.js',
            },
            plugins: [new DependencyModuleListPlugin(modulesListPath)],
        };

        webpack(config, (err, stats) => {
            if (err) {
                reject(err);
            } else {
                if (stats.hasErrors()) {
                    console.warn(
                        '[webpack] Completed with errors:\n' + stats.toString('errors-only')
                    );
                }
                resolve(stats);
            }
        });
    });
}
