# Generate icon fonts by one command

CLI usage
```
rakufontsgenerator -f path/entry.js
```


a entry file sample
```
module.exports = {
    // 图标文件夹
    src: '/Users/hehe/Sites/iconfont-builder/svg/',
    // 字体生成位置
    dest:'/Users/hehe/Sites/fontsgenerator/dist/',
    // dest:'/Users/hehe/repos/site_web/static/fonts/',
    // 生成字体名称
    fontName: 'icomoon',//font-family 的名字
    // 生成 class 的前缀
    prefix: 'icon-',
    // 是否生成 HTML 页面
    demoPage: 1
}

```