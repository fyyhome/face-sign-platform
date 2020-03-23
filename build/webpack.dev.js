const webpack = require('webpack');
const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
    mode: 'development',
    devServer: {
        port: 9000,
        hot: true,
        open: true,
        historyApiFallback: true,
        compress: true,
        proxy: {}
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'eval-source-map'
});
