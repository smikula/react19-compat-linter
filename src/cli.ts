import { runLinter } from './runLinter';
import { LinterConfig } from './types';
import { readFile } from 'fs/promises';

export async function cli(args: string[]) {
    if (args.length === 0) {
        console.error('Error: Please provide the path to the modules list file');
        console.error('Usage: react19-compat-linter <modules-list.json> [config.json]');
        process.exit(1);
    }

    const modulesListPath = args[0];
    let config: LinterConfig | undefined = undefined;
    if (args.length > 1) {
        const configPath = args[1];
        try {
            const configText = await readFile(configPath, 'utf-8');
            config = JSON.parse(configText);
        } catch (err) {
            console.error('Error reading config file:', err);
            process.exit(1);
        }
    }

    try {
        const result = await runLinter(modulesListPath, config);

        console.log(`Found violations in ${result.packages.length} packages:\n`);
        result.packages.forEach(pkg => {
            console.log(`${pkg.packageName} (${pkg.files.length} files):`);
            pkg.files.forEach(file => {
                console.log(`  ${file.filePath}:`);
                file.violations.forEach(violation => {
                    console.log(`    ${violation.line}:${violation.column} - ${violation.message}`);
                });
            });
            console.log('');
        });
        if (result.isCompliant) {
            console.log(
                'Everything is compliant. All violations are within configured package exceptions.'
            );
        } else {
            console.log('There are violations outside configured package exceptions.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error running linter:', error);
        process.exit(1);
    }
}
