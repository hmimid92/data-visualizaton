const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  module.exports = {
    mode: 'development',
    plugins: [new MiniCssExtractPlugin()],
    devServer: {
      static: path.resolve(__dirname, 'demo'),
      port: 8080,
      hot: true,
      liveReload: false
    },
        entry: './src/js/ScatterPlot_graph.js',
        output: {
             filename: 'app.js',
             path: path.resolve(__dirname,'demo/js'),
             publicPath: "demo"
        },
        module: {
          rules: [
            {
                mimetype: 'image/svg+xml',
                scheme: 'data',
                type: 'asset/resource',
                generator: {
                   filename: 'icons/[hash].svg'
                   }
            },
            {
              test: /\.(scss)$/,
              use: [
                {
                  loader: 'style-loader',
                  loader: MiniCssExtractPlugin.loader
                },
                {
                  loader: 'css-loader'
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: {
                      plugins: () => [
                        require('autoprefixer')
                      ]
                    }
                  }
                },
                {
                  loader: 'sass-loader'
                }
              ]
            },
            {
              test: /\.(eot|woff|woff2|ttf|svg)(\?\S*)?$/,
              use: [
                   {
                     loader: 'file-loader',
                     options: {
                              name: '[name].[ext]',
                              outputPath: '../fonts/',
                              publicPath: '../fonts/'
                     }
                   }
              ]
            }
          ]
        },      
        plugins: [
        new MiniCssExtractPlugin({
            filename: '../css/app.css'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
   ]
  }