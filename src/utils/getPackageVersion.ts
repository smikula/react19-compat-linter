import { readFile } from 'fs/promises';

const versionCache = new Map<string, string>();

export async function getPackageVersion(packageJsonPath: string): Promise<string> {
    const cachedVersion = versionCache.get(packageJsonPath);
    if (cachedVersion !== undefined) {
        return cachedVersion;
    }

    const packageJsonContent = await readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    if (!packageJson.version) {
        throw new Error(`No version field found in package.json at ${packageJsonPath}`);
    }

    versionCache.set(packageJsonPath, packageJson.version);
    return packageJson.version;
}
