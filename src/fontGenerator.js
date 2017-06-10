"use strict";

// Buffer 类以一种更优与更适合 Node.js 用例的方式实现了 Uint8Array API。
// 你可以认为 Buffer 就是 Unit8Array

let fs = require('fs');
let path = require('path');
let Q = require('q');
let _ = require('underscore');
let svgicons2svgfont = require('svgicons2svgfont');
let svg2ttf = require('svg2ttf');
let ttf2eot = require('ttf2eot');
let ttf2woff = require('ttf2woff');
let handlebars = require('handlebars');
let defer = require('./defer');
//生成字体的目录
let destFile;


function generateSvg(icons, svgOpts, options) {
  destFile = options.dest + options.fontName;
  let fontStream = svgicons2svgfont(svgOpts);
  let fontSvgPath = destFile + '.svg';
  let def = defer();
  // Setting the font destination
  fontStream.pipe(fs.createWriteStream(fontSvgPath))
    .on('finish', function () {
      def.resolve({
        path: fontSvgPath
      });
      console.log('svg created!')
    })
    .on('error', function (err) {
      console.log(err);
    });
  _.each(icons, function (icon) {
    try {
      let glyph;
      let iconFile = path.join(options.src, icon.file);
      glyph = fs.createReadStream(iconFile);

      glyph.metadata = {
        name: icon.name,
        unicode: [String.fromCharCode(icon.codepoint)]
      };
      fontStream.write(glyph);
    } catch (e) {
      def.reject(e);
      return false;
    }
  });

  // Do not forget to end the stream
  fontStream.end();
  return def.promise;

}

function generateTtf(param) {
  // svg2ttf使用官方例子
  // let ttf = svg2ttf(fs.readFileSync('myfont.svg', 'utf8'), {});
  // fs.writeFileSync('myfont.ttf', new Buffer(ttf.buffer));
  // 可见svg2ttf 接收一个输入流
  let def = defer();
  try {
    let fontTtfPath = destFile + '.ttf';
    let ttf = svg2ttf(fs.readFileSync(destFile + '.svg', 'utf8'), {});
    //ttf.buffer 是 Uint8Array
    //第二参数的类型 <string> | <Buffer> | <Uint8Array>
    fs.writeFileSync(fontTtfPath, new Buffer(ttf.buffer));
    def.resolve({
      path: fontTtfPath,
      data: ttf.buffer
    });
  } catch (e) {
    def.reject(e)
  }
  return def.promise;
}


function generateWoff(res) {
  let fontTtfBuffer = res.data;
  let def = defer();
  try {
    //看源码  ttf2woff接收的是一个数组(应该是 Uint8Array) 并且会将数组转为 Buffer (Buffer.from接收的数组实际上也是 Uint8Array数组)
    let fontWoffPath = destFile + '.woff';
    let woff = ttf2woff(fontTtfBuffer);
    // fs.writeFileSync(fontWoffPath, new Buffer(woff.buffer));
    fs.writeFileSync(fontWoffPath, woff.buffer);
    def.resolve({
      path: fontWoffPath
    });
  } catch (e) {
    def.reject(e)
  }
  return def.promise;

}




function generateEot(res) {
  let ttfFont = res.data;
  let def = defer();
  try {
    let fontEotPath = destFile + '.eot';
    let eot = ttf2eot(new Uint8Array(ttfFont));
    fs.writeFileSync(fontEotPath, eot.buffer);
    def.resolve({
      path: fontEotPath
    });
  } catch (e) {
    def.reject(e)
  }
  return def.promise;
}

/**
 * 生成方便用户查看字体的 html
 *
 * @param {Object} options
 */

function generateHtml(options) {
  let tmpPath = path.join(__dirname, '../template/html.handlebars');
  options.timestamp = +new Date;
  let def = defer();
  fs.readFile(tmpPath, 'utf-8', (err, source) => {
    let fontHtmlPath = destFile + '.html';
    let template = handlebars.compile(source);
    fs.writeFileSync(fontHtmlPath, template(options));
    def.resolve(fontHtmlPath);
  });
  return def.promise;
}



//最好要有返回值  不然不好测试
function fontGenerator(options) {
  // 使用 ascent 和 descent 进行字体的基线调整
  let svgOpts = _.pick(options,
    'fontName', 'ascent', 'descent'
  );

  //不做下面配置的话，会有如下警告
  // The provided icons does not have the same height it could lead to unexpected results.
  // Using the normalize option could solve the problem.
  svgOpts = Object.assign({}, svgOpts, {
    normalize: 1,// 大小统一
    fontHeight: 1024, // 高度统一为1024
    round: 1000, // path值保留三位小数
    log: () => { } // 沉默控制台输出
  });

  let svgPromise = generateSvg(options.icons, svgOpts, options);

  // ttf 依赖 svg 的生成
  //PS then 返回一个 Promise
  let ttfPromise = svgPromise.then(generateTtf);
  let woffPromise = ttfPromise.then(generateWoff);
  let eotPromise = ttfPromise.then(generateEot);
  // 最后生成 html
  if (options.demoPage) {
    generateHtml(options);
  }

  //测试时用 通知调用方生成字体后的状态
  return Promise.all([svgPromise, ttfPromise, woffPromise, eotPromise]);
}

module.exports = fontGenerator;
