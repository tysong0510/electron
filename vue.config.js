process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  lintOnSave: false,
  publicPath: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,

  css: {
    modules: true,
    sourceMap: process.env.NODE_ENV !== 'production',
  },

  pwa: {
    name: 'voxpop',
    themeColor: '#10132B',
  },
};
