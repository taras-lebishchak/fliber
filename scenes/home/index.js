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
import AutocompleteSearch from './components/AutocompleteSearch'
import * as Animatable from 'react-native-animatable';
import { Router, Scene, Actions } from 'react-native-router-flux';
import SideBar from '../sidebar'

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

export default class Home extends Component {
  constructor(props) {
    super(props);
    if (props.role) {
      Client.changeRole(props.role)
      AsyncStorage.setItem('role', props.role);
    }

    this.state = {
      origin: null,
      profile: null,
      markers: [],
      is_trip: true
    }



    this.onSelectAddress = this.onSelectAddress.bind(this);
    this.createTrip = this.createTrip.bind(this);

  }

  closeDrawer = () => {
    this.drawer._root.close()
  };
  openDrawer = () => {
    this.drawer._root.open()
  };


  componentWillMount() {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      this.setState({ origin: { latitude, longitude, latitudeDelta: 0.0184, longitudeDelta: 0.00895 } })
    })

    Client.profile.get().then(profile => {
      Socket.init(profile);
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
      Socket.onWatchPosition(data => {
        let markers = this.state.markers.filter(marker => marker.uid !== data.uid);
        markers.push(data);
        this.setState({ markers });
      })
      Socket.onAcceptOrder(({ uid, order_id }) => {
        Alert.alert(
          'Ваше замовлення підтверджено',
          'Для перегляду деталей відкрийте замовлення',
          [
            {
              text: 'Скасувати',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Відкрити', onPress: () => {
                Client.order.get(order_id).then(order => {
                  Actions.push('history-show', { order })
                })
              }
            },
          ],
          { cancelable: false },
        );
      })

      this.setState({ profile })
    }).catch(err => { })
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchPosition);
  }

  onSelectAddress(place) {
    let { place_id } = place;
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&fields=geometry&key=AIzaSyCHemc9-wcZIkqqjaVCTaA-rfXdlGJ6PLw`)
      .then(res => res.json())
      .then(({ status, result }) => {
        if (status == 'OK') {
          let { geometry: { location: { lat, lng } } } = result;
          return this.setState({ destination: { latitude: lat, longitude: lng }, place });
        }
      })
  };

  calcPrice(distance) {
    return (20 + parseFloat(distance) * 5).toFixed(0);
  }

  createTrip() {
    let { distance, origin, destination, place, profile } = this.state;
    console.log('profile', profile);
    //this.animatableView.transitionTo({ height: height - 80, borderTopLeftRadius: 0, borderTopRightRadius: 0 })

    Client.order.create({
      price: this.calcPrice(distance),
      distance,
      is_freightage: false, size: null, weight: null,
      description: '',
      status: 'active',
      client_id: profile.id,
      driver_id: null
    }).then((order_id) => {
      Client.point.create([{
        title: 'Клієнт поточне місцезнаходження',
        ln: origin.latitude,
        lg: origin.longitude,
        number: 0,
        order_id
      }, {
        title: place.structured_formatting.main_text + ' ' + place.structured_formatting.secondary_text,
        ln: destination.latitude,
        lg: destination.longitude,
        number: 1,
        order_id
      }]).then(result => {
        Alert.alert(
          'Заявку успішно подано',
          'Очікуйте сповіщення від водія про підтвердження замовлення',
          [
            { text: 'OK', onPress: () => { Actions.replace('home'); Actions.push('history') }, style: 'cancel' },
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
    let { origin, destination, place, distance, duration, profile, markers } = this.state;


    return (
      <Container>
        <Drawer
          ref={(ref) => { this.drawer = ref; }}
          content={<SideBar navigation={this.props.navigation} profile={profile} close={this.closeDrawer} />}
          panOpenMask={0.1}
          onClose={() => this.closeDrawer()} >

          <Header hasTabs style={{ backgroundColor: colors.PRIMARY_COLOR }} androidStatusBarColor={colors.DARK_PRIMARY_COLOR} >
            <Left>
              <Button transparent onPress={this.openDrawer}>
                <Icon name='menu' />
              </Button>
            </Left>
            <Body>
              <Title style={{ width: '150%', textAlign: 'left' }}>Fliber</Title>
            </Body>
            <Right>
              <Button transparent onPress={() => { firebase.auth().signOut(); }}>
              </Button>
            </Right>
          </Header>

          {
            origin ?
              <Content>
                <View style={{ height: height - 80 }}>
                  <MapView
                    ref={(ref) => { this.mapView = ref }}
                    style={{ width, height: destination ? (height - 180) : (height - 80) }}
                    customMapStyle={MapStyle}
                    initialRegion={origin}
                    maxZoomLevel={15}
                  >

                    <Marker coordinate={origin} >
                      <FontAwesome name={'circle'} style={{ fontSize: 24, color: colors.PRIMARY_COLOR }} />
                    </Marker>
                    {
                      markers.map(({ uid, latitude, longitude }) => {
                        return (
                          <Marker key={'user-marker-' + uid} coordinate={{ latitude, longitude }} >
                            <FontAwesome5 name={profile.role == 'driver' ? 'user' : 'car'} style={{ fontSize: 24, color: colors.PRIMARY_COLOR }} />
                          </Marker>
                        )
                      })
                    }
                    {
                      destination ?
                        <MapViewDirections
                          origin={origin}
                          //waypoints={(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1) : null}
                          destination={destination}
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
                        /> : null
                    }

                    {
                      destination ?
                        <Marker coordinate={destination} >
                          <FontAwesome name={'flag'} style={{ fontSize: 24, color: colors.PRIMARY_COLOR }} />
                        </Marker> : null
                    }
                  </MapView>
                  {
                    profile && profile.role === 'driver' ? null :
                      !destination ?
                        <AutocompleteSearch onSelectAddress={this.onSelectAddress} />
                        : null
                    // <Button block style={{
                    //   margin: 20,
                    //   width: width - 40,
                    //   backgroundColor: colors.PRIMARY_COLOR,
                    //   borderRadius: 5,
                    //   position: 'absolute',
                    //   top: 0
                    // }}><Text>Додати зупинку в маршруті</Text></Button>
                  }
                  {
                    !destination ?
                      <TouchableWithoutFeedback onPress={() => {
                        this.mapView.fitToCoordinates([origin]);
                      }}>
                        <View style={{
                          backgroundColor: colors.DARK_PRIMARY_COLOR,
                          borderRadius: 50,
                          height: 50, width: 50,
                          position: 'absolute',
                          bottom: 20,
                          right: 20,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          <Icon name="md-locate" style={{ marginLeft: 0, marginRight: 0, color: colors.TEXT_ICONS }} />
                        </View>
                      </TouchableWithoutFeedback> : null
                  }
                  {
                    destination && place ?
                      <Animatable.View
                        ref={(ref) => this.animatableView = ref}
                        style={{
                          backgroundColor: colors.PRIMARY_COLOR,
                          height: 150,
                          width,
                          borderTopLeftRadius: 30,
                          borderTopRightRadius: 30,
                          padding: 20,
                          paddingLeft: 30,
                          paddingRight: 30,
                          position: 'absolute',
                          bottom: 0
                        }}>

                        <Text style={{ fontSize: 22, color: colors.TEXT_ICONS }}>{place.structured_formatting.main_text}</Text>
                        <Text style={{ fontSize: 18, color: colors.LIGHT_PRIMARY_COLOR }}>{place.structured_formatting.secondary_text}</Text>
                        <Text style={{ fontSize: 18, color: colors.LIGHT_PRIMARY_COLOR }}>{parseFloat(distance).toFixed(1) + ' Км  (' + parseFloat(duration).toFixed(1) + ' хв)'}</Text>

                        <Text style={{ fontSize: 24, color: colors.TEXT_ICONS }}>{this.calcPrice(distance) + ' грн'}</Text>

                        <FontAwesome name={'times'} size={24} style={{ position: 'absolute', top: 20, right: 20 }} color={colors.TEXT_ICONS}
                          onPress={() => {
                            this.setState({ destination: null });
                            this.mapView.fitToCoordinates([origin]);
                          }} />
                        <Button style={{ position: 'absolute', bottom: 15, right: 20, backgroundColor: colors.ACCENT_COLOR }} onPress={this.createTrip}>
                          <Text>Створити</Text>
                        </Button>

                      </Animatable.View> : null
                  }
                </View>
              </Content> : null
          }
        </Drawer>
      </Container >
    );
  }
}


