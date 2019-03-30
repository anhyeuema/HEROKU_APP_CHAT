import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Drawer from 'react-native-drawer';
import ControlPanel from './ControlPanal/Controlpanal';
import Main from './Main';

import saveToken from '../../api/saveToken';
import getToken from '../../api/getToken';
import kemtraToken from '../../api/kiemtraToken';
import global from '../../api/global';

export default class Trangchu extends Component {


    componentDidMount() { // getToken de lay token len se checkToken co Username tra ve cho a
        getToken('@token_time')
            .then(token_time_r => {
                console.log("token_time_r", token_time_r);
                kemtraToken(token_time_r)
                    .then(res => { // o day res = a; var a = JSON.parse(res._bodyText);
                        // console.log("token_time_r");
                        // console.log("token_time_r", res);
                        //console.log(JSON.parse(res._bodyText))
                        var a = JSON.parse(res._bodyText);
                        //  var a = res;
                        var username1 = a.Username;
                        saveToken('@Username', username1);
                        console.log('username trang chu::::', username1);
                        if ( username1 !== null ) {
                            console.log('bat dau tu trang chu truyen Username bang ham global sang cho Conponent Controlpanal su ly ');
                            global.OnSignIn(a.Username);
                            global.OnUser(a.Username);
                          //  global.OnSocketID(a.Username);
                        } else {
                            console.log('bat dau truyen Username rong [] tu ham global sang cho Conponent Controlpanal su ly ');
                       
                        }
                       // global.OnSignIn(a.Username);
                        //global.OnSignIn(a.username) 
                        //truyen gia tri username1 = a.username qua global bang module.exports {onSignIn: null}
                        // ban dau co  ham (OnSignIn = null). 
                        //truyen cho Ham OnSignIn cai bien xxx = a.username // xx gia su la user
                        //bien nay muon dung o dau thi chi can khai bao ham OnsignIn(xxx) {this.setState({ user }}
                        //va phai khai bao onSignIn la 1 ham bag cach trong cho ham constructor { global.onSignIn = this.onSignIn.bind(this);}
                        //OnsignIn la ten ham su dung qua global
                        //va can import vao componet chua OnsignIn thu module import global from '../global' 


                       
                        var token_time_1 = a.token_time;
                        var token_new1 = a.token;
                        console.log('token_new1_ trang  chu::::', token_new1);
                        // e.setState({tokenNew: token_new1,token_time: token_new1,});
                        //  saveToken('@token', this.state.tokenNew);  
                        saveToken('@token', token_new1);
                        getToken('@token')
                            .then(token => {
                                console.log('token_new trang chu:::::', token);
                            }).catch(e => console.log(e));
                        saveToken('@token_time', token_time_1);
                        getToken('@token_time')
                            .then(token => {
                                console.log('token_time  trang chu:::::', token);
                            }).catch(e => console.log(e));

                    })
            })
    }

    
    closeControlPanel = () => {
        this._drawer.close()
    };
    openControlPanel = () => {
        this._drawer.open()
    };

    /*
    componentDidMount() {
        this._drawer.open()
    } */
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffff' }}>
                <Text style={styles.styleText}> Trangchu</Text>
                <Drawer

                    tapToClose={true} //hien controlra cho tapToClose={true}
                    openDrawerOffset={0.4} // 20% gap on the right side of drawer

                    ref={(ref) => this._drawer = ref}
                    content={< ControlPanel navigator={this.props.navigator} />}
                >
                    <Main  OnControl={() => this.openControlPanel()} navigator={this.props.navigator} />
                </Drawer>
            </View>
        );
    }
}

styles = StyleSheet.create({
    styleText: {
        fontSize: 6,
    },
});
