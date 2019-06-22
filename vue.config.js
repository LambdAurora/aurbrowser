module.exports = {
  publicPath: '/',
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/sw.js'
    },
    "themeColor": '#FFA000'
  },
  chainWebpack: config => {
    config.module.rule('loaders')
      .test(/\.(png|svg|gif|md)$/)
      .use('file')
      .loader('file-loader')
      .end();
  }
};
