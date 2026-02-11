import { parseFilePath } from './parseFilePath';

describe('parseFilePath', () => {
    it('should parse regular package', () => {
        const filePath = 'project/node_modules/sample/index.js';
        const result = parseFilePath(filePath);
        expect(result).toEqual({
            packageName: 'sample',
            packageJsonPath: 'project/node_modules/sample/package.json',
            relativeFilePath: 'index.js',
        });
    });

    it('should parse scoped package', () => {
        const filePath = 'project/node_modules/@scope/sample/lib/index.js';
        const result = parseFilePath(filePath);
        expect(result).toEqual({
            packageName: '@scope/sample',
            packageJsonPath: 'project/node_modules/@scope/sample/package.json',
            relativeFilePath: 'lib/index.js',
        });
    });

    it('should parse deeply nested file in regular package', () => {
        const filePath = 'project/node_modules/sample/dist/index.js';
        const result = parseFilePath(filePath);
        expect(result).toEqual({
            packageName: 'sample',
            packageJsonPath: 'project/node_modules/sample/package.json',
            relativeFilePath: 'dist/index.js',
        });
    });

    it('should parse deeply nested file in scoped package', () => {
        const filePath = 'project/node_modules/@scope/sample/dist/index.js';
        const result = parseFilePath(filePath);
        expect(result).toEqual({
            packageName: '@scope/sample',
            packageJsonPath: 'project/node_modules/@scope/sample/package.json',
            relativeFilePath: 'dist/index.js',
        });
    });

    it('should handle multiple node_modules in path (nested dependencies)', () => {
        const filePath = 'project/node_modules/sample-a/node_modules/sample/index.js';
        const result = parseFilePath(filePath);
        expect(result).toEqual({
            packageName: 'sample',
            packageJsonPath: 'project/node_modules/sample-a/node_modules/sample/package.json',
            relativeFilePath: 'index.js',
        });
    });

    it('should handle multiple node_modules with scoped package', () => {
        const filePath = 'project/node_modules/sample-a/node_modules/@scope/sample/index.js';
        const result = parseFilePath(filePath);
        expect(result).toEqual({
            packageName: '@scope/sample',
            packageJsonPath:
                'project/node_modules/sample-a/node_modules/@scope/sample/package.json',
            relativeFilePath: 'index.js',
        });
    });

    it('should throw error when path does not contain node_modules', () => {
        const filePath = 'project/src/index.js';
        expect(() => parseFilePath(filePath)).toThrow('Path does not contain node_modules');
    });

    it('should handle Windows-style backslashes', () => {
        const filePath = 'C:\\Users\\dev\\project\\node_modules\\sample\\index.js';
        const result = parseFilePath(filePath);
        expect(result).toEqual({
            packageName: 'sample',
            packageJsonPath: 'C:/Users/dev/project/node_modules/sample/package.json',
            relativeFilePath: 'index.js',
        });
    });

    it('should handle absolute Unix paths', () => {
        const filePath = '/home/dev/project/node_modules/sample/index.js';
        const result = parseFilePath(filePath);
        expect(result).toEqual({
            packageName: 'sample',
            packageJsonPath: '/home/dev/project/node_modules/sample/package.json',
            relativeFilePath: 'index.js',
        });
    });
});
