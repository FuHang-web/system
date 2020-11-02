// const path = require('path') // 自己添加的
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        // path.resolve(__dirname, './src/assets/common/global.less') // 自己添加的, less全局变量所在文件
      ]
    }
  }
}
