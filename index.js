/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './src/App';
import {Text, TextInput} from 'react-native';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import {playbackService} from './musicPlayerService';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

LogBox.ignoreAllLogs(true);
AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => playbackService);
