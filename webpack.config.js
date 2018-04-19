/**
 * Created by bogdan on 07.03.18.
 */
const path = require("path");
const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
    context: path.resolve(__dirname, "app"),
    entry: ["./src/index.js"],
    output: {
        path: path.resolve(__dirname, "server/public/build"), // app/build
        filename: "bundle.js",
        publicPath: '/build/'
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, "server/public"),
        inline: true,
        // proxy: {
        //     "*": "http://localhost:8080"
        // },
        publicPath: '/build/',
        filename: "bundle.js"
    },
    plugins: [
        new LiveReloadPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            }
        ],

    }
};