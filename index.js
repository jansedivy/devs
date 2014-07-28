#!/usr/bin/env node

var watchify = require('watchify');
var program = require('commander');

var browserify = require('browserify');
var path = require('path');

var server = require('./server');

program
  .version(require('./package.json').version)
  .option('-p, --port <n>', 'Port for http server', parseInt)
  .parse(process.argv);

var sourceFile = program.args[2];
var outputFile = program.args[3] || 'bundle.js';

var bundle;

if (sourceFile) {
  var browserifyArgs = { 
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true,
    basedir: process.cwd()
  };

  bundle = watchify(browserify(path.join(process.cwd(), sourceFile), browserifyArgs));
}

server.start(program.port, bundle, outputFile);
