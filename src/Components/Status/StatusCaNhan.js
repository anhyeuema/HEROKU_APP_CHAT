import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ImageBackground, TouchableOpacity, TextInput, AsyncStorage, Dimensions } from 'react-native';
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
const SaveTinNhan = async (Username, ArrayMesse) => {
    try {


        await AsyncStorage.setItem(Username, ArrayMesse)
        return 'SAVE MESSENGER CHO' + Username + 'THANH_CONG';

    } catch (e) {
        return e;
    }
}

const GetTinNhan = async (Username) => {
    try {
        var value = await AsyncStorage.getItem(Username);
        if (value !== null) {
            return value;
        }
        return [];

    } catch (e) {
        return console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbb', e);;

    }
}

var e;

const { width, height } = Dimensions.get('window');

export default class StatusCaNhan extends Component {
    constructor(props) {
        super(props);
        e = this;
        this.state = {
            dataUser: [
                { key: JSON.stringify(0), avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
                { key: "1", StatusMe: 'statusImage1', imaBase64: require('../../../api/ImageAvata/3.jpg') },
                { key: "2", StatusMe: 'statusImage2', imaBase64: require('../../../api/ImageAvata/4.jpg') },
                { key: "3", StatusMe: 'statusImage3', imaBase64: require('../../../api/ImageAvata/5.jpg') },

            ],

            //User: this.props.User, //hung du lieu thu navigator bang cach User={ route.User } o day ta k phai lam the 
            //emit toi tat ca nhung  chi hien thi status cua ca nhan loc cac status khac khong hien thi
            //emit this van emit tat ca nhu StatusPublic
          
            refresh: false,

            textStatus: '', //text Trang thai,
            imaBase64: '', //image kieu base64,
            n: 0, //dem so lan lang nghe server-share-status-public-congKhai de tao 1 mang nhan statusPublic
            //  SaveArrStatusPublic: [], //de hung du lieu moi vao 
            SaveArrStatusPublic: [
                { key: JSON.stringify(0), avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
            ],
            ArrayAvatarAnhBia: [
                { key: JSON.stringify(0), avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') }
            ],
            // ArrayStatusPublic: [],
            imaPath: '', //duong dan anh,

            ArrayStatus: [],
            
            User: this.props.User,
            ArrayStatusItem: this.props.StatusUser_item,



        };
        global.OnUser = this.getUser.bind(this);
        this.socket = io.connect('http://192.168.216.2:2400', { jsonp: false });
        console.log('this.state.User::::'. this.state.User);
        console.log('this.state.ArrayStatusItem::::'. this.state.ArrayStatusItem);
       
       
        this.socket.on('connect', () => {
            console.log('this.state.User o User.js', this.state.User);
            this.socket.emit('client-send-Username', this.state.User);
            //     console.log(' serser app dang emit this.state.User o User.js', this.state.User);
        });
        this.socket.on('socketId-da-disconnect', (socketId) => {
            console.log('socketId-da-disconnect: data la', socketId);
            this.socket.emit('client-xoa-Username', socketId + this.state.User); //co ket noi cai la gui luon username
            console.log('tu User.js app dang emit socketId ma server nodejs -da-disconnect: data la', this.state.User);

            this.socket.on('server-capNhat-Danhsach-socketId-new-saukhi-disconnect', ArraySocketIdUsername => {
                e.setState({ ArraySocketIdUsername: ArraySocketIdUsername });
            });
            //   console.log('ArraySocketIdUsername new sau khi da cap xoa socketId.Username',this.state.ArraySocketIdUsername);

        });

    }


   
    changedAvata() {

    }

    editAnhBia() {
        e.setState({ avata: '' });
    }

    Share() {
        //test textStatus
        e.setState({ textStatus: this.state.textStatus + 'Tính năng dịch trang web trên Chrome có thể là một tính năng vô cùng tiện lợi đối với nhiều người dùng nhưng do được kích hoạt tự động nên khiến nhiều người dùng cảm thấy khó chịu, do đó việc tắt tính năng dịch trang web trê' })
        if (this.props.User == this.state.User) {  //neu props.User  truyen sang trung state.User o tren User trangchu global toi thi cho phep emit neu khong trung thi khong cho e mit
            //  this.socket.emit('client-share-status-public-congKhai', { User: this.state.User, StatusMe: this.state.textStatus, imaBase64: this.state.imaBase64, imaPath: this.state.imaPath });
            this.socket.emit('client-share-statusUser', { User: this.state.User, StatusMe: this.state.textStatus, imaBase64: this.state.imaBase64, imaPath: this.state.imaPath });

        }
    }

    Delete() {
        /* 
       alert(0);
       var ArrayAvatarAnhBia = [
           { key: JSON.stringify(0), avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') }
       ];
       var ArrayAvatarAnhBiaString = JSON.stringify(ArrayAvatarAnhBia);
       SaveTinNhan(this.state.User + "StatusPublic", ArrayAvatarAnhBiaString); //luu tin nha cho ten duoc tich
     
        GetTinNhan(this.state.User + "StatusPublic") //khi kich chuot vao User chon thi getTinNhan mang nay se suoc load ra
             .then(SaveArrStatusPublic_R => {
                 if (SaveArrStatusPublic_R[0] == null || SaveArrStatusPublic_R == 'undefined' || SaveArrStatusPublic_R == '') {
                     e.setState({ SaveArrStatusPublic: [] });
                 } else {
                     console.log('da xoa tin nhan cho :' + this.state.User, SaveArrStatusPublic_R);
                     var SaveArrStatusPublic_R1 = JSON.parse(SaveArrStatusPublic_R);
                     e.setState({ SaveArrStatusPublic: SaveArrStatusPublic_R1 });
                     console.log('SaveArrStatusPublic DELETE  ::', this.state.SaveArrStatusPublic);
                 }
             }); */

        SaveTinNhan(this.state.User + "StatusPublic_User", ''); //luu tin nha cho ten duoc tich

        GetTinNhan(this.state.User + "StatusPublic_User") //khi kich chuot vao User chon thi getTinNhan mang nay se suoc load ra
            .then(ArrayStatus_r => {
                console.log('SaveArrStatusPublic_R:::::', ArrayStatus_r);
                console.log('SaveArrStatusPublic_R[0]:::::', ArrayStatus_r[0]);
                if (ArrayStatus_r[0] == null || ArrayStatus_r[0] == 'undefined' || ArrayStatus_r[0] == '') {
                    var c = (this.state.ArrayAvatarAnhBia).concat([]);
                    e.setState({
                        ArrayStatus: [],
                        ArrayStatusItem: c,
                    });
                    console.log('ArrayStatusItem DELETE  ::', this.state.ArrayStatusItem);
                } else {
                    console.log('da xoa STATUS User cho :' + this.state.User, ArrayStatus_r);
                    var ArrayStatus_r = JSON.parse(ArrayStatus_r);
                    var c = (this.state.ArrayAvatarAnhBia).concat(ArrayStatus_r);
                    e.setState({
                        ArrayStatus: [],
                        ArrayStatusItem: c,
                    });
                    console.log('ArrayStatusItem USER DELETE  ::', this.state.ArrayStatusItem);
                }
            });

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
                const source_R = { uri: response.uri };

                // You can also display the image using data:
                // response.data la base64

                // const sourceBase64 = response.data;
                const sourceBase64 = { uri: 'data:image/jpeg;base64,' + response.data };// uri de hien thi tran web nhang ta the hien ca o web nen chi chuyen base64
                console.log(sourceBase64);
                this.setState({
                    avatarSourceUpLoadBase64: response.data,
                    //  avatarSource: source,
                    imaPath: source_R,
                    imaBase64: sourceBase64,

                });
            }
        });
    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#ffff' }} >
                <Text>Component StatusUser {": " + this.state.User}</Text>
                <TouchableOpacity onPress={() => { this.Delete() }}>
                    <Text>XOA Status</Text>
                </TouchableOpacity>
                <FlatList
                    //load tin nhan  cu ve
                    refreshing={this.state.refresh} //hien thi xoay xoay // neu = flase hien xoa khi dung day
                    onRefresh={() => { // khi keo tren dung day thi se nhay vao ham onRefresh su ly load them du lieu
                        e.setState({ refresh: true }); // truosc khi thu hien lay du lieu mang ve
                        e.setState({
                            dataUser: [
                                { key: JSON.stringify(0), StatusMe: 'toi khong bao gio dong long dau', avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
                                { key: "1", StatusMe: 'toi khong bao gio dong long dau hinh nhu no binh tinh lai roi' },
                                { key: "2", StatusMe: 'toi khong bao gio dong long dau' },
                                { key: "3", StatusMe: 'toi khong bao gio dong long dau' }, { key: "4", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                { key: "5", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                            ],
                            refresh: false,
                        });
                    }}

                    //load them tin nhan moi ve
                    onEndReachedThreshold={0.5} //so khong la gi keo xuong day ma qua day 0.1 thi se nhay vao onEndReched
                    onEndReached={() => {
                        // e.setState({ refresh: true }); // truosc khi thu hien lay du lieu mang ve

                        /*  e.setState({
                               dataUser: [
                                 //  { key: JSON.stringify(0), StatusMe: 'toi khong bao gio dong long dau', avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
                                 //  { key: "1", StatusMe: 'toi khong bao gio dong long dau hinh nhu no binh tinh lai roi' },
                                 //  { key: "2", StatusMe: 'toi khong bao gio dong long dau' },
                                //   { key: "3", StatusMe: 'toi khong bao gio dong long dau' }, { key: "4", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                  // { key: "5", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                  // { key: JSON.stringify(6), StatusMe: 'toi khong bao gio dong long dau', avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
                                   { key: "7", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                   { key: "8", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                               ],
                               refresh: false,
                           }); */
                    }}


                    //data={this.state.SaveArrStatusPublic}
                    data={this.state.ArrayStatusItem}

                    renderItem={({ item }) =>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ height: item.avata == null ? null : avataHeight }}>

                                    <View style={{ height: (item.anhbia == null ? 0 : avataHeight), marginBottom: (item.anhbia == null ? 0 : 30), flexDirection: 'row', }}>
                                        <TouchableOpacity onPress={() => { alert(1) }}>
                                            <ImageBackground source={item.anhbia} style={{ height: (item.anhbia == null ? 0 : avataHeight), width: (item.anhbia == null ? 0 : width) }}>
                                                <View style={{ flexDirection: 'row', backgroundColor: '', height: (item.anhbia == null ? 0 : avataHeight) }} >
                                                    <View style={{ flex: 1, backgroundColor: '', height: (item.avata == null ? 0 : avataWidth) }} >

                                                        <View style={{ height: (item.avata == null ? 0 : (avataWidth / 2)) }} ></View>

                                                        <View style={{ backgroundColor: '', borderRadius: (item.avata == null ? 0 : (avataWidth / 2)) }}  >
                                                            <TouchableOpacity onPress={() => { alert(2) }}>
                                                                <Image source={item.avata} style={{ height: (item.avata == null ? 0 : avataWidth), width: (item.avata == null ? 0 : avataWidth), borderRadius: (item.avata == null ? 0 : (avataWidth / 2)) }}  ></Image>

                                                                <Text style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 40 }} >{item.avata == null ? null : 'changAvata'}</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, }} />
                                                    <View style={{ flex: 1, }}>
                                                        <View style={{ flex: 5 }} />
                                                        <TouchableOpacity style={{ flex: 1 }}
                                                            onPress={() => { this.editAnhBia() }}>
                                                            <Text>{item.anhbia == null ? null : 'edit'}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View >

                                    <View style={{ height: (item.avata) == null ? 0 : 40, marginLeft: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }} >
                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100, marginLeft: (item.avata) == null ? 0 : 20 }} onPress={() => {
                                            var UsernameAddFriend = this.state.User;
                                            var UsernameConfig = this.props.User;

                                            if (UsernameAddFriend !== UsernameConfig) { //neu nguoi gui ket ban khong  trung nguoi nhan loi moi thi ta se add-friend

                                                this.socket.emit('add-friend', { UsernameAddFriend: this.state.User, UsernameConfig: this.props.User });
                                            }
                                        }} >
                                            <Text >{item.avata == null ? null : 'Add Friend'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100 }} onPress={() => { this.Meesenger() }} >
                                            <Text >{item.avata == null ? null : 'Meesenger'} </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100 }} onPress={() => { this.more() }} >
                                            <Text >{item.avata == null ? null : 'more'} </Text>
                                        </TouchableOpacity>
                                    </View>


                                </View>

                                <View style={{ height: (item.avata) == null ? 0 : 50, marginTop: (item.avata == null ? 0 : 70), marginBottom: (item.avata == null ? 0 : 90), justifyContent: 'center', alignItems: 'center' }} >
                                    <TextInput
                                        onChangeText={text => this.setState({ textStatus: text })}
                                        value={this.state.textStatus}
                                        placeholder={item.avata == null ? null : "what us your mind ?"}
                                    />
                                    <View style={{ marginTop: (item.avata == null ? 0 : 10), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.about() }} >
                                            <Text >{item.avata == null ? null : 'Status'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.ShowImage_piker() }} >
                                            <Text >{item.avata == null ? null : 'Photo'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.Friend() }} >
                                            <Text >{item.avata == null ? null : 'Friends'}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.Share() }} >
                                            <Text >{item.avata == null ? null : 'Share'}</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>

                                <View style={{ marginTop: (item.StatusMe == null ? 0 : 10), marginBottom: (item.StatusMe == null ? 0 : 5), height: (item.imaBase64 == null ? 0 : avataHeight), justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>{item.User == null ? null : item.User + ": "}</Text>

                                    <Text>{item.StatusMe == null ? null : item.StatusMe}</Text>
                                    <ImageBackground source={item.imaBase64 == null ? null : item.imaBase64} style={{ height: (item.imaBase64 == null ? 0 : avataHeight), width: (item.imaBase64 == null ? 0 : avataWidth), justifyContent: 'center', alignItems: 'center' }}>

                                    </ImageBackground>


                                </View>
                            </View>


                        </View>



                    }
                />

            </View>
        );
    }
}

const avataHeight = (height - 20) / 2;
const avataWidth = (avataHeight / (1050)) * 700;
const borderavata = (avataHeight / 2);
const styles = StyleSheet.create({
    AnhBiaStyle: {
        flex: 1, flexDirection: 'row', width: avataWidth, height: avataHeight, justifyContent: 'center', alignItems: 'center'
    },
    avtaStyle: {
        flex: 1, width: (avataHeight / 2), height: (avataHeight / 2), borderRadius: (avataHeight / 4)
    },
    styleText: {
        fontSize: 8,
    },
})



{/* 

 <View style={{ flex: 1, backgroundColor: '#ffff' }} >
                <Text>Component User</Text>
                <FlatList
                    //load tin nhan  cu ve
                    refreshing={this.state.refresh} //hien thi xoay xoay // neu = flase hien xoa khi dung day
                    onRefresh={() => { // khi keo tren dung day thi se nhay vao ham onRefresh su ly load them du lieu
                        e.setState({ refresh: true }); // truosc khi thu hien lay du lieu mang ve
                        e.setState({
                            dataUser: [
                                { key: JSON.stringify(0), StatusMe: 'toi khong bao gio dong long dau', avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
                                { key: "1", StatusMe: 'toi khong bao gio dong long dau hinh nhu no binh tinh lai roi' },
                                { key: "2", StatusMe: 'toi khong bao gio dong long dau' },
                                { key: "3", StatusMe: 'toi khong bao gio dong long dau' }, { key: "4", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                { key: "5", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                            ],
                            refresh: false,
                        });
                    }}

                    //load them tin nhan moi ve
                    onEndReachedThreshold={0.5} //so khong la gi keo xuong day ma qua day 0.1 thi se nhay vao onEndReched
                    onEndReached={() => {
                        // e.setState({ refresh: true }); // truosc khi thu hien lay du lieu mang ve
                          e.setState({
                               dataUser: [
                                 //  { key: JSON.stringify(0), StatusMe: 'toi khong bao gio dong long dau', avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
                                 //  { key: "1", StatusMe: 'toi khong bao gio dong long dau hinh nhu no binh tinh lai roi' },
                                 //  { key: "2", StatusMe: 'toi khong bao gio dong long dau' },
                                //   { key: "3", StatusMe: 'toi khong bao gio dong long dau' }, { key: "4", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                  // { key: "5", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                  // { key: JSON.stringify(6), StatusMe: 'toi khong bao gio dong long dau', avata: require('../../../api/ImageAvata/2.jpg'), anhbia: require('../../../api/ImageAvata/1.jpg') },
                                   { key: "7", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                                   { key: "8", StatusMe: 'Wrong. At the time of writing this, the official React Native docs seemingly make no reference to an ImageBackground component. What’s a developer to do?' },
                               ],
                               refresh: false,
                           }); 
                        }}


                        data={this.state.dataUser}
                        renderItem={({ item }) =>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ height: item.avata == null ? null : avataHeight }}>
    
                                        <View style={{ height: (item.anhbia == null ? 0 : avataHeight), marginBottom: (item.anhbia == null ? 0 : 30), flexDirection: 'row', }}>
                                            <TouchableOpacity onPress={() => { alert(1) }}>
                                                <ImageBackground source={item.anhbia} style={{ height: (item.anhbia == null ? 0 : avataHeight), width: (item.anhbia == null ? 0 : width) }}>
                                                    <View style={{ flexDirection: 'row', backgroundColor: '', height: (item.anhbia == null ? 0 : avataHeight) }} >
                                                        <View style={{ flex: 1, backgroundColor: '', height: (item.avata == null ? 0 : avataWidth) }} >
    
                                                            <View style={{ height: (item.avata == null ? 0 : (avataWidth / 2)) }} ></View>
    
                                                            <View style={{ backgroundColor: '', borderRadius: (item.avata == null ? 0 : (avataWidth / 2)) }}  >
                                                                <TouchableOpacity onPress={() => { alert(2) }}>
                                                                    <Image source={item.avata} style={{ height: (item.avata == null ? 0 : avataWidth), width: (item.avata == null ? 0 : avataWidth), borderRadius: (item.avata == null ? 0 : (avataWidth / 2)) }}  ></Image>
    
                                                                    <Text style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 40 }} >{item.avata == null ? null : 'changAvata'}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                        <View style={{ flex: 1, }} />
    
                                                    </View>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                        </View >
    
                                        <View style={{ height: (item.avata) == null ? 0 : 40, marginLeft: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }} >
                                            <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100, marginLeft: (item.avata) == null ? 0 : 20 }} onPress={() => { this.addFriend() }} >
                                                <Text >{item.avata == null ? null : 'Add Friend'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100 }} onPress={() => { this.Meesenger() }} >
                                                <Text >{item.avata == null ? null : 'Meesenger'} </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 100 }} onPress={() => { this.more() }} >
                                                <Text >{item.avata == null ? null : 'more'} </Text>
                                            </TouchableOpacity>
                                        </View>
    
    
                                    </View>
    
                                    <View style={{ height: (item.avata) == null ? 0 : 50, marginTop: (item.avata == null ? 0 : 70), marginBottom: (item.avata == null ? 0 : 10), justifyContent: 'center', alignItems: 'center' }} >
                                        <TextInput
                                            onChangeText={text => this.setState({ textStatus: text })}
                                            value={this.state.textStatus}
                                            placeholder={item.avata == null ? null : "what us your mind ?"}
                                        />
                                        <View style={{ marginTop: (item.avata == null ? 0 : 10), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                            <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.about() }} >
                                                <Text >{item.avata == null ? null : 'Status'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.Photos() }} >
                                                <Text >{item.avata == null ? null : 'Photo'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.Friend() }} >
                                                <Text >{item.avata == null ? null : 'Friends'}</Text>
                                            </TouchableOpacity>
    
                                            <TouchableOpacity style={{ height: (item.avata) == null ? 0 : 50, width: (item.avata) == null ? 0 : 80 }} onPress={() => { this.Share() }} >
                                                <Text >{item.avata == null ? null : 'Share'}</Text>
                                            </TouchableOpacity>
    
                                        </View>
                                    </View>
    
                                    <View style={{ marginBottom: (item.anhbia == null ? 0 : 20) }}>
                                        <Text>{item.StatusMe == null ? null : item.StatusMe}</Text>
                                        <ImageBackground source={item.imaPost} style={{ height: (item.imaPost == null ? 0 : avataHeight), width: (item.imaPost == null ? 0 : avataWidth) }}>
    
                                        </ImageBackground>
    
                                    </View>
                                </View>
    
    
                            </View>
    
    
    
                        }
                    />
    
                </View>


*/}