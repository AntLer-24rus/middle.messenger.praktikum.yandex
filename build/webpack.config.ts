/* eslint-disable import/no-extraneous-dependencies */
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import * as webpack from 'webpack'
import 'webpack-dev-server'

const getRoot = (dir: string): string => {
  if (fs.existsSync(path.resolve(dir, 'package.json'))) {
    return dir
  }
  return getRoot(path.resolve(dir, '..'))
}

const isDevelopment = process.env.NODE_ENV === 'development'
const projectRoot = getRoot(__dirname)

const PATHS = {
  src: path.resolve(projectRoot, 'src'),
  dist: path.resolve(projectRoot, 'dist'),
  build: path.resolve(projectRoot, 'build'),
}

const config: webpack.Configuration = {
  mode: 'development',
  target: 'web',
  entry: path.resolve(PATHS.src, 'index.ts'),
  output: {
    path: PATHS.dist,
    filename: '[name]-[fullhash].js',
    chunkFilename: '[name].bundle-[fullhash].js',
    publicPath: '/',
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  resolve: {
    alias: {
      'handlebars/runtime': 'handlebars/dist/handlebars.runtime.js',
    },
    extensions: ['.ts', '.js', '.scss'],
  },
  devServer: {
    static: {
      directory: PATHS.dist,
    },
    compress: true,
    hot: true,
    port: 3000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(projectRoot, 'tsconfig.json'),
            },
          },
        ],
        exclude: /(node_modules)/,
      },
      {
        test: /\.hbs$/,
        use: [
          {
            loader: path.resolve(PATHS.build, 'hbs-loader.ts'),
            options: {
              ignorePartials: true,
              knownHelpersOnly: false,
              ignoreHelpers: true,
            },
          },
        ],
        exclude: /(node_modules)/,
      },
      {
        test: /\.module\.s(a|c)ss$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
                hashStrategy: 'minimal-subset',
              },
              sourceMap: isDevelopment,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module\.(s(a|c)ss)$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '*',
          context: path.resolve(PATHS.src, 'assets', 'favicons'),
          to: './',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(PATHS.src, 'index.html'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? '[name].css' : '[name].[fullhash].css',
      chunkFilename: isDevelopment ? '[id].css' : '[id].[fullhash].css',
    }),
  ],
}

export default config
