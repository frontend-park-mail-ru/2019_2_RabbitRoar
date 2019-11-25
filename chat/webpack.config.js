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
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/chat/",
    //publicPath: "/", for dev-server
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
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ["@babel/plugin-transform-runtime", "@babel/plugin-proposal-class-properties"],
            presets: ["@babel/preset-env"]
          }
        }
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CopyPlugin([
      { from: 'index.pug', to: '' },
      { from: 'static', to: 'static' },
    ]),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.pug'
    })
  ],
  devtool: 'source-map',  // Source map generations
  devServer: {
    https: true,
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    liveReload: true,
    port: 8081,
  }
  // watch: true`
};