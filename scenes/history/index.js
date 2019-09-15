import React, { Component } from 'react';
import { View, Dimensions, TouchableWithoutFeedback, Alert } from 'react-native'
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Left, Right, Body, Title, Card, List, ListItem, Radio, Thumbnail, Drawer, Text, Tabs, Tab, TabHeading, Spinner } from 'native-base';
import colors from '../../theme/colors';
import Client from '../../lib/client';

import { Actions } from 'react-native-router-flux';

const { height, width } = Dimensions.get('window');

export default class History extends Component {
  constructor() {
    super();
    this.state = {
      active_orders: null,
      done_orders: null,
      canceled_orders: null
    }
    this.reload = this.reload.bind(this);
    this.retry = this.retry.bind(this);
    this.retryBack = this.retryBack.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps)
  }

  componentWillMount() {
    this.reload();
  }

  reload() {
    Client.order.find().then(orders => {
      this.setState({
        active_orders: orders.filter(order => order.status === 'active' || order.status === 'accepted'),
        done_orders: orders.filter(order => order.status === 'done'),
        canceled_orders: orders.filter(order => order.status === 'canceled'),
      })
    })
  }

  retry(order) {
    let { distance, points, price, client_id } = order
    Client.order.create({
      price,
      distance,
      is_freightage: false, size: null, weight: null,
      description: '',
      status: 'active',
      client_id,
      driver_id: null
    }).then((order_id) => {
      Client.point.create([{
        title: points[0].title,
        ln: points[0].ln,
        lg: points[0].lg,
        number: 0,
        order_id
      }, {
        title: points[1].title,
        ln: points[1].ln,
        lg: points[1].lg,
        number: 1,
        order_id
      }]).then(result => {
        Alert.alert(
          'Заявку успішно подано',
          'Очікуйте сповіщення від водія про підтвердження замовлення',
          [
            {
              text: 'OK', onPress: () => {
                this.reload();
                console.log(this.tabs);
              }
            },
          ],
          { cancelable: false },
        );
      }).catch(error => {
        console.log('error', error)
      })
    })
  }

  retryBack(order) {
    let { distance, points, price, client_id } = order
    Client.order.create({
      price,
      distance,
      is_freightage: false, size: null, weight: null,
      description: '',
      status: 'active',
      client_id,
      driver_id: null
    }).then((order_id) => {
      Client.point.create([{
        title: points[1].title,
        ln: points[1].ln,
        lg: points[1].lg,
        number: 0,
        order_id
      }, {
        title: points[0].title,
        ln: points[0].ln,
        lg: points[0].lg,
        number: 1,
        order_id
      }]).then(result => {
        Alert.alert(
          'Заявку успішно подано',
          'Очікуйте сповіщення від водія про підтвердження замовлення',
          [
            { text: 'OK', onPress: () => { Actions.refresh() } },
          ],
          { cancelable: false },
        );
        console.log('result', result)
      }).catch(error => {
        console.log('error', error)
      })
    })
  }

  render() {
    let tab_style = { style: { backgroundColor: colors.PRIMARY_COLOR } }
    let { active_orders, done_orders, canceled_orders } = this.state;
    return (
      <Container>

        <Header hasTabs style={{ backgroundColor: colors.PRIMARY_COLOR }} androidStatusBarColor={colors.DARK_PRIMARY_COLOR} >
          <Left>
            <Button transparent onPress={() => { this.props.navigation.goBack() }}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title style={{ width: '150%', textAlign: 'left' }}>Поїздки</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => { firebase.auth().signOut(); }}>
            </Button>
          </Right>
        </Header>
        <Content>
          <Tabs ref={(ref) => { this.tabs = ref }} >
            <Tab heading={
              <TabHeading {...tab_style} ><Icon name="md-time" style={{ color: colors.TEXT_ICONS }} /></TabHeading>
            }>
              {
                !active_orders ?
                  <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: height - 130, width: '100%' }}>
                    <Spinner color={colors.PRIMARY_COLOR} />
                  </View>
                  :
                  active_orders.length == 0 ?
                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: height - 130, width: '100%' }}>
                      <Text>Активних поїздок не знайдено</Text>
                    </View>
                    :
                    <List>
                      {active_orders.map((order, index) => {
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
                              <Button transparent onPress={() => Actions.push('history-show', { order })}>
                                <Text>Деталі</Text>
                              </Button>
                            </Right>
                          </ListItem>
                        )
                      })}
                    </List>
              }
            </Tab>
            <Tab heading={
              <TabHeading {...tab_style}><Icon name="md-done-all" style={{ color: colors.TEXT_ICONS }} /></TabHeading>}
            >
              {
                !done_orders ?
                  <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: height - 130, width: '100%' }}>
                    <Spinner color={colors.PRIMARY_COLOR} />
                  </View>
                  :
                  done_orders.length == 0 ?
                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: height - 130, width: '100%' }}>
                      <Text>Активних поїздок не знайдено</Text>
                    </View>
                    :
                    <List>
                      {done_orders.map((order, index) => {
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
                              <Button transparent onPress={() => { this.retry(order) }}>
                                <Text>Повторити</Text>
                              </Button>
                              <Button transparent onPress={() => { this.retryBack(order) }}>
                                <Text>Зворотній</Text>
                              </Button>
                            </Right>
                          </ListItem>
                        )
                      })}
                    </List>
              }
            </Tab>
            <Tab heading={
              <TabHeading {...tab_style}><Icon name="md-trash" style={{ color: colors.TEXT_ICONS }} /></TabHeading>}
            >
              {
                !canceled_orders ?
                  <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: height - 130, width: '100%' }}>
                    <Spinner color={colors.PRIMARY_COLOR} />
                  </View>
                  :
                  canceled_orders.length == 0 ?
                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: height - 130, width: '100%' }}>
                      <Text>Активних поїздок не знайдено</Text>
                    </View>
                    :
                    <List>
                      {canceled_orders.map((order, index) => {
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
                              <Button transparent onPress={() => { this.retry(order) }}>
                                <Text>Повторити</Text>
                              </Button>
                              <Button transparent onPress={() => { this.retryBack(order) }}>
                                <Text>Зворотній</Text>
                              </Button>
                            </Right>
                          </ListItem>
                        )
                      })}
                    </List>
              }
            </Tab>
          </Tabs>
        </Content>

      </Container >
    );
  }
}


