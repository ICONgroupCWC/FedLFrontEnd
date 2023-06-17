module.exports = {

    webpack: {
        configure: {
            experiments: {
                topLevelAwait: true,
            },
            resolve: {
                fallback: { "crypto": false },
            },
        },

    },

};