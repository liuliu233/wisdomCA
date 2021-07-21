const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'index': './js/lay-module/layuimini/miniAdmin.js',
    'map': './js/map.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    port: 3000,
    clientLogLevel: 'none',
    stats: 'errors-only'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      template: './index.html',
      filename: 'index.html'
    }),
    new HtmlPlugin({
      template: './page/map.html',
      filename: 'map.html',
      chunks: ['map']
    })
  ]
};
