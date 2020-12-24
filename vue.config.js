module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://www.kangliuyong.com:10002/",
        changeOrigin: true,
        ws: true,
        secure: false,
        pathRewrite: {
          '^/api': ''
        }
      },
    },
    overlay: {
      warnings: false,
      errors: false
    }
  },
  lintOnSave: false
};