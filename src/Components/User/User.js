import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'

import NavigationExperimental from 'react-native-deprecated-custom-components';

import StatusPublic from './StatusPublic';

import StatusUser from './StatusUser';

export default class User extends Component {
    render() {
        return (


            <NavigationExperimental.Navigator
                initialRoute={{ name: 'STATUS_PUBLIC' }}
                renderScene={(route, navigator) => {
                    switch (route.name) {
                        case 'STATUS_PUBLIC': return <StatusPublic navigator={navigator} />;
                        case 'STATUS_USER': return <StatusUser navigator={navigator} />;
                    }
                }}
            />
        );

    }
}