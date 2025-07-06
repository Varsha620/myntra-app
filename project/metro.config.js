const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper asset handling
config.resolver.assetExts.push('db');

// Add support for additional file types if needed
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'json');

// Ensure proper module resolution
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

// Add resolver alias for better module resolution
config.resolver.alias = {
  '@': __dirname,
};

// Transformer configuration for better compatibility
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  minifierConfig: {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
};

// Serializer configuration
config.serializer = {
  ...config.serializer,
  customSerializer: null,
};

module.exports = config;