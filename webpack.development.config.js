/**
 GrblMgmr is a frontend application to interface with Grbl via GrblMQTT
 Copyright (C) 2016 Matti Eiden

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
    context: __dirname,
    entry: [
        'babel-polyfill',
        'react-hot-loader/patch',
        './assets/index'
    ],
    output: {
        path: path.resolve('./assets/bundles/'),
        filename: "main.js",
        publicPath: 'http://localhost:3000/assets/bundles/', // Tell django to use this URL to load packages and not use STATIC_URL + bundle_name
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            },
            '__DEVELOPMENT__': true
        }),
        new webpack.SourceMapDevToolPlugin(),
        new ExtractTextPlugin('styles/[name].[contenthash].css'),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(), // don't reload if there is an error
        new BundleTracker({filename: './webpack-stats.json'}),
    ],

    module: {
        loaders: [
            // we pass the output from babel loader to react-hot loader
            { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader'] },
            { test: /\.scss$/, exclude: /node_modules/, loaders: ['style-loader', 'css-loader?localIdentName=[path][name]--[local]', 'sass-loader']},
            {
                enforce: "post",
                include: [
                    path.resolve(__dirname, 'node_modules/plotly.js'),
                    path.resolve(__dirname, 'node_modules/gcode'),
                    path.resolve(__dirname, 'node_modules/mapbox-gl-shaders')
                ],
                loader: 'transform-loader?brfs'
            }
        ]
    },

    resolve: {
        modules: ['node_modules', 'bower_components'],
        extensions: ['.js', '.jsx']
    }
};