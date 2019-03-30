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

import StatusPublic from './StatusPublic';
import StatusUser from './StatusUser';
import StatusFriend from './StatusFriend';
import StatusCaNhan from './StatusCaNhan';
import ChatUsername from './ChatUsername';
import ChatUser from './ChatUser';
import ChatUser1 from './chatUser1';
import ChatUser2 from './chatUser2';
import ChatUser3 from './ChatUser3';
import ChatUser4 from './ChatUser4';
import ChatUser5 from './ChatUser5';
import ChatUser6 from './ChatUser6';
import ChatUser7  from './ChatUser7';
import ChatUser8 from './ChatUser8';
import ChatUser9 from './ChatUser9';


export default class Status1 extends Component {
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
                initialRoute={{ name: 'CHAT_USER8' }}

                renderScene={(route, navigator) => {
                    switch (route.name) {
                        case 'STATUS_PUBLIC': return <StatusPublic navigator={navigator} />;
                        case 'STATUS_USER': return <StatusUser navigator={navigator} User={route.User} />;
                        case 'STATUS_CANHAN': return <StatusCaNhan navigator={navigator} User={route.User} StatusUser_item={ route.StatusUser_item } />;
                        case 'CHAT_USERNAME': return <ChatUsername navigator={navigator} User={route.User} StatusUser_item={ route.StatusUser_item } />;
                        case 'CHAT_USER': return <ChatUser navigator={navigator} User={route.User} StatusUser_item={ route.StatusUser_item } />;
                        case 'CHAT_USER1': return <ChatUser1 navigator={ navigator } User={route.User} StatusUser_item={ route.StatusUser_item } />
                        case 'CHAT_USER2': return <ChatUser2 navigator={ navigator } User={route.User} StatusUser_item={ route.StatusUser_item } />
                        case 'CHAT_USER3': return <ChatUser3 navigator={ navigator } User={route.User} StatusUser_item={ route.StatusUser_item } />
                        case 'CHAT_USER4': return <ChatUser4 navigator={ navigator }  />
                        case 'CHAT_USER5': return <ChatUser5 navigator={ navigator }  />
                        case 'CHAT_USER6': return <ChatUser6 navigator={ navigator }  />
                        case 'CHAT_USER7': return <ChatUser7 navigator={ navigator }  />
                        case 'CHAT_USER8': return <ChatUser8 navigator={ navigator }  />
                        
                        default: return <StatusFriend navigator={navigator} />;
                    
                    }
                }}
            />
        );
    }
}
