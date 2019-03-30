
import NavigationExperimental from 'react-native-deprecated-custom-components';

import React, { Component } from 'react';


import ChatCaNhan from '../chat/chatCaNhan';

import ChatSocketID from '../chat/ChatSocketID';
import ChatSocketUsername from '../chat/ChatSocketUsername';
import ChatSocketPhong from '../chat/ChatSocketPhong'

import StatusView from './StatusView';
import Messenger from './Messenger';
import Thongbao from './thongbao';




export default class Status extends Component {
    render() {
        return (
            <NavigationExperimental.Navigator
                initialRoute={{ name: 'STATUS' }}
                renderScene={(route,navigator) => {
                    switch (route.name) {
                        case 'MESSENGER': return <Messenger navigator={navigator} />;
                        case 'STATUS': return <StatusView navigator={navigator} />;
                        case 'Chat_Ca_Nhan': return <ChatCaNhan navigator={navigator} />;
                        case 'Chat_Socket_ID' : return <ChatSocketID navigator={navigator} itemskID={route.itemskID} />
                        case 'Chat_Socket_Username' : return <ChatSocketUsername navigator={navigator} itemskID={route.itemskID} dsSoketUsername={route.dsSoketUsername} Username={route.Username} key1={route.key1} />
                        case 'Chat_Socket_Phong' : return <ChatSocketPhong navigator={navigator} />
                       // default: return <chatCaNhan navigator={navigator} />;
                    }
                }}
            />
        );
    }
}
