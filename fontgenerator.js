#!/usr/bin/env node
/*
 Author: lumixraku <lumixraku@gmail.com>
 */

'use strict';

var builder = require('./src/index.js');
var argv = require('optimist').argv;


var entryConfPath = argv.f;
if (!argv.f) {
    console.log('missing entry path please specify with -f option');
} else {

    var entryConf = require(argv.f)

    //builder(entryConf)得到 Promise  Promise.catch 处理异常
    builder(entryConf).then((res) => {
        console.log(res)
    }).catch(e => { console.log(e) })
}
