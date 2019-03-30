import { AsyncStorage } from 'react-native';

  // keyToken la ten cai token  da duoc luu o saveToken
  const getToken = async (keyToken) => {
    try {
        var value = await AsyncStorage.getItem(keyToken);
        if (value !== null) {
            return value;
        }
        return [];
    } catch (e) {
        return [];
    }
}

module.exports = getToken;