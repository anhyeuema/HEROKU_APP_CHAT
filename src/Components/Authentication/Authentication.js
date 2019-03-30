import React, { Component } from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native';
import saveToken from '../../../api/saveToken';
import getToken from '../../../api/getToken'
import global from '../../../api/global';
var e;
export default class Authentication extends Component {

    constructor(props) {
        super(props);
        e = this;
        this.state = {
            username: '',
            email: '',
            password: '',
            isLogin: true,
            token: '',
            tokenNew: '',
            id: '',
            token_time: '',

            time_thuc: '', //the hien ra de kiemtra  thoi gian dat va thoi gian thuc de biet token_time da het han chua
            time_dat: '',
        }
    }

    DangKy() {
        fetch('http://192.168.216.2:81/App_Chat_Web/chat/Register.php', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'applicaiton/json'
            },
            body: JSON.stringify({
                // 'USERNAME' : this.state.username,
                // 'PASSWORD' : this.state.password,
                'USERNAME': 'lan',
                'PASSWORD': '123',
                'HOTEN': 'nguyen thi lan',
                'EMAIL': 'nguye@yahoo.com',

            })
        })
            .then(res => {
                console.log('res::::', res);
                var id1 = JSON.parse(res._bodyText).id;
                e.setState({
                    id: id1,
                });

                if (this.state.id !== null) { //neu co tra ve id khac rong thi la dang kys thanh cong thi nhay vao login
                    //tuc la phan dang nhap
                    this.setState({ //sau khi nhan dang ky ta se cho nguoi dung dang nhap se tro ve man hinh dang nhap
                        //nen ta setState lai isLogin = false
                        isLogin: false
                    });
                }

            })
            .catch(e => console.log(e));



    }


    DangNhap() { //la DangNhap duoc fetch len Login.php
        fetch('http://192.168.216.2:81/App_Chat_Web/chat/Login.php', { //(####)
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'applicaiton/json'
            },
            body: JSON.stringify({
                // 'USERNAME' : this.state.username,
                // 'PASSWORD' : this.state.password,
                //'USERNAME': 'lan',
                //'PASSWORD': '123',
                'USERNAME': 'lan',
                'PASSWORD': '123',
            })
        })
            .then(res => {
                console.log('res::::', res); // res._bodyText trong o co chua gia tri ma server php gui tra
                var a = JSON.parse(res._bodyText); // can JSON.parse no 
                //  console.log('a:::',a);
                var token1 = a.token;
                var id1 = a.id;
                var token_time_1 = a.token_time;
                //    global.OnSignIn(a.Username); 
                //    this.goBackToControlpanal();
                var USER = a.Username;
                //   var b = global.OnSignIn(usename_1);
                //   console.log("b:::::",b);
                //     global.OnSignIn(usename_1);
                //  global.OnSignIn(a.Username);

                console.log('a.Username:::', a.Username);
                e.setState({ // setSate nghĩa là cập nhật giá trị mới khi muốn goi nó ở trong Component thì ta this.state. chấm tên biến cần gọi
                    id: id1,
                    token: token1,
                    token_time: token_time_1,
                    username: a.Username,
                });
                saveToken("@token", this.state.token); //== saveToken("@token", token1)
                getToken('@token')
                    .then(token => {
                        console.log('token_duoc-luu o saveToken - sau khi dang nhap la: ', token);
                    })
                    .catch(e => console.log(e));
                saveToken("@token_time", token_time_1); //luu token_time de su dung khi mo App len thi vao trang chu ta set kiemtratokenApp de lay Username ve va dung global truyen cho Component Controlpanal
                getToken("@token_time")
                    .then(token_time_r => {
                        console.log('token_time duoc-luu o saveToken - sau khi dang nhap la: ', token_time_r);
                    })
                    .catch(e => console.log(e));
                //sau kh dang nhap thanh cong nhay toi Component Trangchu.js

                if (USER !== null) {
                    //OnSignIn o Componet Controlpanal.js  muon dung no thi
                    //o Controlpanal.js khai bao la global.OnSignIn = () => this.ten_ham_dung_no();
                    // dung nho nhu dau ten_ham_dung_no(usename_new ){ this.setState({ username: username_1 })}
                    // o day bie nay usename hung giatri  tu =a.Username truyn tu Compoent Authenticatio.js truyen sang
                    // global.OnSignIn(a.Username); 
                    console.log('Username se truyen tu authentication bang global', a.Username);
                    saveToken('@Users', a.Username);
                    // global.OnSignIn(a.Users);
                    console.log('bat daut tu Authentication truyen Username Bang ham global sang cho Conponent Controlpanal su ly ');
                    global.OnSignIn(a.Username); // truyen gia tri Username = a.Username  cho conponent Controlpannal
                    this.goBackToControlpanal();//truyen xong cho hay toi trang chu goi ham this.goBackToControlpanal trong conponent nay
                } else {
                    console.log('loi dang nhap');
                }

            })
            .catch(e => console.log(e));

        //luu token se luu ten token la  @key = key,
        //gia tri token la token= this.state.token

        /*  khong the goi this.state.token khi ngoai ham fetch //(####) nhung trong 
        /trong Component App ta co the goi thoai mai bien this.state.token
         saveToken("@token", this.state.token);
        getToken('@token')
        .then(token => {
            console.log('token_duoc-luu o saveToken la: ', token);
        })
        */



    }

    checkLogin() { //checkLogin = checkToken

        const KieTraToken = async (varToken) => { // gui token voi ten token voi ten token la TOKEN
            fetch('http://192.168.216.2:81/App_Chat_Web/chat/checkToken.php', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'applicaiton/json'
                },
                body: JSON.stringify({
                    // 'TOKEN' : this.state.token,
                    // varToken la gia tri token =this.state.token hay la varToken=token da luu o saveToken
                    //da luu o ham saveToken()
                    // NameToken la ten token truyen len server Php
                    "TOKEN": varToken,

                })
            })
                .then(res => {
                    //sau khi fetch token len server php thi
                    //sử lý token mới được NHẬN từ server php
                    //có the xử lý ở đây hoạc sử lý ở (*(***))
                    //    console.log("res_token_new_username", res);


                    var a = JSON.parse(res._bodyText);
                    var username1 = a.Username;
                    console.log('username::::', username1);
                    var token_time_1 = a.token_time;

                    var token_new1 = a.token;
                    console.log('token_new1::::', token_new1);
                    e.setState({
                        tokenNew: token_new1,
                        token_time: token_new1,
                    });
                    //  saveToken('@token', this.state.tokenNew);  
                    saveToken('@token', token_new1);
                    getToken('@token')
                        .then(token => {
                            console.log('token_new:::::', token);
                        }).catch(e => console.log(e));
                    saveToken('@token_time', token_time_1);
                    getToken('@token_time')
                        .then(token => {
                            console.log('token_time:::::', token);
                        }).catch(e => console.log(e));

                })
                .catch(e => console.log(e));

        };

        getToken('@token') //(*(***)) //lay token tu saveToken
            .then(token_n => { // ham saveToken return tra ve ket qua token 
                console.log('token_n::::::', token_n);
                KieTraToken(token_n); // gui token voi ten token voi ten token la TOKEN
            })
            .catch(e => console.log(e));

    }

    refreshToken() {

        const RefreshToken_time = async (varToken_time) => {
            fetch('http://192.168.216.2:81/App_Chat_Web/chat/refreshToken.php', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify({
                    // "TOKEN_TIME": this.state.token_time,
                    "TOKEN_TIME": varToken_time,
                })
            })
                .then(res => {
                    //    console.log(res);
                    var a = JSON.parse(res._bodyText);
                    var token_time_1 = a.token_time;
                    var time_thuc_1 = a.time_thuc;
                    var time_dat_1 = a.expire_time_dat;
                    e.setState({
                        token_time: token_time_1,
                        time_thuc: time_thuc_1,
                        time_dat: time_dat_1,
                    });
                    saveToken('@token_time', token_time_1);
                    getToken('@token_time')
                        .then(token_time => {
                            console.log('token_time_sau khi da dc refreshToken token_time nay se moi vi co chua time thuc', token_time);
                        })
                        .catch(e => console.log(e));

                })
                .catch(e => console.log(e));
        }

        getToken('@token_time')
            .then(token_time => {
                console.log('token_time lay duoc tu saveToken(:::)', token_time);
                RefreshToken_time(token_time);
            })
            .catch(e => console.log(e));


    }

    goBackToControlpanal() {
        const { navigator } = this.props;
        // navigator.pop();
        navigator.push({ name: 'TRANG_CHU' });

    }

    componentDidMount() {
        var a = JSON.stringify({
            // 'USERNAME' : this.state.username,
            // 'PASSWORD' : this.state.password,
            'USERNAME': 'lan',
            'PASSWORD': '123',
            'HOTEN': 'nguyen thi lan',
            'EMAIL': 'nguye@yahoo.com',

        });
        console.log(a);
    }
    render() {
        const { btnStyleDangNhap, btnStyleDangKyNgay } = styles;
        const Register = (
            <View style={{ flex: 4, backgroundColor: '#6E97C8', justifyContent: 'center', alignItems: 'center', }}>
                <TextInput
                    onChangeText={text => this.setState({ username: text })}
                    value={this.state.username}
                    placeholder={" nhap tên đăng nhâp muốn dùng"}
                />
                <TextInput
                    onChangeText={text => this.setState({ email: text })}
                    value={this.state.email}
                    placeholder={"nhap email của bạn"}
                />
                <TextInput
                    onChangeText={text => this.setState({ password: text })}
                    value={this.state.password}
                    placeholder={"nhap mật khâu đăng nhập"}
                />

                <TouchableOpacity onPress={() => this.DangKy()} style={btnStyleDangNhap}>
                    <Text style={{ justifyContent: 'center', alignItems: 'center' }}>DangKyNgay</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.setState({ isLogin: false })} style={btnStyleDangKyNgay}>
                    <Text style={{ justifyContent: 'center', alignItems: 'center', }}>Truyen Man Hinh DangNhap</Text>
                </TouchableOpacity>

                <Text>{this.state.token}</Text>

            </View>
        );

        const login = (
            <View style={{ flex: 4, backgroundColor: '#008BD8', justifyContent: 'center', alignItems: 'center', }} >
                <Text>phan dang nhap</Text>
                <TextInput
                    onchangeText={text => this.setState({ username: text })}
                    value={this.state.username}
                    placeholder={"vui long nhap username"}
                />

                <TextInput
                    onchangeText={text => this.setState({ username: text })}
                    value={this.state.username}
                    placeholder={"vui long nhap username"}
                />

                <TouchableOpacity onPress={() => this.DangNhap()} style={btnStyleDangNhap}>
                    <Text style={{ justifyContent: 'center', alignItems: 'center', }}>DANG NHAP</Text>
                </TouchableOpacity>

            </View>
        );

        const JSXmain = this.state.isLogin ? Register : login;

        return (
            <View style={{ flex: 1, backgroundColor: '#ffff' }}>
                <Text>Component Authentication</Text>
                <TouchableOpacity onPress={() => this.goBackToControlpanal()}>
                    <Text>GO BACK ControlPalnal</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.checkLogin()}>
                    <Text>checkLogin</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.refreshToken()}>
                    <Text>refreshToken</Text>
                </TouchableOpacity>
                {JSXmain}


                <View style={{ flex: 2, backgroundColor: '#8354A3' }}>
                    <Text>token :{this.state.token}</Text>
                    <Text style={{ justifyContent: 'center' }}>id: {this.state.id}</Text>
                    <Text >tokenNew: {this.state.tokenNew}</Text>
                    <Text >token_time: {this.state.token_time}</Text>
                    <Text >time_thuc: {this.state.time_thuc}</Text>
                    <Text > time_dat: {this.state.time_dat}</Text>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    btnStyleDangNhap: {
        width: 150, height: 30,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#95CF57',
        borderTopLeftRadius: 20, borderTopRightRadius: 15,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 15,
        marginTop: 10,

    },
    btnStyleDangKyNgay: {
        width: 150, height: 30,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#95CF57',
        borderTopLeftRadius: 20, borderTopRightRadius: 15,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 15,
        marginTop: 10,
    },

});

/*
        const KieTraToken = async(varToken, NameToken) => { // gui token voi ten token voi ten token la TOKEN
           try {
            await fetch('http://192.168.0.101:81/App_Chat_Web/chat/checkToken.php', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'applicaiton/json'
                },
                body: JSON.stringify({
                    // 'TOKEN' : this.state.token,
                    // varToken la gia tri token =this.state.token hay la varToken=token da luu o saveToken
                    //da luu o ham saveToken()
                    // NameToken la ten token truyen len server Php
                    NameToken: varToken,

                })
            })
                .then(res => {
                    //sau khi fetch token len server php thi
                    //sử lý token mới được NHẬN từ server php
                    //có the xử lý ở đây hoạc sử lý ở (*(***))
                    console.log("res_token_new_username", res);

                    
                    var a = JSON.parse(res._bodyText);
                    var token_new1 = a.token;
                  //  e.setState({  tokenNew: token_new1});
                  //  saveToken('@token', this.state.tokenNew);  
                    saveToken('@token',token_new1);
                    getToken('@token')
                    .then(token => {
                            console.log('token_new:::::',token);
                    }).catch( e => console.log(e));
                    

                })
                .catch(e => console.log(e));
           } catch (e) {
                return e;
           }
        };

        getToken('@token') //(*(***)) //lay token tu saveToken
            .then(token_n => { // ham saveToken return tra ve ket qua token 
                console.log('token_n::::::', token_n);
                KieTraToken(token_n,'TOKEN'); // gui token voi ten token voi ten token la TOKEN
            })
            .catch(e => console.log(e));
        */


 /*
        const KieTraToken = async(NameToken, varToken) => { // gui token voi ten token voi ten token la TOKEN
            fetch('http://192.168.0.101:81/App_Chat_Web/chat/checkToken.php', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'applicaiton/json'
                },
                body: JSON.stringify({
                    // 'TOKEN' : this.state.token,
                    // varToken la gia tri token =this.state.token hay la varToken=token da luu o saveToken
                    //da luu o ham saveToken()
                    // NameToken la ten token truyen len server Php
                    NameToken: varToken,

                })
            })

                
                .then(res => {
                    //sau khi fetch token len server php thi
                    //sử lý token mới được NHẬN từ server php
                    //có the xử lý ở đây hoạc sử lý ở (*(***))
                    console.log("res_token_new_username", res);
                    var a = JSON.parse(res._bodyText);
                    var token_new1 = a.token;
                    e.setState({
                        tokenNew: token_new1
                    });
                    saveToken('@token', this.state.tokenNew);
                    .then(token => {
                            console.log('token_new:::::',token);
                    }).catch( e => console.log(e));
                })
                .catch(e => console.log(e));
               
        };

        
        getToken('@token') //(*(***)) //lay token tu saveToken
            .then(token_n => { // ham saveToken return tra ve ket qua token 
                console.log('token_n::::::', token_n);
                KieTraToken('TOKEN',token_n) // gui token voi ten token voi ten token la TOKEN
                    .then(res => { // gui token len server se tra ve tokenNew va uername ve
                        console.log("res_token_new_username", res); 
                        var a = JSON.parse(res._bodyText);
                        var token_new1 = a.token;
                        e.setState({ tokenNew: token_new1 });
                        //chung ta co ham saveToken nen 
                        //co the thay ham 
                      
                        //    e.setState({ tokenNew: token_new1 });
                        //    saveToken('@token', this.state.tokenNew); 
                        //    = saveToken('@token',token_new1);
                       
                        saveToken('@token', this.state.tokenNew);
                        getToken('@token')
                        .then(token => {
                            console.log('token_new:::::',token);
                        }).catch( e => console.log(e));
                    })
                    .catch( e => console.log(e));
            })
            .catch(e => console.log(e));

        */

/*
        const KieTraToken = async(varToken) => { // gui token voi ten token voi ten token la TOKEN
            fetch('http://192.168.0.101:81/App_Chat_Web/chat/checkToken.php', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'applicaiton/json'
                },
                body: JSON.stringify({
                    // 'TOKEN' : this.state.token,
                    // varToken la gia tri token =this.state.token hay la varToken=token da luu o saveToken
                    //da luu o ham saveToken()
                    // NameToken la ten token truyen len server Php
                    "TOKEN": varToken,

                })
            })
                .then(res => {
                    //sau khi fetch token len server php thi
                    //sử lý token mới được NHẬN từ server php
                    //có the xử lý ở đây hoạc sử lý ở (*(***))
                    console.log("res_token_new_username", res);
                    var a = JSON.parse(res._bodyText);
                    var token_new1 = a.token;
                    saveToken('@token',token_new1);
                   // e.setState({ tokenNew: token_new1 });
                   // saveToken('@token', this.state.tokenNew);
                    getToken('@token')
                    .then(token => {
                            console.log('token_new:::::',token);
                    }).catch( e => console.log(e));
                })
                .catch(e => console.log(e));
        };

        getToken('@token') //(*(***)) //lay token tu saveToken
            .then(token_n => { // ham saveToken return tra ve ket qua token 
                console.log('token_n::::::', token_n);
                KieTraToken(token_n) // gui token voi ten token voi ten token la TOKEN
            })
            .catch(e => console.log(e));
        */