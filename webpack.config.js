/**
 * Created by bogdan on 07.03.18.
 */
const path = require('path');
const distPath = path.join(__dirname, 'build');

module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        path:distPath,
        filename: 'bundle.js',
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
    },
    devtool: 'source-map',
    devServer: {
        contentBase: distPath,
        historyApiFallback: true,
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
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader', // creates style nodes from JS strings
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS
                }, {
                    loader: 'sass-loader', // compiles Sass to CSS
                }],
            },
        ],

    },
};