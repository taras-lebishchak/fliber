import React, { Component } from 'react';
import { View, Dimensions, Keyboard } from 'react-native'
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Left, Right, Body, Title, Input, Item, List, ListItem, Radio, Thumbnail, Switch, Text } from 'native-base';
import colors from '../../../../theme/colors';

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'

const { height, width } = Dimensions.get('window');

export default class Home extends Component {
  constructor(props) {
    super(props);
    if (props.ref) {
      props.ref(this);
    }
    this.state = {
      text: "",
      list: [],
      status: null,
      show: true
    }
    this.onChangeText = this.onChangeText.bind(this);
    this.selectAddress = this.selectAddress.bind(this);

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);

  }
  static defaultProps = {
    marginTop: 80,
    style: null
  }

  show() {
    this.setState({ show: true });
  }
  hide() {
    this.setState({ show: false });
  }

  componentWillMount() {

  }

  makeWrapperStyle(marginTop, fullScreen) {
    return {
      height: fullScreen ? height - marginTop : 50,
      width: fullScreen ? width : width * 0.9,
      margin: fullScreen ? 0 : width * 0.05,
      paddingLeft: fullScreen ? 0 : 10,
      paddingRight: fullScreen ? 0 : 10,
      backgroundColor: 'white',
      borderRadius: fullScreen ? 0 : 5,
      position: 'absolute',
      top: 0
    }
  }

  makeInputStyle(fullScreen) {
    return {
      paddingLeft: fullScreen ? 10 : 0,
      paddingRight: fullScreen ? 10 : 0
    }
  }

  onChangeText(text) {
    this.setState({ text });
    let api_key = 'AIzaSyCHemc9-wcZIkqqjaVCTaA-rfXdlGJ6PLw';
    let type = 'textquery'
    let country = 'uk';
    let fields = 'geometry,formatted_address,name';
    if (text !== '') {
      fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${api_key}&inputtype=${type}&language=${country}&fields=${fields}`)
        .then(res => res.json())
        .then(({ status, predictions }) => {
          switch (status) {
            case 'OK':
              return this.setState({ list: predictions, status });
            case 'ZERO_RESULTS':
              return this.setState({ list: [], status });
            case 'BAD_REQUEST':
              return this.setState({ list: null, status });
          }
        })
    } else {
      this.setState({ list: [], status: 'OK' });
    }

  }

  renderIcon(types) {
    for (var i = 0; i < types.length; i++) {
      let type = types[i];
      switch (type) {
        case 'establishment':
          return <FontAwesome5 name='landmark' size={18} />;
        case "route":
          return <FontAwesome5 name='route' size={18} />;
        case 'locality':
          return <Entypo name='location' size={18} />;
        default:
          return <FontAwesome5 name='map-marker-alt' size={18} />;
      }
    }
  }

  selectAddress(place) {
    this.props.onSelectAddress(place);
  }

  render() {
    let { show, list, fullScreen, text, status } = this.state;
    let { marginTop, style } = this.props;
    if (!show) {
      return null;
    }
    return (
      <View style={Object.assign(this.makeWrapperStyle(marginTop, fullScreen), style)}>
        <Item style={this.makeInputStyle(fullScreen)}>
          <FontAwesome name="search" size={24} style={{ paddingRight: 5 }} />
          <Input
            value={text}
            ref={(ref) => { this.input = ref; }}
            placeholder="Введіть адресу"
            style={{ fontSize: 20 }}
            onFocus={() => this.setState({ fullScreen: true })}
            onTouchStart={() => this.setState({ fullScreen: true })}
            onChangeText={this.onChangeText}
          />
          {fullScreen ? <FontAwesome name="times" size={24} style={{ paddingRight: 5 }} onPress={() => { this.setState({ fullScreen: false, text: '' }); Keyboard.dismiss(); }} /> : null}
        </Item>
        {
          fullScreen ?
            <List>
              {
                list && list.length > 0 ?
                  list.map((place) => {
                    let { place_id, structured_formatting: { main_text, secondary_text }, types } = place;
                    return (
                      <ListItem avatar key={place.place_id} onPress={() => this.selectAddress(place)}>
                        <Left>
                          <View style={{ backgroundColor: '#EEE', height: 40, width: 40, borderRadius: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {
                              this.renderIcon(types)
                            }
                          </View>
                        </Left>
                        <Body>
                          <Text>{main_text}</Text>
                          <Text note>{secondary_text}</Text>
                        </Body>
                        <Right>
                        </Right>
                      </ListItem>
                    )
                  }) : status === 'ZERO_RESULTS' ? <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 20 }}>Нічого не знайдено</Text> : null
              }
            </List>
            : null
        }
      </View>
    );
  }
}


