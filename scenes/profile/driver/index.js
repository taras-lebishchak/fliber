import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, AsyncStorage, Alert, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import { Container, Header, Content, Button, Icon, Left, Right, Body, Title, Item, List, ListItem, Radio, Thumbnail, Drawer, Text, Picker } from 'native-base';
import colors from '../../../theme/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Client from '../../../lib/client'
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';


import CarData from '../../../lib/cars.js';

const { height, width } = Dimensions.get('window');

export default class EditDriver extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    let { profile } = props;
    this.state = { ...profile, profile, saved: true }
    this.save = this.save.bind(this);
    this.edit = this.edit.bind(this);
    this.selectImage = this.selectImage.bind(this);


  }

  componentWillMount() {

  }

  edit(attribute, value) {
    let { profile } = this.state;
    var attributes = Object.keys(profile);
    var saved = true;
    for (var i = 0; i < attributes.length; i++) {
      if (attributes[i] === attribute) {
        if (profile[attributes[i]] !== value) {
          saved = false;
        }
      } else {
        if (profile[attributes[i]] !== this.state[attributes[i]]) {
          saved = false;
        }
      }
    }
    this.setState({ [attribute]: value, saved });
  }

  save() {
    let { brand, model, color, year, car_photo, license_id, license_photo, car_pasport_photo, insurance_photo } = this.state;
    Client.profile.update({ brand, model, color, year, car_photo, license_id, license_photo, car_pasport_photo, insurance_photo }).then((profile) => {
      this.setState({ profile, saved: true });
    })
  }

  getModels(brand) {
    if (brand)
      return CarData.filter(a => a.brand === brand)[0].models
    else
      return [];
  }

  selectImage(attribute) {
    ImagePicker.showImagePicker({
      title: 'Select ' + attribute.replace(/_/g, ' '),
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }, ({ data, type }) => {
      if (data) {
        this.setState({ [attribute]: "data:" + type + ";base64," + data });
      }
    });
  }


  render() {
    let { brand, model, color, year, car_photo, license_id, license_photo, car_pasport_photo, insurance_photo, saved } = this.state;

    return (
      <Container>
        <Header style={{ backgroundColor: colors.PRIMARY_COLOR }} androidStatusBarColor={colors.DARK_PRIMARY_COLOR} >
          <Left>
            <Button transparent onPress={() => { this.props.navigation.goBack() }}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Дані водія</Title>
          </Body>
          <Right>

          </Right>
        </Header>
        <Content>
          <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
            <View>

              <Picker
                note
                mode="dropdown"
                style={styles.input}
                selectedValue={brand}
                onValueChange={(brand) => this.setState({ brand })}
              >
                <Picker.Item label={"Оберіть марку автомобіля"} value={null} />
                {CarData.map(({ brand }) => <Picker.Item key={brand} label={brand} value={brand} />)}
              </Picker>

              <Picker
                note
                mode="dropdown"
                style={styles.input}
                selectedValue={model}
                onValueChange={(model) => this.setState({ model })}
              >
                <Picker.Item label={"Оберіть модель автомобіля"} value={null} />
                {this.getModels(brand).map((m) => <Picker.Item key={m} label={m} value={m} />)}
              </Picker>

              <TextInput style={styles.input}
                value={color}
                onChangeText={color => this.setState({ color })}
                autoCapitalize="words"
                onSubmitEditing={() => this.yearInput.focus()}
                autoCorrect={false}
                returnKeyType="next"
                placeholder="Колір"
                placeholderTextColor='rgba(225,225,225,0.7)' />

              <TextInput style={styles.input}
                value={year}
                onChangeText={year => this.setState({ year })}
                autoCapitalize="none"
                ref={(input) => this.yearInput = input}
                onSubmitEditing={() => this.license_idInput.focus()}
                autoCorrect={false}
                keyboardType='number-pad'
                returnKeyType="next"
                placeholder='Рік випуску'
                placeholderTextColor='rgba(225,225,225,0.7)' />


              {
                car_photo ?
                  <Image source={{ uri: car_photo }} style={{ width: width - 40, height: (width - 40) * 0.75, marginBottom: 10 }} /> : null
              }
              <TouchableOpacity style={styles.input} onPress={() => { this.selectImage('car_photo') }}>
                <Text style={{ color: colors.TEXT_ICONS, textAlign: 'center', fontWeight: '600', }}>Обрати фото автомобіля</Text>
              </TouchableOpacity>

              <TextInput style={styles.input}
                value={license_id}
                onChangeText={license_id => this.setState({ license_id })}
                autoCapitalize="none"
                ref={(input) => this.license_idInput = input}
                onSubmitEditing={() => { }}
                autoCorrect={false}
                returnKeyType="next"
                placeholder='Номаер водійського посвідчення'
                placeholderTextColor='rgba(225,225,225,0.7)' />


              {
                license_photo ?
                  <Image source={{ uri: license_photo }} style={{ width: width - 40, height: (width - 40) * 0.75, marginBottom: 10 }} /> : null
              }
              <TouchableOpacity style={styles.input} onPress={() => { this.selectImage('license_photo') }}>
                <Text style={{ color: colors.TEXT_ICONS, textAlign: 'center', fontWeight: '600', }}>Обрати фото посвідчення</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonContainer} onPress={this.save}>
                <Text style={styles.buttonText}>Зберегти</Text>
              </TouchableOpacity>



            </View>
          </KeyboardAvoidingView>

        </Content>
      </Container >
    );
  }
}



const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    height: 40,
    backgroundColor: colors.PRIMARY_COLOR,
    marginBottom: 10,
    padding: 10,
    color: colors.TEXT_ICONS,
    width: width - 40
  },
  buttonContainer: {
    backgroundColor: colors.PRIMARY_COLOR,
    paddingVertical: 15,
    marginTop: 10,

  },
  buttonText: {
    color: colors.TEXT_ICONS,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 24
  }
})
