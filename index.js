/** @format */

import {AppRegistry} from 'react-native';

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppChat);
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import App from './src/Components/App';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class AppChat extends Component<Props> {
  render() {
    return (
      <App />
    );
  }
}