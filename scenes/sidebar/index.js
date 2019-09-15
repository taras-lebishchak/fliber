import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, AsyncStorage } from 'react-native';
import { Left, Icon, Body, Right, List, ListItem, Title } from 'native-base'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import colors from '../../theme/colors';
import BarMenuItem from './components/BarMenuItem';
import { Actions } from 'react-native-router-flux';

const { width } = Dimensions.get('window');
const icon_style = { color: colors.SECONDARY_TEXT, fontSize: 24, textAlign: 'center' };

export default class Sidebar extends Component {
  render() {
    let { close, profile } = this.props;
    return (
      <View style={{ backgroundColor: colors.TEXT_ICONS, height: '100%' }}>
        <View style={{ width: '100%', height: profile ? 300 : 200, backgroundColor: colors.PRIMARY_COLOR }}>
          <Image source={require('../../src/logo-black.png')} style={{ height: 200, width: 200, marginLeft: 50 }} />
          {
            profile ?
              <View style={{ margin: 20, display: 'flex', flexDirection: 'row' }}>
                <View style={{ height: 60, width: 60, borderRadius: 50, overflow: 'hidden', marginRight: 20 }}>
                  <Image source={require('../../src/noavatar.jpg')} style={{ height: 60, width: 60, }} />
                </View>
                <View>
                  <Text style={{ color: colors.TEXT_ICONS, fontSize: 22 }}>{profile.name}</Text>
                  <Text style={{ color: colors.LIGHT_PRIMARY_COLOR, fontSize: 16 }}>{profile.email}</Text>
                </View>
              </View> : null
          }

        </View>
        <List style={{ marginLeft: 10 }}>

          {
            profile && profile.role == 'driver' ?
              <BarMenuItem
                onPress={() => { Actions.push('orders'); }}
                icon={<Icon name='ios-list-box' style={icon_style} />}
                title="Список замовлень"
              />
              : null
          }

          <BarMenuItem
            onPress={() => { Actions.push('history'); }}
            icon={<Icon name="md-time" style={icon_style} />}
            title="Ваші поїздки"
          />

          <BarMenuItem
            onPress={() => { profile ? Actions.push('profile', { profile }) : Actions.push('auth') }}
            icon={<FontAwesome name="user" style={icon_style} />}
            title={profile ? 'Профіль' : 'Вхід'}
          />

        </List>
      </View >
    );
  }
}
