import React, { Component } from 'react';
import { View, Dimensions, TouchableWithoutFeedback } from 'react-native'
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Left, Right, Body, Title, Card, List, ListItem, Radio, Thumbnail, Drawer, Text, Tabs, Tab, TabHeading, Spinner } from 'native-base';
import colors from '../../theme/colors';
import Client from '../../lib/client';
import { Actions } from 'react-native-router-flux';
import Socket from '../../lib/socket'

const { height, width } = Dimensions.get('window');

export default class Orders extends Component {
  constructor() {
    super();
    this.state = {
      orders: []
    }
  }

  componentWillMount() {
    Client.order.findActive().then(orders => {
      this.setState({ orders })
    })
    //Client.profile.get().then(profile => { this.setState({ profile }) })

    Socket.onAcceptOrder(({ uid, order_id }) => {
      console.log(this.state.orders, order_id)
      this.setState({ orders: this.state.orders.filter(order => order.id !== order_id) })
    })

  }

  render() {
    let { orders } = this.state;
    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: colors.PRIMARY_COLOR }} androidStatusBarColor={colors.DARK_PRIMARY_COLOR} >
          <Left>
            <Button transparent onPress={() => { this.props.navigation.goBack() }}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title style={{ width: '150%', textAlign: 'left' }}>Заявки</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => { }}>
            </Button>
          </Right>
        </Header>
        <Content>
          {

            orders.length == 0 ?
              <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: height - 130, width: '100%' }}>
                <Text>Активних поїздок не знайдено</Text>
              </View>
              :
              <List>
                {orders.map((order, index) => {
                  let destination = order.points[order.points.length - 1];
                  let { price, distance } = order;
                  let city = destination.title.split(' ')[0];
                  let details = destination.title.replace(city + ' ', '');
                  return (
                    <ListItem thumbnail key={'active_order_' + order.id}>
                      <Body>
                        <Text>{city}</Text>
                        <Text note numberOfLines={1}>{details}</Text>
                        <Text note numberOfLines={1}>{price + ' Грн (' + distance + ' км)'}</Text>
                      </Body>
                      <Right>
                        <Button transparent onPress={() => Actions.push('order', { order })}>
                          <Text>Деталі</Text>
                        </Button>
                      </Right>
                    </ListItem>
                  )
                })}
              </List>
          }
        </Content>
      </Container >
    );
  }
}


