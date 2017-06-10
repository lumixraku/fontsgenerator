#!/usr/bin/env node
/*
 Author: lumixraku <lumixraku@gmail.com>
 */

'use strict';

var builder = require('./src/index.js');
var argv = require('optimist').argv;


var entryConfPath = argv.f;
var entryConf = require(argv.f)

//builder(entryConf)得到 Promise  Promise.catch 处理异常
builder(entryConf).then((res) => {
    console.log(res)
})
.catch(e => {console.log(e)})