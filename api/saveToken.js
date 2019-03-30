
import { AsyncStorage } from 'react-native';
const saveToken = async (key, token) => {
    try {
        await AsyncStorage.setItem(key, token);
        return 'luu_token_thanh_cong';
    } catch (e) {
        return e;
    }
}

module.exports = saveToken;
