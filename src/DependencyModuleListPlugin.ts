import webpack, { Compilation, NormalModule } from 'webpack';
import { writeFile } from 'fs/promises';

export class DependencyModuleListPlugin {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    apply(compiler: webpack.Compiler) {
        compiler.hooks.thisCompilation.tap('DependencyModuleListPlugin', compilation => {
            compilation.hooks.processAssets.tapPromise(
                {
                    name: 'DependencyModuleListPlugin',
                    stage: Compilation.PROCESS_ASSETS_STAGE_REPORT,
                },
                async () => {
                    const modules: string[] = [];
                    for (const module of compilation.modules) {
                        const resource = (module as NormalModule).resource;
                        if (resource && shouldIncludeModule(resource)) {
                            modules.push(resource);
                        }
                    }

                    const jsonContent = JSON.stringify(modules, null, 2);
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
