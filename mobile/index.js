/**
 * @format
 */

import {enableScreens} from 'react-native-screens';
import {Platform, Dimensions} from 'react-native';

// Disable native screens on Android tablets to prevent touch interception
// on the bottom tab bar. Native screen fragments can block touch dispatch
// to sibling views (tab bar) on large-screen Android devices.
const {width, height} = Dimensions.get('window');
const isAndroidTablet =
  Platform.OS === 'android' && Math.min(width, height) >= 600;
enableScreens(!isAndroidTablet);

import {AppRegistry, LogBox} from 'react-native';
import App from './src/app/App';
import {name as appName} from './app.json';

LogBox.ignoreLogs([
  'This method is deprecated',
  'ReactNativeFirebase',
]);

AppRegistry.registerComponent(appName, () => App);
