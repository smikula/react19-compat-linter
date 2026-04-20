import { requireCSSTransitionNoderefs } from './require-csstransition-noderefs';

import { RuleTester } from '@typescript-eslint/rule-tester';
import * as parser from '@typescript-eslint/parser';

const ruleTester = new RuleTester({
    languageOptions: {
        parser,
        parserOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
});

ruleTester.run('require-csstransition-noderefs', requireCSSTransitionNoderefs, {
    valid: [
        // NON-REQUIRE IMPORTS
        // JSX with namespace import
        {
            code: `import RTG from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition nodeRef={nodeRef}> <div ref={nodeRef}> </div> </RTG.CSSTransition>);`,
        },
        {
            code: `import RTG from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition nodeRef={nodeRef}> <span ref={nodeRef}> </span> </RTG.CSSTransition>);`,
        },
        {
            code: `import RTG from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition nodeRef={nodeRef}> <MyComponent nodeRef={nodeRef}> </MyComponent> </RTG.CSSTransition>);`,
        },
        // JSX with import
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <div ref={nodeRef}> </div> </CSSTransition>);`,
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <span ref={nodeRef}> </span> </CSSTransition>);`,
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <MyComponent nodeRef={nodeRef}> </MyComponent> </CSSTransition>);`,
        },
        // React.createElement with namespace import
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import React from 'react';
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {nodeRef: nodeRef}, React.createElement('div', {ref: nodeRef}));`,
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import React from 'react';
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {nodeRef: nodeRef}, React.createElement('span', {ref: nodeRef}));`,
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import React from 'react';
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {nodeRef: nodeRef}, React.createElement(MyComponent, {nodeRef: nodeRef}));`,
        },
        // React.createElement with import
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import { useRef, createElement } from 'react';
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {nodeRef: nodeRef}, createElement('div', {ref: nodeRef}));`,
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import { useRef, createElement } from 'react';
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {nodeRef: nodeRef}, createElement('span', {ref: nodeRef}));`,
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import { useRef, createElement } from 'react';
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {nodeRef: nodeRef}, createElement(MyComponent, {nodeRef: nodeRef}));`,
        },
        // REQUIRE IMPORTS
        // JSX with namespace import
        {
            code: `const RTG = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition nodeRef={nodeRef}> <div ref={nodeRef}> </div> </RTG.CSSTransition>);`,
        },
        {
            code: `const RTG = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition nodeRef={nodeRef}> <span ref={nodeRef}> </span> </RTG.CSSTransition>);`,
        },
        {
            code: `const RTG = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition nodeRef={nodeRef}> <MyComponent nodeRef={nodeRef}> </MyComponent> </RTG.CSSTransition>);`,
        },
        // JSX with import
        {
            code: `const {CSSTransition} = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <div ref={nodeRef}> </div> </CSSTransition>);`,
        },
        {
            code: `const {CSSTransition} = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <span ref={nodeRef}> </span> </CSSTransition>);`,
        },
        {
            code: `const CSSTransition = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <MyComponent nodeRef={nodeRef}> </MyComponent> </CSSTransition>);`,
        },
        {
            code: `const CSSTransition = require('react-transition-group').CSSTransition;
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <div ref={nodeRef}> </div> </CSSTransition>);`,
        },
        {
            code: `const CSSTransition = require('react-transition-group').CSSTransition;
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <span ref={nodeRef}> </span> </CSSTransition>);`,
        },
        {
            code: `const CSSTransition = require('react-transition-group').CSSTransition;
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <MyComponent nodeRef={nodeRef}> </MyComponent> </CSSTransition>);`,
        },
        // React.createElement with namespace import
        {
            code: `const {CSSTransition} = require('react-transition-group');
                   const React = require('react');
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {nodeRef: nodeRef}, React.createElement('div', {ref: nodeRef}));`,
        },
        {
            code: `const {CSSTransition} = require('react-transition-group');
                   const React = require('react');
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {nodeRef: nodeRef}, React.createElement('span', {ref: nodeRef}));`,
        },
        {
            code: `const {CSSTransition} = require('react-transition-group');
                   const React = require('react');
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {nodeRef: nodeRef}, React.createElement(MyComponent, {nodeRef: nodeRef}));`,
        },
        // React.createElement with import
        {
            code: `const {CSSTransition} = require('react-transition-group');
                   const { useRef, createElement } = require('react');
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {nodeRef: nodeRef}, createElement('div', {ref: nodeRef}));`,
        },
        {
            code: `const {CSSTransition} = require('react-transition-group');
                   const { useRef, createElement } = require('react');
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {nodeRef: nodeRef}, createElement('span', {ref: nodeRef}));`,
        },
        {
            code: `const {CSSTransition} = require('react-transition-group');
                   const { useRef, createElement } = require('react');
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {nodeRef: nodeRef}, createElement(MyComponent, {nodeRef: nodeRef}));`,
        },
    ],
    invalid: [
        // NON-REQUIRE IMPORTS
        // JSX with import
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition> </CSSTransition>);`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition> <div> </div> </CSSTransition>);`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> </CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <div key={nodeRef}> </div> </CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <span key={nodeRef}> </span> </CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <div> </div> </CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        // JSX with namespace import
        {
            code: `import RTG from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition> </RTG.CSSTransition>);`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `import RTG from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition> <div> </div> </RTG.CSSTransition>);`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `import RTG from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition nodeRef={nodeRef}> </RTG.CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `import RTG from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition nodeRef={nodeRef}> <div key={nodeRef}> </div> </RTG.CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `import RTG from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition nodeRef={nodeRef}> <span key={nodeRef}> </span> </RTG.CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `import RTG from 'react-transition-group';
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition nodeRef={nodeRef}> <div> </div> </RTG.CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        // createElement with namespace import
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import React from 'react';
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, null);`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import React from 'react';
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {}, React.createElement('div'));`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import React from 'react';
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {nodeRef: nodeRef});`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import React from 'react';
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {nodeRef: nodeRef}, React.createElement('div', {key: nodeRef}));`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import React from 'react';
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {nodeRef: nodeRef}, React.createElement('span', {key: nodeRef}));`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import React from 'react';
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {nodeRef: nodeRef}, React.createElement('div', null));`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        // createElement without namespace import
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import { nodeRef, createElement } from 'react';
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, null);`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import { nodeRef, createElement } from 'react';
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {}, createElement('div'));`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import { nodeRef, createElement } from 'react';
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {nodeRef: nodeRef});`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import { nodeRef, createElement } from 'react';
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {nodeRef: nodeRef}, createElement('div', {key: nodeRef}));`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import { nodeRef, createElement } from 'react';
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {nodeRef: nodeRef}, createElement('span', {key: nodeRef}));`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `import {CSSTransition} from 'react-transition-group';
                   import { nodeRef, createElement } from 'react';
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {nodeRef: nodeRef}, createElement('div', null));`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        // REQUIRE IMPORTS
        // JSX with import
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition> </CSSTransition>);`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition> <div> </div> </CSSTransition>);`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> </CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <div key={nodeRef}> </div> </CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <span key={nodeRef}> </span> </CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <div> </div> </CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        // JSX with require direct access
        {
            code: `const CSSTransition = require('react-transition-group').CSSTransition;
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition> </CSSTransition>);`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `const CSSTransition = require('react-transition-group').CSSTransition;
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition> <div> </div> </CSSTransition>);`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `const CSSTransition = require('react-transition-group').CSSTransition;
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> </CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `const CSSTransition = require('react-transition-group').CSSTransition;
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <div key={nodeRef}> </div> </CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `const CSSTransition = require('react-transition-group').CSSTransition;
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <span key={nodeRef}> </span> </CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `const CSSTransition = require('react-transition-group').CSSTransition;
                   const nodeRef = React.useRef(null);
                   const toRender = (<CSSTransition nodeRef={nodeRef}> <div> </div> </CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        // JSX with namespace import
        {
            code: `const RTG = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition> </RTG.CSSTransition>);`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `const RTG = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition> <div> </div> </RTG.CSSTransition>);`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `const RTG = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition nodeRef={nodeRef}> </RTG.CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `const RTG = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition nodeRef={nodeRef}> <div key={nodeRef}> </div> </RTG.CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `const RTG = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition nodeRef={nodeRef}> <span key={nodeRef}> </span> </RTG.CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `const RTG = require('react-transition-group');
                   const nodeRef = React.useRef(null);
                   const toRender = (<RTG.CSSTransition nodeRef={nodeRef}> <div> </div> </RTG.CSSTransition>);`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        // createElement with namespace import
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const React = require('react');
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, null);`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const React = require('react');
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {}, React.createElement('div'));`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const React = require('react');
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {nodeRef: nodeRef});`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const React = require('react');
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {nodeRef: nodeRef}, React.createElement('div', {key: nodeRef}));`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const React = require('react');
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {nodeRef: nodeRef}, React.createElement('span', {key: nodeRef}));`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const React = require('react');
                   const nodeRef = React.useRef(null);
                   const toRender = React.createElement(CSSTransition, {nodeRef: nodeRef}, React.createElement('div', null));`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        // createElement without namespace import
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const { useRef, createElement } = require('react');
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, null);`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const { useRef, createElement } = require('react');
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {}, createElement('div'));`,
            errors: [{ messageId: 'addNodeRef' }],
        },
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const { useRef, createElement } = require('react');
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {nodeRef: nodeRef});`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const { useRef, createElement } = require('react');
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {nodeRef: nodeRef}, createElement('div', {key: nodeRef}));`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const { useRef, createElement } = require('react');
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {nodeRef: nodeRef}, createElement('span', {key: nodeRef}));`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
        {
            code: `const { CSSTransition } = require('react-transition-group');
                   const { useRef, createElement } = require('react');
                   const nodeRef = useRef(null);
                   const toRender = createElement(CSSTransition, {nodeRef: nodeRef}, createElement('div', null));`,
            errors: [{ messageId: 'connectNodeRef' }],
        },
    ],
});
