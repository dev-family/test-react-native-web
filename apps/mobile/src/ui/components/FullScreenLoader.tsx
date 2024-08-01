import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Colors} from '../constants/colors';

export const FullScreenLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.text}></ActivityIndicator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
