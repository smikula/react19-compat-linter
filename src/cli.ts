import { runLinter } from './runLinter';

export async function cli(args: string[]) {
    if (args.length === 0) {
        console.error('Error: Please provide the path to the modules list file');
        console.error('Usage: react19-compat-linter <modules-list.json>');
        process.exit(1);
    }

    const modulesListPath = args[0];

    try {
        const result = await runLinter(modulesListPath);

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

        process.exit(0);
    } catch (error) {
        console.error('Error running linter:', error);
        process.exit(1);
    }
}
