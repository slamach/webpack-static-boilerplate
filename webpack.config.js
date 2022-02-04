const path = require('path');
const glob = require('glob');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackBar = require('webpackbar');

const isDev = process.env.NODE_ENV === 'development';

const config = {
  entry: ['./js/index.js', './scss/style.scss'],
  outputDir: 'build',
  ignoreMissingHtmlResources: false,
  devServerPort: 3000,
};

const generateHtmlPlugins = () =>
  glob.sync('./src/*.html').map((dir) => {
    const filename = path.basename(dir);
    return new HtmlWebpackPlugin({
      filename,
      template: path.resolve(__dirname, 'src', filename),
    });
  });

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: config.entry,
  output: {
    filename: isDev ? 'js/bundle.js' : 'js/bundle.[contenthash:8].js',
    path: path.resolve(__dirname, config.outputDir),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            sources: {
              urlFilter: (attribute, value, resourcePath) => {
                if (/^\.\//.test(value)) {
                  return false;
                }

                return config.ignoreMissingHtmlResources
                  ? fs.existsSync(path.resolve(__dirname, 'src', value))
                  : true;
              },
            },
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
              sourceMap: isDev,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: isDev,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|webp|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
        use: {
          loader: 'image-webpack-loader',
          options: {
            disable: isDev,
          },
        },
      },
      {
        test: /\.(mp4|webm)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
      },
      {
        test: /\.(otf|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    ...generateHtmlPlugins(),
    new CopyPlugin({
      patterns: [{ from: 'static' }],
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? 'css/style.css' : 'css/style.[contenthash:8].css',
    }),
    ...(!isDev ? [new WebpackBar()] : []),
  ],
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    hot: true,
    open: true,
    port: config.devServerPort,
  },
  stats: 'errors-warnings',
  performance: {
    hints: false,
  },
};
