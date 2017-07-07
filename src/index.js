"use strict";

let fs = require('fs');
let path = require('path');
let Q = require('q');
let _ = require('underscore');
let mkdirp = require('mkdirp');

let defer = require('./defer');
let fontGenerator = require('./fontGenerator');
let parser = require('./svgFontParser');
let DEFAULT_OPTIONS = {
  readFiles: true,
  writeFiles: true,
  fontName: 'iconfont',
  startCodePoint: 0xE000,
  src: '.',
  dest: '.',
  descent: 0,
  demoPage: 1,
};


//由于要给外部的 fontgenerator 调用 最好有返回值
function builder(options) {
  let svgfiles = fs.readdirSync(options.src);
  let prefix = options.prefix || '';
  let iconconf = [];
  svgfiles.forEach(fname => {
    if(/.*\.svg$/.test(fname)){
      iconconf.push({
        'name': prefix + fname.slice(0, fname.length - 4),
        'file': fname  //file 是后面 fontGenerator 读取文件用
      });
    }
  });

  options = _.extend({}, DEFAULT_OPTIONS, options, { icons: iconconf });
  options.ascent = 1024 - options.descent;

  // 填充 icons 数据
  let icons = fillIcons(options);
  options.icons = icons;

  //then 的 fn 的参数都是前一个 promise resolve 的结果
  let def = defer();
  mkdirp(options.dest, function () {
    //略微处理下再返回  有些 buffer 值就不要返回了
    // def.resolve(fontGenerator(options));
    //PS then的函数参数是上次 promise resolve 的结果
    //注意 then 返回的是一个 Promise
    let fontProList = fontGenerator(options).then((res) => {
      return res.map((resovleData) => {
        return resovleData.path;
      });
    })
    // console.log(fontProList)
    def.resolve(fontProList);
  });
  return def.promise;
}


function fillIcons(options) {
  // 如果有 icons 数据，确保数据不为空

  var baseCode = options.startCodePoint;
  var codeSet = options.icons.map(function (icon) {
    return icon.codepoint;
  });

  _.each(options.icons, function (icon) {
    // name 是必备的
    if (!icon.name) {
      throw new Error('icon ' + icon.file + ' has no name');
    }

    // 如果没有编码，则进行自动生成
    if (!icon.codepoint) {
      while (codeSet.indexOf(baseCode) > -1) {
        baseCode++;
      }
      icon.codepoint = baseCode++;
    }
    icon.xmlCode = '&#x' + icon.codepoint.toString(16) + ';';
    icon.cssCode = '\\' + icon.codepoint.toString(16);
  });
  return options.icons




}






module.exports = builder;
