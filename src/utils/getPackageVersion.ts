import { readFile } from 'fs/promises';
import { getPackageJsonPath } from './getPackageJsonPath';

export async function getPackageVersion(filePath: string): Promise<string> {
    const packageJsonPath = getPackageJsonPath(filePath);
    const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    if (!packageJson.version) {
        throw new Error(`No version field found in package.json at ${packageJsonPath}`);
    }

    return packageJson.version;
}
