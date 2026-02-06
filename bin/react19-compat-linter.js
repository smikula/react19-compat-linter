#!/usr/bin/env node

const { runLinter } = require('../lib/runLinter');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Error: Please provide the path to the modules list file');
    console.error('Usage: react19-compat-linter <modules-list.json>');
    process.exit(1);
}

const modulesListPath = args[0];

runLinter(modulesListPath)
    .then(() => {
        process.exit(0);
    })
    .catch(error => {
        console.error('Error running linter:', error);
        process.exit(1);
    });
