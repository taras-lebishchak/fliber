import React, { Component } from 'react';
import { View, Dimensions, TouchableWithoutFeedback } from 'react-native'
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Left, Right, Body, Title, Item, List, ListItem, Radio, Thumbnail, Drawer, Text } from 'native-base';
import colors from '../../theme/colors';


const { height, width } = Dimensions.get('window');

export default class Payment extends Component {
  constructor() {
    super();
    this.state = {
    }
  }

  componentWillMount() {

  }

  render() {

    return (
      <Container>

        <Header hasTabs style={{ backgroundColor: colors.PRIMARY_COLOR }} androidStatusBarColor={colors.DARK_PRIMARY_COLOR} >
          <Left>
            <Button transparent onPress={() => { this.props.navigation.goBack() }}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title style={{ width: '150%', textAlign: 'left' }}>Методи оплати</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => { firebase.auth().signOut(); }}>
            </Button>
          </Right>
        </Header>
        <Content>

        </Content>
      </Container >
    );
  }
}


