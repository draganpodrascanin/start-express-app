#!/usr/bin/env node

const argv = require('yargs').argv

console.log(argv)

const esm = require('esm');
esm(module/*, options*/);

const cli = require('../src/cli');
cli(argv);