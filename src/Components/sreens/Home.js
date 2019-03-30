import React,{Component } from 'react';
import {View, TouchableOpacity,Text } from 'react-native';

export  default class Home extends Component {
  render() {
    return(
      <View style={{ flex: 1, backgroundColor: '#1D5139'}}>
        <Text>Component Home</Text>
      </View>
    );
  }
}
