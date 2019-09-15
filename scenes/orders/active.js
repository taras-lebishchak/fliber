import React, { Component } from 'react';
import { View, Dimensions, TouchableWithoutFeedback, Alert, AsyncStorage } from 'react-native'
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Left, Right, Body, Title, Item, List, ListItem, Radio, Thumbnail, Drawer, Text } from 'native-base';
import colors from '../../theme/colors';

import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Marker } from 'react-native-maps';
import MapStyle from '../../theme/mapstyle.json'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { Router, Scene, Actions } from 'react-native-router-flux';

import Client from '../../lib/client'
import Socket from '../../lib/socket';

const { height, width } = Dimensions.get('window');
const fit_options = {
  edgePadding: {
    right: (width / 20),
    bottom: (height / 20),
    left: (width / 20),
    top: (height / 20),
  }
}

export default class Active extends Component {
  constructor(props) {
    super(props);
    let { order: { id, client_id, points } } = props;

    this.state = {
      origin: null,
      id,
      client_id,
      first: true,
      points: points.map(({ title, ln, lg }) => ({
        title: title.split(' ')[0],
        details: title.replace(title.split(' ')[0] + ' ', ''),
        coordinates: {
          latitude: ln,
          longitude: lg,
        }
      })),
      index: 0
    }
    this.setNextPoint = this.setNextPoint.bind(this);
    this.setPrevPoint = this.setPrevPoint.bind(this);
    this.doneOrder = this.doneOrder.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);

  }


  componentWillMount() {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      this.setState({ origin: { latitude, longitude, latitudeDelta: 0.0184, longitudeDelta: 0.00895 } })
    })

    this.watchPosition = navigator.geolocation.watchPosition(({ coords: { latitude, longitude } }) => {
      this.setState({ origin: { latitude, longitude, latitudeDelta: 0.0184, longitudeDelta: 0.00895 } })
      Socket.watchPosition({ latitude, longitude });
    }, error => {
      console.log('watchPosition', error);
    }, {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
      });

  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchPosition);
  }

  setNextPoint() {
    let { index, points, last } = this.state;
    if (last) {
      this.doneOrder();
    } else {
      if (index + 1 < points.length) {
        this.setState({ index: index + 1, first: false, last: index + 2 == points.length })
      }
    }
  }

  setPrevPoint() {
    let { index } = this.state;
    if (index > 0) {
      this.setState({ index: index - 1, first: index == 1, last: false })
    }
  }

  doneOrder() {
    Alert.alert(
      'Завершення поїздки',
      'Цю дію не можливо відмінити',
      [
        {
          text: 'Скасувати',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'Продовжити', onPress: () => {
            Client.order.done({ id: this.state.id }).then(() => {
              Actions.reset('home')
            })
          }
        },
      ],
      { cancelable: false },
    );
  }

  cancelOrder() {
    Alert.alert(
      'Відмовитись від поїздки',
      'Цю дію не можливо відмінити',
      [
        {
          text: 'Скасувати',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'Продовжити', onPress: () => {
            Client.order.cancel({ id: this.state.id }).then(() => {
              Actions.reset('home');
              Actions.push('orders')
            })
          }
        },
      ],
      { cancelable: false },
    );
  }


  render() {
    let { origin, points, place, distance, duration, profile, markers, is_trip, index, last, first } = this.state;

    console.log('origin', origin);
    if(!origin){
      return null;
    }
    origin = Object.assign({}, origin, { longitude: 23.5123192999, latitude: 49.3580116 });
    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: colors.PRIMARY_COLOR }} androidStatusBarColor={colors.DARK_PRIMARY_COLOR} >
          <Body>
            <Title style={{ marginLeft: 20, textAlign: 'left' }}>Fliber</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.cancelOrder}>
              <Text style={{ width: 180 }}>Скасувати поїздку</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <View style={{ height: height - 80 }}>
            <MapView
              ref={(ref) => { this.mapView = ref }}
              style={{ width, height: height - 180 }}
              customMapStyle={MapStyle}
              initialRegion={origin}
              maxZoomLevel={15}
            >

              <Marker coordinate={origin} >
                <FontAwesome name={'circle'} style={{ fontSize: 24, color: colors.PRIMARY_COLOR }} />
              </Marker>

              <MapViewDirections
                origin={origin}
                destination={points[index].coordinates}
                apikey={'AIzaSyCHemc9-wcZIkqqjaVCTaA-rfXdlGJ6PLw'}
                strokeWidth={3}
                strokeColor="white"
                optimizeWaypoints={true}
                onStart={(params) => {
                  console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                }}
                onReady={result => {
                  let { distance, duration } = result;
                  this.setState({ distance, duration })
                  this.mapView.fitToCoordinates(result.coordinates, fit_options);
                }}
                onError={(errorMessage) => {
                  console.log('GOT AN ERROR', errorMessage);
                }}
              />

              <Marker coordinate={points[index].coordinates} >
                <FontAwesome name={'flag'} style={{ fontSize: 24, color: colors.PRIMARY_COLOR }} />
              </Marker>
            </MapView>




            <View
              ref={(ref) => this.animatableView = ref}
              style={{
                backgroundColor: colors.PRIMARY_COLOR,
                height: 150,
                width,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingTop: 20,
                paddingLeft: 30,
                paddingRight: 30,
                position: 'absolute',
                bottom: 0
              }}>
              {
                is_trip ?
                  <Text style={{ fontSize: 24, color: colors.TEXT_ICONS }}>Початкова точка поїздки</Text> : null

              }
              <Text style={{ fontSize: 22, color: colors.TEXT_ICONS }}>{points[index].title}</Text>
              <Text style={{ fontSize: 18, color: colors.LIGHT_PRIMARY_COLOR }}>{points[index].details}</Text>
              <Text style={{ fontSize: 18, color: colors.LIGHT_PRIMARY_COLOR }}>{parseFloat(distance).toFixed(1) + ' Км  (' + parseFloat(duration).toFixed(1) + ' хв)'}</Text>

              {
                first ? null :
                  <Button transparent style={{ position: 'absolute', height: 64, width: 64, paddingBottom: 0, paddingTop: 0, bottom: 0, right: 64 }} onPress={this.setPrevPoint}>
                    <Icon name={'ios-arrow-dropleft-circle'} style={{ fontSize: 64, color: colors.TEXT_ICONS, marginLeft: 0, marginRight: 0, textAlign: 'center' }} />
                  </Button>
              }
              <Button transparent style={{ position: 'absolute', height: 64, width: 64, paddingBottom: 0, paddingTop: 0, bottom: 0, right: 0 }} onPress={this.setNextPoint}>
                {
                  last ?
                    <FontAwesome5 name={'flag'} style={{ fontSize: 48, color: colors.TEXT_ICONS }} />
                    :
                    <Icon name={'ios-arrow-dropright-circle'} style={{ fontSize: 64, color: colors.TEXT_ICONS, marginLeft: 0, marginRight: 0, textAlign: 'center' }} />
                }

              </Button>

            </View>
          </View>
        </Content>
      </Container >
    );
  }
}


