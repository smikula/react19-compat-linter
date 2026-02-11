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
    const modulesList = await loadModulesList(modulesListPath);
    const eslint = createLinter();
    const allResults = await eslint.lintFiles(modulesList);
    const filteredResults = filterViolationResults(allResults);
    const files = buildFileResults(filteredResults);
    const packages = await groupFilesByPackage(files);

    return { packages };
}

async function loadModulesList(modulesListPath: string): Promise<string[]> {
    const modulesListText = await readFile(modulesListPath, 'utf-8');
    return JSON.parse(modulesListText);
}

function createLinter(): ESLint {
    return new ESLint({
        overrideConfigFile: path.resolve(__dirname, './eslint.config.js'),
        ignorePatterns: ['!**/node_modules/'],
        concurrency: 'auto',
    });
}

function filterViolationResults(allResults: ESLint.LintResult[]): ESLint.LintResult[] {
    // Filter to only violations related to our no-restricted-imports rule
    return allResults
        .map(result => ({
            ...result,
            messages: result.messages.filter(
                msg => msg.ruleId === 'react19-compat-linter/no-restricted-imports'
            ),
        }))
        .filter(result => result.messages.length > 0);
}

function buildFileResults(results: ESLint.LintResult[]): LinterFileResult[] {
    return results.map(result => ({
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
}

async function groupFilesByPackage(files: LinterFileResult[]): Promise<LinterPackageResult[]> {
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

    const packages = Array.from(packageMap.values());
    packages.sort((a, b) => a.packageName.localeCompare(b.packageName));

    return packages;
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
