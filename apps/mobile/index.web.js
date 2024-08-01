import { AppRegistry } from 'react-native';
import name from './app.json';
import App from './App';
import { enableExperimentalWebImplementation } from 'react-native-gesture-handler';

enableExperimentalWebImplementation(true);

AppRegistry.registerComponent(name, () => App);

AppRegistry.runApplication(name, {
  initialProps: {},
  rootTag: document.getElementById('app-root')
});