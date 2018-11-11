const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './example/index.js',
  plugins: [
    new HtmlWebpackPlugin()
  ],
  devServer: {
    host: '0.0.0.0',
    open: true
  }
}
