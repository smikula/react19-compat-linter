import { getPackageJsonPath } from './getPackageJsonPath';

describe('getPackageJsonPath', () => {
    it('should find package.json for regular package', () => {
        const filePath = 'project/node_modules/lodash/index.js';
        const result = getPackageJsonPath(filePath);
        expect(result).toBe('project/node_modules/lodash/package.json');
    });

    it('should find package.json for scoped package', () => {
        const filePath = 'project/node_modules/@babel/core/lib/index.js';
        const result = getPackageJsonPath(filePath);
        expect(result).toBe('project/node_modules/@babel/core/package.json');
    });

    it('should find package.json for deeply nested file in regular package', () => {
        const filePath = 'project/node_modules/react/cjs/react.development.js';
        const result = getPackageJsonPath(filePath);
        expect(result).toBe('project/node_modules/react/package.json');
    });

    it('should find package.json for deeply nested file in scoped package', () => {
        const filePath = 'project/node_modules/@typescript-eslint/parser/dist/index.js';
        const result = getPackageJsonPath(filePath);
        expect(result).toBe('project/node_modules/@typescript-eslint/parser/package.json');
    });

    it('should handle multiple node_modules in path (nested dependencies)', () => {
        const filePath = 'project/node_modules/package-a/node_modules/package-b/index.js';
        const result = getPackageJsonPath(filePath);
        expect(result).toBe('project/node_modules/package-a/node_modules/package-b/package.json');
    });

    it('should handle multiple node_modules with scoped package', () => {
        const filePath = 'project/node_modules/package-a/node_modules/@scope/package-b/index.js';
        const result = getPackageJsonPath(filePath);
        expect(result).toBe(
            'project/node_modules/package-a/node_modules/@scope/package-b/package.json'
        );
    });

    it('should throw error when path does not contain node_modules', () => {
        const filePath = 'project/src/index.js';
        expect(() => getPackageJsonPath(filePath)).toThrow('Path does not contain node_modules');
    });

    it('should handle Windows-style backslashes', () => {
        const filePath = 'C:\\Users\\dev\\project\\node_modules\\react\\index.js';
        const result = getPackageJsonPath(filePath);
        expect(result).toBe('C:/Users/dev/project/node_modules/react/package.json');
    });

    it('should handle absolute Unix paths', () => {
        const filePath = '/home/dev/project/node_modules/react/index.js';
        const result = getPackageJsonPath(filePath);
        expect(result).toBe('/home/dev/project/node_modules/react/package.json');
    });
});
