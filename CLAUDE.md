# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React 19 compatibility linter that helps identify deprecated React APIs in your project's bundled dependencies. React 19 removed several deprecated APIs (`ReactDOM.render`, `findDOMNode`, `unmountComponentAtNode`), and this tool scans not just your code but all bundled packages in `node_modules` to identify compatibility issues.

### Architecture: Two-Part System

The package is intentionally split into two decoupled components:

1. **DependencyModuleListPlugin** (webpack plugin) - Extracts a JSON list of all JavaScript/TypeScript modules from `node_modules` during the webpack build
2. **runLinter** (ESLint runner) - Runs a custom ESLint rule against the extracted modules to detect React 19 incompatible APIs

**Why separate?** This allows users with non-webpack bundlers to generate their own module lists while still using the linting functionality. It also separates the slow linting process from the webpack build.

### Key Components

- **src/DependencyModuleListPlugin.ts** - Webpack plugin that hooks into `PROCESS_ASSETS_STAGE_REPORT` to extract all `.js/.jsx/.ts/.tsx/.mjs/.cjs` files from `node_modules`
- **src/runLinter.ts** - Runs ESLint with the custom rule and filters results to show only `react19-compat-linter/no-restricted-imports` violations
- **src/no-restricted-imports.ts** - Custom ESLint rule that detects three forms of restricted API usage:
  - Direct named imports: `import { findDOMNode } from 'react-dom'`
  - Namespace access: `ReactDOM.findDOMNode()`
  - Destructuring: `const { findDOMNode } = ReactDOM`
- **src/eslint.config.ts** - ESLint flat config that registers and enables the custom rule
- **bin/react19-compat-linter.js** - CLI entry point

## Common Commands

**Note: Always use yarn for development in this project.**

### Build
```bash
yarn build
```
Compiles TypeScript to `lib/` directory. Required before testing CLI or publishing.

### Test
```bash
yarn test
```
Runs all Jest tests (uses ts-jest preset).

Run a specific test file:
```bash
yarn test no-restricted-imports.test.ts
```

Run tests in watch mode:
```bash
yarn test --watch
```

### CLI Usage (after build)
```bash
node bin/react19-compat-linter.js ./modules-list.json
```

## Development Notes

### ESLint Rule Testing
Tests use `@typescript-eslint/rule-tester` which provides a structured way to test both valid and invalid code patterns. Each test case includes the code string and expected error messages.

### Default Restrictions
The ESLint rule defaults to restricting these react-dom APIs:
- `findDOMNode`
- `render`
- `unmountComponentAtNode`

The rule is configurable via the `restrictedImports` option to support other deprecated APIs or modules.

### Compilation Output
- TypeScript compiles to `lib/` with module system "nodenext"
- The CLI script in `bin/` requires compiled files from `lib/`
- Always run `yarn build` after TypeScript changes before testing the CLI

### Exports
The package exports two main items via `src/index.ts`:
- `DependencyModuleListPlugin` - for webpack configuration
- `runLinter` - for programmatic usage
