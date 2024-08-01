module.exports = {
  dependencies: {
    'react-native-reanimated': {
      platforms: {
        web: {
          cmake: {
            config: {
              plugin: require('react-native-reanimated/plugin')
            }
          }
        }
      }
    }
  }
};