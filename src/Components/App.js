/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import NavigationExperimental from 'react-native-deprecated-custom-components'; //yarn add react-native-deprecated-custom-components
import Trangchu from './Trangchu';
import Authentication from './Authentication/Authentication';
import User from './User/User';



import refreshTokenApp from '../../api/refreshTokenApp'; //kiem tra token 


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timePassed: false,
        }
    }

    /*
    componentDidMount() {

        /*
        var time = 6000;
        //sau 1 khoang thoi gian vi du time = 60000(ms)=60(s) thi ap se lai  thuc hien ham refreshTokenApp(); 1 lan
        setInterval(() => {
           //cu sau time tinh bang miligiay  thi thuc hien ham refreshTokenApp()  lan
           refreshTokenApp();
        }, time);//tinh bang mili  giay (1000ms= 1s)
        */
        

        /*
        setTimeout(() => {
            this.setState({
                timePassed: true //neu timePassed = true khac voi khi bat dat = false sau 1 khoang thoi gian 10000(ms) thi ap se lai  thuc hien ham refreshTokenApp(); 1 lan
            });
            refreshTokenApp();
        }, 10000);
        */
      /*  
    }
    */
    render() {
        return (
            <NavigationExperimental.Navigator
                initialRoute={{ name: 'TRANG_CHU' }}

                renderScene={(route, navigator) => {
                    switch (route.name) {
                        case 'TRANG_CHU': return <Trangchu navigator={navigator} />;
                        case 'AUTHENTICATION': return <Authentication navigator={navigator} />;
                        default: return <User navigator={navigator} />;
                    
                    }
                }}
            />
        );
    }
}
