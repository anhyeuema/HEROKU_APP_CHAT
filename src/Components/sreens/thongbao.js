import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import io from 'socket.io-client/dist/socket.io.js';

var e;
export default class thongbao extends Component {

    constructor(props) {
        super(props);
        e = this;
        this.socket = io('http://192.168.0.101:3500', { jsonp: false });
        this.state = {
            dsmangSocketID: null,
        };

        this.socket.on('server-send-danhsach-socketID', mangSoketID => {
            console.log('mangSocketID:::', mangSoketID);
            e.setState({
                dsmangSocketID: mangSoketID
            });
            console.log('this.state.dsmangSocketID:::', this.state.dsmangSocketID);
        });
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#C3DFF3' }}>
                <Text> Component thongbao</Text>

                <FlatList
                    data={this.state.dsmangSocketID}
                    renderItem={({item}) => 
                        <TouchableOpacity>
                            <Text>{item.key}</Text>
                            <Text>{item.skID}</Text>
                        </TouchableOpacity>
                    }
                />
            </View>
        );
    }
}