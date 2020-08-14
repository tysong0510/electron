// const webpack = require('webpack');

process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  lintOnSave: true,
  publicPath: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,
  // Commented because it breaks main page in multipage setup.
  /* configureWebpack: {
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 6
      })
    ]
  }, */
  pwa: {
    name: "Voxpop Games",
    themeColor: "#10132B",
    msTileColor: "#10132B",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "#10132B"
  },
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    },
    electronBuilder: {
      builderOptions: {
        appId: "voxpop.id",
        mac: {
          category: "voxpop.category"
        },
        protocols: {
          name: "voxpop-protocol",
          schemes: ["voxpop"]
        },
        win: {
          publisherName: "VoxPop Games Inc"
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },

        extraResources: [
          {
            from: "node_modules/regedit/vbs",
            to: "regedit/vbs",
            filter: ["**/*"]
          }
        ]
      }
    }
  },
  css: {
    // modules: true,
    sourceMap: process.env.NODE_ENV !== "production"
  },
  pages: {
    main: {
      // entry for the page
      entry: "src/main.js",
      // the source template
      template: "public/index.html",
      // output as dist/index.html
      filename: "index.html"
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      // chunks: ['chunk-vendors', 'chunk-common', 'main']
    },
    webtorrent: {
      // entry for the page
      entry: "src/webtorrent.js",
      // the source template
      template: "public/webtorrent.html",
      // output as dist/index.html
      filename: "webtorrent.html"
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      // chunks: ['chunk-vendors', 'chunk-common', 'webtorrent']
    }
    // ,
    /*externalLink: {
      //entry for the page
      entry: "src/externalMain.js",
      //the source template
      template: "public/externalLink.html",
      //output as dist/index.html
      filename: "externalLink.html"
    }*/
  }

  /* devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /\/index/, to: '/index.html' },
        { from: /\/webtorrent/, to: '/webtorrent.html' }
      ]
    }
  } */
};
