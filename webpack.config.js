module.exports = {
    entry: "./js/index.js",
    output: {
        path: __dirname,
        filename: "output.js",
    },
    module: {
        loaders: [
            {
                test: /\.jsx|\.js$/,
                exclude: /(node_modules|vendor)/,
                loader: "babel-loader",
                query: {
                    presets: ["react", "env"],
                    plugins: ["transform-object-rest-spread"]
                },
            }
        ],
    }
};
