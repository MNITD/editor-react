const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(['build'],  {exclude: [ 'index.html' ]}),
        new UglifyJsPlugin(),
        // new StyleExtHtmlWebpackPlugin(),
    ],
});