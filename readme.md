# Generate icon fonts by one command

Forked from: https://github.com/malcolmyu/iconfont-builder

[![Build Status](https://travis-ci.org/lumixraku/fontsgenerator.svg?branch=master)](https://travis-ci.org/lumixraku/fontsgenerator)


## Installation
```
npm install rakufontsgenerator -g
```

## Tests

```
npm test
```

## CLI usage
```
rakufontsgenerator -f path/entry.js
```


## a sample entry file
```
module.exports = {
    // the directory where the svg files are stored
    src: '/Users/hehe/Sites/icons/svg/',
    // the directory that you want to store the generated fonts
    dest:'/Users/hehe/repos/site/static/fonts/',
    // the name of generated fonts
    fontName: 'icomoon',
    // the prefix for the css class
    prefix: 'icon-',
    // whether to generate demo HTML page
    demoPage: 1
}

```