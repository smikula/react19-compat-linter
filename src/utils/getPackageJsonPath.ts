export function getPackageJsonPath(filePath: string): string {
    // Normalize to forward slashes for consistent parsing
    const parts = filePath.split('\\').join('/').split('/');
    const nodeModulesIndex = parts.lastIndexOf('node_modules');

    if (nodeModulesIndex === -1) {
        throw new Error(`Path does not contain node_modules: ${filePath}`);
    }

    const packageParts = parts.slice(nodeModulesIndex + 1);
    let packageRootParts: string[];

    // Handle scoped packages (@scope/package-name)
    if (packageParts[0].startsWith('@')) {
        packageRootParts = parts.slice(0, nodeModulesIndex + 3);
    } else {
        packageRootParts = parts.slice(0, nodeModulesIndex + 2);
    }

    return [...packageRootParts, 'package.json'].join('/');
}
