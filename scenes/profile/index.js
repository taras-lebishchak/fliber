import React, { Component } from 'react';
import { View, Dimensions, Image, AsyncStorage, Alert } from 'react-native'
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Left, Right, Body, Title, Item, List, ListItem, Radio, Thumbnail, Drawer, Text, Switch } from 'native-base';
import colors from '../../theme/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Client from '../../lib/client'
import { Actions } from 'react-native-router-flux';
const { height, width } = Dimensions.get('window');


export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
    }
    this.signout = this.signout.bind(this);
    this.onDriverModeChange = this.onDriverModeChange.bind(this);

    AsyncStorage.getItem('role').then(role => {
      if (role) {
        this.setState({ role })
      } else {
        this.setState({ role: 'client' });
        AsyncStorage.setItem('role', 'client');
      }
    })
  }

  componentWillMount() {

  }

  signout() {
    Client.auth.signout().then(() => {
      AsyncStorage.removeItem('token');
      Actions.replace('auth');
    })
  }

  onDriverModeChange(value) {
    let role = value ? 'driver' : 'client';
    Alert.alert(
      'Перехід в режим ' + (value ? 'водія' : 'клієнта'),
      'Додаток буде автоматично перезавантажено',
      [
        {
          text: 'Відміна', onPress: () => { }, style: 'cancel'
        },
        {
          text: 'OK', onPress: () => { Actions.reset('home', { role }); }
        },
      ],
      { cancelable: true },
    );
  }

  render() {
    let { profile } = this.props;
    let { role } = this.state;
    return (
      <Container>
        <Header span style={{ backgroundColor: colors.PRIMARY_COLOR }} androidStatusBarColor={colors.DARK_PRIMARY_COLOR} >
          <Left>
            <Button transparent onPress={() => { this.props.navigation.goBack() }}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <View style={{ height: 60, width: 60, borderRadius: 50, overflow: 'hidden', marginRight: 20 }}>
                <Image source={require('../../src/noavatar.jpg')} style={{ height: 60, width: 60, }} />
              </View>
              <View>
                <Text style={{ color: colors.TEXT_ICONS, fontSize: 22 }}>{profile.name}</Text>
                <Text style={{ color: colors.LIGHT_PRIMARY_COLOR, fontSize: 16 }}>{profile.email}</Text>
              </View>
            </View>
          </Body>
          <Right>
            <Button transparent onPress={this.signout}>
              <FontAwesome name='sign-out' style={{ fontSize: 24, color: colors.TEXT_ICONS }} />
            </Button>
          </Right>
        </Header>
        <Content>

          <ListItem icon style={{ height: 50 }} onPress={() => Actions.push('edit-profile', { profile, role })}>
            <Left >
              <Button style={{ backgroundColor: colors.PRIMARY_COLOR, padding: 0 }}>
                <Icon active name="md-person" />
              </Button>
            </Left>
            <Body>
              <Text>Редагувати персональні дані</Text>
            </Body>
            <Right style={{ height: 47 }}>
              <Icon active name="ios-arrow-forward" />
            </Right>
          </ListItem>

          <ListItem icon style={{ height: 50 }} onPress={() => Actions.push('edit-driver', { profile, role })}>
            <Left >
              <Button style={{ backgroundColor: colors.PRIMARY_COLOR, padding: 0 }}>
                <Icon active name="md-car" />
              </Button>
            </Left>
            <Body>
              <Text>Редагувати дані водія</Text>
            </Body>
            <Right style={{ height: 47 }}>
              <Icon active name="ios-arrow-forward" />
            </Right>
          </ListItem>

          <ListItem icon style={{ height: 50 }}>
            <Left >
              <Button style={{ backgroundColor: colors.PRIMARY_COLOR }}>
                <Icon active name="md-power" />
              </Button>
            </Left>
            <Body>
              <Text>Ввімкнути режим водія</Text>
            </Body>
            <Right style={{ height: 47 }}>
              <Switch value={role == 'driver'} onValueChange={this.onDriverModeChange} />
            </Right>
          </ListItem>



        </Content>
      </Container >
    );
  }
}


