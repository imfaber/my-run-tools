const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

module.exports = {
    stories: ['../components/**/*.stories.[tj]s'],

    addons: [
        '@storybook/addon-viewport/register',
        '@storybook/addon-docs'
    ],

    webpackFinal: async (config) => {
        config.resolve.extensions.push(
            '.ts',
            '.js',
            '.tsx',
            '.vue',
            '.css',
            '.scss',
            '.sass',
            '.html',
            '.svg'
        );

        // Typescript
        config.module.rules.push({
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                        transpileOnly: true
                    }
                }
            ]
        });

        // Style
        config.module.rules.push({
            test: /\.s[ac]ss$/i,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }
            ]
        });

        // Path aliases
        config.resolve.alias['@'] = path.resolve(__dirname, '..');
        config.resolve.alias['~'] = path.resolve(__dirname, '..');

        config.plugins.push(new ForkTsCheckerWebpackPlugin());

        return config;
    }
};
