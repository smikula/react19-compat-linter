import webpack, { NormalModule } from 'webpack';
import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

export class DependencyModuleListPlugin {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    apply(compiler: webpack.Compiler) {
        compiler.hooks.thisCompilation.tap('DependencyModuleListPlugin', compilation => {
            // Use finishModules, which fires before the seal/optimization phase.
            // At this point all modules are plain NormalModules — no ConcatenatedModules yet.
            compilation.hooks.finishModules.tapPromise(
                'DependencyModuleListPlugin',
                async modules => {
                    const filePaths: string[] = [];
                    for (const module of modules) {
                        const resource = (module as NormalModule).resource;
                        if (resource && shouldIncludeModule(resource)) {
                            filePaths.push(resource);
                        }
                    }

                    const jsonContent = JSON.stringify(filePaths, null, 2);
                    await mkdir(dirname(this.filePath), { recursive: true });
                    await writeFile(this.filePath, jsonContent, 'utf-8');
                }
            );
        });
    }
}

const jsExtensions = /\.(js|jsx|ts|tsx|mjs|cjs)$/i;
function shouldIncludeModule(resource: string): boolean {
    return jsExtensions.test(resource) && resource.includes('node_modules');
}
