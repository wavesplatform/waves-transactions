const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist/min'),
        filename: 'waves-transactions.min.js',
        library: {
            name: 'WavesTransactions',
            type: 'umd',
        },
        globalObject: 'this',
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                parallel: true,
                terserOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                    },
                    output: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(__dirname, 'tsconfig.json'),
                            compilerOptions: {
                                module: 'esnext',
                            },
                        },
                    },
                ],
            },
        ],
    },
    stats: {
        colors: true,
        modules: false,
        children: false,
    },
};
