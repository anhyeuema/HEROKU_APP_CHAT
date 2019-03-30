
const KieTraToken = async (varToken) => { //hay la checkToken gui token voi ten token voi ten token la TOKEN

    try {
        const a = fetch('http://192.168.216.2:81/App_Chat_Web/chat/checkToken.php', {
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
        /*
        .then(res => {
            res
          //  console.log(JSON.parse(res._bodyText));
           // return JSON.parse(res._bodyText);
            //  console.log("res_token_new_username", res);
            //   JSON.parse(res._bodyText) //duoc var a = JSON.parse(res._bodyText)
            //sau khi fetch token len server php thi
            //sử lý token mới được NHẬN từ server php
            //có the xử lý ở đây hoạc sử lý ở (*(***))
            //    console.log("res_token_new_username", res);

            /*
            var a = JSON.parse(res._bodyText);
            var username1 = a.username;
            console.log('username::::', username1);
            var token_time_1 = a.token_time;
            var token_new1 = a.token;
            console.log('token_new1::::', token_new1);
           // e.setState({tokenNew: token_new1,token_time: token_new1,});
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
            */
        /*
     })

     */

        return a;
    } catch (e) {
        return e;
    }
};

module.exports = KieTraToken;


/*

 const KieTraToken = async (varToken) => { //hay la checkToken gui token voi ten token voi ten token la TOKEN
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
            var username1 = a.username;
            console.log('username::::', username1);
            var token_time_1 = a.token_time;
            var token_new1 = a.token;
            console.log('token_new1::::', token_new1);
           // e.setState({tokenNew: token_new1,token_time: token_new1,});
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

module.exports = KieTraToken;
*/