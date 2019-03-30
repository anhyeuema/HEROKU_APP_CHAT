import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import io from 'socket.io-client/dist/socket.io.js';

import global from '../../../api/global';
import getToken from '../../../api/getToken';
import saveToken from '../../../api/saveToken';
import User from '../User/User';

import ImagePicker from 'react-native-image-picker';

// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

export default class Controlpanal extends Component {

    constructor(props) {
        super(props);
        this.socket = io('http://192.168.0.103:3500', { jsonp: false });
        this.state = {
            // isLogin: null,
            //     username: null,
            USERNAME: null,
            avatarSourceReceri: null, //bien lang nghe khi co su thay doi avata
        };
        //   global.OnSignIn = this.OnSignIn.bind(this); //khai bao ham lobal.onSignIn = ham this.onSignIn.bind(this) o day
        // global.OnSignIn = () =>{ this.OnSignIn1()}; //khai bao ham lobal.onSignIn = ham this.onSignIn.bind(this) o day
        global.OnSignIn = this.OnSignIn1.bind(this);

        //lang nghe khi co thay doi avatar
        this.socket.on('server-send-avatar-fromApp-toAppWeb', avatarSourceReceriB64 => {
            console.log(avatarSourceReceriB64.uri);
            this.setState({
                avatarSourceReceri: avatarSourceReceriB64
            });
            console.log('this.state.avatarSourceReceri:::', this.state.avatarSourceReceri);
        });
    }



    OnSignIn1(Users) {
        console.log('Users global COntrolpanal---::::', Users);
        this.setState({
            // USER = false na de y ham  JXSControl = this.state.USER ? SignIn : SignIned;
            // co nghia la SignIned tuong uong voi USER = false nghia la se nhay vao ham SignIned
            USERNAME: Users, // USER = username1 nghia la USER != null thi se nhay ham
            //const JXSControl = this.state.USER ? SignIn : SignIned; tu ham nay ta se co SignIned
            //  isLogin: true
        });
        console.log('this.state.USERNAME COntrolpanal::::', this.state.USERNAME);
        /*
        getToken('@Users')
            .then(Users1 => {
                console.log('Users:::::', Users1);
                this.setState({
                    // USER = false na de y ham  JXSControl = this.state.USER ? SignIn : SignIned;
                    // co nghia la SignIned tuong uong voi USER = false nghia la se nhay vao ham SignIned
                    USER: Users1, // USER = username1 nghia la USER != null thi se nhay ham
                    //const JXSControl = this.state.USER ? SignIn : SignIned; tu ham nay ta se co SignIned
                  //  isLogin: true
                });
                console.log('this.state.USER COntrolpanal::::', this.state.USER);
                if (this.state.USER !== null) { //co username tra ve thi la da SignIned
                    // USER = false na de y ham  JXSControl = this.state.USER ? SignIn : SignIned;
                     // co nghia la SignIned tuong uong voi USER = false nghia la se nhay vao ham SignIned
                     this.setState({
                      //  isLogin: true
                     });
                } 
                console.log('this.state.isLogin COntrolpanal::::', this.state.isLogin);
            }); */

        /*
        console.log('Username VE CHO THONG TIN NGUOI DUNG KHI DANG NHAP THANH CONG::::', Users);
        this.setState({
            // USER = false na de y ham  JXSControl = this.state.USER ? SignIn : SignIned;
            // co nghia la SignIned tuong uong voi USER = false nghia la se nhay vao ham SignIned
            USER: Users // USER = username1 nghia la USER != null thi se nhay ham
            //const JXSControl = this.state.USER ? SignIn : SignIned; tu ham nay ta se co SignIned

        });
        console.log('this.state.USER::::', this.state.USER);
        */
        /*
        this.setState({
            username: username1,
        });
        /*
        if (this.state.username !== null) { //co username tra ve thi la da SignIned
           // USER = false na de y ham  JXSControl = this.state.USER ? SignIn : SignIned;
            // co nghia la SignIned tuong uong voi USER = false nghia la se nhay vao ham SignIned
            USER: false,
        } */
    }

    ImagPicker() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                //const source = { uri: response.uri };

                // You can also display the image using data:
                const source = { uri: 'data:image/jpeg;base64,' + response.data };  // image da chuyen sang dang base64
                console.log('source::::', source);
                console.log('response.data::::', response.data);
                this.setState({
                    avatarSource: source,
                });
                this.socket.emit('App-send-avata-to-server', this.state.avatarSource);
            }
        });
    }



    LogOut() { //xoa token
        //  this.setState({ username: mull });
        this.setState({ USERNAME: null });
        saveToken('@token_time', '');

        /*
        this.setState({
            // USER = false na de y ham  JXSControl = this.state.USER ? SignIn : SignIned;
            // co nghia la SignIned tuong uong voi USER = false nghia la se nhay vao ham SignIned
            USER: true,

        }); */
        getToken('@token_time')
            .then(token_time_r => console.log('token_time_r sau khi logout controlpanal', token_time_r))
            .catch(e => console.log(e));
    }

    gotoAuthentication() {
        const navigator = this.props.navigator;
        navigator.push({ name: 'AUTHENTICATION' });
    }

    gotoUser() {
        const navigator = this.props.navigator;
        navigator.push({ name: 'USER' });
    }

    render() {
        const { styleSignIn, txtSignInStyle, styleAvata, styleImage } = styles;
        //gia tri sau khi emit avatar len
        //this.state.avatarSourceReceri sau ? = true = !null tuong ung gia tri <Image source={this.state.avatarSourceReceri} style={styleImage} />
        //  : null= false la '' rong  tuong ung gia tri <Image source={require('../../../public/imgaes/gaixinh.jpg')} style={styleImage} />
        const avatarSourceReceri_A = this.state.avatarSourceReceri ?
            // !null = true       //: null= false la '' rong
            <Image source={this.state.avatarSourceReceri} style={styleImage} /> : <Image source={require('../../../public/imgaes/gaixinh.jpg')} style={styleImage} />;

        {/*
            //
             const avatarSourceReceri_A = this.state.avatarSourceReceri ?
            // !null = true       //: null= false la '' rong
            // gai tri sau khi da emit                                           : // hien thi avatar ra 
            <Image source={this.state.avatarSourceReceri} style={styleImage} /> : < Image source={this.state.avatarSource} style={{ width: 100, height: 100 }} />/>;

          const avatarSourceReceri_A = this.state.avatarSourceReceri == null ? null :
        < Image source={this.state.avatarSourceReceri} style={{ width: 100, height: 100 }} />

        const avatarSourceReceri_A = this.state.avatarSourceReceri ? // sau dau ? la gai tri true= !null truoc  : sau do gia tri se la flase=null
        // !null = true                                                      //: null= false la '' rong
        <Image source={this.state.avatarSourceReceri} style={styleImage} /> : null;

        const avatarSourceReceri_A = this.state.avatarSourceReceri ?
            // !null = true       //: null= false la '' rong
            <Image source={this.state.avatarSourceReceri} style={styleImage} /> : <Image source={require('../../../public/imgaes/gaixinh.jpg')} style={styleImage} />;
        */}
        const SignIn = (
            <View style={{ flex: 1, backgroundColor: '#E61A5F', justifyContent: 'center', alignItems: 'center', }}>
                <Image
                    style={styleImage}
                    source={require('../../../public/imgaes/gaixinh.jpg')}
                />
                <TouchableOpacity onPress={() => this.gotoAuthentication()} style={styleSignIn}>
                    <Text style={txtSignInStyle}>SingIn</Text>
                </TouchableOpacity>

                <Text>nguyen{this.state.USERNAME ? this.state.USERNAME : ''}</Text>

            </View>
        );

        const SignIned = (
            <View style={{ flex: 1, backgroundColor: '#E61A5F', justifyContent: 'center', alignItems: 'center', }}>
                <TouchableOpacity onPress={() => this.ImagPicker()} style={styleAvata} >
                    <Text>Doi Avata</Text>

                </TouchableOpacity>


                <TouchableOpacity onPress={() => this.ImagPicker()} style={styleImage} >
                    {avatarSourceReceri_A}

                    {/*
                    <Image
                        style={styleImage}
                        source={require('../../../public/imgaes/gaixinh.jpg')}
                    />
                    
                    <Image source={this.state.avatarSourceReceri } style={styleImage} />
                    */}
                </TouchableOpacity>


                <Text>nguyen{this.state.USERNAME ? this.state.USERNAME : ''}</Text>
                <TouchableOpacity onPress={() => this.gotoUser()} style={styleSignIn} >
                    <Text>changInfo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.LogOut()} style={styleSignIn} >
                    <Text>LogOut</Text>
                </TouchableOpacity>

            </View>
        );
        //USER = null ? dung thi SignIn
        //USER != null ? dung thi SignIned
        // const JXSControl = this.state.USER ? SignIned : SignIn;
        // const JXSControl = this.state.isLogin ? SignIn : SignIned ;
        //? true <=> !null : false <=> null
        const JXSControl = this.state.USERNAME ? SignIned : SignIn;




        {/*
        const avatarSource_A = this.state.avatarSource ?
        // !null = true                                             //: null= false la '' rong
        <Image source={this.state.avatarSource} style={styleImage} /> : null;

        const avatarSource_A = this.state.avatarSource == null ? null :
        < Image source={this.state.avatarSource} style={{ width: 100, height: 100 }} />

            const avatarSource = this.state.avatarSource ?
            // !null = true                                             //: null= false la '' rong
            <Image source={this.state.avatarSource} style={styleImage} /> : null ;
       

        //hien thia anh avata
        const avatarSource = this.state.avatarSource ?
            // !null = true                                             //: null= false la '' rong
            <Image source={this.state.avatarSource} style={styleImage} /> : <Image source={require('../../../public/imgaes/gaixinh.jpg')} style={styleImage} />;
        */}
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Text>Controlpanal</Text>
                {/* avatarSource_A */}
                {JXSControl}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    styleSignIn: {
        width: 150, height: 30,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#95CF57',
        borderTopLeftRadius: 20, borderTopRightRadius: 15,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 15,
        marginTop: 10,
    },
    styleSignOut: {

    },
    txtSignInStyle: {
        justifyContent: 'center', alignItems: 'center'
    },
    styleAvata: {
        width: 150, height: 30,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#95CF57',
        borderTopLeftRadius: 20, borderTopRightRadius: 15,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 15,
        marginBottom: 10,
    },
    styleImage: {
        width: 100, height: 100, borderRadius: 50,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#629E22'
    }
})