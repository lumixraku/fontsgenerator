var _ = require('underscore');

var builder = require('../../src/index.js');

var basePath = '';



describe('buidtest', function () {
  it('failed', function (done) {
    var options = {
      // icons: [
      //   {
      //     name: 'fontname',
      //     file: 'test.svg'
      //   }
      // ],
      src: './test/build/svg',
      dest: './test/build/dist/',
      fontName: 'testfont',
      readFiles: true,
      writeFiles: true,
      startCodePoint: 57344,
      descent: 0,
      demoPage: 1,
      prefix: 'icon-'
    };

    builder(options)
      .then(function (res) {
        var extlist = [];
        extlist = res.map(function(path){
          return path.match(/.*\.([A-z]{3,4})/)[1];
        });
        if(extlist.indexOf('svg') === -1){
          done(new Error('svg not found'))
        }else if(extlist.indexOf('woff') === -1){
          done(new Error('woff not found'))
        }else if(extlist.indexOf('eot') === -1){
          done(new Error('eot not found'))
        }else if(extlist.indexOf('ttf') === -1){
          done(new Error('ttf not found'))
        }else{
          done();
        }
      }).catch(e => {
        console.log(e)
        done(new Error(e.toString()));
      })
  });
});