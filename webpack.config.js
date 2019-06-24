const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './fe/index.js',
  output: {
    path: path.resolve(__dirname, 'fe/dist'),
    filename: 'index.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      template: './fe/index.html',
    }),
    new CopyPlugin([
      { from: './fe/icons', to: 'icons' },
      './fe/manifest.json',
      './fe/serviceworker.js',
      './fe/paintworklet.js',
    ]),
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: './fe',
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'https://music.xianqiao.wang',
        pathRewrite: { '^/api': '/api' },
        secure: false,
        changeOrigin: true,
      },
    },
  },
};
