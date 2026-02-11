import { ESLint } from 'eslint';
import * as path from 'path';
import { readFile } from 'fs/promises';
import { extractPackageName } from './utils/extractPackageName';
import { getPackageVersion } from './utils/getPackageVersion';
import type { LinterFileResult, LinterPackageResult, LinterResult } from './types';

interface PackageMapEntry {
    packageName: string;
    version: string;
    files: LinterFileResult[];
}

export async function runLinter(modulesListPath: string): Promise<LinterResult> {
    const modulesListText = await readFile(modulesListPath, 'utf-8');
    const modulesList: string[] = JSON.parse(modulesListText);

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

    const files: LinterFileResult[] = results.map(result => ({
        filePath: result.filePath,
        violations: result.messages.map(msg => {
            const { importName, moduleName } = parseViolationMessage(msg.message);
            return {
                line: msg.line,
                column: msg.column,
                message: msg.message,
                importName,
                moduleName,
            };
        }),
    }));

    // Group files by package and version
    const packageMap = new Map<string, PackageMapEntry>();
    for (const file of files) {
        const packageName = extractPackageName(file.filePath);
        const version = await getPackageVersion(file.filePath);
        const key = `${packageName}@${version}`;

        if (!packageMap.has(key)) {
            packageMap.set(key, {
                packageName,
                version,
                files: [],
            });
        }
        packageMap.get(key)!.files.push(file);
    }

    // Convert to array of package results
    const packages: LinterPackageResult[] = Array.from(packageMap.values());

    // Sort packages by name for consistent output
    packages.sort((a, b) => a.packageName.localeCompare(b.packageName));

    return {
        packages,
    };
}

function parseViolationMessage(message: string): { importName: string; moduleName: string } {
    // This regex must match the error messages in no-restricted-imports.ts
    const match = message.match(
        /(?:Importing|Accessing|Destructuring) (.+) from "(.+)" is not allowed\./
    );
    if (!match) {
        throw new Error(`Unable to parse violation message: ${message}`);
    }
    return {
        importName: match[1],
        moduleName: match[2],
    };
}
