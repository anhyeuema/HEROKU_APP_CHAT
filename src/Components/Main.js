import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';

import Home from './sreens/Home';
import Messenger from './sreens/Messenger';
import Status from './sreens/Status';
import FreeAll from './sreens/FreeAll';
import FreeSuper from './sreens/FreeSuper';

import User from './User/User';

import Status1 from './Status/Status';


export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'status1'
          // selectedTab: 'user'
        };
    }



    OnContolPanal() {
        const OnControl = this.props.OnControl; // khai bao bien OnControl de huong gia tri tu Tranhcu.js truyen sang OnControl ={() => this.openControlPanel()
        OnControl();
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffff' }}>
                <View style={{ flex: 1, backgroundColor: '#F2F2F2', flexDirection: 'row' }} >
                    <Text style={styles.styleText} >Main</Text>
                    <TouchableOpacity onPress={() => this.OnContolPanal()} style={styles.btnStyle} >
              
                        <Image source={require('../../api/Images/BackIcon.png')} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 12, backgroundColor: '#ffff' }} >
                    <TabNavigator>
                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'home'}
                            title="Home"
                            //  renderIcon={() => <Image source={...} />}
                            //  renderSelectedIcon={() => <Image source={...} />}
                            //   badgeText="1"
                            onPress={() => this.setState({ selectedTab: 'home' })}>
                            <Home />
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'messenger'}
                            title="Messenger"
                            // renderIcon={() => <Image source={...} />}
                            //  renderSelectedIcon={() => <Image source={...} />}
                            //  renderBadge={() => <CustomBadgeView />}
                            onPress={() => this.setState({ selectedTab: 'messenger' })}>
                            <Messenger />
                        </TabNavigator.Item>

                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'status'}
                            title="Status"
                            //  renderIcon={() => <Image source={...} />}
                            //  renderSelectedIcon={() => <Image source={...} />}
                            //badgeText="1"
                            onPress={() => this.setState({ selectedTab: 'status' })}>
                            <Status />
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'freeall'}
                            title="FreeAll"
                            //  renderIcon={() => <Image source={...} />}
                            //  renderSelectedIcon={() => <Image source={...} />}
                            //badgeText="1"
                            onPress={() => this.setState({ selectedTab: 'freeall' })}>
                            <FreeAll />
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'freesuper'}
                            title="FreeSuper"
                            //  renderIcon={() => <Image source={...} />}
                            //  renderSelectedIcon={() => <Image source={...} />}
                            //badgeText="1"
                            onPress={() => this.setState({ selectedTab: 'freesuper' })}>
                            <FreeSuper navigator={this.props.navigator} />
                        </TabNavigator.Item>

                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'status1'}
                            title="Status1"
                            //  renderIcon={() => <Image source={...} />}
                            //  renderSelectedIcon={() => <Image source={...} />}
                            //badgeText="1"
                            onPress={() => this.setState({ selectedTab: 'status1' })}>
                            <Status1 navigator={this.props.navigator} />
                        </TabNavigator.Item>

                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'user'}
                            title="User"
                            //  renderIcon={() => <Image source={...} />}
                            //  renderSelectedIcon={() => <Image source={...} />}
                            //badgeText="1"
                            onPress={() => this.setState({ selectedTab: 'user' })}>
                            <User navigator={this.props.navigator} />
                        </TabNavigator.Item>

                    </TabNavigator>
                </View>

            </View>
        );
    }
}

styles = StyleSheet.create({
    styleText: {
        fontSize: 6,
    },
    styleIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#81B945'
    },
    btnStyle: {
        width: 100, height: 16,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#95CF57',
        borderTopLeftRadius: 8, borderTopRightRadius: 8,
        borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
        marginTop: 8,
    }
});
