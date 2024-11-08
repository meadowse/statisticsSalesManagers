const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@components': path.resolve(__dirname, './src/components'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@services': path.resolve(__dirname, './src/services'),
            '@helpers': path.resolve(__dirname, './src/helpers'),
            '@data': path.resolve(__dirname, './src/data')
        }
    }
};
