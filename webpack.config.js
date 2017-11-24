'use strict'

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('[name]-bundle.css');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: {
    dngearsim: ['./app.js'],
    vendors: [
      'es5-shim',
      'es6-shim',
      'jquery',
      'angular',
      'angular-route',
      'angular-animate',
      'angular-translate',
      'angulartics',
      'angulartics-google-analytics',
      'bootstrap',
      'bootstrap/dist/css/bootstrap.min.css',
      'bootstrap/dist/css/bootstrap-theme.min.css',
      'lodash',
      'file-saver',
      'lz-string',
      'firebase',
      'ng-infinite-scroll'
    ]
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, 'bin')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  },
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'ng-annotate-loader',
          },
          {
            loader: 'babel-loader',
            query: {
              presets: ['es2015'],
              cacheDirectory: true,
            }
          }
        ],
        exclude: /node_modules|built|test/,
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true 
            }
          }
        ],
        exclude: /node_modules|built|test/,
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
              removeComments: false,
              collapseWhitespace: false
            }
          }
        ],
        exclude: /index.html/,
      },
      {
        test: /\.eot$|\.woff2$|\.woff$|\.svg$|\.ttf$/,
        loader: 'file-loader?name=[name].[ext]',
      },
      {
        test: /\.png$|\.jpg$|\.jpeg$/,
        loader: 'file-loader?name=images/[name].[ext]',
      },
      {
        test: /\.css$/,
        use: extractCSS.extract(['css-loader'])
      },
      {
        test: /\.scss$/,
        use: extractCSS.extract({
          use: [{
                loader: 'css-loader' // translates CSS into CommonJS
            }, {
                loader: 'sass-loader' // compiles Sass to CSS
            }]
        })
      },
    ]
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    extractCSS,
    new webpack.optimize.CommonsChunkPlugin({name: 'vendors'}),
    new webpack.ProvidePlugin({
      'window.jQuery': 'jquery',
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};
