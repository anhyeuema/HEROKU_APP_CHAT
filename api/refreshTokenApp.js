import saveToken from '../api/saveToken';
import getToken from '../api/getToken';

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
          //  console.log(res);
            var a = JSON.parse(res._bodyText);
            var token_time_1 = a.token_time;
            var time_thuc_1 = a.time_thuc;
            var time_dat_1 = a.expire_time_dat;

            saveToken('@time_thuc', time_thuc_1);
            saveToken('@time_dat', time_dat_1);

            saveToken('@token_time', token_time_1);
            getToken('@token_time')
                .then(token_time => {
                    console.log('token_time_sau khi da dc refreshToken token_time nay se moi vi co chua time thuc', token_time);
                })
                .catch(e => console.log(e))

        })
        .catch(e => console.log(e))
}

const refreshTokenApp = async () => {
    getToken('@token_time')
        .then(token_time => {
         //   console.log('token_time lay duoc tu saveToken(:::)', token_time);
            RefreshToken_time(token_time);
        })
        .catch(e => console.log(e))
}

module.exports = refreshTokenApp;