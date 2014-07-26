#!/usr/bin/env node

var watchify = require('watchify');

var browserify = require('browserify');
var path = require('path');

var server = require('./server');

var sourceFile = process.argv[2];
var outputFile = process.argv[3] || 'bundle.js';

if (!sourceFile) {
  console.error('Specify main js file');
  return 1;
}

var browserifyArgs = { 
  cache: {},
  packageCache: {},
  fullPaths: true,
  debug: true,
  basedir: process.cwd()
};

var bundle = watchify(browserify(path.join(process.cwd(), sourceFile), browserifyArgs));

server.start(bundle, outputFile);
