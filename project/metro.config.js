const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper asset handling
config.resolver.assetExts.push('db');

// Add support for additional file types
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'json');

// Ensure proper module resolution
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

// Transformer configuration for better compatibility
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
};

// Fix for React Native 0.79+ compatibility
config.resolver.unstable_enablePackageExports = false;

module.exports = config;