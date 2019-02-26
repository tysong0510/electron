const webpack = require('webpack');

process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  lintOnSave: false,
  publicPath: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,
  configureWebpack: {
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 6
      })
    ]
  },
  pwa: {
    name: 'Voxpop Games',
    themeColor: '#10132B',
    msTileColor: '#10132B',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: '#10132B'
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  css: {
    //modules: true,
    sourceMap: process.env.NODE_ENV !== 'production'
  }
};
