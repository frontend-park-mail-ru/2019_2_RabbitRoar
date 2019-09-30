const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './js/index.js', 
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {},
      },
      {
        test: /\.s[ac]ss$/i, 
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ]
      },
      { 
        test: /\.pug$/,
        use: ['pug-loader']
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CopyPlugin([
      { from: 'index.pug', to: '' },
    ]),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.pug'
    }),
  ],
  devtool: 'source-map',  // Source map generations
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    liveReload: true,
    port: 8000,
  }
  // watch: true`
};