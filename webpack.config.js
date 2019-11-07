const path = require('path');
const { JSDOM } = require('jsdom');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

class MyHtmlWebpackPlugin {
  // Remove `index.js` in `index.html`
  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    compiler.hooks.compilation.tap('MyHtmlWebpackPlugin', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
        'MyHtmlWebpackPlugin',
        (data, cb) => {
          const dom = new JSDOM(data.html);
          const { document } = dom.window;
          document
            .querySelectorAll('[href="index.js"],[src="index.js"]')
            .forEach(ele => ele.remove());
          data.html = dom.serialize();
          cb(null, data);
        },
      );
    });
  }
}

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './fe/index.js',
  output: {
    path: path.resolve(__dirname, 'fe/dist'),
    filename: 'index.[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'minify-lit-html-loader',
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MyHtmlWebpackPlugin(),
    new HtmlWebpackPlugin({
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
    host: '0.0.0.0',
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
