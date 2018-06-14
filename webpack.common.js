const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ExtractTextPluginInstance = new ExtractTextPlugin('styles.css');
module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            // {
            //     test: /\.scss$/,
            //     use: [{
            //         loader: 'style-loader', // creates style nodes from JS strings
            //     }, {
            //         loader: 'css-loader', // translates CSS into CommonJS
            //     }, {
            //         loader: 'sass-loader', // compiles Sass to CSS
            //     }],
            // },
            {
                test: /\.scss$/,
                use: ExtractTextPluginInstance.extract({
                    use: [
                        {
                            loader: 'css-loader',
                        }, {
                            loader: 'sass-loader',
                        }],
                    fallback: 'style-loader',
                }),
                exclude: /node_modules/,
                // include: path.resolve(__dirname, '/app/scss'),
            },

        ],

    },
    plugins: [
        ExtractTextPluginInstance,
    ],
};