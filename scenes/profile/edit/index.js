import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, AsyncStorage, Alert, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import { Container, Header, Content, Button, Icon, Left, Right, Body, Title, Item, List, ListItem, Radio, Thumbnail, Drawer, Text, Switch } from 'native-base';
import colors from '../../../theme/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Client from '../../../lib/client'
import { Actions } from 'react-native-router-flux';

const { height, width } = Dimensions.get('window');


export default class Edit extends Component {
  constructor(props) {
    super(props);
    let { profile } = props;
    this.state = { ...profile, profile, saved: true }
    this.save = this.save.bind(this);
    this.edit = this.edit.bind(this);

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
    let { name, email, phone } = this.state;
    Client.profile.update({ name, email, phone }).then((profile) => {
      this.setState({ profile, saved: true });
    })
  }


  render() {
    let { name, email, phone, saved } = this.state;
    return (
      <Container>
        <Header style={{ backgroundColor: colors.PRIMARY_COLOR }} androidStatusBarColor={colors.DARK_PRIMARY_COLOR} >
          <Left>
            <Button transparent onPress={() => { this.props.navigation.goBack() }}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Персональні дані</Title>
          </Body>
          <Right>

          </Right>
        </Header>
        <Content>
          <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
            <View>
              <TextInput style={styles.input}
                value={name}
                onChangeText={name => this.edit('name', name)}
                autoCapitalize="words"
                onSubmitEditing={() => this.emailInput.focus()}
                autoCorrect={false}
                returnKeyType="next"
                placeholder="Iм'я"
                placeholderTextColor='rgba(225,225,225,0.7)' />
              <TextInput style={styles.input}
                value={email}
                onChangeText={email => this.edit('email', email)}
                autoCapitalize="none"
                ref={(input) => this.emailInput = input}
                onSubmitEditing={() => this.passwordInput.focus()}
                autoCorrect={false}
                keyboardType='email-address'
                returnKeyType="next"
                placeholder='Email'
                placeholderTextColor='rgba(225,225,225,0.7)' />

              <TextInput style={styles.input}
                value={phone}
                onChangeText={phone => this.edit('phone', phone)}
                autoCapitalize="none"
                ref={(input) => this.phoneInput = input}
                autoCorrect={false}
                keyboardType="phone-pad"
                returnKeyType="done"
                placeholder="+380(XX)XXXXXXX"
                placeholderTextColor='rgba(225,225,225,0.7)' />

              {!saved ?
                <TouchableOpacity style={styles.buttonContainer} onPress={this.save}>
                  <Text style={styles.buttonText}>Зберегти</Text>
                </TouchableOpacity>
                : null}


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
    color: colors.TEXT_ICONS
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
