const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper asset handling
config.resolver.assetExts.push('db');

// Add support for additional file types if needed
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'json');

// Ensure proper module resolution
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

module.exports = config;