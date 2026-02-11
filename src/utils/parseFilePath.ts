export interface ParsedFilePath {
    packageName: string;
    packageJsonPath: string;
    relativeFilePath: string;
}

export function parseFilePath(filePath: string): ParsedFilePath {
    // Normalize to forward slashes for consistent parsing
    const parts = filePath.split('\\').join('/').split('/');
    const nodeModulesIndex = parts.lastIndexOf('node_modules');

    if (nodeModulesIndex === -1) {
        throw new Error(`Path does not contain node_modules: ${filePath}`);
    }

    const packageParts = parts.slice(nodeModulesIndex + 1);
    let packageName: string;
    let packageRootParts: string[];
    let relativePathStartIndex: number;

    // Determine if this is a scoped package (@scope/package-name)
    const isScoped = packageParts[0].startsWith('@');
    if (isScoped) {
        packageName = packageParts.slice(0, 2).join('/');
        packageRootParts = parts.slice(0, nodeModulesIndex + 3);
        relativePathStartIndex = nodeModulesIndex + 3;
    } else {
        packageName = packageParts[0];
        packageRootParts = parts.slice(0, nodeModulesIndex + 2);
        relativePathStartIndex = nodeModulesIndex + 2;
    }

    const packageJsonPath = [...packageRootParts, 'package.json'].join('/');
    const relativeFilePath = parts.slice(relativePathStartIndex).join('/');

    return {
        packageName,
        packageJsonPath,
        relativeFilePath,
    };
}
