import { noRestrictedImports } from './no-restricted-imports';

import { RuleTester } from '@typescript-eslint/rule-tester';
import * as parser from '@typescript-eslint/parser';

const ruleTester = new RuleTester({
    languageOptions: {
        parser,
        parserOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
        },
    },
});

ruleTester.run('no-restricted-imports', noRestrictedImports, {
    valid: [
        // Allowed imports from react-dom
        {
            code: "import { createPortal } from 'react-dom';",
        },
        {
            code: "import ReactDOM from 'react-dom';",
        },
        {
            code: "import * as ReactDOM from 'react-dom';",
        },
        // Namespace access of allowed methods
        {
            code: "import * as ReactDOM from 'react-dom';\nReactDOM.createPortal();",
        },
        {
            code: "import ReactDOM from 'react-dom';\nReactDOM.createRoot();",
        },
        // Destructuring of allowed methods
        {
            code: "import * as ReactDOM from 'react-dom';\nconst { createPortal } = ReactDOM;",
        },
        // Imports from non-restricted modules
        {
            code: "import { useState } from 'react';",
        },
    ],
    invalid: [
        // Named imports - restricted imports from react-dom
        {
            code: "import { findDOMNode } from 'react-dom';",
            errors: [
                {
                    messageId: 'restrictedImport',
                    data: {
                        importName: 'findDOMNode',
                        moduleName: 'react-dom',
                    },
                },
            ],
        },
        // Multiple restricted imports in one statement
        {
            code: "import { findDOMNode, render, createPortal } from 'react-dom';",
            errors: [
                {
                    messageId: 'restrictedImport',
                    data: {
                        importName: 'findDOMNode',
                        moduleName: 'react-dom',
                    },
                },
                {
                    messageId: 'restrictedImport',
                    data: {
                        importName: 'render',
                        moduleName: 'react-dom',
                    },
                },
            ],
        },
        // Import with alias
        {
            code: "import { findDOMNode as findNode } from 'react-dom';",
            errors: [
                {
                    messageId: 'restrictedImport',
                    data: {
                        importName: 'findDOMNode',
                        moduleName: 'react-dom',
                    },
                },
            ],
        },
        // Namespace access - accessing restricted methods through namespace
        {
            code: "import * as ReactDOM from 'react-dom';\nReactDOM.findDOMNode();",
            errors: [
                {
                    messageId: 'restrictedNamespaceAccess',
                    data: {
                        importName: 'findDOMNode',
                        moduleName: 'react-dom',
                    },
                },
            ],
        },
        // Default import with namespace access
        {
            code: "import ReactDOM from 'react-dom';\nReactDOM.render();",
            errors: [
                {
                    messageId: 'restrictedNamespaceAccess',
                    data: {
                        importName: 'render',
                        moduleName: 'react-dom',
                    },
                },
            ],
        },
        // Destructuring - extracting restricted methods from namespace
        {
            code: "import * as ReactDOM from 'react-dom';\nconst { findDOMNode } = ReactDOM;",
            errors: [
                {
                    messageId: 'restrictedDestructuring',
                    data: {
                        importName: 'findDOMNode',
                        moduleName: 'react-dom',
                    },
                },
            ],
        },
        // Multiple destructured properties (mixed restricted and allowed)
        {
            code: "import * as ReactDOM from 'react-dom';\nconst { render, createPortal, findDOMNode } = ReactDOM;",
            errors: [
                {
                    messageId: 'restrictedDestructuring',
                    data: {
                        importName: 'render',
                        moduleName: 'react-dom',
                    },
                },
                {
                    messageId: 'restrictedDestructuring',
                    data: {
                        importName: 'findDOMNode',
                        moduleName: 'react-dom',
                    },
                },
            ],
        },
        // Multiple modules with restrictions
        {
            code: "import { findDOMNode } from 'react-dom';\nimport { useEffect } from 'react';",
            options: [
                {
                    restrictedImports: [
                        {
                            module: 'react-dom',
                            imports: ['findDOMNode'],
                        },
                        {
                            module: 'react',
                            imports: ['useEffect'],
                        },
                    ],
                },
            ],
            errors: [
                {
                    messageId: 'restrictedImport',
                    data: {
                        importName: 'findDOMNode',
                        moduleName: 'react-dom',
                    },
                },
                {
                    messageId: 'restrictedImport',
                    data: {
                        importName: 'useEffect',
                        moduleName: 'react',
                    },
                },
            ],
        },
        // createFactory restrictions from react
        {
            code: "import { createFactory } from 'react';",
            errors: [
                {
                    messageId: 'restrictedImport',
                    data: {
                        importName: 'createFactory',
                        moduleName: 'react',
                    },
                },
            ],
        },
        // hydrate restriction from react-dom
        {
            code: "import { hydrate } from 'react-dom';",
            errors: [
                {
                    messageId: 'restrictedImport',
                    data: {
                        importName: 'hydrate',
                        moduleName: 'react-dom',
                    },
                },
            ],
        },
        // unstable_renderSubtreeIntoContainer restriction from react-dom
        {
            code: "import { unstable_renderSubtreeIntoContainer } from 'react-dom';",
            errors: [
                {
                    messageId: 'restrictedImport',
                    data: {
                        importName: 'unstable_renderSubtreeIntoContainer',
                        moduleName: 'react-dom',
                    },
                },
            ],
        },
        // unstable_flushControlled restriction from react-dom
        {
            code: "import { unstable_flushControlled } from 'react-dom';",
            errors: [
                {
                    messageId: 'restrictedImport',
                    data: {
                        importName: 'unstable_flushControlled',
                        moduleName: 'react-dom',
                    },
                },
            ],
        },
        // unstable_createEventHandle restriction from react-dom
        {
            code: "import { unstable_createEventHandle } from 'react-dom';",
            errors: [
                {
                    messageId: 'restrictedImport',
                    data: {
                        importName: 'unstable_createEventHandle',
                        moduleName: 'react-dom',
                    },
                },
            ],
        },
        // unstable_runWithPriority restriction from react-dom
        {
            code: "import { unstable_runWithPriority } from 'react-dom';",
            errors: [
                {
                    messageId: 'restrictedImport',
                    data: {
                        importName: 'unstable_runWithPriority',
                        moduleName: 'react-dom',
                    },
                },
            ],
        },
    ],
});
