import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import io from 'socket.io-client/dist/socket.io.js';
import ImagePicker from 'react-native-image-picker'; //yarn add react-native-image-picker// react-native link react-native-image-picker
import RNFetchBlob from 'react-native-fetch-blob'; //yarn add react-native-fetch-blob//react-native link
import getToken from '../../../api/getToken';

import Authentication from '../Authentication/Authentication';

var e;
const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',

    },
};

var key = 0;

// var ArrdataMessenger = [];
var ArrarySaveDataMessenger = [];


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






export default class FreeAll extends Component {


    constructor(props) {


        var ArrUserSendKey1 = [
            { key: 0, UserSend: 'UserSend', messenger: 'messenger' },
            { key: 0, UserSend: 'UserSend', messenger: 'messenger' },
            { key: 1, UserSend: 'UserSend', messenger: 'messenger' },
            { key: 0, UserSend: 'UserSend', messenger: 'messenger' },
            { key: 1, UserSend: 'UserSend', messenger: 'messenger' },
            { key: 2, UserSend: 'UserSend', messenger: 'messenger' },

        ];
        var x = ArrUserSendKey1;
        console.log('xxxxxxxxxxxx', x);

        super(props);

        e = this;
        this.state = {

            ArrUserSendKey9: [
                { key: 0, UserSend: 'UserSend', messenger: 'messenger' },
                { key: 0, UserSend: 'UserSend', messenger: 'messenger' },
                { key: 1, UserSend: 'UserSend', messenger: 'messenger' },
                { key: 0, UserSend: 'UserSend', messenger: 'messenger' },
                { key: 1, UserSend: 'UserSend', messenger: 'messenger' },
                { key: 2, UserSend: 'UserSend', messenger: 'messenger' },

            ],

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
        }


        this.socket = io('http://192.168.216.2:2400', { jsonp: false });
        this.socket.on('connect', (data) => {
            //  console.log('data app ket lang nghe connect tu ser nodjs', data);
            getToken('@Username')
                .then(UsernameNguoiSend => {
                    if (UsernameNguoiSend == '' || UsernameNguoiSend == 'undefined') {
                        //go back to dang nhap goto Authentication
                        const { navigator } = this.props;
                        navigator.push({ 'name': 'AUTHENTICATION' });
                    } else {
                        console.log('Username_r.. UsernameNguoiSend tai FressALL::', UsernameNguoiSend);
                        this.socket.emit('client-send-Username', UsernameNguoiSend);
                        console.log('App dang-emit send to getToken -Username -UsernameNguoiSend-ca-nhan trong coment FressALL::::', UsernameNguoiSend);

                    }
                });
        });



        this.socket.on('socketId-da-disconnect', socketId => {
            console.log('socketId-da-disconnect: data la', socketId);
            getToken('@Username')
                .then(UsernameNguoiSend => {
                    console.log('Username_r.. UsernameNguoiSend socketId-da-disconnect FressALL::', UsernameNguoiSend);
                    this.socket.emit('client-xoa-Username', socketId + UsernameNguoiSend); //co ket noi cai la gui luon username
                    console.log('app dang emit socketId ma server nodejs -da-disconnect: data la', socketId + UsernameNguoiSend);
                    this.socket.on('server-capNhat-Danhsach-socketId-new-saukhi-disconnect', ArraySocketUsername => {
                        e.setState({ ArraySocketUsername: ArraySocketUsername });
                    })
                });
        });

        /*
                this.socket = io('http://192.168.216.2:2400', { jsonp: false });
                this.socket.on('connect', (data) => {
                    console.log('data app ket lang nghe connect tu ser nodjs', data);
                    getToken('@Username')
                        .then(UsernameNguoiSend => {
                            console.log('Username_r.. UsernameNguoiSend tai FressALL::', UsernameNguoiSend);
                            e.setState({ UsernameNguoiSend: UsernameNguoiSend });
                            console.log('Username_r.. UsernameNguoiSend  this.state.UsernameNguoiSend FressALL::', this.state.UsernameNguoiSend);
                         //   this.socket.emit('client-send-Username', UsernameNguoiSend);
                            this.socket.emit('client-send-Username',  this.state.UsernameNguoiSend);
                            console.log('App dang-emit send to getToken -Username -UsernameNguoiSend-ca-nhan trong coment FressALL::::',this.state.UsernameNguoiSend);
                        });
                });
                this.socket.on('socketId-da-disconnect', socketId => {
                    console.log('socketId-da-disconnect: data la', socketId);
                    this.socket.emit('client-xoa-Username', socketId + this.state.UsernameNguoiSend); //co ket noi cai la gui luon username
                    console.log('app dang emit socketId ma server nodejs -da-disconnect: data la', socketId + this.state.UsernameNguoiSend);
                }); 
        */

        getToken('@Username')
            .then((Username_r) => {
                e.setState({ UsernameNguoiSend: Username_r });
            });
        console.log('this.state.UsernameNguoiSend', this.state.UsernameNguoiSend);

        this.socket.on('server-send-socket.id+Username', async (ArraySocketUsername) => {
            console.log('ArraySocketUsername:::', ArraySocketUsername);
            console.log('ArraySocketUsername.length:::', ArraySocketUsername.length);
            e.setState({ ArraySocketUsername: ArraySocketUsername })
            var ArrayUserSocketId1 = [];
            var arrayUsername1 = [];
            var ArraySocketUsername = this.state.ArraySocketUsername;
            ArraySocketUsername.map(function (value, index) {
                //  console.log('ArrayUserSocketId index::', index);

                var UserSocketId = value.UserSocketId;
                var Username = value.Username;
                if (Username !== null || Username !== '' || Username !== null || Username !== 'undefined') {
                    // console.log('UserSocketId value::', UserSocketId);
                    //  console.log('Username value::', Username);

                    ArrayUserSocketId1.push(UserSocketId);
                    arrayUsername1.push(Username);

                    // console.log('ArrayUserSocketI1::', ArrayUserSocketId1);
                    // console.log('arrayUsername1::', arrayUsername1);
                }


            });
            //  console.log('ArrayUserSocketI1 ngoai map::', ArrayUserSocketId1);
            // console.log('arrayUsername1 ngoai map::', arrayUsername1);
            //  console.log('ArrayUserSocketI1.length ngoai map::', ArrayUserSocketId1.length);
            //  console.log('arrayUsername1.length ngoai map::', arrayUsername1.length);

            await e.setState({
                ArrayUserSocketId: ArrayUserSocketId1,
                arrayUsername: arrayUsername1,
            });
            // console.log('this.state.ArrayUserSocketId:::', this.state.ArrayUserSocketId);
            // console.log('this.state.arrayUsername:::', this.state.arrayUsername);
            //  console.log('this.state.arrayUsername.length.:::', (this.state.arrayUsername).length);
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
                MangUserKey.push({ key: i, Userkey: mangU1[i] });
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
                    var UserKey = { key: index, Userkey: value };
                    ArrUserKey.push(UserKey);
                }

            });
            console.log('ArrUserKey1::::', ArrUserKey);

            await e.setState({
                mangU: ArrUserKey
            });

        });

        //var n = 0;
        //lang nghe server send tin nhan
        this.socket.on('server-send-messenger', dataMessenger => {
            //    alert(dataMessenger.UsernameNguoiSend + ": " + dataMessenger.messenger);
            console.log('dataMessenger:::', dataMessenger);
            //  var msSend = dataMessenger.UsernameNguoiNhan + ": " + dataMessenger.messenger;
            //  var msNhan = dataMessenger.UsernameNguoiSend + ": " + dataMessenger.messenger;
            //   $('#ListMesseger').append("<div class='CmsSend'>" + msSend + "</div>" + "<br/>");
            //   $('.CmsSend').css("color", "red");


            // var ArrdataMessenger =  [dataMessenger];
            // var UserSend = dataMessenger.UsernameNguoiSend;
            // var messenger = dataMessenger.messenger;



            //  var n = n+1;
            //  var n = parseInt(n) + 1; //so lan lang nghe duoc server-send-messenger de tinh ra key khong trung
            //  ArrdataMessenger.push(dataMessenger);

            /*         this.setState({ n: (this.state.n + 1) });
                        ArrdataMessenger.push(dataMessenger);
                        var UserSend = dataMessenger.UsernameNguoiSend;
                        var messenger = dataMessenger.messenger;
                        var UserSendKey = { key: this.state.n, UserSend: UserSend, messenger: messenger }; //key  khai bao ben ngoai component de cho key luong tang
                        ArrUserSendKey1.push(UserSendKey);
            */

            //khi nhan duoc lai phai setState ve rong
            // e.setState({  UserSendEmit: '',  messenger: '',});

            // e.setState({  UserSendEmit: '',  messenger: '',});
            // var UserSendKey = { key: (ArrdataMessenger.length + 1), UserSend: dataMessenger.UsernameNguoiSend, messenger: dataMessenger.messenger, UserNhan: this.state.Username, messengerNhan: this.state.Username==null? null : this.state.messenger };

            var ArrdataMessenger = this.state.SaveDataMessengerApp;
            console.log('var ArrdataMessenger =  this.state.SaveDataMessengerApp::::', ArrdataMessenger);
            var UserSendKey = { key: (ArrdataMessenger.length + 1), UserSend: dataMessenger.UsernameNguoiSend, messenger: dataMessenger.messenger, UserNhan: '', messengerNhan: '' };

            ArrdataMessenger.push(UserSendKey);

            ArrarySaveDataMessenger.push(UserSendKey);
            console.log('ArrarySaveDataMessenger...this socket.on', ArrarySaveDataMessenger);

            var ArrUserSendKey1 = [];
            for (i = 0; i < ArrdataMessenger.length; i++) {
                var UserSend = ArrdataMessenger[i].UserSend;
                var messenger = ArrdataMessenger[i].messenger;                          //tam thoi lay bien UserSendEmit de thai the bien UserNhan nhan duoc tu lnag ngh
                //thay the de khi chia nhan iet ta chua setstate UserSendEmit thi no chua hien len flastlist
                var UserNhan = ArrdataMessenger[i].UserNhan;                  //UserNhan se la ng emit tu ap xuong  ,messengerNhan la ng emit tin nhan xuong ap
                var messengerNhan = ArrdataMessenger[i].messengerNhan;
                //  var UserSendKey = { key: i, UserSend: UserSend, messenger: messenger, UserNhan: this.state.UserSendEmit, messengerNhan: this.state.messenger };
                var UserSendKey = { key: i, UserSend: UserSend, messenger: messenger, UserNhan: UserNhan, messengerNhan: messengerNhan };
                ArrUserSendKey1.push(UserSendKey);
            }
            //  console.log('ArrUserSendKey1::::', ArrUserSendKey1); //ArrUserSendKey1 maga nay gui len server de luu chu nha
            e.setState({
                ArrUserSendKey: ArrUserSendKey1,
                SaveDataMessengerApp: ArrUserSendKey1
            });
            console.log('this.state.ArrUserSendKey::::', this.state.ArrUserSendKey);
            console.log('this.state.SaveDataMessengerApp::::', this.state.SaveDataMessengerApp);
            var SaveDataMessengerApp1 = JSON.stringify(this.state.SaveDataMessengerApp);
            var Username = this.state.Username;
            console.log('.SaveDataMessengerApp1::::', SaveDataMessengerApp1);

            const SaveTinNhan = async (Username, ArrayMesse) => {
                try {
                    await AsyncStorage.setItem(Username, ArrayMesse)
                    if (ArrayMesse !== null) {
                        return 'SAVE MESSENGER CHO' + Username + 'THANH_CONG';
                    }
                } catch (e) {
                    return e;
                }
            }
            SaveTinNhan(Username, SaveDataMessengerApp1); //luu tin nha cho ten duoc tich
            //SaveTinNhan(this.state.Username, ArrdataMessenger);
            // SaveTinNhan('manh', ArrdataMessenger);


            GetTinNhan(Username) //khi kich chuot vao Username chon thi getTinNhan mang nay se suoc load ra
                .then(SaveDataMessengerApp => {
                    console.log('SaveDataMessengerApp get tinnhan ::', SaveDataMessengerApp);
                });

            /*
            for (i = 0; i < ArrdataMessenger.length; i++) {
                // var UserSendKey = { key: i, UserSend: UserSend, messenger: messenger };
                // var UserSendKey = { "key": "'" + key + 1 + "'", UserSend: UserSend, messenger: messenger }; //key  khai bao ben ngoai component de cho key luong tang
                var UserSend = ArrdataMessenger[i].UsernameNguoiSend;
                var messenger = ArrdataMessenger[i].messenger;
                var UserSendKey = { key: n, UserSend: UserSend, messenger: messenger }; //key  khai bao ben ngoai component de cho key luong tang
                ArrUserSendKey1.push(UserSendKey);
            } */
            // console.log('ArrUserSendKey1::::', ArrUserSendKey1);
            /* function setArrUserSendKey() {
                 e.setState({
                     ArrUserSendKey: ArrUserSendKey1
                 });
             }
             console.log('this.state.ArrUserSendKey::::', this.state.ArrUserSendKey);
            
             */



            //$('#ListMesseger').append("<div class='CmsNhan'>" + msNhan + "</div>" + "<br/>");
            //$('.CmsNhan').css("color", "blue");
            //  $('#NguoiSend').append("<div class='' >" + UsernameNguoiSend + "</div>");
        });

    }

    componentDidMount() {
        var y = this.state.ArrUserSendKey9;
        console.log('yyyyyyyyyyyyy', y);
    }

    setStateArrUserSendKey() {
        var ArrUserSendKey1 = [
            { key: 0, UserSend: 'UserSend', messenger: 'messenger' },
            { key: 0, UserSend: 'UserSend', messenger: 'messenger' },
            { key: 1, UserSend: 'UserSend', messenger: 'messenger' },
            { key: 0, UserSend: 'UserSend', messenger: 'messenger' },
            { key: 1, UserSend: 'UserSend', messenger: 'messenger' },
            { key: 2, UserSend: 'UserSend', messenger: 'messenger' },

        ];
        e.setState({ ArrUserSendKey: ArrUserSendKey1 });

    }

    setState1() {
        e.setState({ ArrUserSendKey: this.state.ArrUserSendKey });
    }

    sendEmit() {



        //cap nhan co ng emit gui messe
        e.setState({
            UserSendEmit: this.state.UsernameNguoiSend,
        });
        console.log('this.state.UserSendEmit', this.state.UserSendEmit);

        //test thu message text send di 
        e.setState({ messenger: 'Instead of playing the guessing game, when you try all the different combinations till you find the one that fits, just use the following modifiers props: left, top, right & bottom.' });
        /*
        this.setState({ //lay gia tri send khi da setState (*****)
            send: true, // khi chua gui bang flase nhe
        }); */
        getToken('@Username')
            .then(async (Username_r) => {

                await e.setState({ UserSendEmit: Username_r });
            });
        console.log('this.state.UsernameNguoiSend', this.state.UserSendEmit)
        console.log('this.state.UsernameNguoiSend', this.state.UsernameNguoiSend)
        //   var dataEmit = { UsernameNguoiNhan: this.state.Username, UsernameNguoiSend: this.state.UserSendEmit, DSsocketIdNguoiNhan: this.state.ArraySocketIdThoaMan, messenger: this.state.messenger };
        var dataEmit = { UsernameNguoiNhan: this.state.Username, UsernameNguoiSend: this.state.UsernameNguoiSend, DSsocketIdNguoiNhan: this.state.ArraySocketIdThoaMan, messenger: this.state.messenger };
        this.socket.emit("client-send-messenger", dataEmit);
        console.log('server dang send socket.usernam va messenger ca nhan dataEmit', dataEmit);

        e.setState({ m: (parseInt(this.state.m) + 1), });//so lan emit 1 lan emit la 1 lan cap nhat mang tin nhan cua app nhe
        console.log('this.state.m::::', this.state.m);

        //su ly mang moi cho this.state.ArrUserSendKey
        ///////////////////////////////////////////////////////
        /*
         var a = this.state.ArrUserSendKey; //ArrarySaveDataMessenger mang lu chutin nhan tren  app cho nguoi dung
         console.log('ArrarySaveDataMessenger _ aaaa:::', a);
         var i = ArrUserSendKey.length; // moi 1 lan emit la 1 lan tnag bien mang len
         console.log('i::::', i);
         console.log('m::::', m);
         var s = (i + this.state.m);
         console.log('s::::', s);
         var UserSend = this.state.UsernameNguoiSend;
         var messenger = this.state.messenger;
         var UserNhan = this.state.Username; //la username duoc tich chuot tren app
         var UserSendKey = [{ key: (i + this.state.m), UserSend: UserSend, messenger: messenger, UserNhan: UserNhan, messengerNhan: this.state.messenger }];
         ArrdataMessenger = ArrdataMessenger.concat([UserSendKey]); //= ArrdataMessenger = this.state.ArrUserSendKey.concat([UserSendKey])
         var ArrUserSendKey1 = [];
         for (i = 0; i < ArrdataMessenger.length; i++) {
             var UserSend = ArrdataMessenger[i].UsernameNguoiSend;
             var messenger = ArrdataMessenger[i].messenger;                          //tam thoi lay bien UserSendEmit de thai the bien UserNhan nhan duoc tu lnag ngh
             //thay the de khi chia nhan iet ta chua setstate UserSendEmit thi no chua hien len flastlist
             var UserNhan = ArrdataMessenger[i].UsernameNguoiNhan;                  //UserNhan se la ng emit tu ap xuong  ,messengerNhan la ng emit tin nhan xuong ap
             var UserSendKey = { key: i, UserSend: UserSend, messenger: messenger, UserNhan: this.state.UserSendEmit, messengerNhan: this.state.messenger };
             ArrUserSendKey1.push(UserSendKey);
         }
         console.log('ArrUserSendKey1::::', ArrUserSendKey1); //ArrUserSendKey1 maga nay gui len server de luu chu nha
         e.setState({
             ArrUserSendKey: ArrUserSendKey1
         });
 
      */
        //cap nhat  them 1 phan tu trong Flatlist cho ArrdataMessenger
        // var UserSend = this.state.UsernameNguoiSend;
        // var messenger = this.state.messenger;
        // var UserNhan = this.state.Username; //la username duoc tich chuot tren app
        //var UserSend = '';
        //var messenger = '';
        //var UserNhan = this.state.Username; //la username duoc tich chuot tren app
        //e.setState({ messenger: 'this.setState({ //lay gia tri send khi da setState (*****)sdgdsgdgdgdgdgdgdg' }); //setState messenger 
        //var UserSendKey = { key: (ArrdataMessenger.length + 1), UserSend: UserSend, messenger: messenger, UserNhan: UserNhan, messengerNhan: this.state.messenger };

        //  e.setState({ messenger: 'this.setState({ //lay gia tri send khi da setState (*****)sdgdsgdgdgdgdgdgdg' }); //setState messenger     //neu khong co ten nguoi nhan thi k hien thi tin nhan messenger ng gui
        // var UserSendKey = { key: (ArrdataMessenger.length + 1), UserSend: '', messenger: '', UserNhan: this.state.Username, messengerNhan: this.state.Username == null ? null : this.state.messenger };
        // ArrdataMessenger = this.state.ArrUserSendKey.push(UserSendKey);
        //ArrdataMessenger da co them phan tu UserNhan, messengerNhan

        //  ArrdataMessenger = (this.state.SaveDataMessengerApp);

        var ArrdataMessenger = this.state.SaveDataMessengerApp;
        var UserSendKey = { key: (ArrdataMessenger.length + 1), UserSend: '', messenger: '', UserNhan: this.state.Username, messengerNhan: this.state.Username == null ? null : this.state.messenger };
        ArrdataMessenger.push(UserSendKey);
        ArrarySaveDataMessenger.push(UserSendKey);
        console.log('ArrarySaveDataMessenger...ArrarySaveDataMessenger', ArrarySaveDataMessenger);
        var ArrUserSendKey1 = [];
        for (i = 0; i < ArrdataMessenger.length; i++) {
            var UserSend = ArrdataMessenger[i].UserSend;
            var messenger = ArrdataMessenger[i].messenger;                          //tam thoi lay bien UserSendEmit de thai the bien UserNhan nhan duoc tu lnag ngh
            //thay the de khi chia nhan iet ta chua setstate UserSendEmit thi no chua hien len flastlist
            var UserNhan = ArrdataMessenger[i].UserNhan;                  //UserNhan se la ng emit tu ap xuong  ,messengerNhan la ng emit tin nhan xuong ap
            var messengerNhan = ArrdataMessenger[i].messengerNhan;
            //  var UserSendKey = { key: i, UserSend: UserSend, messenger: messenger, UserNhan: this.state.UserSendEmit, messengerNhan: this.state.messenger };
            var UserSendKey = { key: i, UserSend: UserSend, messenger: messenger, UserNhan: UserNhan, messengerNhan: messengerNhan };
            ArrUserSendKey1.push(UserSendKey);
        }
        console.log('ArrUserSendKey1::::', ArrUserSendKey1); //ArrUserSendKey1 maga nay gui len server de luu chu nha
        e.setState({
            ArrUserSendKey: ArrUserSendKey1,
            SaveDataMessengerApp: ArrUserSendKey1,
        });
        console.log('this.state.ArrUserSendKey sendEmit::::', this.state.ArrUserSendKey);
        console.log('this.state.ArrUserSendKey sendEmit::::', this.state.SaveDataMessengerApp);
        var SaveDataMessengerApp = JSON.stringify(this.state.SaveDataMessengerApp);
        SaveTinNhan(this.state.Username, SaveDataMessengerApp); //luu tin nha cho ten duoc tich
        GetTinNhan(this.state.Username) //khi kich chuot vao Username chon thi getTinNhan mang nay se suoc load ra
            .then(SaveDataMessengerApp => {
                console.log('SaveDataMessengerApp get tinnhan sendemit  ::', SaveDataMessengerApp);
            });
        //  SaveTinNhan(this.state.Username, ArrdataMessenger); //luu tin nhan o mang goc  ArrdataMessenger
        // SaveTinNhan('manh', ArrdataMessenger); //luu tin nhan o mang goc  ArrdataMessenger


        /*  var b = this.state.ArrUserSendKey;
          console.log('this.state.ArrUserSendKey_ bbbbb::::', b);
          //co duoc mang moi can cong mang cu va mang moi la de duoc mang tong data tin nhan app
          ArrarySaveDataMessenger = a.concat(b);
          console.log('ArrarySaveDataMessenger::::', ArrarySaveDataMessenger);
          */

    }
    render() {

        var JSXmesseger = this.state.UserSendEmit + ": " + this.state.messenger;
        const ketQuaJSX = this.state.messenger == null ? null : JSXmesseger;

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flex: 1, backgroundColor: '#fff', flexDirection: 'row' }} >
                    <Text style={styles.styleText} >danh sach socket.id+Username</Text>
                    <Text style={styles.UserOnline}>UserOnline: {this.state.Username === null ? null : this.state.Username}</Text>
                    <TouchableOpacity onPress={() => {
                        SaveTinNhan(this.state.Username, '');
                        GetTinNhan(this.state.Username)
                            .then(SaveDataMessengerApp_r => {
                                console.log('da xoa tin nhan cho :' + this.state.Username, SaveDataMessengerApp_r);
                                e.setState({ ArrUserSendKey: SaveDataMessengerApp_r, SaveDataMessengerApp: SaveDataMessengerApp_r });
                                console.log('this.state.ArrUserSendKey get tin nhan khi kich chuot vao Username ta se get tinnhan de lay tin nhan da luu len ::', this.state.SaveDataMessengerApp_r);

                            });
                    }}>
                        <Text style={styles.styleText}>xoa Tin nhan cho Username Hien tren Username Onlike</Text>
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
                                        e.setState({ Username: Username }); //de hien thi Username duoc kich chuot
                                        GetTinNhan(this.state.Username) //khi kich chuot vao Username chon thi getTinNhan mang nay se suoc load ra
                                            .then(SaveDataMessengerApp_r => {
                                                console.log('SaveDataMessengerApp_r khi kich chuot vao Username ta se get tinnhan de lay tin nhan da luu len chua JSON.paser thi no van o dang JSON.string ::', SaveDataMessengerApp_r);
                                                console.log('SaveDataMessengerApp_r[0]::', SaveDataMessengerApp_r[0])
                                                if (SaveDataMessengerApp_r[0] == null || SaveDataMessengerApp_r[0] == '' || SaveDataMessengerApp_r[0] == 'undefined') {
                                                    console.log('SaveDataMessengerApp_r kiem tra xem nhay vao if (SaveDataMessengerApp_r === []) ', SaveDataMessengerApp_r);
                                                    e.setState({ ArrUserSendKey: SaveDataMessengerApp_r, SaveDataMessengerApp: SaveDataMessengerApp_r });
                                                    console.log('this.state.ArrUserSendKey get tin nhan khi kich chuot vao Username ta se get tinnhan de lay tin nhan da luu len ::', this.state.SaveDataMessengerApp_r);
                                                }
                                                else {
                                                    var SaveDataMessengerApp = JSON.parse(SaveDataMessengerApp_r);
                                                    console.log('ArrUserSendKey khi kich chuot vao Username ta se get tinnhan de lay tin nhan da luu len ::', SaveDataMessengerApp);
                                                    e.setState({ ArrUserSendKey: SaveDataMessengerApp, SaveDataMessengerApp: SaveDataMessengerApp });
                                                    console.log('this.state.ArrUserSendKey get tin nhan khi kich chuot vao Username ta se get tinnhan de lay tin nhan da luu len ::', this.state.SaveDataMessengerApp)

                                                }
                                            });

                                        /*
                                        GetTinNhan(this.state.Username) //khi kich chuot vao Username chon thi getTinNhan mang nay se suoc load ra
                                            .then(SaveDataMessengerApp => {
                                                console.log('ArrUserSendKey get tinnhan ::', SaveDataMessengerApp);
                                                e.setState({ SaveDataMessengerApp: SaveDataMessengerApp });
                                                console.log('this.state.ArrUserSendKey get tin nhan::', this.state.ArrUserSendKey)
                                            });
                                         GetTinNhan(this.state.Username) //khi kich chuot vao Username chon thi getTinNhan mang nay se suoc load ra
                                             .then(ArrUserSendKey => {
                                                 console.log('ArrUserSendKey get tinnhan ::', ArrUserSendKey);
                                                 e.setState({ ArrUserSendKey: ArrUserSendKey });
                                                 console.log('this.state.ArrUserSendKey get tin nhan::', this.state.ArrUserSendKey)
                                             }); */

                                        // alert(Username)
                                        var ArraySocketIdThoaMan1 = []; // moi lan nha class = skidUS thi set mang ArraySocketIdThoaMan rong neu khong cac mang truoc se conc cac manh username sau
                                        this.state.ArrayUserSocketId.map(function (value, index) {
                                            // console.log('value:::5555', value);
                                            // console.log('index:::6666', index);
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
                                <FlatList
                                    // data={ArrUserSendKey1}
                                    //data = {ArrarySaveDataMessenger}
                                    data={this.state.ArrUserSendKey}
                                    renderItem={({ item }) =>

                                        <View style={{ flex: 1 }}>

                                            {/*  <TouchableOpacity onPress={() => {

                                                    console.log('this.state.ArrUserSendKey TouchableOpacity::', this.state.ArrUserSendKey)
                                                }}>
                                                    <Text>setArrUserSendKeyTouchableOpacity</Text>

                                                </TouchableOpacity>

                                                <Text>{console.log('this.state.ArrUserSendKey o flatList1111111111', this.state.ArrUserSendKey)}</Text>
                                            */}
                                            <View style={{ flex: 1, flexDirection: 'row', }}>

                                                {/* <View style={{ flex: 4, flexDirection: 'row' }}> */}
                                                <View style={{ flex: 9 }}>
                                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                                        <Text key={item.key} style={{ flex: 2, color: 'red', fontSize: 10, }}>{item.key} {item.UserSend}</Text>
                                                        <Text key={item.key} style={{ flex: 7, fontSize: 8 }}>{":  " + item.messenger}</Text>
                                                        <Text style={{ flex: 1 }} />
                                                    </View>
                                                </View>
                                                <View style={{ flex: 1 }} />
                                                {/* neu la coloum ta them the nay chen giua de tao khoang cach <Text style={{ flex: 1 }} />  */}
                                            </View>

                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <Text style={{ flex: 2 }} />
                                                <Text key={item.key} style={styles.styleUserSend_FromApp_Send}>
                                                    {
                                                        // this.state.messenger == null ? null : (item.UserNhan + item.messengerNhan)
                                                        item.key + (item.UserNhan == null ? null : item.UserNhan + ": ") + (item.messengerNhan == null ? null : item.messengerNhan)
                                                        //  item.key + item.UserNhan + item.messengerNhan
                                                    }
                                                </Text>
                                            </View>

                                            {/* 
                                                la 1 cai view khac ha
                                                <Text key={item.key} style={{ color: 'blue' }}>{item.key + ": "}{ketQuaJSX}</Text> */}

                                        </View>
                                    }

                                />

                                {/*   <Text style={{ color: 'blue' }}>{ketQuaJSX}</Text> */}

                            </View>

                            {/*  <View style={{ flex: 3, backgroundColor: '#FFFFFF' }}>
                                {
                                    this.state.ArrUserSendKey.map(function (item, index) {
                                        <View>
                                            <Text style={{ color: 'red' }} >{index}</Text>
                                            <Text style={{ color: 'red' }} >{item.key + ": "} {item.UserSend} {":  " + item.messenger}</Text>
                                        </View>
                                    })
                                }

                                <Text style={{ color: 'blue' }}>{ketQuaJSX}</Text> 
                                </View>
                            */}

                        </View>
                    </View>

                </View>

                <View style={{ flex: 2, backgroundColor: '#fff', height: 200, }} >

                    <View style={{ flex: 2, backgroundColor: '#fff', height: 80, }}>

                        <TextInput
                            onChangeText={text => this.setState({ messenger: text })}
                            value={this.state.messenger}
                            placeholder={"vui long nhap text"}
                            style={{ height: 80 }}
                        />
                    </View>



                    <View style={{ flex: 1, flexDirection: 'row', height: 100, }}>
                        <TouchableOpacity onPress={() => { this.sendEmit() }}>
                            <Image source={require('../../../api/Images/sendIcon.png')} style={styles.styleIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.setStateArrUserSendKey() }}>
                            <Text> setStateArrUserSendKey </Text>
                        </TouchableOpacity>



                        <TouchableOpacity onPress={() => { this.setState1() }}>
                            <Text style={{ color: 'red' }}>SETSTATE </Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        );
    }
}

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
    }

})

{
    /**
     *
     * 
     * 
     * 
     * 
     *        
     *  <Textarea ></Textarea>
     *   <FlatList
                    data={this.state.ArraySocketUsername}
                    renderItem={({ item }) =>
                        <view >
                            <text>{item.UserSocketId}</text>
                            <text>{item.Username}</text>
                        </view>
                    }
                />
 
 
               <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Text> Component FreeAll </Text>
 
                $('#listSocket_id_User').html('');
$(ArraySocketUsername).each(function (index, value) {
                    $('#listSocket_id_User').append("<div class='skidUS' >" + value.UserSocketId + "</div>");
                $('#listSocket_id_User').append("<div class='US' >" + value.Username + "</div>");
                $('#listSocket_id_User').css("color", "blue");
                ArrayUserSocketId.push(value.UserSocketId);
                arrayUsername.push(value.Username);
                //console.log('ArrayUserSocketId::', ArrayUserSocketId);
            });
            
                 <View style={styles.styleFlatlist}>
                    <Text style={styles.styleText} >danh sach socket.Username</Text>
                    <FlatList
                        data={this.state.mangU1}
                        renderItem={({ item }) => //item = usernaem vi mangU1 chua username khong trung               // UsernameNguoiSend = usernaem_r lay tu getToken
                            <TouchableOpacity onPress={() => {
                                this.socket.emit("client-send-messenger", { UsernameNguoiNhan: item, UsernameNguoiSend: UsernameNguoiSend, DSsocketIdNguoiNhan: ArraySocketIdThoaMan, messenger: this.state.messenger });
                                // console.log('server dang send socket.usernam va messenger ca nhan', { socketUs: item.UsSoket, msText: this.state.messengerText, dsSoketUsername: this.state.dsSoketUsername, Username: item.Username });
 
 
                                //danh sach socket-id-username thoa nam kich chuot ArraySocketIdThoaMan
                                $('#UserOnline').html(''); //truoc khi vao vong lap xoa ve chong '' danh sach ListUser
                                $('.Username').map(function (index, value) { // <FlatList data={this.state.mangU1}  //touch Flatlist ,mangU1 chon 1 Username nha
                                    $(this).click(() => {
                                        var Username = item;
                                        this.setState({ Username: Username }); //de hien thi Username duoc kich chuot
                                        // $('#UserOnline').append( value );
                                        $('#UserOnline').html('');
                                        $('#UserOnline').append("<div class = 'user' >" + "Userane Online: " + Username + "</div>");
                                        $('#UserOnline').css("color", "#E61A5F");
                                        // alert(Username)
                                        //   console.log('value:::', value);
                                        //   console.log('index:::', index);
                                        var ArraySocketIdThoaMan = []; // moi lan nha class = skidUS thi set mang ArraySocketIdThoaMan rong neu khong cac mang truoc se conc cac manh username sau
                                        this.state.ArrayUserSocketId.map(function (value,index) {
                                            //        console.log('value:::5555', value);
                                            //       console.log('index:::6666', index);
                                            if (value.indexOf(Username) > -1) {
                                                var SocketId = value.replace(Username, '');
                                                ArraySocketIdThoaMan.push(SocketId);
                                                e.setState({ ArraySocketIdThoaMan: ArraySocketIdThoaMan })
                                            }
                                        });
                                        console.log('ArraySocketIdThoaMan:::', ArraySocketIdThoaMan.length + ": +" + Username + ": " + ArraySocketIdThoaMan);
                                        $(document).ready(() => {
                                            //khi nhan send
                                            //ham nhan send tin nhan 
                                        // goi o ham sendEmit
                                            //khi nhan send
                                            //ham nhan send tin nhan 
                                            this.setState({ 
                                                send: true, // khi chua gui bang flase nhe
                                            });
                                            console.log()
                                            this.state.send; 
 
                                            $('#send').click(() => {
                                                $('#ListMesseger').append("<div class='CmsSend'>" + UsernameNguoiSend + ": " + $('#messenger').val() + "</div>" + "<br/>");
                                                $('.CmsSend').css("color", "red");
                                                socket.emit("client-send-messenger", { UsernameNguoiNhan: Username, UsernameNguoiSend: UsernameNguoiSend, DSsocketIdNguoiNhan: ArraySocketIdThoaMan, messenger: $('#messenger').val() });
 
                                            });
                                        })
                                    });
                                });
 
 
                            }}>
                                <Text style={styles.styleText} >{item}</Text>
                            </TouchableOpacity>
                        }
                    />
                </View>
 
                <FlatList
                    data={this.state.ArraySocketUsername}
                    renderItem={({ item }) =>
                        <view >
                            <text>{item.UserSocketId}</text>
                            <text>{item.Username}</text>
                        </view>
                    }
                />
 
                <view>
                    <Text>{this.state.Username}</Text>
                    <TextInput
                        onChangeText={text => this.setState({ messenger: text })}
                        value={this.state.messenger}
                    />
                    <TouchableOpacity onPress={ ()=> {this.SendMesenger()} }>
                        <Text>send</Text>
                    </TouchableOpacity>
                </view>
 
 
            </View>
        );
    }
}
     * 
     * 
     * 
     * 
     * 
     *   //hien thi danh sach socket+id+Username
     socket.on('server-send-socket.id+Username', ArraySocketUsername => {
        console.log('ArraySocketUsername:::', ArraySocketUsername);
        var ArrayUserSocketId = [];
        var arrayUsername = [];
        
        $('#listSocket_id_User').html('');
        $(ArraySocketUsername).each(function (index, value) {
            $('#listSocket_id_User').append("<div class='skidUS' >" + value.UserSocketId + "</div>");
            $('#listSocket_id_User').append("<div class='US' >" + value.Username + "</div>");
            $('#listSocket_id_User').css("color", "blue");
            ArrayUserSocketId.push(value.UserSocketId);
            arrayUsername.push(value.Username);
            //console.log('ArrayUserSocketId::', ArrayUserSocketId);
        });
    
        var ArrayUserSocketId = [];
        var arrayUsername = [];
        ArraySocketUsername.map(function (value, index) {
            e.setState({
                UserSocketId: value.UserSocketId,
                Username: value.Username,
            });
            ArrayUserSocketId.push(value.UserSocketId);
            arrayUsername.push(value.Username);
            console.log('ArrayUserSocketId::', ArrayUserSocketId);
        });
        // Expected output: [1, 5, "a", 3, "f", "3", "b", "e"]
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
        var mangU1 = deduplicate(arrayUsername);
        console.log('mangU1111111', mangU1); //mang Username khong co phan tu lap
        
        
        e.setState({
            mangU1 : mangU1
        });
    
        
    
        $('#ListUser').html(''); //truoc khi vao vong lap xoa ve chong '' danh sach ListUser
        $(mangU1).each(function (index, value) { //hien thi username
            /////////////////////////////////////////////////
            if (value == null || value == 'undefined') {
                $('#ListUser').html('');
            }
            else {
                $('#ListUser').append("<div class='Username' >" + value + "</div>");
                $('#ListUser').css("color", "#E61A5F");
            }
        });
    
        //danh sach socket-id-username thoa nam kich chuot ArraySocketIdThoaMan
        $('#UserOnline').html(''); //truoc khi vao vong lap xoa ve chong '' danh sach ListUser
        $('.Username').map(function (index, value) {
            $(this).click(() => {
                var Username = mangU1[index];
                // $('#UserOnline').append( value );
                $('#UserOnline').html('');
                $('#UserOnline').append("<div class = 'user' >" + "Userane Online: " + Username + "</div>");
                $('#UserOnline').css("color", "#E61A5F");
                // alert(Username)
                //   console.log('value:::', value);
                //   console.log('index:::', index);
                var ArraySocketIdThoaMan = []; // moi lan nha class = skidUS thi set mang ArraySocketIdThoaMan rong neu khong cac mang truoc se conc cac manh username sau
                $(ArrayUserSocketId).each(function (index, value) {
                    //        console.log('value:::5555', value);
                    //       console.log('index:::6666', index);
                    if (value.indexOf(Username) > -1) {
                        var SocketId = value.replace(Username, '');
                        ArraySocketIdThoaMan.push(SocketId);
                    }
                });
                console.log('ArraySocketIdThoaMan:::', ArraySocketIdThoaMan.length + ": +" + Username + ": " + ArraySocketIdThoaMan);
                $(document).ready(() => {
                    //khi nhan send
                    $('#send').click(() => {
                        $('#ListMesseger').append("<div class='CmsSend'>" + UsernameNguoiSend + ": " + $('#messenger').val() + "</div>" + "<br/>");
                        $('.CmsSend').css("color", "red");
                        socket.emit("client-send-messenger", { UsernameNguoiNhan: Username, UsernameNguoiSend: UsernameNguoiSend, DSsocketIdNguoiNhan: ArraySocketIdThoaMan, messenger: $('#messenger').val() });
    
                    });
                })
            });
        });
        // hien thi user da duoc kich chuot va 
        console.log('ArrayUserSocketId::', ArrayUserSocketId);
        $('.skidUS').each(function (index, value) {
            $(this).click(() => {
                var UserSocketId = ArrayUserSocketId[index];
                var Username = arrayUsername[index];
                console.log('Username::::', Username);
                alert(Username);
                //  alert(ArrayDanhSachUser[index]);
                //loc username da duoc kich chuot
                ArraySocketIdThoaMan = []; // moi lan nha class = skidUS thi set mang ArraySocketIdThoaMan rong neu khong cac mang truoc se conc cac manh username sau
                $(ArrayUserSocketId).each(function (index, value) {
                    if (value.indexOf(Username) > -1) {
                        var SocketId = value.replace(Username, '');
                        ArraySocketIdThoaMan.push(SocketId);
                    }
                });
                console.log('ArrayUserThoaMan:::', ArraySocketIdThoaMan);
                //  socket.emit('client-send-danh-sach-socket.id-duoc-kich-chuot',ArraySocketIdThoaMan);
                //document.write(ArraySocketIdThoaMan.join());
            });
        });
    
    
    });
     */
}