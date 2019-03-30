




import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import io from 'socket.io-client/dist/socket.io.js';
import ImagePicker from 'react-native-image-picker'; //yarn add react-native-image-picker// react-native link react-native-image-picker
import RNFetchBlob from 'react-native-fetch-blob'; //yarn add react-native-fetch-blob//react-native link

import getToken from '../../../api/getToken';
import global from '../../../api/global';


const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',

    },
};

var e;

export default class Status extends Component {

    constructor(props) {
        super(props);
        this.socket = io.connect('http://192.168.216.2:3500', { jsonp: false });
        e = this;
        this.state = {
            mang: [
                { key: '1', tuoi: 19, ten: 'nguyennam' },
                { key: '2', tuoi: 19, ten: 'nguyennam' },
                { key: '3', tuoi: 19, ten: 'nguyennam' },
                { key: '4', tuoi: 19, ten: 'nguyennam' },
            ],
            resData: [],
            refresh: false,
            avatarSource: null,
            avatarSourceUpLoadBase64: null,
            page: 1,
            txt: 'hello',

            dsmangSocketID: null,

            Username: null,

            dsSoketUsername: null,

            messengerText: null,

            danhsachPhongUsername: null,

            itemskID: null,

            key1: 1,
        };

        //   global.OnSignIn = this.LayRaUsername.bind(this);

        //app lang nghe su kien touchableOpacity gui phong ca nhan toi server va server tra lai app
        this.socket.on('server-send-phong-ca-nhan', phongCaNhanA => {
            console.log('dang nhap phong cá nhân');
            console.log('phoncanhan:::', phongCaNhanA.phong1);
            console.log('phoncanhan:::', phongCaNhanA.msText);
            alert(phongCaNhanA.msText);
            // this.setState({ });
        })

        //lag nghe server-send-danhsach-usernamephong
        this.socket.on('server-send-danhsach-usernamephong', dsPongUS => {
        //    alert(dsPongUS);
         //   console.log('dsPongUS::::::', dsPongUS);
            this.setState({
                danhsachPhongUsername: dsPongUS
            });
        })

        //server-send-socket.Username-rieng-da-TouchableOpacity-trong-appReact-native
        //server-send-socket.Username-rieng-da-TouchableOpacity-trong-appReact-native
        this.socket.on('server-send-socket.Username-rieng-da-TouchableOpacity-trong-appReact-native', socketUsrieng => {
            alert(socketUsrieng.msText);
        })

        // lang nghe mang danh sach socket.Username //server-send-socket.Username
        this.socket.on('server-send-socket.Username', dsSoketUs => {
        //    console.log('danh sach socket.username', dsSoketUs);
            this.setState({
                dsSoketUsername: dsSoketUs
            });
            console.log('this.state.dsSoketUsername:::', this.state.dsSoketUsername);
        });

        //lang nghe server send socketID rieng sau khi nha TouchableOpacity de emit tu app qua server va lai ve app
        this.socket.on('server-send-socketID-Rieng', socketIDrieng => {
            alert(socketIDrieng.messengerT);
            // alert(socketIDrieng);
        });

        //lag nghe server gui danh sanh socketID len App
        this.socket.on('server-send-danhsach-socketID', mangSoketID => {
          //  console.log('mangSocketID:::', mangSoketID);
            this.setState({
                dsmangSocketID: mangSoketID
            });
         //   console.log('this.state.dsmangSocketID:::', this.state.dsmangSocketID);
        });

        //ban than soketID cua app la gi 
        this.socket.on('socketid-cua-ca-nhan-app-do-la-gi', socketIDapp => {
            console.log('socket-id-cua-app-nay-la socketIDapp =: ' + socketIDapp);
        });

    }

    /*
    LayRaUsername(username) {
        this.setState({
            Username: username,
        });
        console.log('this.state.Username StatusZZZZZZZ::::', this.state.Username);
        this.socket.emit('App-send-Username-dai-dien-socket.Username-ca-nhan', this.state.Username);
        console.log('App dang-send-Username-ca-nhan trong coment Status::::');
    } */

    componentDidMount() {

        getToken('@Username')
            .then(Username_r => {
                console.log('Username_r tai statusView::', Username_r);
                this.socket.emit('App-send-Username-dai-dien-socket.Username-ca-nhan', Username_r);
                console.log('App dang-send to getToken -Username-ca-nhan trong coment Status::::');
            });

        getToken('@Username')
            .then(Username_r => {
                console.log('Username_r tai statusView::', Username_r);
                this.socket.emit('App-send-Username-la-phong-dai-dien-socket.phong-ca-nhan', Username_r);
                console.log('App-send-Username-la-phong-dai-dien-socket.phong-ca-nhan coment Status::::');
            });

        this.setState({ //setState de test TextInput
            messengerText: 'anh yeu em',
        })

        var uri = 'http://192.168.216.2:81/App_Chat_Web/DemoFlatList/DemoFlat2.php?trang=1';
        var uri1 = 'http://192.168.216.2:81/App_Chat_Web/DemoFlatList/DemoFlat.php';
        this.setState({ refresh: true });
        fetch(uri)
            .then(res => {
                //  console.log('res::', res);
                console.log("res._bodyInit::::", res._bodyInit);
                var a = JSON.parse(res._bodyInit);
                console.log('a:::', a);

                this.setState({
                    resData: a,
                    refresh: false,
                });
                console.log('this.state.resData:::', this.state.resData);
            })
            .catch(e => console.log(e));
    }


    ShowImage_piker() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // response.data la base64

                // const sourceBase64 = response.data;
                const sourceBase64 = { uri: 'data:image/jpeg;base64,' + response.data };// uri de hien thi tran web nhang ta the hien ca o web nen chi chuyen base64
                console.log(sourceBase64);
                this.setState({
                    avatarSourceUpLoadBase64: response.data,
                    avatarSource: source,
                    // messengerImage: sourceBase64,

                });
            }
        });
    }

    uploadToServer() {
        RNFetchBlob.fetch('POST', 'http://192.168.216.2:81/App_Chat_Web/DemoFlatList/upload.php', {
            Authorization: "Bearer access-token",
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
        }, [
                // element with property `filename` will be transformed into `file` in form data
                { name: 'image', filename: 'image.png', type: 'image/png', data: this.state.avatarSourceUpLoadBase64 },
                // custom content type
                //    { name: 'avatar-png', filename: 'avatar-png.png', type: 'image/png', data: binaryDataInBase64 },
                // part file from storage
                //   { name: 'avatar-foo', filename: 'avatar-foo.png', type: 'image/foo', data: RNFetchBlob.wrap(path_to_a_file) },
                // elements without property `filename` will be sent as plain text
                { name: 'name', data: 'user' },
                {
                    name: 'info', data: JSON.stringify({
                        mail: 'example@example.com',
                        tel: '12345678'
                    })
                },
            ]).then((resp) => {
                console.log("resp:::::", resp);
                console.log("resp.path:::::", resp.path);
            }).catch((err) => {
                console.log(err);
            })
    }



    gotoMessenger() {
        //  alert('1');
        const navigator = this.props.navigator;
        navigator.push({ name: 'MESSENGER' });

    }

    chatCaNhan() {
        const { navigator } = this.props;
        navigator.push({ name: 'Chat_Ca_Nhan' });
    }

    chatSocketID() {
        console.log('this.state.itemskID tai Compoment Status::::::',this.state.itemskID);
        const itemskID = this.state.itemskID;
        const { navigator } = this.props;
        console.log('itemskID2 tai Compoment Status::::::',itemskID);
        navigator.push({ name: 'Chat_Socket_ID', itemskID });
    }

    chatSocketUsername() {
        console.log('this.state.itemskID tai Compoment Status::::::',this.state.itemskID);
        console.log('this.state.key tai Compoment Status::::::',this.state.key);
        const { itemskID, dsSoketUsername, Username, key1 } = this.state;
        console.log('itemskID2 tai Compoment Status::::::',itemskID);
        const { navigator } = this.props;
        navigator.push({ name: 'Chat_Socket_Username', itemskID, dsSoketUsername, Username, key1 });
    }

    chatSocketPhong() {
        const { navigator } = this.props;
        navigator.push({ name: 'Chat_Socket_Phong' });
    }

    EmitSoketUsername() {
        getToken('@Username')
            .then(Username_r => {
                console.log('Username_r tai statusView::', Username_r);
                this.socket.emit('App-send-Username-dai-dien-socket.Username-ca-nhan', Username_r);
                console.log('App dang-send to getToken -Username-ca-nhan trong coment Status::::');
            });
    }

    EmitSocketPhong() {
        getToken('@Username')
            .then(Username_r => {
                console.log('Username_r tai statusView::', Username_r);
                this.socket.emit('App-send-Username-la-phong-dai-dien-socket.phong-ca-nhan', Username_r);
                console.log('App-send-Username-la-phong-dai-dien-socket.phong-ca-nhan coment Status::::');
            });
    }

    EmitText() {
        this.socket.emit('app-send-messenger-Text');
    }

    Refresh() {
        fetch('http://192.168.216.2:81/App_Chat_Web/DemoFlatList/DemoFlat1.php')
            .then(res => {
                // console.log('res::', res);
                var a = JSON.parse(res._bodyInit);
                this.setState({
                    resData: a,
                    refresh: false,
                });
                console.log('this.state.resData:::', this.state.resData);
            })
            .catch(e => console.log(e))
    }
    render() {

        const imagpicker = this.state.avatarSource == null ? null :
            <Image source={this.state.avatarSource} style={{ width: 100, height: 100 }} />
        const MESSENGER_TIN_NHAN = (
            <View style={{ flexDirection: 'row', marginRight: 20, }}>
                <TouchableOpacity onPress={() => this.ShowImage_piker()}>
                    <Image source={require('../../../api/Images/cameraIcon.png')} style={styles.styleIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.uploadToServer()}>
                    <Image source={require('../../../api/Images/sendIcon.png')} style={styles.styleIcon} />
                </TouchableOpacity>
                <TextInput
                    onChangeText={text => this.setState({ messengerT: text })}
                    value={this.state.messengerText}
                    placeholder={"vui long nhap text"}
                />
                <TouchableOpacity onPress={() => this.EmitText()}>
                    <Image source={require('../../../api/Images/sendIcon.png')} style={styles.styleIcon} />
                </TouchableOpacity>
            </View>
        );
        return (
            <View style={styles.styleStatus}>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    <Text style={styles.styleText} >Component Status</Text>
                    <TouchableOpacity onPress={() => this.chatCaNhan()}>
                        <Text style={styles.styleText} > chatCaNhan </Text>
                    </TouchableOpacity>
            
                    <TouchableOpacity onPress={() => {
                        this.refs.danhsach.scrollToEnd()
                    }}>
                        <Text style={styles.styleText} >{this.state.txt}</Text>
                    </TouchableOpacity>

                    {/*
                    <TouchableOpacity onPress={() => this.EmitSoketUsername()}>
                        <Text style={styles.styleText} >EmitSoketUsername</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.EmitSocketPhong()}>
                        <Text style={styles.styleText} >EmitSocketPhong</Text>
                    </TouchableOpacity>
*/}
                    <View style={{ flexDirection: 'row', marginRight: 20, }}>
                        <TouchableOpacity onPress={() => this.ShowImage_piker()}>
                            <Image source={require('../../../api/Images/cameraIcon.png')} style={styles.styleIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.uploadToServer()}>
                            <Image source={require('../../../api/Images/sendIcon.png')} style={styles.styleIcon} />
                        </TouchableOpacity>
                        <TextInput
                            onChangeText={text => this.setState({ messengerT: text })}
                            value={this.state.messengerText}
                            placeholder={"vui long nhap text"}
                        />
                        <TouchableOpacity onPress={() => this.EmitText()}>
                            <Image source={require('../../../api/Images/sendIcon.png')} style={styles.styleIcon} />
                        </TouchableOpacity>
                    </View>

                    {imagpicker}
                </View>

                <View style={styles.styleFlatlist}>
                    <Text style={styles.styleText} >danh sach socket.phong</Text>
                    <FlatList
                        data={this.state.danhsachPhongUsername}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => {
                               // alert(item.key);
                                this.socket.emit('app-send-socket.phong-ca-nhan', { phong1: item.phong, msText: this.state.messengerText});
                                console.log('app dang  bat dau -send-socket.phong-ca-nhan',{ phong1: item.phong, msText: this.state.messengerText });

                            }}>
                                <Text style={styles.styleText} >{item.key}</Text>
                                <Text style={styles.styleText} >{item.phong}</Text>
                            </TouchableOpacity>
                        }
                    />
                </View>


                <View style={styles.styleFlatlist}>
                    <Text style={styles.styleText} >danh sach socket.Username</Text>
                    <FlatList
                        data={this.state.dsSoketUsername}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => {
                                var itemskID1 = item.UsSoket; 
                                console.log('itemskID1 FlatList tai Compoment Status::::::',itemskID1);
                                e.setState({
                                    itemskID: itemskID1,
                                    Username: item.Username,
                                    key1: item.key,
                                });
                                console.log('key1::::',this.state.key1);
                                console.log('this.state.itemskID FlatList tai Compoment Status::::::   11111',this.state.itemskID);
                                
                                var dk = this.state.itemskID !== null && this.state.Username !==null && this.state.dsSoketUsername !==null && this.state.key1 !==null;
                                if (dk) {
                                    this.chatSocketUsername();
                                }


                               // alert(item.key);
                               // this.socket.emit('app-send-socket.username-va-messenger', { socketUs: item.UsSoket, msText: this.state.messengerText, dsSoketUsername: this.state.dsSoketUsername, Username: item.Username });
                               // console.log('server dang send socket.usernam va messenger ca nhan', { socketUs: item.UsSoket, msText: this.state.messengerText, dsSoketUsername: this.state.dsSoketUsername, Username: item.Username });

                            }}>
                                <Text style={styles.styleText} >{item.key}</Text>
                                <Text style={styles.styleText} >{item.UsSoket}</Text>
                                <Text style={styles.styleText} >{item.Username}</Text>
                            </TouchableOpacity>
                        }
                    />
                </View>

                <View style={styles.styleFlatlist}>
                    <Text style={styles.styleText} >danh sach socket.ID</Text>
                    <FlatList
                        data={this.state.dsmangSocketID}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => {
                                // alert(item.key);
                                // { MESSENGER_TIN_NHAN } //cho vao khong duoc
                                const itemskID1 = item.skID; 
                                console.log('itemskID1 FlatList tai Compoment Status::::::',itemskID1);
                              
                             //   if (itemskID1 !== null) {
                             //       global.OnSocketID(itemskID1); //truyen item.skID qua global cho Component chuyen sang Component ChatSosketID 
                             //       this.chatSocketID();
                             //   }

                                e.setState({
                                    itemskID: itemskID1,
                                });
                                console.log('this.state.itemskID FlatList tai Compoment Status::::::   11111',this.state.itemskID);
                                if (this.state.itemskID !== null) {
                                    this.chatSocketID();
                                }
        
                                {/*
                                    this.socket.emit('App-send-socketID-ca-nhan', { skID1: item.skID, messengerT: this.state.messengerText });
                                    console.log('dang emit socketid:::', item.skID);
                                   
                                */}

                            }}>
                                <Text style={styles.styleText} >{item.key}</Text>
                                <Text style={styles.styleText} >{item.skID}</Text>
                            </TouchableOpacity>
                        }
                    />
                </View>

                <View style={styles.styleFlatlist}>
                    <Text style={styles.styleText} >danh sach tin</Text>
                    <FlatList
                        ref="danhsach"
                        onEndReachedThreshold={0.3}
                        onEndReached={() => {
                            const page = 1;
                            this.setState({
                                txt: '123',
                                page: page + 1
                            });
                        }}
                        // horizontal={true}
                        refreshing={this.state.refresh}
                        onRefresh={() => this.Refresh()}
                        data={this.state.resData}
                        renderItem={({ item }) =>
                            <View style={styles.giaodien}>
                                <View style={styles.trai}>
                                    <TouchableOpacity onPress={() => this.gotoMessenger()} >
                                        <Image source={{ uri: item.HINH }} style={{ width: 80, height: 80, borderRadius: 40 }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.phai}>
                                    <Text style={styles.styleText} >{item.NAME}</Text>
                                    <Text style={styles.styleText} >{item.MOTA}</Text>
                                    <Text style={styles.styleText} >{item.key}</Text>
                                </View>
                            </View>
                        }
                    />
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    styleStatus: {
        flex: 1, backgroundColor: '#FF82D3'
    },
    giaodien: {
        borderBottomWidth: 1, flexDirection: 'row'
    },
    trai: {
        flex: 1, backgroundColor: '#6FAC2D', justifyContent: 'center', alignItems: 'center'
    },
    phai: {
        flex: 3, justifyContent: 'center', alignItems: 'center'
    },
    styleText: {
        fontSize: 8,
    },
    styleFlatlist: {
        flex: 1, borderBottomWidth: 1
    },
    styleTextInput: {
        height: 8, width: 50, borderColor: 'gray', borderWidth: 1,
    },
    styleIcon: {
        width: 24,
        height: 24,
    }

})
