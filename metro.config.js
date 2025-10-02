const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add your custom extensions to the existing ones
config.resolver.sourceExts.push('cjs');
config.resolver.assetExts.push('glb', 'gltf', 'mtl', 'obj', 'OBJ');

module.exports = config;