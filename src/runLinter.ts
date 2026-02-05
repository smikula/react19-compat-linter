import { ESLint } from 'eslint';
import * as path from 'path';

export async function runLinter(modulesList: string) {
    const eslint = new ESLint({
        overrideConfigFile: path.resolve(__dirname, './eslint.config.js'),
        ignorePatterns: ['!**/node_modules/'],
        concurrency: 'auto',
    });

    const allResults = await eslint.lintFiles(modulesList);

    // Filter for results containing the react19-compat-linter/no-restricted-imports rule violation
    const results = allResults
        .map(result => ({
            ...result,
            messages: result.messages.filter(
                msg => msg.ruleId === 'react19-compat-linter/no-restricted-imports'
            ),
        }))
        .filter(result => result.messages.length > 0);

    console.log(`Found ${results.length} files with violations:\n`);
    results.forEach(result => {
        console.log(`${result.filePath}:`);
        result.messages.forEach(msg => {
            console.log(`  ${msg.line}:${msg.column} - ${msg.message}`);
        });
        console.log('');
    });
}
