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

var key = 0;
// var ArrdataMessenger = [];
var ArrarySaveDataMessenger = [];


//lay tu FreeSuper.js goc
export default class ChatUser1 extends Component {
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

		e.setState({ UsernameNguoiSend: Useranme1 });
		var UsernameNguoiSend = this.state.UsernameNguoiSend;
		console.log('this.state.UsernameNguoiSend globalGetUser::::::', UsernameNguoiSend);
		this.socket = io('http://192.168.216.2:2800', { jsonp: false });
		this.socket.on('connect', (data) => {
			var UsernameNguoiSend = this.state.UsernameNguoiSend;
			this.socket.emit('client-send-Username', UsernameNguoiSend);
			console.log('App dang-emit UsernameNguoiSend ChatUsrname::::', UsernameNguoiSend);

			// this.socket.on('server-send-messenger', dataMessenger => {
			//     //alert('server-send-socket.id+Username')
			//     console.log('dataMessenger: globalGetUser::', dataMessenger);
			// });










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
				this.socket.on('server-send-messenger', async (dataMessenger) => {
					console.log('dataMessenger:::', dataMessenger);
					//web send thi ti nua emit la nhan   // app nhan ti emit la send ta dat ten bi nguoc
					await e.setState({
						UserWeb: dataMessenger[0].UsernameNguoiSend,
						UserApp: dataMessenger[0].UsernameNguoiNhan,
						soPage: 1, //de hien thi la ra tin nhan moc ve 1 tinh tu length max - 1.m = hien thi so phan tu tu lon nhat toi -m phan tu

					});
					//  console.log('this.state.UsernameNguoiNhan !== "":::', this.state.UserApp);
					const { UserWeb, UserApp } = this.state; //UserApp = UsernameNguoiSend, 

					//lay socketId cua app tuc la lay socketId o day da dat la socketIdNguoiSend
					// var UsernameNguoiSend = this.state.UsernameNguoiSend;
					//can tim socketIdUsername co UserApp chua no thi moi emit ve no duoc
					ArrSocketId_UserSend = [];
					//  var UsernameNguoiSend = this.state.UsernameNguoiSend;
					var ArraySocketUsername = this.state.ArraySocketUsername;
					ArraySocketUsername.map(function (value, index) {
						var UserSocketId = value.UserSocketId;
						if (UserSocketId.indexOf(UserApp) > -1) {
							var ArrSocketId = UserSocketId.replace(UserApp, '');
							ArrSocketId_UserSend.push(ArrSocketId);
						}
					});

					e.setState({ ArrSocketId_UserSend: ArrSocketId_UserSend });
					//  console.log('ArrSocketId_UserSend this.state.ArrSocketId_UserSend:::', this.state.ArrSocketId_UserSend);


					// var ArrSocketId_UserSend = 
					await this.socket.emit('client-muon-lay-ArrayMess-User', {
						NameUserSendUserItem: UserApp + UserWeb + "ChatUsername.docx", //luu ten cua messger de de quan ly
						ArrSocketId_UserSend: this.state.ArrSocketId_UserSend,
						UserYeuCauMess: UserApp, //tu thang nay o server cung co the tim ra socket id thoa man, //nen su dung se chi can viet o server la su lu ca o app va web duoc
						soPage: this.state.soPage, // quan ly so trang muon lay ve
					});
					await this.socket.on('server-trave-yeucau-ArrayMess-User', (DataMessengerApp_r) => {
						//{Nms: n, Sms: SaveDataMessengerApp}
						console.log('server-trave-yeucau-ArrayMess-User::', DataMessengerApp_r);
						var Nms = DataMessengerApp_r.Nms;
						var SaveDataMessengerApp_r = DataMessengerApp_r.Sms;
						var SaveDataMessengerApp = SaveDataMessengerApp_r;
						console.log('server-trave-yeucau-ArrayMess-User::', SaveDataMessengerApp.length);
						console.log('server-trave-yeucau-ArrayMess-User::', SaveDataMessengerApp[0]);
						if (SaveDataMessengerApp.length == 1 && SaveDataMessengerApp[0] == '0') { //neu ton tai SaveDataMessengerApp_r
							//if (SaveDataMessengerApp_r = "" || SaveDataMessengerApp_r[0] == null || SaveDataMessengerApp_r[0] == undefined) {
							//localStorage.setItem('SaveDataMessengerApp', JSON.stringify([dataEmit]));
							if (dataMessenger[0] !== null) {
								//////  console.log('server-trave-yeucau-ArrayMess-User::==0', SaveDataMessengerApp_r);
								var ArrdataMessenger = [];
								//    console.log('verver-trave-yeucau-ArrayMessUser::==0 dataMessenger:::', dataMessenger)
								dataMessenger.map(function (dataEmit, index) {
									var UserSendKey = {
										key: JSON.stringify(ArrdataMessenger.length + index),
										UserSend: dataEmit.UsernameNguoiSend, //thang send cho Userapp, va app dang la thang nhan nhung lai dat o this.state( la UsernameNguoiSend )
										messenger: dataEmit.messenger,
										imageBase64: dataEmit.imageBase64,
										pathIma: dataEmit.pathIma,
										UserNhan: '', //them vao de hien thi thoi
										messengerNhan: '',
									};
									//    console.log('.UserSendKey: ==0:::', UserSendKey);

									ArrdataMessenger.push(UserSendKey);

								});
								// e.setState({ SaveDataMessengerApp: dataMessenger })
								e.setState({
									SaveDataMessengerApp: ArrdataMessenger,
									ArrUserSendKey: ArrdataMessenger
								});

								// var SaveDataMessengerApp1 = JSON.stringify(this.state.SaveDataMessengerApp);
								console.log('(this.state.SaveDataMessengerApp);:::', this.state.SaveDataMessengerApp);
								var SaveDataMessengerApp1 = JSON.stringify(this.state.SaveDataMessengerApp);
								var ArrayMessUsersendUserItem = {
									//dao ten so coi app nguoi send thanh nguoi nhan va nguoi nahn thanh nguoi send
									//  NameUserSendUserItem: UsernameNguoiSend + localStorage.getItem('Username') + "ChatUsername.docx",
									NameUserSendUserItem: UserApp + UserWeb + "ChatUsername.docx",
									NameUserSendUserItem1: UserWeb + UserApp + "ChatUsername.docx",
									SaveDataMessengerApp: this.state.SaveDataMessengerApp, // dataMessenger la mang san roi
								}
								this.socket.emit('client-send-ArrayMessUsersendUserItem', ArrayMessUsersendUserItem);
								console.log('ArrayMessUsersendUserItem truong hop == 011111111111111 tra ve', ArrayMessUsersendUserItem);

							}
						}

						else if (SaveDataMessengerApp.length > 1 && SaveDataMessengerApp[0] == '[') { //neu ArrayMessUsersendUserItem[0]  khac rong thi ta JSON.parser
							//{Nms: n, Sms: SaveDataMessengerApp}
							if (dataMessenger[0] !== null) {

								var ArrdataMessenger = JSON.parse(SaveDataMessengerApp);
								// console.log('ArrdataMessenger da JSON.parse:!==0:::', ArrdataMessenger);
								var ArrMessSendServer = []; // ArrMessSendServer chi lay 1 phan tu hay vai phan tu tu tin nhan new duoc web gui toi
								dataMessenger.map(function (dataEmit, index) {
									//Nms la so phan tu tinnhan luu o server 
									var UserSendKey = {
										key: JSON.stringify(Nms + index), //do index gia tri bat dau tu 0, index=0 MIN
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
								})
								// console.log('var ArrdataMessenger =  this.state.SaveDataMessengerApp::::', ArrdataMessenger);
								e.setState({
									SaveDataMessengerApp: ArrMessSendServer,
									ArrUserSendKey: ArrdataMessenger,
								});

								// var SaveDataMessengerApp1 = JSON.stringify(this.state.SaveDataMessengerApp);
								console.log('(this.state.SaveDataMessengerApp);:::', this.state.SaveDataMessengerApp);
								var SaveDataMessengerApp1 = JSON.stringify(this.state.SaveDataMessengerApp);
								var ArrayMessUsersendUserItem = {
									//dao ten so coi app nguoi send thanh nguoi nhan va nguoi nahn thanh nguoi send
									//  NameUserSendUserItem: UsernameNguoiSend + localStorage.getItem('Username') + "ChatUsername.docx",
									NameUserSendUserItem: UserApp + UserWeb + "ChatUsername.docx",
									NameUserSendUserItem1: UserWeb + UserApp + "ChatUsername.docx",
									SaveDataMessengerApp: this.state.SaveDataMessengerApp, // dataMessenger la mang san roi
								}

								this.socket.emit('client-send-ArrayMessUsersendUserItem', ArrayMessUsersendUserItem);
								console.log('ArrayMessUsersendUserItem truong hop == 011111111111111 tra ve', ArrayMessUsersendUserItem);



							}

						}

						/*
						// var SaveDataMessengerApp1 = JSON.stringify(this.state.SaveDataMessengerApp);
						console.log('(this.state.SaveDataMessengerApp);:::', this.state.SaveDataMessengerApp);
						var SaveDataMessengerApp1 = JSON.stringify(this.state.SaveDataMessengerApp);
						var ArrayMessUsersendUserItem = {
							//dao ten so coi app nguoi send thanh nguoi nhan va nguoi nahn thanh nguoi send
							//  NameUserSendUserItem: UsernameNguoiSend + localStorage.getItem('Username') + "ChatUsername.docx",
							NameUserSendUserItem: UserApp + UserWeb + "ChatUsername.docx",
							NameUserSendUserItem1: UserWeb + UserApp + "ChatUsername.docx",
							SaveDataMessengerApp: this.state.SaveDataMessengerApp, // dataMessenger la mang san roi
						}

						this.socket.emit('client-send-ArrayMessUsersendUserItem', ArrayMessUsersendUserItem);
						console.log('ArrayMessUsersendUserItem truong hop == 011111111111111 tra ve', ArrayMessUsersendUserItem);
						*/

					});

				});










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
		if (YeuCauArrMess == null) {
			console.log('chua chon nguoi nhan nhe!!!!', YeuCauArrMess)
		}
		else if (this.state.YeuCauArrMess !== null) {
			const { UsernameNguoiSend } = this.state;
			//cap nhan co ng emit gui messe
			e.setState({
				UserSendEmit: UsernameNguoiSend,
			});
			const { UserSendEmit } = this.state;
			// console.log('this.state.UserSendEmit', UserSendEmit);
			//test thu message text send di 
			e.setState({ messenger: 'Instead of playing the guessing game, when you try all the different combinations till you find the one that fits, just use the following modifiers props: left, top, right & bottom.' });
			e.setState({ UserSendEmit: UsernameNguoiSend });
			//  console.log('this.state.UsernameNguoiSend', UserSendEmit) // UserSendEmit = app
			//   console.log('this.state.UsernameNguoiSend', UsernameNguoiSend);

			const { Username, ArraySocketIdThoaMan, messenger, imageBase64, pathIma } = this.state;
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
			//  console.log('client-send-messenger dataEmit', dataEmit);

			e.setState({ m: (parseInt(this.state.m) + 1), });//so lan emit 1 lan emit la 1 lan cap nhat mang tin nhan cua app nhe
			//  console.log('this.state.m::::', this.state.m);

			//co can moc len tu server khong ta

			//hien thi tin nhan len app khi emit thi chi hien thi cho chinh no chu k can emit cho chinh no
			const { SaveDataMessengerApp } = this.state; //moc gia chi khida setState o this.on('server-send-messenger')
			//    console.log('SaveDataMessengerApp moc tu this.on(server-send-messenger da setState ', SaveDataMessengerApp)
			var ArrdataMessenger = SaveDataMessengerApp;
			console.log('ArrdataMessenger = SaveDataMessengerApp', ArrdataMessenger.length);
			var UserSendKey = {  //them 1 obj moi vao flatlist
				key: JSON.stringify((ArrdataMessenger.length) + 1), //ket se duoc tang len 1, so thu tu no khong bat dau tu 0. mang.length bat dau tu 1
				UserSend: '',
				messenger: '',
				UserNhan: UsernameNguoiSend, //hien thi nguoi gui gio la app gui web
				messengerNhan: Username == null ? null : messenger,
				imageBase64: Username == null ? null : imageBase64,
				pathIma: Username == null ? null : pathIma,

			};
			ArrdataMessenger.push(UserSendKey);
			ArrarySaveDataMessenger.push(UserSendKey); //ArrarySaveDataMessenger = ArrdataMessenger
			// console.log('sendEmit...ArrarySaveDataMessenger', ArrarySaveDataMessenger);
			e.setState({
				ArrUserSendKey: ArrdataMessenger,
				SaveDataMessengerApp: ArrdataMessenger,
			});
			const { ArrUserSendKey } = this.state;
			// console.log('this.state.ArrUserSendKey sendEmit::::', ArrUserSendKey);
			console.log('this.state.SaveDataMessengerApp sendEmit::::', SaveDataMessengerApp.length);

            /*
            var ArrUserSendKey1 = [];
            for (i = 0; i < ArrdataMessenger.length; i++) {
                const { UserSend, messenger, UserNhan, messengerNhan, imageBase64, pathIma } = ArrdataMessenger[i];
                //  var UserSend = ArrdataMessenger[i].UserSend;
                //  var messenger = ArrdataMessenger[i].messenger;                          //tam thoi lay bien UserSendEmit de thai the bien UserNhan nhan duoc tu lnag ngh
                //thay the de khi chia nhan iet ta chua setstate UserSendEmit thi no chua hien len flastlist
                //   var UserNhan = ArrdataMessenger[i].UserNhan;                  //UserNhan se la ng emit tu ap xuong  ,messengerNhan la ng emit tin nhan xuong ap
                //   var messengerNhan = ArrdataMessenger[i].messengerNhan;
                //   var imageBase64 = ArrdataMessenger[i].imageBase64;
                //   var pathIma = ArrdataMessenger[i].pathIma;
                //  var UserSendKey = { key: i, UserSend: UserSend, messenger: messenger, UserNhan: this.state.UserSendEmit, messengerNhan: this.state.messenger };
                var UserSendKey = {
                    key: JSON.stringify(i),
                    UserSend: UserSend,
                    messenger: messenger,
                    UserNhan: UserNhan,
                    messengerNhan: messengerNhan,
                    imageBase64: imageBase64,
                    pathIma: pathIma
                };
                ArrUserSendKey1.push(UserSendKey);
            }
            //  console.log('ArrUserSendKey1::::', ArrUserSendKey1); //ArrUserSendKey1 maga nay gui len server de luu chu nha
            e.setState({
                ArrUserSendKey: ArrUserSendKey1,
                SaveDataMessengerApp: ArrUserSendKey1,
            });
            const { ArrUserSendKey } = this.state;
            // console.log('this.state.ArrUserSendKey sendEmit::::', ArrUserSendKey);
            console.log('this.state.SaveDataMessengerApp sendEmit::::', SaveDataMessengerApp);
            */
			if (SaveDataMessengerApp[0] !== null) {
				e.setState({  //bat dau lien faltlist cap nhat gia tri moi
					//khi kich chuot vao username muon chat ta moi moc du lieu ti nhan tu server nodejs hien thij len cho nguoi
					// dungva gio dim cah co ng gui tin nhan la hien thong bao co tin nhan
					ArrControlItemMess: this.state.ArrUserSendKey,
				});
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
				this.setState({
					avatarSourceUpLoadBase64: response.data,
					//  avatarSource: source,
					imaPath: source_R,
					imaBase64: sourceBase64,
				});
			}
		});
	}

	uploadImage() {
		RNFetchBlob.fetch('POST', 'http://192.168.216.2:2800', {
			Authorization: "Bearer access-token",
			otherHeader: "foo",
			'Content-Type': 'multipart/form-data',
		}, [
				{ name: 'avatar', filename: 'avatar.png', data: this.state.data },
				{ name: 'info', data: 'khoapham' },
			])
			.then((resp) => {
				console.log(resp);
			}).catch((err) => {
				console.log(err);
			})
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
					SaveDataMessengerApp: ArrdataMessenger,
					ArrControlItemMess: ArrdataMessenger,  // da nhan vao chon Username roi
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
		var ima1 = 'http://192.168.216.2:2800/hotgirls/1.jpg'
		return (
			<View style={{ flex: 1, backgroundColor: '#fff' }}>
				<Text>{this.state.soPage}</Text>
				<View style={{ flex: 1, backgroundColor: '#fff', flexDirection: 'row' }} >
					<Text style={styles.styleText} >Username</Text>
					<Text style={styles.UserOnline}>User Receri: {this.state.Username === null ? null : this.state.Username}</Text>
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
                        /*
                        SaveTinNhan(this.state.Username, '');
                        GetTinNhan(this.state.Username)
                            .then(SaveDataMessengerApp_r => {
                                console.log('da xoa tin nhan cho :' + this.state.Username, SaveDataMessengerApp_r);
                                e.setState({ ArrUserSendKey: SaveDataMessengerApp_r, SaveDataMessengerApp: SaveDataMessengerApp_r });
                                console.log('this.state.ArrUserSendKey get tin nhan khi kich chuot vao Username ta se get tinnhan de lay tin nhan da luu len ::', this.state.SaveDataMessengerApp_r);

                            }); */
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
										e.setState({
											Username: Username, //de hien thi Username duoc kich chuot
											// ArrControlItemMess: this.state.ArrUserSendKey,//LOAD LUON SE CHI HIEN THI CAI MESS moi doc nhan o socket.on('server-send-messenger') //khi kich chuot vao username muon chat ta moi moc du lieu ti nhan tu server nodejs hien thij len cho nguoi dungva gio dim cah co ng gui tin nhan la hien thong bao co tin nhan
										});

										const { Username, UsernameNguoiSend } = this.state;

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
											this.socket.emit('client-muon-lay-ArrayMess-User', {
												NameUserSendUserItem: (UsernameNguoiSend + Username + "ChatUsername.docx"),
												ArrSocketId_UserSend: ArrSocketId_UserSend,
												UserYeuCauMess: UsernameNguoiSend, //UserApp,
												soPage: this.state.soPage,
											});
											this.socket.on('server-trave-yeucau-ArrayMess-User', DataMessengerApp_r => {
												console.log('server-trave-yeucau-ArrayMess-User flatlist::', DataMessengerApp_r);
												//console.log('SaveDataMessengerApp[0] !== undefined:::',SaveDataMessengerApp[0] !== 'undefined')
												var Nms = DataMessengerApp_r.Nms;
												var Sms = DataMessengerApp_r.Sms;
												var SaveDataMessengerApp_r = Sms;
												e.setState({
													YeuCauArrMess: SaveDataMessengerApp_r,
												});
												var SaveDataMessengerApp = SaveDataMessengerApp_r;
												//var x= '[]' x.length=1
												if (SaveDataMessengerApp[0] == '0' && SaveDataMessengerApp.length == 1) {
													//khong lam gi ca nhe
													console.log('flalist khong lam gi ca voi SaveDataMessengerApp')
													//  e.setState({ 
													//     ArrControlItemMess: [],
													// });
												}
												else if (SaveDataMessengerApp[0] == '[' && SaveDataMessengerApp.length > 1) { //neu ArrayMessUsersendUserItem[0]  khac rong thi ta JSON.parser
													SaveDataMessengerApp = JSON.parse(SaveDataMessengerApp_r);// Neu ArrayMessUsersendUserItem[0] == rong thi ta bo qua cau lenh trong if
													e.setState({
														ArrUserSendKey: SaveDataMessengerApp,
														SaveDataMessengerApp: SaveDataMessengerApp,

													});
													console.log('this.state.SaveDataMessengerApp flatlist;;;;;;', this.state.SaveDataMessengerApp);
													//nhan duoc ket qua SaveDataMessengerApp tu server tra ve ta moi setState no cho phep mang duoc set moi
													if (this.state.SaveDataMessengerApp[0] !== null) { //ca mang server tra tin nhan ve moi thuc su cap nhat mang lhac rong vao faltlist cua faltlist danh sach tin nhan
														e.setState({
															//khi kich chuot vao username muon chat ta moi moc du lieu ti nhan tu server nodejs hien thij len cho nguoi
															// dungva gio dim cah co ng gui tin nhan la hien thong bao co tin nhan
															ArrControlItemMess: this.state.ArrUserSendKey,
														});
													}
												}

											});

										}



                                        /*  GetTinNhan(this.state.Username) //khi kich chuot vao Username chon thi getTinNhan mang nay se suoc load ra
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
                                            }); */

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
									//data={this.state.ArrUserSendKey}

									refreshing={this.state.refersh}
									onRefresh={() => {
										//keo dung dinh thi lam gi
										e.setState({ refersh: true, });
										e.setState({
											soPage: parseInt(this.state.soPage) + 1,
										});
										this.onYeuCauMess(); //lang nghe server tra ve va setState de hien thi
										e.setState({ refersh: false })
									}}
									onEndReachedThreshold={0.5}
									onEndReached={() => {
										//keo dung day thi lam gi
										e.setState({ refersh: true });
										e.setState({
											soPage: parseInt(this.state.soPage) - 1,
										});
										e.setState({ refersh: false })
									}}


									data={this.state.ArrControlItemMess} // dieu hien hien thi tin nhan neu kich chuot va Username chat chua kich thi chi luu o server
									renderItem={({ item }) =>

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

															<View style={{ flex: 7, backgroundColor: 'red', width: (item.pathIma == null ? 0 : avataWidth), height: (item.pathIma == null ? 0 : avataHeight), }} >

																<Image source={{ uri: (item.pathIma == null ? ima1 : item.pathIma) }} style={styles.pathImaStyle} >
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


														<View style={{ flex: 3, backgroundColor: 'yellow', height: (item.pathIma == null ? 0 : avataHeight), width: (item.pathIma == null ? 0 : avataWidth) }} >
															<Image source={{ uri: (item.pathIma == null ? ima1 : item.pathIma) }} style={styles.pathImaStyle} >
															</Image>

														</View>

													</View>

												</View>




											</View>



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
							style={{ height: 80 }}
						/>
					</View>



					<View style={{ flex: 1, flexDirection: 'row', height: 100, }}>
						<TouchableOpacity onPress={() => { this.sendEmit() }}>
							<Image source={require('../../../api/Images/sendIcon.png')} style={styles.styleIcon} />
						</TouchableOpacity>

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
	},
	pathImaStyle: {
		width: 140,
		height: 120,
	}

})


///// console.log('server-trave-yeucau-ArrayMess-User::!==0', SaveDataMessengerApp);


//    var SaveDataMessengerApp = JSON.parse(SaveDataMessengerApp);// Neu ArrayMessUsersendUserItem[0] == rong thi ta bo qua cau lenh trong if
//    await e.setState({
//        ArrUserSendKey: SaveDataMessengerApp,
//        SaveDataMessengerApp: SaveDataMessengerApp
//    });
//    const { SaveDataMessengerApp } = this.state;
//    console.log('ArrdataMessenger ::::',SaveDataMessengerApp);
//    var ArrdataMessenger = SaveDataMessengerApp; 

//  console.log('this.state.SaveDataMessengerApp::::', SaveDataMessengerApp);
//  ArrarySaveDataMessenger.push(UserSendKey);


// //can ArrUserSendKey1 la thi ,muon thay doi key cua ArrdataMessenger 
// var ArrUserSendKey1 = [];
// for (i = 0; i < ArrdataMessenger.length; i++) {
//    // var UserSend = ArrdataMessenger[i].UserSend;
//    // var messenger = ArrdataMessenger[i].messenger;  //tam thoi lay bien UserSendEmit de thai the bien UserNhan nhan duoc tu lnag ngh
//    // var UserNhan = ArrdataMessenger[i].UserNhan;  //thay the de khi chia nhan iet ta chua setstate UserSendEmit thi no chua hien len flastlist  
//    // var messengerNhan = ArrdataMessenger[i].messengerNhan;    //UserNhan se la ng emit tu ap xuong  ,messengerNhan la ng emit tin nhan xuong ap
//    // var imageBase64 = ArrdataMessenger[i].imageBase64;
//    // var pathIma = ArrdataMessenger[i].pathIma;
//     var UserSendKey = {
//         key: JSON.stringify(i), 
//         UserSend: ArrdataMessenger[i].UserSend==null? '' : ArrdataMessenger[i].UserSend,
//         messenger: ArrdataMessenger[i].messenger==null? '' : ArrdataMessenger[i].messenger,
//         imageBase64: ArrdataMessenger[i].imageBase64 == null ? '' : ArrdataMessenger[i].imageBase64,
//         pathIma: ArrdataMessenger[i].pathIma==null? '' : ArrdataMessenger[i].pathIma,
//         UserNhan: ArrdataMessenger[i].UserNhan==null ? '' : ArrdataMessenger[i].UserNhan,
//         messengerNhan: ArrdataMessenger[i].messengerNhan==null? '' : ArrdataMessenger[i].messengerNhan,
//     };
//     ArrUserSendKey1.push(UserSendKey);
// }
// //  console.log('ArrUserSendKey1::::', ArrUserSendKey1); //ArrUserSendKey1 maga nay gui len server de luu chu nha
// await e.setState({
//     ArrUserSendKey: ArrUserSendKey1,
//     SaveDataMessengerApp: ArrUserSendKey1
// });
//   console.log('this.state.ArrUserSendKey::::', this.state.ArrUserSendKey);
// // console.log('this.state.SaveDataMessengerApp: socket.on.server-send-messenger:::', this.state.SaveDataMessengerApp);


{/*


  SaveTinNhan(this.state.Username, SaveDataMessengerApp1); //luu tin nha cho ten duoc tich
              GetTinNhan(this.state.Username) //khi kich chuot vao Username chon thi getTinNhan mang nay se suoc load ra
                  .then(SaveDataMessengerApp1 => {
                      console.log('SaveDataMessengerApp get tinnhan sendemit  ::', SaveDataMessengerApp1);
                  }); 



            
              console.log('this.state.ArrControlItemMess sendEmit::::', this.state.ArrControlItemMess);
             var SaveDataMessengerApp1 = JSON.stringify(SaveDataMessengerApp);
                   if (Username !== null) {
                 //  var YeuCauArrMess = this.state.YeuCauArrMess;
                 if (YeuCauArrMess.length > 1 && YeuCauArrMess[0] == '[') {
                     var ArrayMessUsersendUserItem = {
                         NameUserSendUserItem: UsernameNguoiSend + Username + "ChatUsername.docx",
                         NameUserSendUserItem1: Username + UsernameNguoiSend + "ChatUsername.docx",
                         SaveDataMessengerApp: SaveDataMessengerApp1
                     }
                     this.socket.emit('client-send-ArrayMessUsersendUserItem33333333333333', (ArrayMessUsersendUserItem));
 
                 }
 
                 else { //neu ton tai SaveDataMessengerApp_r
 
                     // e.setState({ SaveDataMessengerApp: dataMessenger })
                     e.setState({
                         SaveDataMessengerApp: [dataEmit],
                         ArrUserSendKey: [dataEmit],
                     });
                     var SaveDataMessengerApp2 = JSON.stringify(this.state.SaveDataMessengerApp);
                     var ArrayMessUsersendUserItem = {
                         //dao ten so coi app nguoi send thanh nguoi nhan va nguoi nahn thanh nguoi send
                         //  NameUserSendUserItem: UsernameNguoiSend + localStorage.getItem('Username') + "ChatUsername.docx",
                         NameUserSendUserItem: UserApp + UserWeb + "ChatUsername.docx",
                         NameUserSendUserItem1: UserWeb + UserApp + "ChatUsername.docx",
                         SaveDataMessengerApp: SaveDataMessengerApp2, // dataMessenger la mang san roi
                     }
                     socket.emit('client-send-ArrayMessUsersendUserItem4444444444444', ArrayMessUsersendUserItem);
              
             
*/}