

import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View,
  TouchableOpacity, TextInput,
} from 'react-native';

import SaveData from './api/saveData';
import getData from './api/getData';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      isLogin: true,
      resultLogin: '',
      token: '',
    }
  }

  RegisterUser() {
    console.log('11111111');
    var data = JSON.stringify({
      USERNAME: this.state.username,
      PASWORD: this.state.password,
    });
    console.log('data::', data);

    fetch('http://192.168.216.2:3200/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'

      },
      body: JSON.stringify({
        USERNAME: this.state.username,
        PASSWORD: this.state.password,
      })
    })
      .then(Response => {
        console.log('Response RegisterUser:::', Response);
        var result = Response._bodyText;


        console.log('result::::', result);
        console.log('result 000::::', result !== '0');
        console.log('result 111::::', result == '0');
        console.log('result:222:::', result == 0);

        this.setState({ isLogin: false });

      })
  }


  LoginUser() {
    var data = JSON.stringify({
      USERNAME: this.state.username,
      PASWORD: this.state.password,
    });
    console.log('data::', data);

    fetch('http://192.168.216.2:3200/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'

      },
      body: JSON.stringify({
        USERNAME: this.state.username,
        PASSWORD: this.state.password,
      })
    })
      .then(Response => {
        console.log('Response:LoginUser::', Response);
        var data = Response._bodyText;
        console.log('data:::login', data);
        var result = JSON.parse(data);

        if (result == 0) {

        } else {
          console.log('result:::v result result result', result);
          this.setState({ token: result.token });
          console.log('this.state.resultLogin:::', this.state.token);
          const { navigator } = this.props;
          navigator.push({ name: 'BUYSELL' });

          //save token nua
          SaveData(this.state.token, '@token');

          getData('@token')
            .then(res => {
              console.log('res;;;; getData', res);
            })

        }


      })

  }

  componentDidMount() {

    this.setState({
      username: 'lan',
      password: '123'
    });
    // this.RegisterUser();

    getData('@token')
      .then(token => {

        if (token == null) {

        } else {
          console.log('token::: cmd App 00000 ::', token);
          fetch('http://192.168.216.2:3200/checkToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'

            },
            body: JSON.stringify({
              TOKEN: token
            })
          })
            .then(res1 => {
              console.log('res1::::', res1);
              var data = (res1._bodyText);

              if (data == 0) {
                const { navigator } = this.props;
                navigator.push({ name: 'TRANGCHU' });
              }
              else {


                var dataToken = JSON.parse(data);
                // var token  = JSON.parse(data);
                this.setState({ tokenNew: dataToken.tokenNew });
                console.log('this.state.token:::', this.state.tokenNew);
                SaveData(this.state.tokenNew, "@token");
                getData('@token')
                  .then(res => {
                    console.log('res tokenNewtokenNew tokenNew', res);

                  });

                const { navigator } = this.props;
                navigator.push({ name: 'BUYSELL' });
              }

            })
        }
      })

  }

  render() {

    const JSXRegister = (
      <View style={{ justifyContent: "center", alignItems: 'center',  flex: 1  }} >

        <View style={{ justifyContent: "center", alignItems: 'center', flex: 1 }} >
          <TextInput
            onChangeText={text => this.setState({ username: text })}
            value={this.state.username}
            placeholder="username resgister"
          />

          <TextInput
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
            placeholder="password"
          />
        </View>


        <View style={{  flex: 1, justifyContent: "center", alignItems: 'center', flexDirection: 'row' }} >
          <TouchableOpacity onPress={() => this.RegisterUser()}
            style={styles.btnStyle}
          >
            <Text>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {
            this.setState({ isLogin: false });

          }}
            style={styles.btnStyle}
          >
            <Text>Login</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => {
            SaveData('', "@token");

          }}
            style={styles.btnStyle}
          >
            <Text>LogOut</Text>
          </TouchableOpacity>
        </View>


      </View>
    );

    const JSXLogin = (
      <View  style={{ justifyContent: "center", alignItems: 'center',  flex: 1  }} >

        <View  style={{ justifyContent: "center", alignItems: 'center',  flex: 1  }} >
          <TextInput
            onChangeText={text => this.setState({ username: text })}
            value={this.state.username}
            placeholder="username resgister"
          />

          <TextInput
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
            placeholder="password"
          />

          <TouchableOpacity onPress={() => this.LoginUser()}
            style={styles.btnStyle}
          >
            <Text>Login</Text>
          </TouchableOpacity>

        </View>

        <View  style={{ justifyContent: "center", alignItems: 'center',  flex: 1  }} >
          <Text> {this.state.token == null ? null : this.state.token} </Text>
        </View>


      </View>
    );

    const MainJSX = this.state.isLogin == true ? JSXRegister : JSXLogin;
    return (
      <View  style={{ justifyContent: "center", alignItems: 'center',  flex: 1, backgroundColor: '#0E639C'  }} >
        <Text>main</Text>

        {MainJSX}



      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnStyle: {
    width: 100, height: 16,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#95CF57',
    borderTopLeftRadius: 8, borderTopRightRadius: 8,
    borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
    marginLeft: 8,
  }
})