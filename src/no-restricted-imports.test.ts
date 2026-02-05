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

// Common test configuration for react-dom restrictions
const defaultOptions: [{ restrictedImports: { module: string; imports: string[] }[] }] = [
    {
        restrictedImports: [
            {
                module: 'react-dom',
                imports: ['findDOMNode', 'render', 'unmountComponentAtNode'],
            },
        ],
    },
];

ruleTester.run('no-restricted-imports', noRestrictedImports, {
    valid: [
        // Allowed imports from react-dom
        {
            code: "import { createPortal } from 'react-dom';",
            options: defaultOptions,
        },
        {
            code: "import ReactDOM from 'react-dom';",
            options: defaultOptions,
        },
        {
            code: "import * as ReactDOM from 'react-dom';",
            options: defaultOptions,
        },
        // Namespace access of allowed methods
        {
            code: "import * as ReactDOM from 'react-dom';\nReactDOM.createPortal();",
            options: defaultOptions,
        },
        {
            code: "import ReactDOM from 'react-dom';\nReactDOM.createRoot();",
            options: defaultOptions,
        },
        // Destructuring of allowed methods
        {
            code: "import * as ReactDOM from 'react-dom';\nconst { createPortal } = ReactDOM;",
            options: defaultOptions,
        },
        // Imports from non-restricted modules
        {
            code: "import { useState } from 'react';",
            options: defaultOptions,
        },
    ],
    invalid: [
        // Named imports - restricted imports from react-dom
        {
            code: "import { findDOMNode } from 'react-dom';",
            options: defaultOptions,
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
            options: defaultOptions,
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
            options: defaultOptions,
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
            options: defaultOptions,
            errors: [
                {
                    messageId: 'restrictedNamespaceAccess',
                    data: {
                        importName: 'findDOMNode',
                        namespace: 'ReactDOM',
                    },
                },
            ],
        },
        // Default import with namespace access
        {
            code: "import ReactDOM from 'react-dom';\nReactDOM.render();",
            options: defaultOptions,
            errors: [
                {
                    messageId: 'restrictedNamespaceAccess',
                    data: {
                        importName: 'render',
                        namespace: 'ReactDOM',
                    },
                },
            ],
        },
        // Destructuring - extracting restricted methods from namespace
        {
            code: "import * as ReactDOM from 'react-dom';\nconst { findDOMNode } = ReactDOM;",
            options: defaultOptions,
            errors: [
                {
                    messageId: 'restrictedDestructuring',
                    data: {
                        importName: 'findDOMNode',
                        namespace: 'ReactDOM',
                    },
                },
            ],
        },
        // Multiple destructured properties (mixed restricted and allowed)
        {
            code: "import * as ReactDOM from 'react-dom';\nconst { render, createPortal, findDOMNode } = ReactDOM;",
            options: defaultOptions,
            errors: [
                {
                    messageId: 'restrictedDestructuring',
                    data: {
                        importName: 'render',
                        namespace: 'ReactDOM',
                    },
                },
                {
                    messageId: 'restrictedDestructuring',
                    data: {
                        importName: 'findDOMNode',
                        namespace: 'ReactDOM',
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
    ],
});
