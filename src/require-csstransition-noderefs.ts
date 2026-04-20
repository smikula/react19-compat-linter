import { ESLintUtils, TSESTree } from '@typescript-eslint/utils';

export const requireCSSTransitionNoderefs = ESLintUtils.RuleCreator(f => f)({
    name: 'require-csstransition-noderefs',
    defaultOptions: [{}],
    meta: {
        type: 'problem',
        messages: {
            addNodeRef:
                'Please add a node ref to eliminate deprecated findDOMNode call. See https://reactcommunity.org/react-transition-group/css-transition',
            connectNodeRef:
                "Please ensure that your nodeRef is properly set as a ref for the transition element's child.",
        },
        docs: {
            description: "Ensures that uses of CSSTransition don't call deprecated findDOMNode.",
        },
        schema: [],
    },

    create(context) {
        let cssTransitionLocal: {
            isDefault: boolean;
            localName: string;
            transitionGroupName?: string;
            importDeclaration?: TSESTree.ImportDeclaration | TSESTree.VariableDeclarator;
        };
        let createElementLocal:
            | {
                  isDefault: boolean;
                  localName: string;
                  reactName?: string;
                  importDeclaration?: TSESTree.ImportDeclaration | TSESTree.VariableDeclarator;
              }
            | undefined = undefined;

        function isCSSTransitionIdentifier(node: TSESTree.Node) {
            return (
                cssTransitionLocal?.importDeclaration &&
                node.type === 'Identifier' &&
                node.name === cssTransitionLocal.localName
            );
        }

        function isCreateElementCall(node: TSESTree.Node) {
            if (node.type !== 'CallExpression') {
                return false;
            }
            const { callee } = node;
            return (
                // Case that it's called like React.createElement
                (createElementLocal &&
                    createElementLocal.isDefault &&
                    callee.type === 'MemberExpression' &&
                    callee.object.type === 'Identifier' &&
                    createElementLocal.reactName &&
                    callee.object.name === createElementLocal.reactName &&
                    callee.property.type === 'Identifier' &&
                    callee.property.name === 'createElement') ||
                // Case that it's called as createElement
                (createElementLocal &&
                    !createElementLocal.isDefault &&
                    callee.type === 'Identifier' &&
                    callee.name === createElementLocal.localName)
            );
        }

        function isCSSTransitionCreateElement(node: TSESTree.Node) {
            return (
                node.type === 'CallExpression' &&
                isCreateElementCall(node) &&
                node.arguments.length >= 1 &&
                isCSSTransitionIdentifier(node.arguments[0])
            );
        }

        function findProp(objectExpression: TSESTree.ObjectExpression, propName: string) {
            return objectExpression.properties.find(
                p =>
                    p.type === 'Property' &&
                    p.key.type === 'Identifier' &&
                    p.key.name === propName &&
                    p.value != null
            );
        }

        function childHasMatchingRef(childNode: TSESTree.Node, nodeRefName: string) {
            if (!isCreateElementCall(childNode) || childNode.type !== 'CallExpression') {
                return false;
            }
            const childProps = childNode.arguments[1];
            if (!childProps || childProps.type !== 'ObjectExpression') return false;
            const refProp = findProp(childProps, 'ref');
            return (
                refProp != null &&
                refProp.type === 'Property' &&
                refProp.value.type === 'Identifier' &&
                refProp.value.name === nodeRefName
            );
        }

        function getRequireSource(initNode: TSESTree.Expression) {
            if (
                initNode?.type === 'CallExpression' &&
                initNode.callee.type === 'Identifier' &&
                initNode.callee.name === 'require' &&
                initNode.arguments.length === 1 &&
                initNode.arguments[0].type === 'Literal' &&
                typeof initNode.arguments[0].value === 'string'
            ) {
                return { source: initNode.arguments[0].value };
            }
            if (
                initNode?.type === 'MemberExpression' &&
                initNode.object.type === 'CallExpression' &&
                initNode.object.callee.type === 'Identifier' &&
                initNode.object.callee.name === 'require' &&
                initNode.object.arguments.length === 1 &&
                initNode.object.arguments[0].type === 'Literal' &&
                typeof initNode.object.arguments[0].value === 'string' &&
                initNode.property.type === 'Identifier'
            ) {
                return { source: initNode.object.arguments[0].value, spec: initNode.property.name };
            }
            return null;
        }

        return {
            ImportDeclaration(node: TSESTree.ImportDeclaration) {
                const {
                    specifiers,
                    source: { value: moduleSpecifier },
                } = node;

                if (moduleSpecifier == 'react-transition-group') {
                    const computedSpec = specifiers.find(
                        spec =>
                            spec.type === 'ImportSpecifier' &&
                            spec.imported.type === 'Identifier' &&
                            spec.imported.name === 'CSSTransition'
                    );
                    const computedSpecDefault = specifiers.find(
                        spec =>
                            spec.type === 'ImportDefaultSpecifier' ||
                            spec.type === 'ImportNamespaceSpecifier'
                    );

                    if (computedSpecDefault) {
                        cssTransitionLocal = {
                            isDefault: true,
                            localName: 'CSSTransition',
                            transitionGroupName: computedSpecDefault.local.name,
                            importDeclaration: node,
                        };
                    }
                    if (computedSpec) {
                        cssTransitionLocal = {
                            isDefault: false,
                            localName: computedSpec.local.name,
                            importDeclaration: node,
                        };
                    }
                }
                if (moduleSpecifier == 'react') {
                    const computedSpec = specifiers.find(
                        spec =>
                            spec.type === 'ImportSpecifier' &&
                            spec.imported.type === 'Identifier' &&
                            spec.imported.name === 'createElement'
                    );
                    const computedSpecDefault = specifiers.find(
                        spec =>
                            spec.type === 'ImportDefaultSpecifier' ||
                            spec.type === 'ImportNamespaceSpecifier'
                    );

                    if (computedSpecDefault) {
                        createElementLocal = {
                            isDefault: true,
                            localName: 'createElement',
                            reactName: computedSpecDefault.local.name,
                            importDeclaration: node,
                        };
                    }
                    if (computedSpec) {
                        createElementLocal = {
                            isDefault: false,
                            localName: computedSpec.local.name,
                            importDeclaration: node,
                        };
                    }
                }
            },
            VariableDeclarator(node: TSESTree.VariableDeclarator) {
                const requireSource = node.init ? getRequireSource(node.init) : null;
                // Track require statements:
                // var RTG = require('react-transition-group')
                if (
                    requireSource?.source === 'react-transition-group' &&
                    !requireSource.spec &&
                    node.id.type === 'Identifier'
                ) {
                    cssTransitionLocal = {
                        isDefault: true,
                        localName: 'CSSTransition',
                        transitionGroupName: node.id.name,
                        importDeclaration: node,
                    };
                }
                // var React = require('react')
                if (
                    requireSource?.source === 'react' &&
                    !requireSource.spec &&
                    node.id.type === 'Identifier'
                ) {
                    createElementLocal = {
                        isDefault: true,
                        localName: 'createElement',
                        reactName: node.id.name,
                        importDeclaration: node,
                    };
                }

                // var CSSTransition = require('react-transition-group').CSSTransition
                if (
                    requireSource?.source === 'react-transition-group' &&
                    requireSource.spec === 'CSSTransition' &&
                    node.id.type === 'Identifier'
                ) {
                    cssTransitionLocal = {
                        isDefault: false,
                        localName: node.id.name,
                        importDeclaration: node,
                    };
                }
                // var createElement = require('react').createElement
                if (
                    requireSource?.source === 'react' &&
                    requireSource.spec === 'createElement' &&
                    node.id.type === 'Identifier'
                ) {
                    createElementLocal = {
                        isDefault: false,
                        localName: node.id.name,
                        importDeclaration: node,
                    };
                }

                // var { CSSTransition } = require('react-transition-group')
                if (
                    requireSource?.source === 'react-transition-group' &&
                    !requireSource.spec &&
                    node.id.type === 'ObjectPattern'
                ) {
                    const prop = node.id.properties.find(
                        p =>
                            p.type === 'Property' &&
                            p.key.type === 'Identifier' &&
                            p.key.name === 'CSSTransition'
                    );
                    if (prop) {
                        cssTransitionLocal = {
                            isDefault: false,
                            localName:
                                prop.value?.type === 'Identifier'
                                    ? prop.value.name
                                    : 'CSSTransition',
                            importDeclaration: node,
                        };
                    }
                }
                // var { createElement } = require('react')
                if (
                    requireSource?.source === 'react' &&
                    !requireSource.spec &&
                    node.id.type === 'ObjectPattern'
                ) {
                    const prop = node.id.properties.find(
                        p =>
                            p.type === 'Property' &&
                            p.key.type === 'Identifier' &&
                            p.key.name === 'createElement'
                    );
                    if (prop) {
                        createElementLocal = {
                            isDefault: false,
                            localName:
                                prop.value?.type === 'Identifier'
                                    ? prop.value.name
                                    : 'createElement',
                            importDeclaration: node,
                        };
                    }
                }

                // var CSSTransition = RTG.CSSTransition  (RTG was already tracked as default)
                if (
                    cssTransitionLocal?.isDefault &&
                    node.id.type === 'Identifier' &&
                    node.init?.type === 'MemberExpression' &&
                    node.init.object.type === 'Identifier' &&
                    node.init.object.name === cssTransitionLocal?.transitionGroupName &&
                    node.init.property.type === 'Identifier' &&
                    node.init.property.name === 'CSSTransition'
                ) {
                    cssTransitionLocal.isDefault = false;
                    cssTransitionLocal.localName = node.id.name;
                }
                // var ce = React.createElement  (React was already tracked as default)
                if (
                    createElementLocal?.isDefault &&
                    node.id.type === 'Identifier' &&
                    node.init?.type === 'MemberExpression' &&
                    node.init.object.type === 'Identifier' &&
                    node.init.object.name === createElementLocal?.reactName &&
                    node.init.property.type === 'Identifier' &&
                    node.init.property.name === 'createElement'
                ) {
                    createElementLocal.isDefault = false;
                    createElementLocal.localName = node.id.name;
                }

                // Destructuring a previously imported namespace
                if (cssTransitionLocal?.isDefault && node.id.type === 'ObjectPattern') {
                    if (
                        node.init?.type === 'Identifier' &&
                        node.init?.name === cssTransitionLocal?.transitionGroupName
                    ) {
                        const cssTransitionProp = node.id.properties.find(
                            prop =>
                                prop.type === 'Property' &&
                                prop.key.type === 'Identifier' &&
                                prop.key.name === 'CSSTransition'
                        );
                        if (cssTransitionProp) {
                            cssTransitionLocal.isDefault = false;
                            if (cssTransitionProp.value?.type === 'Identifier') {
                                cssTransitionLocal.localName = cssTransitionProp.value.name;
                            } else {
                                cssTransitionLocal.localName = 'CSSTransition';
                            }
                        }
                    }
                }
                if (createElementLocal?.isDefault && node.id.type === 'ObjectPattern') {
                    if (
                        node.init?.type === 'Identifier' &&
                        node.init?.name === createElementLocal?.reactName
                    ) {
                        const createElementProp = node.id.properties.find(
                            prop =>
                                prop.type === 'Property' &&
                                prop.key.type === 'Identifier' &&
                                prop.key.name === 'createElement'
                        );
                        if (createElementProp) {
                            createElementLocal.isDefault = false;
                            if (createElementProp.value?.type === 'Identifier') {
                                createElementLocal.localName = createElementProp.value.name;
                            } else {
                                createElementLocal.localName = 'createElement';
                            }
                        }
                    }
                }
            },
            JSXElement(node: TSESTree.JSXElement) {
                let nodeRefVal:
                    | TSESTree.JSXElement
                    | TSESTree.Literal
                    | TSESTree.JSXExpression
                    | null = null;
                if (
                    (node.openingElement.name.type === 'JSXIdentifier' &&
                        node.openingElement.name.name === cssTransitionLocal?.localName) ||
                    (node.openingElement.name.type === 'JSXNamespacedName' &&
                        cssTransitionLocal?.isDefault &&
                        node.openingElement.name.namespace.name ===
                            cssTransitionLocal?.transitionGroupName &&
                        node.openingElement.name.name.name === cssTransitionLocal?.localName) ||
                    (node.openingElement.name.type === 'JSXMemberExpression' &&
                        cssTransitionLocal?.isDefault &&
                        node.openingElement.name.object.type === 'JSXIdentifier' &&
                        node.openingElement.name.object.name ===
                            cssTransitionLocal?.transitionGroupName &&
                        node.openingElement.name.property.name === cssTransitionLocal?.localName)
                ) {
                    const nodeRef = node.openingElement.attributes.find(
                        attr =>
                            attr.type === 'JSXAttribute' &&
                            attr.name.type === 'JSXIdentifier' &&
                            attr.name.name === 'nodeRef' &&
                            attr.value != null
                    );

                    if (nodeRef && nodeRef.type === 'JSXAttribute') {
                        nodeRefVal = nodeRef.value;
                    } else {
                        context.report({
                            node,
                            messageId: 'addNodeRef',
                        });
                        return;
                    }

                    const transitionChild = node.children.find(
                        child =>
                            // Check to find there is a child that's an element with the transition's nodeRef as some kind of ref attribute
                            child.type === 'JSXElement' &&
                            (child.openingElement.name.type === 'JSXIdentifier' &&
                            (child.openingElement.name.name == 'div' ||
                                child.openingElement.name.name == 'span')
                                ? child.openingElement.attributes.find(
                                      attr =>
                                          // Ensure the attribute is correctly formatted as passing an expression
                                          attr.type === 'JSXAttribute' &&
                                          attr.name.type === 'JSXIdentifier' &&
                                          attr.name.name == 'ref' &&
                                          attr.value?.type === 'JSXExpressionContainer' &&
                                          nodeRefVal?.type === 'JSXExpressionContainer' &&
                                          // Ensure that the attribute being passed is an identifier, and that it matches the nodeRef of the CSSTransition object
                                          attr.value?.expression.type === 'Identifier' &&
                                          nodeRefVal.expression.type === 'Identifier' &&
                                          attr.value?.expression.name === nodeRefVal.expression.name
                                  )
                                : child.openingElement.attributes.find(
                                      attr =>
                                          // Ensure the attribute is correctly formatted as passing an expression
                                          attr.type === 'JSXAttribute' &&
                                          attr.value?.type === 'JSXExpressionContainer' &&
                                          nodeRefVal?.type === 'JSXExpressionContainer' &&
                                          // Ensure that the attribute being passed is an identifier, and that it matches the nodeRef of the CSSTransition object
                                          attr.value?.expression.type === 'Identifier' &&
                                          nodeRefVal.expression.type === 'Identifier' &&
                                          attr.value?.expression.name === nodeRefVal.expression.name
                                  ))
                    );
                    if (!transitionChild) {
                        context.report({
                            node,
                            messageId: 'connectNodeRef',
                        });
                    }
                }
            },
            CallExpression(node: TSESTree.CallExpression) {
                // CSSTransition hasn't been defined or this call expression isn't calling React.createElement on a CSSTransition
                if (!cssTransitionLocal?.importDeclaration || !isCSSTransitionCreateElement(node)) {
                    return;
                }

                const propsArg = node.arguments[1];
                // No props or props aren't an object expression
                if (!propsArg || propsArg.type !== 'ObjectExpression') {
                    context.report({ node, messageId: 'addNodeRef' });
                    return;
                }

                const nodeRefProp = findProp(propsArg, 'nodeRef');
                if (!nodeRefProp) {
                    context.report({ node, messageId: 'addNodeRef' });
                    return;
                }

                // Avoid false positives, return if the nodeRef isn't traceable
                if (nodeRefProp.type === 'Property' && nodeRefProp.value.type !== 'Identifier') {
                    return;
                }

                const nodeRefName =
                    nodeRefProp.type === 'Property' && nodeRefProp.value.type === 'Identifier'
                        ? nodeRefProp.value.name
                        : '';
                if (node.arguments.slice(2).length == 0) {
                    context.report({ node, messageId: 'connectNodeRef' });
                }
                const analyseableChildren = node.arguments
                    .slice(2)
                    .filter(isCreateElementCall)
                    .filter(
                        child =>
                            child.type === 'CallExpression' &&
                            child.arguments.length > 1 &&
                            child.arguments[0].type === 'Literal' &&
                            typeof child.arguments[0].value === 'string'
                    );

                // If there are no createElement children we cannot verify the
                // ref connection (the child may be a variable or a created
                // custom element). Skip the connectNodeRef check to avoid
                // false positives.
                if (analyseableChildren.length === 0) return;

                const hasConnectedChild = analyseableChildren.some(child =>
                    childHasMatchingRef(child, nodeRefName)
                );
                if (!hasConnectedChild) {
                    context.report({ node, messageId: 'connectNodeRef' });
                }
            },
        };
    },
});
