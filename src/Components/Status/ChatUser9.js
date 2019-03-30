import React, { Component } from 'react';
import {
    View, Text, FlatList, StyleSheet, Image, TouchableOpacity,
    TextInput, AsyncStorage, ImageBackground,
    Dimensions,
} from 'react-native';
import io from 'socket.io-client/dist/socket.io.js';
import ImagePicker from 'react-native-image-picker'; //yarn add react-native-image-picker// react-native link react-native-image-picker
import RNFetchBlob from 'react-native-fetch-blob'; //yarn add react-native-fetch-blob//react-native link


import Authentication from '../Authentication/Authentication';
import global from '../../../api/global';

import GetTinNhan from '../../../api/getTinNhan';
import SaveTinNhan from '../../../api/saveTinNhan';

import getToken from '../../../api/getToken';
import saveToken from '../../../api/saveToken';
import kemtraToken from '../../../api/kiemtraToken';

const { width, height } = Dimensions.get('window');

var e;
const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',

    },
};

function openStream() {
    const config = {
        audio: false,
        video: true
    };
    return navigator.mediaDevices.getUserMedia(config);
}
function PlayStream(idvideoTag, stream) {
    const video = document.getElementById(idvideoTag);
    video.srcObject = stream;
    video.play();
}

var key = 0;
// var ArrdataMessenger = [];
var ArrarySaveDataMessenger = [];


//lay tu FreeSuper.js goc
export default class ChatUser8 extends Component {
    constructor(props) {
        super(props);

        //   this.socket = io('http://192.168.216.2:2400', { jsonp: false });
        e = this;
        this.state = {
            SaveDataMessengerApp: [], //luu thong tin ap khi nhan vao Username thi se load lai mang nay SaveDataMessengerApp ==  ArrdataMessenger
            UsernameNguoiSend: '', //lay username da luu emit toi server de cong voi socket.id cua server de tao socket+id+username
            // ArraySocketUsername -  ArrayUserSocketId = arrayUsername (loc Useranem trung) == mangU1 chua Usernam duoc tich
            ArraySocketUsername: [],// mang nay khong can setState o app ArraySocketUsername: [], //danh sach socket+id+Username
            ArrayUserSocketId: [], //danh sach socket+id
            arrayUsername: [], //danh sach Useranme co lap 
            mangU: [],  //danh sach username khong lap de chon Username
            Username: '',
            ArraySocketIdThoaMan: [], // mang dach sach socketId thoa man la socketid co trong Username duoc tich touchableopacity; ArraySocketIdThoaMan = socket+id+Useranme - Usernaem (ma TouchableOpacty nhan onPress);
            messenger: '', //messenger tu TextInput map ap se gui di chu khong phai messenger nhan duoc tu server
            // send: false, //bien co tac dung set gia tri neu set send neu send duoc setState({ send: true }) thi se gui send data ngay
            ArrUserSendKey: [], //mang hung su lieu tin nhat tra ve tu server
            UserSendEmit: '',  //User se send emt xuong server  cai nay duoc setState sau cung khi nhat nut emit
            n: 0, //bien tao key cho mnag
            m: 0, //dem so lan emit de xong mang On lang nghe tin ngan cong voi mang emit tin nhan
            imageBase64: '',
            pathIma: 'http://192.168.216.2:2800/hotgirls/2.jpg',
            ArrSocketId_UserSend: '', // mang socketId co chua UsernameSend

            ArrControlItemMess: [], // dieu khien hien thi tin nhan cau faltlist neu nhan vao nguoi muon chat thi ta moi hien thi mess ca nhan voi nguoi duoc nhan vao  khi do ta se loi goi cai bien chua 
            // gai tri flast ArrUserSendKey , 1) vao flastlist cho setState({ Username: }) goi emit client muon lay mess user tra ve thi setState({ArrUserSendKey: ArrUserSendKey(moc tu server) }). o faltlist thi setState({ ArrControlItemMess: this.state.ArrUserSendKey});
            UsernameNguoiNhan: '', //de luu messenger xuong server,

            UserWeb: '', //thay the cho UsernameNguoiNhan
            UserApp: '', //thay the cho UsernameNguoiSend
            YeuCauArrMess: [],

            refersh: false, // dieu khien load du hien cai xoay xoay
            soPage: 1, // quan ly load So trang mess

            soOnMess: 0, //so lan lang nghe this.socket.on('server-send-messenger',)

            p: 0,

            Nms: 0,// length max hien thi  ArrControlItemMess.length = Nms;
            SoKey: 0,// so lenth max mang tin nhan server - so phan tu truyen len client=sokey //SoKey = Nms - ArrdataMessenger.length // key: JSON.stringify((Nms -ArrdataMessenger.length) + ArrdataMessenger.length + index_goc), //do index gia tri bat dau tu 0, index=0 MIN


            OnManSendMs: [],

            arrThemOnMes: [], //the vao de hien thi tin nhan dau tien cho chat messenger
            a: 0, // neu m tang len 1 thi phan tu xoa cung tang 1 = m- this.state.a

            fileName: '', //ten file anh muon emit,

            dataIma: '',

        }
        global.OnUser = this.globalGetUser.bind(this);



        /*
         var UsernameNguoiSend = this.state.UsernameNguoiSend;
         this.socket.on('connect', (data) => {
             this.socket.emit('client-send-Username', UsernameNguoiSend);
             console.log('App dang-emit UsernameNguoiSend ChatUsrname::::', UsernameNguoiSend);
 
         }); */


    }

    globalGetUser(Useranme1) {



        // var UserWeb = User;
        // var socket = io.connect('http://localhost:2800');
        // const peer = new Peer({ key: 'tk5g2acaree6666669udi' }); //thay no la;  key: socket.id

        e.setState({ UsernameNguoiSend: Useranme1 });
        var UsernameNguoiSend = this.state.UsernameNguoiSend;
        console.log('this.state.UsernameNguoiSend globalGetUser::::::', UsernameNguoiSend);
        this.socket = io('http://192.168.216.2:2800', { jsonp: false });


        /*
        const peer = new Peer({ key: 'tk5g2acaree6666669udi' }); //thay no la;  key: socket.id

        this.socket.on('connect', function (data) {

            peer.on('open', id => {
                //  $("#my-peer").append(id);
                console.log('id:;: open pree', id);
                var dataStream = {
                    ten: this.state.UsernameNguoiSend, // this.state.UsernameNguoiSend tuong tu User ben web
                    peerId: id,
                };
                var dataUser = { Username: this.state.UsernameNguoiSend, peerId: id };
                this.socket.emit('NGUOI_DUNG_DANG_KY_STREAM_PREE', dataStream);
                console.log('dataStream::::', dataStream);
                this.socket.emit('client-send-Username', dataUser); //co ket noi cai la gui luon username
                console.log('App dang-emit UsernameNguoiSend ChatUsrname ', dataUser);
            });
        }); */

        /*
        this.socket.on('connect', (data) => {
            var UsernameNguoiSend = this.state.UsernameNguoiSend;
            this.socket.emit('client-send-Username', UsernameNguoiSend);
            console.log('App dang-emit UsernameNguoiSend ChatUsrname::::', UsernameNguoiSend);
 
            // this.socket.on('server-send-messenger', dataMessenger => {
            //     //alert('server-send-socket.id+Username')
            //     console.log('dataMessenger: globalGetUser::', dataMessenger);
            // });
        }); */


        /*

        socket.on('connect', function (data) {
            peer.on('open', id => {
                $("#my-peer").append(id);
                console.log('id:;: open pree', id);
                var dataStream = {
                    ten: User,
                    peerId: id,
                };
                var dataUser = { Username: User, peerId: id }
                // console.log('dataStream:0000:::', dataStream);

                socket.emit('NGUOI_DUNG_DANG_KY_STREAM_PREE', dataStream);
                console.log('dataStream:11111:::', dataStream);
                // var Eemit = this; 
                //      var dataUser = { Username: User, peerId: id }
                socket.emit('client-send-Username', dataUser); //co ket noi cai la gui luon username
                console.log('client-send-Username UsernameNguoiSend CheckUser ', dataUser);
            });
        }); */



        this.socket.on('connect', (data) => {
            var UsernameNguoiSend = this.state.UsernameNguoiSend;
            var dataUser = {
                Username: UsernameNguoiSend,
                // peerId: id 
            }
            this.socket.emit('client-send-Username', dataUser);

            console.log('App dang-emit UsernameNguoiSend ChatUsrname::::', dataUser);

            // this.socket.on('server-send-messenger', dataMessenger => {
            //     //alert('server-send-socket.id+Username')
            //     console.log('dataMessenger: globalGetUser::', dataMessenger);
            // });
        });


        this.socket.on('Reactjs-stream', dataIma => {
            console.log('dataIma dataIma :::', dataIma);
            e.setState({
                dataIma: dataIma
            });
        })

        this.socket.on('server-send-socket.id+Username', async (ArraySocketUsername) => {
            console.log('ArraySocketUsername:::', ArraySocketUsername);
            e.setState({ ArraySocketUsername: ArraySocketUsername });
            var ArrayUserSocketId1 = [];
            var arrayUsername1 = [];
            var ArraySocketUsername = this.state.ArraySocketUsername;
            ArraySocketUsername.map(function (value, index) {
                var UserSocketId = value.UserSocketId;
                var Username = value.Username;
                if (Username !== null || Username !== '' || Username !== null || Username !== 'undefined') {
                    ArrayUserSocketId1.push(UserSocketId);
                    arrayUsername1.push(Username);
                }
            });

            await e.setState({
                ArrayUserSocketId: ArrayUserSocketId1,
                arrayUsername: arrayUsername1,
            });

            function deduplicate(arr) {
                var isExist = (arr, x) => {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i] === x) return true;
                    }
                    return false;
                }
                var ans = [];
                arr.forEach(element => {
                    if (!isExist(ans, element)) ans.push(element);
                });
                return ans;
            }
            var mangU1 = deduplicate(this.state.arrayUsername);
            console.log('mangU1111111', mangU1); //mang Username khong co phan tu lap
            var MangUserKey = [];
            var m = mangU1.length;
            for (i = 0; i < m; i++) {
                MangUserKey.push({ key: JSON.stringify(i), Userkey: mangU1[i] });
                // console.log('MangUserKey::::', MangUserKey);
            }
            console.log('MangUserKey::::', MangUserKey);

            //loai bo ky Username = [] trong danh sach caht neu co
            var mangU2 = [];
            for (i = 0; i < mangU1.length; i++) {
                var User = mangU1[i];
                if (User === '' || User === []) {

                }
                else if (User !== '' || User !== []) {
                    mangU2.push(User);
                }
            }
            console.log('mangU2 loai bo username rong::::', mangU2);

            //mang hung du lieu mangU1 ma tao mang moi ArrUserKey co chua key 
            var ArrUserKey = [];
            mangU1.map(function (value, index) { //index thay cho key
                if (value !== null || value !== undefined || value !== []) {
                    var UserKey = { key: JSON.stringify(index), Userkey: value };
                    ArrUserKey.push(UserKey);
                }

            });
            console.log('ArrUserKey1::::', ArrUserKey);
            await e.setState({
                mangU: ArrUserKey
            });
            //lang nghe tin nha tu server
            /// this.socket.on('server-send-messenger', dataMessenger => {
            // alert('server-send-socket.id+Username')
            //    console.log('dataMessenger: on server-send-socket.id+Username::', dataMessenger);
            //});




            this.socket.on('server-send-messenger', async (dataMessenger) => {


                await e.setState({ p: (this.state.p + 1) });
                console.log('pppppppppppppppppppppppppppppppppppppppppppppppppp', this.state.p);
                //UserApp = UsernameNguoiSend, 

                e.setState({
                    UserWeb: dataMessenger[0].UsernameNguoiSend, //web sen toi app App la thang duoc kich chuot la Username
                    UserApp: dataMessenger[0].UsernameNguoiNhan,
                    soPage: 1, //de hien thi la ra tin nhan moc ve 1 tinh tu length max - 1.m = hien thi so phan tu tu lon nhat toi -m phan tu
                });
                //  console.log('this.state.UsernameNguoiNhan !== "":::', this.state.UserApp);
                const { UserApp, Nms, Username, OnManSendMs, UserWeb, SoKey } = this.state; //UserApp = UsernameNguoiSend, 
                OnManSendMs.push(UserWeb);
                console.log('OnManSendMs::lap', OnManSendMs);

                function deduplicate(arr) {
                    var isExist = (arr, x) => {
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i] === x) return true;
                        }
                        return false;
                    }
                    var ans = [];
                    arr.forEach(element => {
                        if (!isExist(ans, element)) ans.push(element);
                    });
                    return ans;
                }
                var OnManSendMs_r = deduplicate(OnManSendMs);
                var m = OnManSendMs_r.length;
                e.setState({ OnManSendMs: OnManSendMs_r });
                console.log('OnManSendMs: khong lap :ArrDoneLap', this.state.OnManSendMs.length);

                /*
                    var ArrdataMessengerThem = []
                    if(ArrdataMessenger.length >(m)){
                        console.log('var xoa phan tu thu 2 nao',ArrdataMessenger.length);
                        ArrdataMessenger.splice(m,1); // XOA 1 PHAN TU O VI TRI THU 2, de lai vi tri thu nhat
                    // co the dung unshift() / shift() — thêm/xóa phần tử từ vị trí đầu mảng
                    console.log('ArrdataMessenger xoa phan tu thu 2 con',ArrdataMessenger);
                    }
                */
                //lang nghe server send tin nhan
                /* var dataEmit = { //hien thi de biet dataEmit gom nhungphan tu gi de ta re viet code thui
                  UsernameNguoiNhan: dataMessenger.UsernameNguoiNhan,
                  UsernameNguoiSend: dataMessenger.UsernameNguoiSend,
                  messenger: dataMessenger.messenger,
                  imageBase64: dataMessenger.imageBase64,
                  pathIma: dataMessenger.pathIma,
                  }; */
                //da co thay doi data dataMessenger = dataEmit || dataMessenger= ArrMess la 1 cai mang 
                // xu ly mang [], hoac mang [ 1phan tu], [ nhieu phan tu], mang chua rong [] ta bo qua khong lam gi ca
                //1) tao mang co key chua no
                // var dataMessengerKey = [];

                console.log('Nms:socket.on(server-send-messenger:::::', Nms);
                if (dataMessenger[0] !== null) {
                    var ArrdataMessenger = this.state.ArrUserSendKey;
                    // console.log('ArrdataMessenger da JSON.parse:!==0:::', ArrdataMessenger);
                    var ArrMessSendServer = []; // ArrMessSendServer chi lay 1 phan tu hay vai phan tu tu tin nhan new duoc web gui toi
                    console.log('Username:::', Username);
                    var { arrThemOnMes } = this.state;
                    console.log('arrThemOnMes', arrThemOnMes);
                    if (Username == '') { //chua chon ten nguoi chat nguoi nhan tin nhan
                        console.log('Username == ""::::', Username == "");
                        dataMessenger.map(function (dataEmit, index) {
                            //Nms la so phan tu tinnhan luu o server 
                            arrThemOnMes.unshift(dataEmit);
                        });
                        console.log('arrThemOnMes sau khi unshift splice(m, 1)', arrThemOnMes);
                        //  console.log('arrThemOnMes', arrThemOnMes);
                        if (arrThemOnMes.length >= (m + 1)) {
                            var ptuXoa = 1;///m- this.state.a=1; //m  = this.state.a
                            //  console.log('ptuXoa:::::::::',m);      
                            console.log('ptuXoa:::::::::', ptuXoa);
                            //    console.log('so phantu khong lap :', m);
                            //    console.log('var xoa phan tu thu 2 nao', arrThemOnMes.length + ">=" + (m));
                            // neu m tang len 1 thi phan tu xoa cung tang 1 = m- this.state.a
                            arrThemOnMes.splice(ptuXoa, 1); // XOA 1 PHAN TU O VI TRI THU 2, de lai vi tri thu nhat
                            // co the dung unshift() / shift() — thêm/xóa phần tử từ vị trí đầu mảng
                            //dao gia tri them hien thi
                            e.setState({ arrThemOnMes: arrThemOnMes, });
                            e.setState({ a: arrThemOnMes.length, })
                            console.log('this.state.aaaaaaaaaaaaaaaaaa sau khi splice(m, 1)', this.state.a);
                            console.log('arrThemOnMes sau khi splice(m, 1)', arrThemOnMes);
                            //  e.setState({  arrThemOnMes: arrThemOnMes, });
                            // e.setState({ arrThemOnMes: arrThemOnMes, });
                            var arrThemOnMesKetQua = [];
                            arrThemOnMes.map(function (dataEmit, index) {
                                //Nms la so phan tu tinnhan luu o server 
                                //  var index_goc = Nms + index; //gia tri goc tinh tu cai nhan duoc server gui len
                                var UserSendKey = {
                                    // key: JSON.stringify(SoKey + ArrdataMessenger.length + index), //do index gia tri bat dau tu 0, index=0 MIN
                                    key: JSON.stringify(index), //do index gia tri bat dau tu 0, index=0 MIN
                                    UserSend: dataEmit.UsernameNguoiSend, //thang send cho Userapp, va app dang la thang nhan nhung lai dat o this.state( la UsernameNguoiSend )
                                    messenger: dataEmit.messenger,
                                    imageBase64: dataEmit.imageBase64,
                                    pathIma: dataEmit.pathIma,
                                    UserNhan: '', //them vao de hien thi thoi
                                    messengerNhan: '',
                                };
                                // console.log('.UserSendKey::::', UserSendKey);
                                arrThemOnMesKetQua.push(UserSendKey);
                                //  ArrMessSendServer.push(UserSendKey);
                                ArrdataMessenger = arrThemOnMesKetQua;
                                ArrUserSendKey = arrThemOnMesKetQua;

                            });

                            //   console.log('ArrdataMessenger', ArrdataMessenger);


                            console.log('ArrdataMessenger xoa phan tu thu ' + m + 'con :', ArrdataMessenger);
                        }

                    } else if (Username !== '') {
                        console.log('Username == UserWeb::::', Username == UserWeb);
                        if (Username == UserWeb) { // nguoi gui userweb ma = username tich chon thi moi hien thi tin nhan //cho cho thang duoc kich chuot hien thi tren flatlist hien tai => Username == Username gui tin nha cho o day la web
                            dataMessenger.map(function (dataEmit, index) {

                                //Nms la so phan tu tinnhan luu o server 
                                //  var index_goc = Nms + index; //gia tri goc tinh tu cai nhan duoc server gui len
                                var UserSendKey = {
                                    //key: JSON.stringify(Nms + index), //do index gia tri bat dau tu 0, index=0 MIN
                                    key: JSON.stringify(SoKey + ArrdataMessenger.length + index), //do index gia tri bat dau tu 0, index=0 MIN
                                    // key: JSON.stringify((Nms -ArrdataMessenger.length) + ArrdataMessenger.length + index_goc)// so lenth max mang tin nhan server - so phan tu truyen len client=sokey //SoKey = Nms - ArrdataMessenger.length // key: JSON.stringify((Nms -ArrdataMessenger.length) + ArrdataMessenger.length + index_goc), //do index gia tri bat dau tu 0, index=0 MIN
                                    UserSend: dataEmit.UsernameNguoiSend, //thang send cho Userapp, va app dang la thang nhan nhung lai dat o this.state( la UsernameNguoiSend )
                                    messenger: dataEmit.messenger,
                                    imageBase64: dataEmit.imageBase64,
                                    pathIma: dataEmit.pathIma,
                                    UserNhan: '', //them vao de hien thi thoi
                                    messengerNhan: '',
                                };
                                // console.log('.UserSendKey::::', UserSendKey);
                                ArrdataMessenger.push(UserSendKey);
                                ArrMessSendServer.push(UserSendKey);
                            });
                            console.log('ArrdataMessenger::::', ArrdataMessenger);
                        } else if (Username !== UserWeb) { //username gui la UserWeb khac voi username tich thi ta khong hien thi mess
                            ///truong hop la 1 cai ten nguoi tich khong phai nguoi gui tu web thi khong lam gi ca
                            console.log('nguoi gui tin nhan khong hien thi o day vi chua kich chuot vao nguoi do');
                        }
                    }

                    // console.log('var ArrdataMessenger =  this.state.SaveDataMessengerApp::::', ArrdataMessenger);
                    e.setState({
                        // SaveDataMessengerApp: ArrMessSendServer,
                        ArrUserSendKey: ArrdataMessenger,
                        ArrControlItemMess: ArrdataMessenger,


                    });
                    console.log('this.state.ArrControlItemMess', this.state.ArrControlItemMess);
                    // var SaveDataMessengerApp1 = JSON.stringify(this.state.SaveDataMessengerApp);
                    //   console.log('(this.state.ArrUserSendKey);:::', this.state.ArrUserSendKey)
                    //  console.log('(this.state.ArrControlItemMess);:::', this.state.ArrControlItemMess)
                    //   this.socket.emit('client-send-ArrayMessUsersendUserItem', ArrayMessUsersendUserItem);
                    // console.log('ArrayMessUsersendUserItem truong hop == 011111111111111 tra ve', ArrayMessUsersendUserItem);
                }

            });

        });

        /* this.socket.on('socketId-da-disconnect', socketId => {
             console.log('socketId-da-disconnect: data la', socketId + UsernameNguoiSend);
             this.socket.emit('client-xoa-Username', socketId + UsernameNguoiSend); //co ket noi cai la gui luon username
             console.log('app dang emit socketIdUsername ma serverda-disconnect: data la', socketId + UsernameNguoiSend);
             this.socket.on('server-capNhat-Danhsach-socketId-new-saukhi-disconnect', ArraySocketUsername => {
                 e.setState({ ArraySocketUsername: ArraySocketUsername });
             });
             console.log('app ArraySocketUsername new sau khi disconnect: ', this.state.ArraySocketUsername);
         }); */
    }



    sendEmit() {


        var YeuCauArrMess = this.state.YeuCauArrMess;

        if (this.state.Username == null) {
            console.log('chua chon nguoi nhan nhe!!!!', YeuCauArrMess)
        }
        else if (this.state.Username !== null) {
            const { UsernameNguoiSend } = this.state;
            //cap nhan co ng emit gui messe
            e.setState({
                UserSendEmit: UsernameNguoiSend,
            });
            const { UserSendEmit } = this.state;
            // console.log('this.state.UserSendEmit', UserSendEmit);
            //test thu message text send di 
            //   e.setState({ messenger:   });
            //    e.setState({ UserSendEmit: UsernameNguoiSend });
            //  console.log('this.state.UsernameNguoiSend', UserSendEmit) // UserSendEmit = app
            //   console.log('this.state.UsernameNguoiSend', UsernameNguoiSend);

            //   this.uploadImage(); // de setState({ pathImag: });///
            const { Username, ArraySocketIdThoaMan, messenger, imageBase64, pathIma, SoKey } = this.state;
            var dataEmit = {
                key: '0',
                UsernameNguoiNhan: Username,
                UsernameNguoiSend: UsernameNguoiSend,
                DSsocketIdNguoiNhan: ArraySocketIdThoaMan,
                messenger: messenger,
                imageBase64: imageBase64,
                pathIma: pathIma,
            };
            this.socket.emit("client-send-messenger", dataEmit);
            console.log('client-send-messenger dataEmit', dataEmit);

            e.setState({ m: (parseInt(this.state.m) + 1), });//so lan emit 1 lan emit la 1 lan cap nhat mang tin nhan cua app nhe
            //  console.log('this.state.m::::', this.state.m);

            //co can moc len tu server khong ta

            //hien thi tin nhan len app khi emit thi chi hien thi cho chinh no chu k can emit cho chinh no
            const { ArrControlItemMess } = this.state; //moc gia chi khida setState o this.on('server-send-messenger')
            //    console.log('SaveDataMessengerApp moc tu this.on(server-send-messenger da setState ', SaveDataMessengerApp)
            var ArrdataMessenger = ArrControlItemMess;
            console.log('ArrdataMessenger = SaveDataMessengerApp', ArrdataMessenger.length);
            var UserSendKey = {  //them 1 obj moi vao flatlist
                key: JSON.stringify((ArrControlItemMess.length) + SoKey), //ket se duoc tang len 1, so thu tu no khong bat dau tu 0. mang.length bat dau tu 1
                UserSend: '',
                messenger: '',
                UserNhan: UsernameNguoiSend,//UsernameNguoiSend, //hien thi nguoi gui gio la app gui web
                messengerNhan: Username == null ? null : messenger,
                imageBase64: Username == null ? null : imageBase64,
                pathIma: Username == null ? null : pathIma,

            };
            ArrdataMessenger.push(UserSendKey);
            //   ArrarySaveDataMessenger.push(UserSendKey); //ArrarySaveDataMessenger = ArrdataMessenger
            // console.log('sendEmit...ArrarySaveDataMessenger', ArrarySaveDataMessenger);
            e.setState({
                ArrUserSendKey: ArrdataMessenger,
                //  SaveDataMessengerApp: ArrdataMessenger,
            });
            const { ArrUserSendKey } = this.state;
            // console.log('this.state.ArrUserSendKey sendEmit::::', ArrUserSendKey);


            if (ArrdataMessenger[0] !== null) {
                e.setState({  //bat dau lien faltlist cap nhat gia tri moi
                    //khi kich chuot vao username muon chat ta moi moc du lieu ti nhan tu server nodejs hien thij len cho nguoi
                    // dungva gio dim cah co ng gui tin nhan la hien thong bao co tin nhan
                    ArrControlItemMess: ArrUserSendKey,
                });
            }
            console.log('this.state.ArrControlItemMess sendEmit::::', ArrControlItemMess);

            if (dataEmit !== null) { //KHI ma da gui tin nhan di thi can setState({ pathIma: '' });
                e.setState({ pathIma: '' });
            }
        }

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
                e.setState({
                    avatarSourceUpLoadBase64: response.data,
                    //  avatarSource: source,
                    imaPath: source_R,
                    imaBase64: sourceBase64,
                    fileName: response.fileName, //ten file anh do
                });
            }
        });
    }

    stream() {
        // Launch Camera:
        ImagePicker.launchCamera(options, (response) => {
            // Same code as in above section!
            console.log('response response response stream,', response);
        });

    }

    stream1() {
        // Open Image Library:
        ImagePicker.launchImageLibrary(options, (response) => {
            // Same code as in above section!
            console.log('response response response stream1111111111111111111,', response);
        });
    }

    EndCallImga(){
        e.setState({
            dataIma: '',
        })
    }

    uploadImage() {
        const nameSend = this.state.UsernameNguoiSend;
        // RNFetchBlob.fetch('POST', 'http://192.168.216.2:2800/ReactNative/Upload', {
        RNFetchBlob.fetch('POST', 'http://192.168.216.2:1400/ReactNative/Upload', {
            Authorization: "Bearer access-token",
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
        }, [
                { name: nameSend, filename: this.state.fileName, data: this.state.avatarSourceUpLoadBase64 }, // data: this.state.data
                { name: 'info', data: 'khoapham' },
            ])
            .then((resp) => {
                console.log('resp uploadImage::::', resp.data);
                var name = (resp.data).replace('public\\upload\\', '');
                console.log('name::::::::::', name);
                e.setState({ pathIma: 'http://192.168.216.2:2800/upload/' + name }); //  http://localhost:2800/upload/1.jpg
                console.log('pathIma:::::', this.state.pathIma);

                /*
                var dataImageUp = JSON.parse(resp.data);
                console.log(dataImageUp);
                console.log('nameSend', nameSend);

                var NameReciver= dataImageUp.lan;//= dataImageUp.nameSend;
                console.log('NameReciver::::', NameReciver);
                var path = NameReciver.path;
                var name  = NameReciver.name;
                console.log('path:::', path);
                console.log('name:::', name);
                e.setState({ pathIma: 'http://localhost:2800/upload/' + name}); //  http://localhost:2800/upload/1.jpg
                console.log('pathIma:::::', this.state.pathIma);
                */


                //tra ve duong dan nhe de ta con emit di nhe
            }).catch((err) => {
                console.log('err uploadImage ;;;;', err);
                e.setState({ pathIma: '' });
            })
    }

    hienthiMess() {

        //lay du lieu tin nhan khi duoc kcih chuot vao
        const { Username, UsernameNguoiSend } = this.state;
        this.socket.emit('client-muon-lay-ArrayMess-User', {
            NameUserSendUserItem: (UsernameNguoiSend + Username + "ChatUsername.docx"),
            //  ArrSocketId_UserSend: ArrSocketId_UserSend,
            UserYeuCauMess: UsernameNguoiSend, //UserApp,
            soPage: this.state.soPage,
        });
        this.socket.on('server-trave-yeucau-ArrayMess-User', DataMessengerApp_r => {
            console.log('server-trave-yeucau-ArrayMess-User hienthiMess chuyen cho flatlist::', DataMessengerApp_r);
            //console.log('SaveDataMessengerApp[0] !== undefined:::',SaveDataMessengerApp[0] !== 'undefined')
            var Nms = DataMessengerApp_r.Nms;
            var Sms = DataMessengerApp_r.Sms;
            var SaveDataMessengerApp_r = Sms;
            e.setState({
                YeuCauArrMess: SaveDataMessengerApp_r,
                Nms: Nms,
            });
            var SaveDataMessengerApp = SaveDataMessengerApp_r;
            //var x= '[]' x.length=1
            if (SaveDataMessengerApp[0] == '0' && SaveDataMessengerApp.length == 1) {
                //khong lam gi ca nhe
                console.log('flalist khong lam gi ca voi SaveDataMessengerApp');
                // e.setState({ 
                //     ArrControlItemMess: [],
                /// });
            }
            else if (SaveDataMessengerApp[0] == '[' && SaveDataMessengerApp.length > 1) { //neu ArrayMessUsersendUserItem[0]  khac rong thi ta JSON.parser
                var SaveDataMessengerApp1 = JSON.parse(SaveDataMessengerApp_r);// Neu ArrayMessUsersendUserItem[0] == rong thi ta bo qua cau lenh trong if
                const { Nms } = this.state;
                e.setState({
                    ArrUserSendKey: SaveDataMessengerApp1,
                    //  SaveDataMessengerApp: SaveDataMessengerApp,
                    SoKey: Nms - SaveDataMessengerApp1.length,
                });
                console.log('this.state.SaveDataMessengerApp flatlist; !==0;;;;;', this.state.ArrUserSendKey);
                console.log('this.state.SoKey flatlist;;;;;;', this.state.SoKey);//////
                //nhan duoc ket qua SaveDataMessengerApp tu server tra ve ta moi setState no cho phep mang duoc set moi
                if (this.state.ArrUserSendKey[0] !== null) { //ca mang server tra tin nhan ve moi thuc su cap nhat mang lhac rong vao faltlist cua faltlist danh sach tin nhan
                    e.setState({
                        //khi kich chuot vao username muon chat ta moi moc du lieu ti nhan tu server nodejs hien thij len cho nguoi
                        // dungva gio dim cah co ng gui tin nhan la hien thong bao co tin nhan
                        ArrControlItemMess: this.state.ArrUserSendKey,
                        //SoKey: (Nms -ArrdataMessenger.length) 


                    });
                    console.log('this.state.ArrControlItemMess flatlist;;;;;;', this.state.ArrControlItemMess);

                }
            }

        });


    }

    hienthiMess1() {

        //lay khi co nguoi gui toi UserWeb gui toi la nguoi gui tin nhan toi
        const { UserWeb, UsernameNguoiSend } = this.state;
        var dataYeuCau = {
            NameUserSendUserItem: (UsernameNguoiSend + UserWeb + "ChatUsername.docx"),
            //  ArrSocketId_UserSend: ArrSocketId_UserSend,
            UserYeuCauMess: UsernameNguoiSend, //UserApp,
            soPage: this.state.soPage,
        };
        this.socket.emit('client-muon-lay-ArrayMess-User', dataYeuCau);
        console.log('client-muon-lay-ArrayMess-User datayeaucau', dataYeuCau);

        this.socket.on('server-trave-yeucau-ArrayMess-User', DataMessengerApp_r => {
            console.log('server-trave-yeucau-ArrayMess-User hienthiMess chuyen cho flatlist::', DataMessengerApp_r);
            //console.log('SaveDataMessengerApp[0] !== undefined:::',SaveDataMessengerApp[0] !== 'undefined')
            var Nms = DataMessengerApp_r.Nms;
            var Sms = DataMessengerApp_r.Sms;
            var SaveDataMessengerApp_r = Sms;
            e.setState({
                YeuCauArrMess: SaveDataMessengerApp_r,
                Nms: Nms,

            });
            var SaveDataMessengerApp = SaveDataMessengerApp_r;
            //var x= '[]' x.length=1
            if (SaveDataMessengerApp[0] == '0' && SaveDataMessengerApp.length == 1) {
                //khong lam gi ca nhe
                console.log('flalist khong lam gi ca voi SaveDataMessengerApp');
                // e.setState({ 
                //     ArrControlItemMess: [],
                /// });
            }
            else if (SaveDataMessengerApp[0] == '[' && SaveDataMessengerApp.length > 1) { //neu ArrayMessUsersendUserItem[0]  khac rong thi ta JSON.parser
                var SaveDataMessengerApp1 = JSON.parse(SaveDataMessengerApp_r);// Neu ArrayMessUsersendUserItem[0] == rong thi ta bo qua cau lenh trong if
                const { Nms } = this.state;
                e.setState({
                    ArrUserSendKey: SaveDataMessengerApp1,
                    //  SaveDataMessengerApp: SaveDataMessengerApp,
                    SoKey: Nms - SaveDataMessengerApp1.length,
                });
                console.log('this.state.SaveDataMessengerApp flatlist; !==0;;;;;', this.state.ArrUserSendKey);
                console.log('this.state.SoKey flatlist;;;;;;', this.state.SoKey);//////
                //nhan duoc ket qua SaveDataMessengerApp tu server tra ve ta moi setState no cho phep mang duoc set moi
                if (this.state.ArrUserSendKey[0] !== null) { //ca mang server tra tin nhan ve moi thuc su cap nhat mang lhac rong vao faltlist cua faltlist danh sach tin nhan
                    e.setState({
                        //khi kich chuot vao username muon chat ta moi moc du lieu ti nhan tu server nodejs hien thij len cho nguoi
                        // dungva gio dim cah co ng gui tin nhan la hien thong bao co tin nhan
                        ArrControlItemMess: this.state.ArrUserSendKey,
                        //SoKey: (Nms -ArrdataMessenger.length) 


                    });
                    console.log('this.state.ArrControlItemMess flatlist;;;;;;', this.state.ArrControlItemMess);

                }
            }
        });

    }

    onYeuCauMess() {

        //truong hop hay de hien thi thoi khi  da nhan chuot chon username
        var UserWeb = this.state.Username;
        var UserApp = this.state.UsernameNguoiSend;
        this.socket.emit('client-muon-lay-ArrayMess-User', {
            NameUserSendUserItem: UserApp + UserWeb + "ChatUsername.docx", //luu ten cua messger de de quan ly
            //ArrSocketId_UserSend: this.state.ArrSocketId_UserSend,
            UserYeuCauMess: UserApp, //tu thang nay o server cung co the tim ra socket id thoa man, //nen su dung se chi can viet o server la su lu ca o app va web duoc
            soPage: this.state.soPage, // quan ly so trang muon lay ve da dc setState o onEndRead cua faltlist
        });
        //  console.log('this.state.UsernameNguoiNhan !== "":::', this.state.UserApp);
        //const { UserWeb, UserApp } = this.state; //UserApp = UsernameNguoiSend, 
        this.socket.on('server-trave-yeucau-ArrayMess-User', (DataMessengerApp_r) => {
            //{Nms: n, Sms: SaveDataMessengerApp}
            console.log('server-trave-yeucau-ArrayMess-User onYeuCauMess ::', DataMessengerApp_r);
            var Nms = DataMessengerApp_r.Nms;
            var SaveDataMessengerApp_r = DataMessengerApp_r.Sms;
            var SaveDataMessengerApp = SaveDataMessengerApp_r;
            console.log('server-trave-yeucau-ArrayMess-User onYeuCauMess::', SaveDataMessengerApp.length);
            console.log('server-trave-yeucau-ArrayMess-User onYeuCauMess::', SaveDataMessengerApp[0]);
            //chi hien thi ra thoi
            if (SaveDataMessengerApp.length == 1 && SaveDataMessengerApp[0] == '0') { //neu ton tai SaveDataMessengerApp_r
                //////  console.log('server-trave-yeucau-ArrayMess-User::==0', SaveDataMessengerApp_r);
                var ArrdataMessenger = [];
                e.setState({
                    // SaveDataMessengerApp: ArrdataMessenger,
                    ArrUserSendKey: ArrdataMessenger,
                    ArrControlItemMess: ArrdataMessenger,  // da nhan vao chon Username roi
                    Nms: Nms,
                });
            }
            if (SaveDataMessengerApp.length > 1 && SaveDataMessengerApp[0] == '[') { //neu ArrayMessUsersendUserItem[0]  khac rong thi ta JSON.parser
                //{Nms: n, Sms: SaveDataMessengerApp}
                var ArrdataMessenger = JSON.parse(SaveDataMessengerApp);
                e.setState({
                    ArrUserSendKey: ArrdataMessenger,
                    ArrControlItemMess: ArrdataMessenger, // da nhan vao chon Username roi
                });
            }
            // var SaveDataMessengerApp1 = JSON.stringify(this.state.SaveDataMessengerApp);
            console.log('(this.state.SaveDataMessengerApp);onYeuCauMess:::', this.state.ArrUserSendKey);
        });

    }

    render() {

        var JSXmesseger = this.state.UserSendEmit + ": " + this.state.messenger;
        const ketQuaJSX = this.state.messenger == null ? null : JSXmesseger;
        var ima1 = 'http://192.168.216.2:2800/upload/1549127159230_avatar.jpg';

        const callJSX = (
            <View style={{
                flex: 1, backgroundColor: '#2F51CB',
                width: (this.state.dataIma == null ? 0 : 500),
                height: this.state.dataIma == null ? 0 : 500,
            }}>
                <ImageBackground

                    style={{
                        backgroundColor: '#2F51CB',
                        width: (this.state.dataIma == null ? 0 : 500),
                        height: this.state.dataIma == null ? 0 : 400,
                        // resizeMode: 'contain',
                    }}
                    source={{ uri: `${this.state.dataIma == null ? ima1 : this.state.dataIma}` }}
                >
                    <Text>000000000000000000000000000000000000{this.state.soPage}</Text>
                </ImageBackground>
            </View>
        );

        const OJSX = (
            <View style={{
                width: 0,
                height: 0
            }}>
            </View>
        );

        var callImage = this.state.dataIma == null ? OJSX: callJSX;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Text>{this.state.soPage}</Text>

                <View style={{ flexDirection: 'row' }}>

                    <View style={{ flex: 1, backgroundColor: '#fff', flexDirection: 'row' }} >
                        <Text style={styles.styleText} >User88</Text>
                        <Text style={styles.UserOnline}>ChatUser8: {this.state.Username === null ? null : this.state.Username}</Text>
                        <TouchableOpacity onPress={() => {
                            const { UsernameNguoiSend, Username } = this.state;
                            this.socket.emit('client-want-dellete-messChatUser', {
                                NameMessDellete: UsernameNguoiSend + Username + "ChatUsername.docx",
                                NameMessDellete1: Username + UsernameNguoiSend + "ChatUsername.docx",
                            });
                            console.log('client-want-dellete-messChatUser');
                            e.setState({
                                ArrControlItemMess: [],
                            });

                        }}>
                            <Image source={require('../../../api/Images/delete.png')} style={styles.styleIconCall}></Image>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity>
                        <Image source={require('../../../api/Images/icons8-call.png')} style={styles.styleIconCall} ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={require('../../../api/Images/videocall.png')} style={styles.styleIconCall} ></Image>
                    </TouchableOpacity>

                </View>



                <View style={{ flex: 7, backgroundColor: '#fff', flexDirection: 'row' }}>

                    <View style={{ flex: 1, backgroundColor: '#007ACC' }}>

                        <View style={{ flex: 1, backgroundColor: '#007ACC', flexDirection: 'column' }} >
                            <FlatList
                                data={this.state.mangU}
                                renderItem={({ item }) => //item = usernaem vi mangU1 chua username khong trung               // UsernameNguoiSend = usernaem_r lay tu getToken
                                    <TouchableOpacity onPress={() => {
                                        var Username = item.Userkey;
                                        e.setState({
                                            Username: Username, //de hien thi Username duoc kich chuot
                                            // ArrControlItemMess: this.state.ArrUserSendKey,//LOAD LUON SE CHI HIEN THI CAI MESS moi doc nhan o socket.on('server-send-messenger') //khi kich chuot vao username muon chat ta moi moc du lieu ti nhan tu server nodejs hien thij len cho nguoi dungva gio dim cah co ng gui tin nhan la hien thong bao co tin nhan
                                        });

                                        const { Username, UsernameNguoiSend } = this.state;

                                        console.log('Username !== null', Username !== null);
                                        console.log('Username !== ', Username !== '');
                                        // console.log('Username !== null',Username !== );
                                        if (Username !== '') {
                                            //   this.uploadImage(); // de setState({ pathImag: });///
                                            //  const { Username, ArraySocketIdThoaMan, messenger, imageBase64, pathIma, SoKey } = this.state;
                                            var dataYeuCauMs = {
                                                UsernameNguoiNhan: Username,
                                                UsernameNguoiSend: UsernameNguoiSend,
                                            };
                                            this.socket.emit('client-yeucau-read-ArrMessSendServer', dataYeuCauMs);
                                        }


                                        //can tim socketIdUsername co UsernameNguoiSend chua no thi moi emit  tra lai chinh no duoc
                                        ArrSocketId_UserSend = [];
                                        var ArraySocketUsername = this.state.ArraySocketUsername;
                                        ArraySocketUsername.map(function (value, index) {
                                            var UserSocketId = value.UserSocketId;
                                            if (UserSocketId.indexOf(UsernameNguoiSend) > -1) {
                                                var ArrSocketId = UserSocketId.replace(UsernameNguoiSend, '');
                                                ArrSocketId_UserSend.push(ArrSocketId);
                                            }
                                        });
                                        console.log('ArrSocketId_UserSend:::', ArrSocketId_UserSend);
                                        e.setState({ ArrSocketId_UserSend: ArrSocketId_UserSend });
                                        var ArrSocketId_UserSend = this.state.ArrSocketId_UserSend;



                                        if (Username !== "") {
                                            this.hienthiMess();

                                        }


                                        var ArraySocketIdThoaMan1 = []; // moi lan nha class = skidUS thi set mang ArraySocketIdThoaMan rong neu khong cac mang truoc se conc cac manh username sau
                                        this.state.ArrayUserSocketId.map(function (value, index) {

                                            if (value.indexOf(Username) > -1) {
                                                var SocketId = value.replace(Username, '');
                                                ArraySocketIdThoaMan1.push(SocketId);
                                                e.setState({ ArraySocketIdThoaMan: ArraySocketIdThoaMan1 })
                                            }
                                        });
                                        //   console.log('this.state.ArraySocketIdThoaMan1:::', (this.state.ArraySocketIdThoaMan));

                                    }}>
                                        <Text style={styles.styleText} >{item.key + ": "}{item.Userkey}</Text>
                                    </TouchableOpacity>
                                }
                            />
                        </View>

                    </View>

                    <View style={{ flex: 4, backgroundColor: '#FFFFFF' }}>
                        <View style={{ flex: 1, backgroundColor: '#fff', flexDirection: 'row' }}>

                            <View style={{ flex: 3, backgroundColor: '#609A22' }}>



                               {callImage}



                                        
                                <FlatList
                                    // data={ArrUserSendKey1}
                                    //data = {ArrarySaveDataMessenger}
                                    //data={this.state.ArrUserSendKey}

                                    refreshing={this.state.refersh}
                                    onRefresh={() => {
                                        //keo dung dinh thi lam gi
                                        e.setState({ refersh: true, });
                                        e.setState({
                                            soPage: parseInt(this.state.soPage) + 1,
                                        });
                                        // this.onYeuCauMess(); //lang nghe server tra ve va setState de hien thi
                                        this.hienthiMess();
                                        e.setState({ refersh: false })
                                    }}
                                    onEndReachedThreshold={0.5}
                                    onEndReached={() => {
                                        //keo dung day thi lam gi
                                        e.setState({ refersh: true });
                                        if (this.state.soPage > 1) {
                                            e.setState({
                                                soPage: parseInt(this.state.soPage) - 1,
                                            });
                                        }
                                        this.hienthiMess();
                                        e.setState({ refersh: false })
                                    }}


                                    data={this.state.ArrControlItemMess} // dieu hien hien thi tin nhan neu kich chuot va Username chat chua kich thi chi luu o server
                                    renderItem={({ item }) =>


                                        <View style={{ flex: 1 }}>

                                            <TouchableOpacity onPress={() => {
                                                //  e.setstate({ key: item.key, UserSend: item.UserSend, messenger: item.messenger, pathIma: item.pathIma })
                                                // var Username = item.Userkey;
                                                // e.setState({ Username: Username, }); //de hien thi Username duoc kich chuot// ArrControlItemMess: this.state.ArrUserSendKey,//LOAD LUON SE CHI HIEN THI CAI MESS moi doc nhan o socket.on('server-send-messenger') //khi kich chuot vao username muon chat ta moi moc du lieu ti nhan tu server nodejs hien thij len cho nguoi dungva gio dim cah co ng gui tin nhan la hien thong bao co tin nhan
                                                //Username = UserWeb

                                                e.setState({
                                                    UserWeb: item.UserSend,
                                                    Username: item.UserSend,
                                                });

                                                const { UserWeb, UsernameNguoiSend } = this.state;
                                                //   alert(UserWeb);
                                                console.log('this.state.Username:::::', this.state.Username)
                                                //can tim socketIdUsername co UsernameNguoiSend chua no thi moi emit  tra lai chinh no duoc
                                                ArrSocketId_UserSend = [];
                                                var ArraySocketUsername = this.state.ArraySocketUsername;
                                                ArraySocketUsername.map(function (value, index) {
                                                    var UserSocketId = value.UserSocketId;
                                                    if (UserSocketId.indexOf(UsernameNguoiSend) > -1) {
                                                        var ArrSocketId = UserSocketId.replace(UsernameNguoiSend, '');
                                                        ArrSocketId_UserSend.push(ArrSocketId);
                                                    }
                                                });
                                                console.log('ArrSocketId_UserSend:::', ArrSocketId_UserSend);
                                                e.setState({ ArrSocketId_UserSend: ArrSocketId_UserSend });
                                                var ArrSocketId_UserSend = this.state.ArrSocketId_UserSend;
                                                console.log('this.state.UserWeb:::::', this.state.UserWeb)
                                                if (UserWeb !== "") {
                                                    this.hienthiMess1();
                                                }
                                                var ArraySocketIdThoaMan1 = []; // moi lan nha class = skidUS thi set mang ArraySocketIdThoaMan rong neu khong cac mang truoc se conc cac manh username sau
                                                this.state.ArrayUserSocketId.map(function (value, index) {
                                                    if (value.indexOf(UserWeb) > -1) {
                                                        var SocketId = value.replace(UserWeb, '');
                                                        ArraySocketIdThoaMan1.push(SocketId);
                                                        e.setState({ ArraySocketIdThoaMan: ArraySocketIdThoaMan1 })
                                                    }
                                                });
                                                //   console.log('this.state.ArraySocketIdThoaMan1:::', (this.state.ArraySocketIdThoaMan));

                                            }}>

                                                {this.state.Username == null ?


                                                    //  this.state.UserSend == null ? null
                                                    //      :
                                                    <View style={{ flexDirection: 'column' }} >


                                                        <View >
                                                            <Text>{console.log('this.state.Username !==null ')}</Text>
                                                            <Text>{console.log('this.state.Username:::: view', this.state.Username)}</Text>

                                                        </View>


                                                        <View style={{ flex: 1, flexDirection: 'row', }}>
                                                            {/* <View style={{ flex: 4, flexDirection: 'row' }}> */}
                                                            <View style={{ flex: 1 }}>
                                                                <View style={{ flex: 1, flexDirection: 'row' }}>

                                                                    <View style={{ flex: 2, backgroundColor: 'blue', }} >
                                                                        <Text key={item.key} style={{ color: 'red', fontSize: 10, }}>{item.key} {item.UserSend}</Text>

                                                                    </View>



                                                                    <Text key={item.key} style={{ flex: 7, fontSize: 8 }}>{":  " + item.messenger}</Text>
                                                                    <Text style={{ flex: 1 }} />

                                                                </View>
                                                                <View />

                                                            </View>
                                                            {/* neu la coloum ta them the nay chen giua de tao khoang cach <Text style={{ flex: 1 }} />  */}
                                                        </View>
                                                        <View style={{ flex: 1 }} />



                                                        <View style={{ flex: 1, flexDirection: 'row', }}>
                                                            {/* <View style={{ flex: 4, flexDirection: 'row' }}> */}
                                                            <View style={{ flex: 1 }}>
                                                                <View
                                                                    style={{
                                                                        flex: 1, flexDirection: 'row',
                                                                        width: (item.pathIma == null ? 0 : avataWidth),
                                                                        height: (item.pathIma == null ? 0 : avataHeight),
                                                                    }}>

                                                                    <View style={{ flex: 2, backgroundColor: 'blue', }} >

                                                                    </View>
                                                                    <View
                                                                        style={{
                                                                            flex: 7, backgroundColor: 'red',
                                                                            width: (item.pathIma == null ? 0 : avataWidth),
                                                                            height: (item.pathIma == null ? 0 : avataHeight),
                                                                        }} >
                                                                        <Text>path: {item.pathIma}</Text>

                                                                        <Image
                                                                            source={{ uri: (item.pathIma == null ? ima1 : `${item.pathIma}`) }}
                                                                            // style={styles.pathImaStyle} 
                                                                            style={{
                                                                                width: item.pathIma == null ? 0 : avataWidth,
                                                                                height: item.pathIma == null ? 0 : 300,

                                                                            }}
                                                                        >
                                                                        </Image>
                                                                    </View>
                                                                    <View style={{ flex: 1 }} />

                                                                </View>
                                                                <View />

                                                            </View>
                                                            {/* neu la coloum ta them the nay chen giua de tao khoang cach <Text style={{ flex: 1 }} />  */}
                                                        </View>


                                                    </View>


                                                    :

                                                    <View style={{ flex: 1 }}>
                                                        <View style={{ flexDirection: 'column' }} >
                                                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                                                {/* <View style={{ flex: 4, flexDirection: 'row' }}> */}
                                                                <View style={{ flex: 1 }}>
                                                                    <View style={{ flex: 1, flexDirection: 'row' }}>

                                                                        <View style={{ flex: 2, backgroundColor: 'blue', }} >
                                                                            <Text key={item.key} style={{ color: 'red', fontSize: 10, }}>{item.key} {item.UserSend}</Text>

                                                                        </View>

                                                                        <Text key={item.key} style={{ flex: 7, fontSize: 8 }}>{":  " + item.messenger}</Text>
                                                                        <Text style={{ flex: 1 }} />

                                                                    </View>
                                                                    <View />

                                                                </View>
                                                                {/* neu la coloum ta them the nay chen giua de tao khoang cach <Text style={{ flex: 1 }} />  */}
                                                            </View>
                                                            <View style={{ flex: 1 }} />



                                                            <View style={{ flex: 1, flexDirection: 'row', }}>
                                                                {/* <View style={{ flex: 4, flexDirection: 'row' }}> */}
                                                                <View style={{ flex: 1 }}>
                                                                    <View style={{ flex: 1, flexDirection: 'row' }}>

                                                                        <View style={{ flex: 2, backgroundColor: 'blue', }} >

                                                                        </View>

                                                                        <View style={{ flex: 7, backgroundColor: 'red', width: (`${item.pathIma}` == null ? 0 : avataWidth), height: (`${item.pathIma}` == null ? 0 : avataHeight), }} >
                                                                            <Text>path: {item.pathIma}</Text>

                                                                            <Image source={{ uri: (`${item.pathIma}` == null ? ima1 : `${item.pathIma}`) }} style={styles.pathImaStyle} >
                                                                            </Image>
                                                                        </View>
                                                                        <View style={{ flex: 1 }} />

                                                                    </View>
                                                                    <View />

                                                                </View>
                                                                {/* neu la coloum ta them the nay chen giua de tao khoang cach <Text style={{ flex: 1 }} />  */}
                                                            </View>
                                                        </View>

                                                        <View style={{ flex: 1, flexDirection: 'column' }}>
                                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                                <Text style={{ flex: 2 }} />
                                                                <View style={{ flex: 3, backgroundColor: '#E61A5F', }} >
                                                                    {/*}
                                                        <Image source={{ uri: (item.pathIma == null ? ima1 : item.pathIma) }} style={styles.pathImaStyle} >
                                                        </Image>
                                                                */}
                                                                    <Text key={item.key} style={styles.styleUserSend_FromApp_Send}>
                                                                        {
                                                                            // this.state.messenger == null ? null : (item.UserNhan + item.messengerNhan)
                                                                            item.key + (item.UserNhan == null ? "" : item.UserNhan + ": ") + (item.messengerNhan == null ? "" : item.messengerNhan)
                                                                            //  item.key + item.UserNhan + item.messengerNhan
                                                                        }
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                            <View />

                                                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#E61A5F', }}>
                                                                <View style={{ flex: 2 }} />
                                                                <View style={{ flex: 3, }} >

                                                                    <View
                                                                        style={{
                                                                            flex: 3, backgroundColor: 'yellow',
                                                                            height: (`${item.pathIma}` == null ? 0 : avataHeight),
                                                                            width: (`${item.pathIma}` == null ? 0 : avataWidth)
                                                                        }} >
                                                                        <Text>path: {item.pathIma}</Text>
                                                                        <Text>{console.log('${item.pathIma}:::', `${item.pathIma}`)}</Text>
                                                                        <Image
                                                                            source={{ uri: (`${item.pathIma}` == null ? ima1 : `${item.pathIma}`) }}
                                                                            style={styles.pathImaStyle} >
                                                                        </Image>

                                                                    </View>
                                                                </View>
                                                            </View>


                                                        </View>



                                                    </View>


                                                }
                                            </TouchableOpacity>




                                        </View>

                                    }

                                />

                            </View>


                        </View>
                    </View>

                </View>

                <View style={{ flex: 2, backgroundColor: '#fff', height: 200, }} >

                    <View style={{ flex: 2, backgroundColor: '#fff', height: 80, }}>

                        <TextInput
                            onChangeText={text => this.setState({ messenger: text })}
                            value={this.state.messenger}
                            placeholder={"vui long nhap text"}
                            style={{ height: 80, width: 500 }}
                            multiline={true}
                            numberOfLines={4}
                        />
                    </View>



                    <View style={{ flex: 1, flexDirection: 'row', height: 100, }}>
                        <TouchableOpacity onPress={() => {
                            this.ShowImage_piker();
                        }}>
                            <Image source={require('../../../api/Images/cameraIcon.png')} style={styles.styleIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {

                        }}>
                            <Image source={require('../../../api/Images/microphone.png')} style={styles.styleIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { this.sendEmit() }}>
                            <Image source={require('../../../api/Images/sendIcon.png')} style={styles.styleIcon} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { this.uploadImage() }}>
                            <Text>  UL</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { this.stream() }}>
                            <Text>  stm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { this.stream1() }}>
                            <Text>  stm1</Text>
                        </TouchableOpacity>

                         <TouchableOpacity onPress={() => { this.EndCallImga() }}>
                            <Text>  EcallIM</Text>
                        </TouchableOpacity>


                        <TextInput
                            onChangeText={text => this.setState({ messenger: text })}
                            value={this.state.messenger}
                            placeholder={"vui long nhap text"}
                            style={{ height: 80, width: 500 }}
                            multiline={true}
                            numberOfLines={4}

                        />

                        <Image source={{ uri: 'http://192.168.216.2:2400/hotgirls/1.jpg' }} style={styles.styleIcon} >

                        </Image>

                    </View>

                </View>

            </View>
        );
    }
}

const avataHeight = (height - 20) / 2;
const avataWidth = (avataHeight / (1050)) * 700;
const borderavata = (avataHeight / 2);
const styles = StyleSheet.create({
    styleUserSend_ToAPP_Nhan: {
        fontSize: 8,
        // backgroundColor: '#ffff',

    },
    styleUserSend_FromApp_Send: {
        fontSize: 10,
        // backgroundColor: '#ffff',
        color: 'blue',
        flex: 3,
    },
    UserOnline: {
        backgroundColor: '#DDD6DB',
        color: 'red'
    },
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
        marginLeft: 16,
    },
    styleIconCall: {

        width: 24,
        height: 24,
        marginRight: 16,
    },
    pathImaStyle: {
        width: 140,
        height: 120,
    }

})

