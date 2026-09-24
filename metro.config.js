const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Permite importar arquivos .svg como componentes (ex: import IconeMenu from '../../assets/icons/menu.svg')
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer/expo');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = config;
