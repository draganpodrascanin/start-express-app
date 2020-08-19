#!/usr/bin/env node
require = require('esm')(module /*, options*/);

const argv = require('yargs').argv;

// console.log(argv)
console.log(process.argv);
require('../src/cli').cli(process.argv, argv);
