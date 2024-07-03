const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    publicPath: "http://localhost:4202/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "report",
      filename: "remoteEntry.js",
      exposes: {
        './Module': './src/app/report/report.module.ts',
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
      },
    }),
  ],
};
