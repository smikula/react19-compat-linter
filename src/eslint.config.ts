import type { Linter } from 'eslint';
import { noRestrictedImports } from './no-restricted-imports';
import { requireCSSTransitionNoderefs } from './require-csstransition-noderefs';

// Using `export =` because ESLint expects CommonJS style export
export = [
    {
        plugins: {
            'react19-compat-linter': {
                rules: {
                    // Cast to `any` because the rule type from @typescript-eslint/utils doesn't quite match
                    'no-restricted-imports': noRestrictedImports as any,
                    'require-csstransition-noderefs': requireCSSTransitionNoderefs as any,
                },
            },
        },
        rules: {
            'react19-compat-linter/no-restricted-imports': 'error',
            'react19-compat-linter/require-csstransition-noderefs': 'error',
        },
    },
] satisfies Linter.Config[];
