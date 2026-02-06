import * as path from 'path';

export function extractPackageName(filePath: string): string {
    const parts = filePath.split(path.sep);
    const nodeModulesIndex = parts.lastIndexOf('node_modules');

    if (nodeModulesIndex === -1) {
        throw new Error(`Path does not contain node_modules: ${filePath}`);
    }

    // Handle scoped packages (@scope/package-name)
    const packageParts = parts.slice(nodeModulesIndex + 1);
    if (packageParts[0].startsWith('@')) {
        return packageParts.slice(0, 2).join('/');
    }

    // Handle regular packages
    return packageParts[0];
}
