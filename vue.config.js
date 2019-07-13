module.exports = {
  publicPath: '/',
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/sw.js',
      importWorkboxFrom: 'local'
    },
    iconPaths: {
      favicon32: 'ressources/icons/aurbrowser_blue_32.png',
      favicon16: 'ressources/icons/aurbrowser_blue_16.png',
      appleTouchIcon: 'ressources/icons/aurbrowser_blue_apple-touch.png',
      maskIcon: 'icons/safari-pinned-tab.svg',
      msTileImage: 'ressources/icons/aurbrowser_blue_ms144.png',
    },
    "themeColor": '#FFA000'
  },
  chainWebpack: config => {
    config.module.rule('loaders')
      .test(/\.(png|svg|gif)$/)
      .use('file')
      .loader('file-loader')
      .end()
      .test(/\.(md)$/)
      .use('file')
      .loader('raw-loader')
      .end();
  }
};
