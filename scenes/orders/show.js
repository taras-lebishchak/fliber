import React, { Component } from 'react';
import { View, Dimensions, TouchableWithoutFeedback } from 'react-native'
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Left, Right, Body, Title, Card, List, ListItem, Radio, Thumbnail, Drawer, Text, Tabs, Tab, TabHeading, Spinner } from 'native-base';
import colors from '../../theme/colors';
import Client from '../../lib/client';
import Socket from '../../lib/socket';

import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Marker } from 'react-native-maps';
import MapStyle from '../../theme/mapstyle.json'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Actions } from 'react-native-router-flux';

const { height, width } = Dimensions.get('window');
const fit_options = {
  edgePadding: {
    right: (width / 20),
    bottom: (height / 20),
    left: (width / 20),
    top: (height / 20),
  }
}

export default class Order extends Component {
  constructor() {
    super();
    this.state = { distance: 0, duration: 0 }
    this.acceptOrder = this.acceptOrder.bind(this);

  }

  componentWillMount() {
    let { client_id } = this.props.order;
    Client.user.get(client_id).then(client => {
      this.setState({ client });
    })

    Socket.onAcceptOrder(({ uid, order_id }) => {
      if (this.props.order.id == order_id) {
        this.setState({ accepted: true });
      }
    })
  }

  acceptOrder() {
    let { id } = this.props.order;
    Client.order.acept({ id }).then(data => {
      Socket.acceptOrder(id);
      Client.profile.get().then(profile => {
        Actions.reset('active', profile)
      })
    })

  }

  render() {
    let { distance, duration, accepted } = this.state;
    let { id, points, price } = this.props.order;
    let origin = points[0];
    let origin_coord = { latitude: origin.ln, longitude: origin.lg, latitudeDelta: 0.0184, longitudeDelta: 0.00895 };
    let destination = points[points.length - 1];
    let destination_coord = { latitude: destination.ln, longitude: destination.lg };
    let city = destination.title.split(' ')[0];
    let details = destination.title.replace(city + ' ', '');
    
    origin = Object.assign({}, origin, { longitude: 23.5123192999, latitude: 49.3580116 });
    return (
      <Container>

        <Header hasTabs style={{ backgroundColor: colors.PRIMARY_COLOR }} androidStatusBarColor={colors.DARK_PRIMARY_COLOR} >
          <Left>
            <Button transparent onPress={() => { this.props.navigation.goBack() }}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title style={{ width: '150%', textAlign: 'left' }}>Замовлення №{id}</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => { }}>
            </Button>
          </Right>
        </Header>
        <Content >
          <MapView
            ref={(ref) => { this.mapView = ref }}
            style={{ width, height: width }}
            customMapStyle={MapStyle}
            initialRegion={origin_coord}
            maxZoomLevel={15}
          >
            <Marker coordinate={origin_coord} >
              <FontAwesome name={'circle'} style={{ fontSize: 24, color: colors.PRIMARY_COLOR }} />
            </Marker>
            <Marker coordinate={destination_coord} >
              <FontAwesome name={'circle'} style={{ fontSize: 24, color: colors.PRIMARY_COLOR }} />
            </Marker>
            <MapViewDirections
              origin={origin_coord}
              //waypoints={(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1) : null}
              destination={destination_coord}
              apikey={'AIzaSyCHemc9-wcZIkqqjaVCTaA-rfXdlGJ6PLw'}
              strokeWidth={3}
              strokeColor="white"
              optimizeWaypoints={true}
              onStart={(params) => {
                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
              }}
              onReady={({ distance, duration, coordinates }) => {
                this.setState({ distance, duration })
                this.mapView.fitToCoordinates(coordinates, fit_options);
              }}
              onError={(errorMessage) => {
                console.log('GOT AN ERROR', errorMessage);
              }}
            />
          </MapView>
          <View style={{ margin: 20 }}>
            <Text style={{ fontSize: 22, color: colors.PRIMARY_TEXT }}>{city}</Text>
            <Text style={{ fontSize: 18, color: colors.SECONDARY_TEXT }}>{details}</Text>
            <Text style={{ fontSize: 18, color: colors.SECONDARY_TEXT }}>{parseFloat(distance).toFixed(1) + ' Км  (' + parseFloat(duration).toFixed(1) + ' хв)'}</Text>
            <Text style={{ fontSize: 24, color: colors.PRIMARY_TEXT }}>{price + ' грн'}</Text>
          </View>
          {
            accepted ?
              <View style={{ margin: 20, borderRadius: 8, width: width - 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ color: colors.PRIMARY_TEXT }}>Замовлення підтверджено іншим водієм</Text>
              </View>
              :
              <Button block style={{ backgroundColor: colors.PRIMARY_COLOR, margin: 20, borderRadius: 8 }} onPress={this.acceptOrder}>
                <Text style={{ color: colors.TEXT_ICONS }}>Підтвердити замовлення</Text>
              </Button>
          }

        </Content>
      </Container >
    );
  }
}


