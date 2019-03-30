import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, TextInput, StyleSheet } from 'react-native';
import io from 'socket.io-client/dist/socket.io.js';
import ImagePicker from 'react-native-image-picker'; //yarn add react-native-image-picker// react-native link react-native-image-picker
import RNFetchBlob from 'react-native-fetch-blob'; //yarn add react-native-fetch-blob//react-native link

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
export default class ChatSocketID extends Component {

    constructor(props) {
        super(props);
        e = this;
        this.socket = io('http://192.168.216.2:3500', { jsonp: false });
        this.state = {
            dsmangSocketID: null,
            // messengerT: null, //text tra ve
            avatarSourceUpLoadBase64: null,
            socketID: null, //de hung bien trong global
            messengerText: '',
            MessengerTraLai: [],  //tinnhanTraLai

            uriTraVeApp: [], //mang tra lai cho chinh cai app da emit uri xuong co chua uri

            avatarSource: null,
            uriTouch: [], //bien hung mang duoc chon tu touchableOpacity  this.socket.emit('App-send-socketID-ca-nhan', { skID1: this.props.itemskID, messengerT: this.state.messengerText });

        };

        global.OnSocketID = this.OnSocketID1.bind(this);; // ham OnSocketID1 se nhan socketID tu Componet Status qua global

        //lang nghe server emit tu socket.id duoc chon trong ToucableOpacity server-send-uri-image //io.to(uriSkID.skID1).emit('server-send-uri-image', uriSkID);
        this.socket.on('server-send-uri-image', uriTouch1 => {
            this.setState({ uriTouch: uriTouch1 });
        });

        //lang nghe server tra lai uri cho app server-tra-lai-uri-cho-app
        this.socket.on('server-tra-lai-uri-cho-app', uriTraVeApp => {
            // alert(uriTraVeApp);
            console.log('uriTraVeApp::::', uriTraVeApp);
            e.setState({
                uriTraVeApp: uriTraVeApp,
            });
        })
        // lnag nghe server tra tin nhan tra lai cua chinh nguoi da gui cua chinh cai app da emit xuong server
        this.socket.on('server-tra-ve-tin-nhan-cho-chinh-nguoi-gui', tinnhanTL => {
            // alert(tinnhanTL);
            console.log('MessengerTraLai::::', tinnhanTL);
            e.setState({ MessengerTraLai: tinnhanTL });
            console.log('this.state.MessengerTraLai::::', this.state.MessengerTraLai);
        });


   

        //lang nghe server send socketID rieng sau khi nha TouchableOpacity de emit tu app qua server va lai ve app
        this.socket.on('server-send-socketID-Rieng', socketIDrieng => {
            alert(socketIDrieng.messengerT);
            // alert(socketIDrieng);
        });

        this.socket.on('server-send-danhsach-socketID', mangSoketID => {
            console.log('mangSocketID:::', mangSoketID);
            e.setState({
                dsmangSocketID: mangSoketID
            });
            console.log('this.state.dsmangSocketID:::', this.state.dsmangSocketID);
        });
    }

    OnSocketID1(socketid) {
        console.log('socketid trong Conponent ChatSocketID', socketid);
        e.setState({ socketID: socketid, });
        console.log('this.state.socketID trong Conponent ChatSocketID', this.state.socketID);
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
                const uri = "http://192.168.216.2:81/App_Chat_Web/DemoFlatList/" + JSON.parse(resp.data).NameFile;
                const source = { uri: uri };
                console.log('uri:::::', uri);
                console.log("resp:::::", resp);
                console.log("resp.path:::::", resp.path);
                this.socket.emit('app-chatSocketID-send-uri-image', { source1: source, skID1: this.props.itemskID });
                console.log('app dang send uri cho app thuc hien image picker ca nhan chatSocketID', { uri1: uri, skID1: this.props.itemskID });
            }).catch((err) => {
                console.log(err);
            });
    }

    test() {
        const { itemskID } = this.props;
        console.log('this.props.itemskID tai Component ChatSocketID:::', itemskID);
    }

    componentDidMount() {
        //test messenger
      //  e.setState({ messengerText: 'anh yeu em lam' });
        // this.test();
    }

    gobackStatus() {
        const { navigator } = this.props;
        navigator.push({ name: 'STATUS' });
    }

    render() {
        const imagepicker = this.state.avatarSource == null ? null :
            <Image source={this.state.avatarSource} style={styles.styleIcon} />
        return (
            <View style={{ flex: 1, backgroundColor: '#C3DFF3' }}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.styleText}> Component ChatSocketID</Text>
                    <TouchableOpacity onPress={() => this.gobackStatus()}>
                        <Image source={require('../../../api/Images/BackIcon.png')} style={styles.styleIcon} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', marginRight: 20, flex: 1 }}>
                    <TouchableOpacity onPress={() => this.ShowImage_piker()}>
                        <Image source={require('../../../api/Images/cameraIcon.png')} style={styles.styleIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.uploadToServer()}>
                        <Image source={require('../../../api/Images/sendIcon.png')} style={styles.styleIcon} />
                    </TouchableOpacity>
                    <TextInput
                        onChangeText={text => this.setState({ messengerText: text })}
                        value={this.state.messengerText}
                        placeholder={"vui long nhap text"}
                    />

                    <TouchableOpacity onPress={() => {
                        this.socket.emit('App-send-socketID-ca-nhan', { skID1: this.props.itemskID, messengerT: this.state.messengerText });
                        console.log('dang emit socketid:::', this.props.itemskID);
                    }}>
                        <Image source={require('../../../api/Images/sendIcon.png')} style={styles.styleIcon} />
                    </TouchableOpacity>

                </View>


                {imagepicker}

                <View style={styles.styleStatus}>
                    <FlatList
                        data={this.state.uriTraVeApp}
                        renderItem={({ item }) =>
                            <View style={styles.giaodien}>
                                <View style={styles.trai}>
                                    <Text style={styles.styleText} > {item.skidApp = null ? null : item.skidApp}</Text>
                                    <Text style={styles.styleText} >{item.key}</Text>
                                </View>
                                <View style={styles.phai}>
                                    <Image source={item.source1} style={{ width: 100, height: 100 }} />
                                </View>
                            </View>
                        }
                    />

                    <FlatList
                        data={this.state.uriTouch}
                        renderItem={({ item }) =>
                            <View style={styles.giaodien}>
                                <View style={styles.trai}>
                                    <Text style={styles.styleText} > {item.skID1 = null ? null : item.skID1}</Text>
                                    <Text style={styles.styleText} >{item.key}</Text>
                                </View>
                                <View style={styles.phai}>
                                    <Image source={item.source1} style={{ width: 100, height: 100 }} />
                                </View>
                            </View>
                        }
                    />


                    <FlatList
                        data={this.state.MessengerTraLai}
                        renderItem={({ item }) =>
                            <View style={styles.giaodien}>
                                <View style={styles.trai}>
                                    <Text style={styles.styleText} >{item.key}</Text>
                                    <Text style={styles.styleText} >{item.skidApp == null ? null : item.skidApp + ": "}</Text>
                                </View>
                                <View style={styles.phai}>
                                    <Text style={styles.styleText} >{item.ms = null ? null : item.ms}</Text>
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
        flex: 5, backgroundColor: '#FF82D3'
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

});




{/*
    <View style={styles.giaodien}>
        <View style={styles.trai}>
            <Text style={styles.styleText} >{item.skidApp + ": "}{item.ms}</Text>
            <Text style={styles.styleText} > {item.skidApp}</Text>
            <Image source={{ uri: item.uri }} style={styles.styleIcon} />
        </View>
        <View style={styles.phai}>
            <Text style={styles.styleText} >{item.key}</Text>
        </View>
    </View>
*/}
/*

 
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import io from 'socket.io-client/dist/socket.io.js';

var e;
export default class ChatSocketID extends Component {

    constructor(props) {
        super(props);
        e = this;
        this.socket = io('http://192.168.216.2:3500', { jsonp: false });
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
                <Text> Component ChatSocketID</Text>

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



*/