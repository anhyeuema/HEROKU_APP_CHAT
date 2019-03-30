import React, { Component } from 'react';
import { View, TouchableOpacity, Text, RefreshControl, TextInput, Image, StyleSheet, FlatList } from 'react-native';

import ImagePicker from 'react-native-image-picker'; //yarn add react-native-image-picker// react-native link react-native-image-picker
import io from 'socket.io-client/dist/socket.io.js';
import RNFetchBlob from 'react-native-fetch-blob'; //yarn add react-native-fetch-blob//react-native link

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};


var e;
const DATA = [
    { hoten: 'Mr.nam', namsinh: '1998' },
    { hoten: 'Mr.yen', namsinh: '1999' },
    { hoten: 'Mr.yen', namsinh: '2000' },
    { hoten: 'Mr.yen', namsinh: '2001' },
    { hoten: 'Mr.yen', namsinh: '2002' },
    { hoten: 'Mr.hanh', namsinh: '2003' },
];
export default class Messenger extends Component {
    constructor(props) {
        super(props);
        e = this;
        this.socket = io('http://192.168.216.2:3500', { jsonp: false });
        //   const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            resDATA: [],
            //    dataSource: ds.cloneWithRows(DATA),
            messengerText: '',
            username: '',
            messengerImage: null,

            id: '',

            ImagePk: null,
            ImageWebBase64: null,
            imgaAppWebDataBase_Receri: null,

            page: 1,
            refreshing: false,

            avatarSourceUpLoadBase64: null, // upload Image to server nodejs

            mang: [
                { key: '1', ten: 'nam' },
                { key: '2', ten: 'nam' },
                { key: '3', ten: 'nam' },
                { key: '4', ten: 'nam' },
            ],
            ima: '', //hung image 
        };

       // var i=1;

        this.arr = [];
        /*
        const setStateImage = () => ({
            ImagePk_1: this.state.ImagePk,
            ImageWebBase64_1: this.state.ImageWebBase64,
            imgaAppWebDataBase_Receri_1: this.state.imgaAppWebDataBase_Receri,

        }); */


        
        this.socket.on('server-send-messenger-from-app-to-AppAndWeb', async (mesT) => {
            console.log('app dang nhan messenger text');
            await e.setState({
                messengerText: mesT.ms,
                username: mesT.un,

            });
            const res = await {
                messengerText1: this.state.messengerText,
                username1: this.state.username,
            };

            this.arr = res;
            await e.setState({
                resDATA: res,
                dataSource: ds.cloneWithRows(this.arr),
            });

            console.log('this.state.messengerText::', this.state.messengerText);
            console.log('this.state.username:::', this.state.username);
            console.log('this.state.resDATA:::', this.state.resDATA);
        });
        

        //lang nghe su kien app send messengerImage to server nodejs va tu server nodejs tra ve App va web
        this.socket.on('server-send-imagePK-fromApp-toAppWeb', async (imagePIK) => { // messengerImage
            console.log('dang nhan image picker tu server');
            console.log('imagePIK::::', imagePIK);
            await e.setState({
                ImagePk: imagePIK,
            });

            /*
            res = [
                { key: '1', ImagePk_1: this.state.ImagePk },
                { key: '2', ImageWebBase64_1: this.state.ImageWebBase64 },
                { key: '3', imgaAppWebDataBase_Receri_1: this.state.imgaAppWebDataBase_Receri },
            ]; 
            
            res = [
                { key: "1", ima: this.state.ImagePk },
                { key: "2", ima: this.state.ImageWebBase64 },
                { key: "3", ima: this.state.imgaAppWebDataBase_Receri },
            ];*/

            
            var res = [
                { key: "1", ima: this.state.ImagePk },
                { key: "2", ima: this.state.ImageWebBase64 },
                { key: "3", ima: this.state.imgaAppWebDataBase_Receri },
            ];

            this.arr = res;
            await e.setState({
                resDATA: res,
                //     dataSource: ds.cloneWithRows(this.arr),
            });



            console.log('this.state.ImagePk::::', this.state.ImagePk);
            console.log('this.state.resDATA::::', this.state.resDATA);

            console.log('this.state.dataSource::::', this.state.dataSource);
        });

        //app lang nghe su kien web gui imgae sang server va tu server ve app
        this.socket.on('server-send-imageBase64-fromweb-toAppAndWeb', async (imageWebBase64Receri) => {
            console.log('app dang nhap image tu web');
            console.log('imageWebBase64:::::', imageWebBase64Receri.imageWebBase64);
            var imageWebBase64_uri = { uri: 'data:image/jpeg;base64,' + imageWebBase64Receri.imageWebBase64 };
            console.log('imageWebBase64_uri:::::', imageWebBase64_uri);
            e.setState({
                ImageWebBase64: imageWebBase64_uri
            });

            /*
             res = [
                { key: '2', ImageWebBase64_1: this.state.ImageWebBase64 },
                { key: '1', ImagePk_1: this.state.ImagePk },
                { key: '3', imgaAppWebDataBase_Receri_1: this.state.imgaAppWebDataBase_Receri },
            ];
             res = [
                { key: "1", ima: this.state.ImagePk },
                { key: "2", ima: this.state.ImageWebBase64 },
                { key: "3", ima: this.state.imgaAppWebDataBase_Receri },
            ]; */

            var res = [
                { key: "1", ima: this.state.ImagePk },
                { key: "2", ima: this.state.ImageWebBase64 },
                { key: "3", ima: this.state.imgaAppWebDataBase_Receri },
            ];

            this.arr = res;

            e.setState({
                resDATA: res,
                //      dataSource: ds.cloneWithRows(this.arr),
            });
            console.log('this.state.ImageWebBase64:::::', this.state.ImageWebBase64);
            console.log('this.state.ImageWebBase64.uri:::::', this.state.ImageWebBase64.uri);
            console.log('this.state.resDATA::::', this.state.resDATA);


        });


        //lang nghe ham EmitImageFromWebDatabase() gui len server va request lai app va web
        this.socket.on('server-send-image-blob-fromWebDatabase-reactApp-toAppWeb', imgaAppWebDataBase_Receri_r => {
            console.log('imgaWebDataBase_Receri:::::', imgaAppWebDataBase_Receri_r);
            var imgaWebDataBase_Receri_uri = { uri: 'data:image/jpeg;base64,' + imgaAppWebDataBase_Receri_r };
            e.setState({
                imgaAppWebDataBase_Receri: imgaWebDataBase_Receri_uri
            });

            /*
            res = [
                { key: '2', ImageWebBase64_1: this.state.ImageWebBase64 },
                { key: '1', ImagePk_1: this.state.ImagePk },
                { key: '3', imgaAppWebDataBase_Receri_1: this.state.imgaAppWebDataBase_Receri }
            ];
             res = [
                { key: "1", ima: this.state.ImagePk },
                { key: "2", ima: this.state.ImageWebBase64 },
                { key: "3", ima: this.state.imgaAppWebDataBase_Receri },
            ]; */

            var res = [
                { key: "1", ima: this.state.ImagePk },
                { key: "2", ima: this.state.ImageWebBase64 },
                { key: "3", ima: this.state.imgaAppWebDataBase_Receri },
            ];

            this.arr = res;
            e.setState({
                resDATA: res,
                //     dataSource: ds.cloneWithRows(this.arr),
            })
        });


    }

    EmitText() {
        const MS = 'anhyeuem'
        //  const Ms = this.state.messengerText;
        this.socket.emit('app-send-messenger-text', MS);
        console.log('app_send_messenge::');
    }
    EmitImage() {

        this.socket.emit('app-send-image-picker', this.state.messengerImage);
        console.log('app dang gui image picker');
    }



    taohang(property) {
        this.arr = property;

        console.log('property.ImageWebBase64_1:::::', property.ImageWebBase64_1);
        //  console.log('property._dataBlob:::::',property._dataBlob);

        const { styleImage, styleImage1, styleImage2, styleImage3, styleText } = styles;
        //neu = null  thi == imageNull
        const imageNull = <Image source={require('../../../public/imgaes/gaixinh.jpg')} style={styleImage} />;


        //image = from-web-server-to-AppWeb
        // neu  property.ImageWebBase64_1 = null la true = imageNull
        const ImageWebBase64_A_lv = property.ImageWebBase64_1 == null ? imageNull : //lang nghe image gui tu web to server va server tra ve app va web
            < Image source={property.ImageWebBase64} style={{ width: 50, height: 60, backgroundColor: '#60B15D' }} />
        ////image = from-App-server-to-AppWeb


        const ImagePk_A_lv = property.ImagePk_1 == null ? imageNull : //;lay o ham showImagePicker //hien thi cai lang nghe duoc tu emit picker
            <Image source={property.ImagePk_1} style={{ width: 50, height: 60, backgroundColor: '#F15A24' }} />
        //image = from-app-datatbase-server-to-AppWeb


        const imgaAppWebDataBase_Receri_A_lv = property.imgaAppWebDataBase_Receri_1 == null ? imageNull : //hien thi image tu app fetch len database va lay base64 emit server nodejs va verver tra ve cho AppWeb
            <Image source={property.imgaAppWebDataBase_Receri_1} style={{ width: 50, height: 60, backgroundColor: '#2C2255' }} />

        return (
            <View style={{ flex: 1, backgroundColor: '#D6ECF8' }}>
                <View style={{ flex: 1, backgroundColor: '#24416B' }} >
                    <Text>{property.namsinh}</Text>
                    {/*<Text>{console.log(property.messengerText1)}</Text> */}
                    <Text style={styleText}>{property.username1 + ':'}{property.messengerText1}</Text>
                    <Text style={styleText} >{console.log(property.messengerText1)}</Text>
                    <Text style={styleText} >{property.ImageWebBase64_1}</Text>
                    <Text style={styleText} >{console.log(property.ImageWebBase64_1)}</Text>
                </View>

                <View style={{ flex: 3, flexDirection: 'row', backgroundColor: '#007ACC', justifyContent: 'center', alignItems: 'center' }} >
                    {/* <Image source={property.ImagePk_1} style={{ width: 100, height: 100 }}/> */}
                    {ImageWebBase64_A_lv}
                    {ImagePk_A_lv}
                    {imgaAppWebDataBase_Receri_A_lv}
                </View>
            </View>

        );
    };

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
                    messengerImage: sourceBase64,

                });
            }
        });
    }

    uploadToServer() {
        RNFetchBlob.fetch('POST', 'http://192.168.216.2:1500/reactNative/Upload', {
            Authorization: "Bearer access-token",
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
        }, [
                // element with property `filename` will be transformed into `file` in form data
                { name: 'avatar', filename: 'avatar.png', data: this.state.avatarSourceUpLoadBase64 },
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
                // ...
            }).catch((err) => {
                console.log(err);
            })
    }

    EmitImageFromWebDatabase() {
        RNFetchBlob.fetch('GET', 'http://192.168.216.2:81/api/images/product/56.jpg', {
            Authorization: 'Bearer access-token...',
            // more headers  ..
        })
            // when response status code is 200
            .then((res) => {
                // the conversion is done in native code
                //  let base64Str = res.base64()
                // the following conversions are done in js, it's SYNC
                // let text = res.text()
                // let json = res.json()
                this.socket.emit('app-from-web-database-client-send-base64', res.data); //res.data de lay Basee64 trong res
                console.log('dang sendtu EmitImageFromWebDatabase base64 len server node:', res.data);

            })
            // Status code is not 200
            .catch((errorMessage, statusCode) => {
                // error handling
            })
    }
    render() {
        const { btnStyle, styleTextInput, styleImage, styleText, styleImage1, styleImage2, styleImage3 } = styles;

        const ImagePk_A = this.state.ImagePk == null ? null : //hien thi cai lang nghe duoc tu emit picker
            <Image source={this.state.ImagePk} style={styleImage} />
        const ImageWebBase64_A = this.state.ImageWebBase64 == null ? null :
            < Image source={this.state.ImageWebBase64} style={styleImage} />

        const messengerImage_A = this.state.messengerImage == null ? null :  //hien thi cai image khi ta chon image o image picker //hien thi cai image da cho o image picker
            < Image source={this.state.messengerImage} style={styleImage} />

        const imgaAppWebDataBase_Receri_A = this.state.imgaAppWebDataBase_Receri == null ? null : //hien thi image tu app fetch len database va lay base64 emit server nodejs va verver tra ve cho AppWeb
            <Image source={this.state.imgaAppWebDataBase_Receri} style={styleImage} />



        /*
        //neu = null  thi == imageNull
        const imageNull = <Image source={require('../../../public/imgaes/gaixinh.jpg')} style={styleImage} />;

        //image = from-web-server-to-AppWeb
        // neu  property.ImageWebBase64_1 = null la true = imageNull
        const ImageWebBase64_A_lv = property.ImageWebBase64_1 == null ? imageNull : //lang nghe image gui tu web to server va server tra ve app va web
            < Image source={property.ImageWebBase64} style={{ width: 50, height: 60, backgroundColor: '#60B15D' }} />
        ////image = from-App-server-to-AppWeb

        const ImagePk_A_lv = property.ImagePk_1 == null ? imageNull : //;lay o ham showImagePicker //hien thi cai lang nghe duoc tu emit picker
            <Image source={property.ImagePk_1} style={{ width: 50, height: 60, backgroundColor: '#F15A24' }} />
        //image = from-app-datatbase-server-to-AppWeb
        const imgaAppWebDataBase_Receri_A_lv = property.imgaAppWebDataBase_Receri_1 == null ? imageNull : //hien thi image tu app fetch len database va lay base64 emit server nodejs va verver tra ve cho AppWeb
            <Image source={property.imgaAppWebDataBase_Receri_1} style={{ width: 50, height: 60, backgroundColor: '#2C2255' }} />
        */



        return (
            <View style={{ flex: 1, backgroundColor: '#FFFF' }}>
                <TouchableOpacity onPress={() => this.uploadToServer()} style={btnStyle} >
                    <Text>uploadToServer</Text>
                </TouchableOpacity>
                <Text>Component Messenger</Text>
                <View style={{ flex: 2, backgroundColor: '#766F82' }}>
                    <View style={{ flex: 2, backgroundColor: '#1C82CD', justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            onChangeText={text => this.setState({ messengerText: Text })}
                            value={this.state.messengerText}
                            placeholder={"Enter Messenger"}
                            style={styleTextInput}
                        />
                        <TouchableOpacity onPress={() => this.EmitText()} style={btnStyle}>
                            <Text style={styleText}>Enter Text</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.ShowImage_piker()} style={btnStyle} >
                            <Text style={styleText}>ShowImage_piker</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.EmitImage()} style={btnStyle} >
                            <Text style={styleText}>EmitImage</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.EmitImageFromWebDatabase()} style={btnStyle} >
                            <Text style={styleText} >EmitImageFromWebDatabase</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#6EC6A1' }}>
                        <Image source={require('../../../public/imgaes/gaixinh.jpg')} style={styleImage} />
                        {ImagePk_A}
                        {ImageWebBase64_A}
                        {messengerImage_A}
                        {imgaAppWebDataBase_Receri_A}
                    </View>

                </View>
                <View style={{ flex: 1, backgroundColor: '#A3DE64' }}>

                    {/*
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.taohang}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this.setState({ refreshing: true }); // refreshing = true  bat dau refreshing lai ban dau refreshing = flase
                                    const newpage = this.state.page + 1;
                                    this.taoHang(property, newpage)
                                        .then(() => {
                                            this.arr = this.arr.concat(property); //pust mang no vao
                                            this.setState({ //refresh lai cai mang dua vao dataSource
                                                dataSource: ds.cloneWithRows(this.arr),
                                                refreshing: false,
                                            });
                                           
                                        }
                                        )
                                        .catch(e => console.log(e));
                                }}
                            />
                        }
                    />
                    */}

                    <FlatList
                        data={this.state.resDATA}
                        renderItem={({ item }) =>

                            <View style={styles.dong}>

                                <View style={styles.bentrai}>
                                    <Image source={item.ima} style={styleImage} />
                                     {/* 
                                    <Text>{item.ten}</Text>
                                     <Image source={item.ImageWebBase64_1} style={styleImage} />
                                    <Image source={item.ImagePk_1} style={styleImage} />
                                    <Image source={item.imgaAppWebDataBase_Receri_1} style={styleImage} />
                                   */}
                                </View>

                                <View style={styles.bentrai}>
                                    <Text>{item.key}</Text>

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
    dong: {
        flex: 1, borderBottomWidth: 1, padding: 50, backgroundColor: '#ffff', flexDirection: 'row'
    },
    bentrai: {
        flex: 1, backgroundColor: '#243D1E'
    },
    bentrai: {
        flex: 4, backgroundColor: '#375EED'
    },
    btnStyle: {
        width: 100, height: 16,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#95CF57',
        borderTopLeftRadius: 8, borderTopRightRadius: 8,
        borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
        marginTop: 8,
    },
    styleTextInput: {
        height: 10, borderWidth: 1, borderColor: '#E61A5F'
    },
    styleImage: {
        width: 80, height: 90
    },
    styleImage1: {
        width: 50, height: 60, backgroundColor: '#60B15D'
    },
    styleImage2: {
        width: 50, height: 60, backgroundColor: '#F15A24'
    },
    styleImage3: {
        width: 50, height: 60, backgroundColor: '#2C2255'
    },
    styleText: {
        // marginLeft:5,
        fontSize: 8,
        // width:5,
        // alignSelf: 'center'
    }

})
