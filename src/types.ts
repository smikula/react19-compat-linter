export interface LinterViolation {
    line: number;
    column: number;
    message: string;
}

export interface LinterFileResult {
    filePath: string;
    violations: LinterViolation[];
}

export interface LinterPackageResult {
    packageName: string;
    files: LinterFileResult[];
}

export interface LinterResult {
    packages: LinterPackageResult[];
}
