module.exports = {
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.output.publicPath = '';
      // config.target = 'electron-renderer';
      for (const plug of config.plugins) {
        if (plug && plug.filename && plug.filename.startsWith('css/')) {
          plug.filename = plug.filename.substr(4)
        }
      }
    }
  }
}
