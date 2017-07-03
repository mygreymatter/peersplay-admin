const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        bundle: './js/main.js',
        vendor: ["jquery", "vue", "vue-router", "axios", "vue-cookie"]
    },
    output: {
        path: path.resolve(__dirname + "/js/dist"),
        filename: '[name].js'

    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {}
                // other vue-loader options go here
            }
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.common.js'
        }
    },
    plugins: [new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor']
    }), new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    })]
}

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            sourcemap: true,
            compress: {
                warnings: false
            }
        })
    )

    module.exports.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    )
}