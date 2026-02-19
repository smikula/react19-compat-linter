import { ESLintUtils } from '@typescript-eslint/utils';

export const noRestrictedImports = ESLintUtils.RuleCreator(f => f)({
    name: 'no-restricted-imports',
    meta: {
        type: 'problem',
        messages: {
            restrictedImport: 'Importing {{importName}} from "{{moduleName}}" is not allowed.',
            restrictedNamespaceAccess:
                'Accessing {{importName}} from "{{moduleName}}" is not allowed.',
            restrictedDestructuring:
                'Destructuring {{importName}} from "{{moduleName}}" is not allowed.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    restrictedImports: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                module: {
                                    type: 'string',
                                },
                                imports: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                    },
                                },
                            },
                            required: ['module', 'imports'],
                            additionalProperties: false,
                        },
                    },
                },
                additionalProperties: false,
                required: ['restrictedImports'],
            },
        ],
        docs: {
            description: 'Restricts specific imports from specified modules.',
        },
    },
    defaultOptions: [
        {
            restrictedImports: [
                {
                    module: 'react-dom',
                    imports: [
                        'findDOMNode',
                        'render',
                        'hydrate',
                        'unmountComponentAtNode',
                        'unstable_renderSubtreeIntoContainer',
                        'unstable_flushControlled',
                        'unstable_createEventHandle',
                        'unstable_runWithPriority',
                    ],
                },
                {
                    module: 'react',
                    imports: ['createFactory'],
                },
            ],
        },
    ],
    create(context, options) {
        const restrictedImports = options[0].restrictedImports;
        const namespaceIdentifiers = new Map<string, string>();

        return {
            ImportDeclaration(node) {
                const moduleName = node.source.value as string;

                // Find if this module has any restricted imports
                const restriction = restrictedImports.find(r => r.module === moduleName);
                if (!restriction) {
                    return;
                }

                // Check each import specifier
                node.specifiers.forEach(specifier => {
                    if (specifier.type === 'ImportSpecifier') {
                        const importedName =
                            specifier.imported.type === 'Identifier'
                                ? specifier.imported.name
                                : specifier.imported.value;

                        if (restriction.imports.includes(importedName)) {
                            context.report({
                                node: specifier,
                                messageId: 'restrictedImport',
                                data: {
                                    importName: importedName,
                                    moduleName: moduleName,
                                },
                            });
                        }
                    } else if (
                        specifier.type === 'ImportDefaultSpecifier' ||
                        specifier.type === 'ImportNamespaceSpecifier'
                    ) {
                        // Track namespace/default imports for this module
                        // e.g., "import React from 'react'" or "import * as React from 'react'"
                        namespaceIdentifiers.set(specifier.local.name, moduleName);
                    }
                });
            },
            MemberExpression(node) {
                // Check if accessing a restricted import through a namespace identifier
                // e.g., ReactDOM.render
                if (node.object.type === 'Identifier' && node.property.type === 'Identifier') {
                    const namespaceName = node.object.name;
                    const propertyName = node.property.name;

                    // Check if this identifier is a tracked namespace
                    const moduleName = namespaceIdentifiers.get(namespaceName);
                    if (!moduleName) {
                        return;
                    }

                    // Find if this module has restrictions
                    const restriction = restrictedImports.find(r => r.module === moduleName);
                    if (!restriction) {
                        return;
                    }

                    // Check if the accessed property is in the restricted imports list
                    if (restriction.imports.includes(propertyName)) {
                        context.report({
                            node,
                            messageId: 'restrictedNamespaceAccess',
                            data: {
                                importName: propertyName,
                                moduleName: moduleName,
                            },
                        });
                    }
                }
            },
            VariableDeclarator(node) {
                // Check for require statements set to a variable
                // const ReactDOM = require('react-dom');
                if (
                    node.init &&
                    node.init.type === 'CallExpression' &&
                    node.init.callee.type === 'Identifier' &&
                    node.init.callee.name == 'require' &&
                    node.init.arguments.length == 1 &&
                    node.init.arguments[0].type === 'Literal' &&
                    node.init.arguments[0].value &&
                    node.id.type === 'Identifier'
                ) {
                    const moduleName = node.init.arguments[0].value.toString();
                    namespaceIdentifiers.set(node.id.name, moduleName);
                }

                // Check for require() access
                // const findDOMNode = require('react-dom').findDOMNode;
                if (
                    node.init &&
                    node.init.type === 'MemberExpression' &&
                    node.init.object.type === 'CallExpression' &&
                    node.init.object.callee.type === 'Identifier' &&
                    node.init.object.callee.name == 'require' &&
                    // Check arguments
                    node.init.object.arguments.length == 1 &&
                    node.init.object.arguments[0].type === 'Literal' &&
                    node.init.object.arguments[0].value
                ) {
                    const moduleName = node.init.object.arguments[0].value.toString(); //namespaceIdentifiers.get() || 'a';

                    const restriction = restrictedImports.find(r => r.module == moduleName);
                    if (!restriction) {
                        return;
                    }

                    if (node.init.property.type === 'Identifier') {
                        const propertyName = node.init.property.name;
                        if (
                            propertyName &&
                            restrictedImports.find(r => r.imports.find(y => y == propertyName))
                        ) {
                            context.report({
                                node: node,
                                messageId: 'restrictedImport',
                                data: {
                                    importName: propertyName,
                                    moduleName,
                                },
                            });
                        }
                    }
                }
                // Check for destructuring from a namespace identifier
                // e.g., const { findDOMNode } = ReactDOM;
                if (node.id.type === 'ObjectPattern' && node.init) {
                    let moduleName: string | undefined;
                    if (node.init.type === 'Identifier') {
                        const namespaceName = node.init.name;

                        // Check if this identifier is a tracked namespace
                        moduleName = namespaceIdentifiers.get(namespaceName);
                    } else if (
                        node.init.type === 'CallExpression' &&
                        node.init.callee.type === 'Identifier' &&
                        node.init.callee.name === 'require' &&
                        node.init.arguments.length == 1 &&
                        node.init.arguments[0].type === 'Literal' &&
                        node.init.arguments[0].value
                    ) {
                        moduleName = node.init.arguments[0].value.toString();
                    }

                    if (!moduleName) {
                        return;
                    }

                    // Find if this module has restrictions
                    const restriction = restrictedImports.find(r => r.module === moduleName);
                    if (!restriction) {
                        return;
                    }

                    // Check each destructured property
                    node.id.properties.forEach(prop => {
                        if (prop.type === 'Property' && prop.key.type === 'Identifier') {
                            const propertyName = prop.key.name;
                            if (restriction.imports.includes(propertyName)) {
                                context.report({
                                    node: prop,
                                    messageId: 'restrictedDestructuring',
                                    data: {
                                        importName: propertyName,
                                        moduleName: moduleName,
                                    },
                                });
                            }
                        }
                    });
                }
            },
        };
    },
});
