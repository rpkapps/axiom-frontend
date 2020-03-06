const ThemeLessPlugin = require('./libs/ui/src/styles/plugins/theme.js');

module.exports = (config, options) => {
  // TODO RK: enable when the theme plugin is fixed
  // config.module.rules.push({
  //   test: /\.less$/,
  //   use: [
  //     {
  //       loader: 'less-loader',
  //       options: {
  //         sourceMap: options.sourceMap,
  //         javascriptEnabled: true,
  //         paths: (options.stylePreprocessorOptions &&  options.stylePreprocessorOptions.includePaths) || [],
  //         plugins:[ThemeLessPlugin]
  //       }
  //     }
  //   ]
  // });
  return config;
};
