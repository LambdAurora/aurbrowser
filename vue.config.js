module.exports = {
  chainWebpack: config => {
    config.module.rule('loaders')
      .test(/\.(png|svg|gif|md)$/)
      .use('file')
      .loader('file-loader')
      .end();
  }
};
