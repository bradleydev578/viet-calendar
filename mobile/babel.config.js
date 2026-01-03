module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@core': './src/core',
          '@hooks': './src/hooks',
          '@stores': './src/stores',
          '@theme': './src/theme',
          '@utils': './src/utils',
          '@assets': './src/assets',
          '@data': './src/data',
        },
      },
    ],
  ],
};
