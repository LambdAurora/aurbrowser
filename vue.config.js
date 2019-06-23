module.exports = {
  publicPath: '/',
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/sw.js',
      importWorkboxFrom: 'local'
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
