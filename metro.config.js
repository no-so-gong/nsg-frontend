const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // svg 처리 설정
  config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

  config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
  config.resolver.sourceExts.push('svg');

  return config;
})();
