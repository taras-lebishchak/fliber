import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Image, KeyboardAvoidingView, TextInput, AsyncStorage, Alert } from 'react-native'
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Left, Right, Body, Title, Item, List, ListItem, Radio, Thumbnail, Drawer, Text, Spinner } from 'native-base';
import colors from '../../theme/colors';
import { Actions } from 'react-native-router-flux';

const { height, width } = Dimensions.get('window');
import Client from '../../lib/client';

export default class Auth extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      no_connection: false,
    }
    this.submit = this.submit.bind(this);

    AsyncStorage.getItem('role').then(role => {
      if (role) {
        Client.changeRole(role);
      } else {
        AsyncStorage.setItem('role', 'client');
      }
    })
  }

  componentWillMount() {
    AsyncStorage.getItem('token').then(token => {
      if (token) {
        Client.auth.signinWithToken(token).then(token => {
          AsyncStorage.setItem('token', token)
          Client.profile.get().then(profile => {
            if (profile.order) {
              Actions.reset('active', profile);
            } else {
              Actions.reset('home');
            }
          }).catch(err => {
            this.setState({ no_connection: true, loading: false })
          })
        })
      } else {
        Client.ping().then(status => {
          if (status) {
            this.setState({ loading: false })
          }
        }).catch(err => {
          this.setState({ no_connection: true, loading: false })
        })
      }
    })
  }



  submit() {
    let { signup } = this.props;
    let { email, password, name, phone } = this.state;
    if (signup) {

      Alert.alert(
        'Зареєструватись як водій?',
        'Потрібно надати детальнішу інформацію про ваш транспортний засіб та ваше посвідчення водія.',
        [
          {
            text: 'Стати водієм', onPress: () => {
              Client.auth.signup({ email, password, name, phone }).then(token => {
                AsyncStorage.setItem('token', token);
                alert('Для переходу в режим водія зайдіть в налаштування профілю та заповніть дані про своє авто та права.');
                Actions.reset('home');
              })
            }
          },
          {
            text: 'Не зараз', onPress: () => {
              Client.auth.signup({ email, password, name, phone }).then(token => {
                AsyncStorage.setItem('token', token);
                Actions.reset('home');
              })
            }
          },
        ],
        { cancelable: false },
      );
    } else {
      Client.auth.signin({ email, password }).then(token => {
        AsyncStorage.setItem('token', token);
        Actions.reset('home');
      })
    }

  }

  render() {
    let { loading, no_connection } = this.state;
    let { signup, navigation } = this.props;

    if (loading) {
      return (
        <Container style={{ backgroundColor: colors.PRIMARY_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner color={colors.TEXT_ICONS} size={'large'} />
        </Container>
      )
    }
    if (no_connection) {
      return (
        <Container style={{ backgroundColor: '#E5E9EC', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../../src/no_connection.png')} style={{ width: 300, height: 200 }} resizeMethod={'resize'} />
          <Text>Немає з'єднання з сервером</Text>
          <Button block style={{ margin: 20, marginRight: 100, marginLeft: 100, backgroundColor: colors.PRIMARY_COLOR }} onPress={() => { Actions.push('auth') }}>
            <Text>Спробувати знову</Text>
          </Button>
        </Container>
      )
    }

    return (
      <Container style={{ backgroundColor: colors.PRIMARY_COLOR }}>
        <Content>
          <KeyboardAvoidingView style={styles.container} behavior="position" enabled>
            <Image source={require('../../src/logo-black.png')} style={{ width: width - 40, height: width - 40 }} />
            <View>
              {
                signup ?
                  <TextInput style={styles.input}
                    onChangeText={name => this.setState({ name })}
                    autoCapitalize="words"
                    onSubmitEditing={() => this.emailInput.focus()}
                    autoCorrect={false}
                    returnKeyType="next"
                    placeholder="Iм'я"
                    placeholderTextColor='rgba(225,225,225,0.7)' /> : null
              }
              <TextInput style={styles.input}
                onChangeText={email => this.setState({ email })}
                autoCapitalize="none"
                ref={(input) => this.emailInput = input}
                onSubmitEditing={() => this.passwordInput.focus()}
                autoCorrect={false}
                keyboardType='email-address'
                returnKeyType="next"
                placeholder='Email'
                placeholderTextColor='rgba(225,225,225,0.7)' />

              <TextInput style={styles.input}
                onChangeText={password => this.setState({ password })}
                returnKeyType="go"
                onSubmitEditing={() => this.phoneInput.focus()}
                ref={(input) => this.passwordInput = input}
                placeholder='Пароль'
                placeholderTextColor='rgba(225,225,225,0.7)'
                secureTextEntry />
              {
                signup ?
                  <TextInput style={styles.input}
                    onChangeText={phone => this.setState({ phone })}
                    autoCapitalize="none"
                    ref={(input) => this.phoneInput = input}
                    autoCorrect={false}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    placeholder="+380(XX)XXXXXXX"
                    placeholderTextColor='rgba(225,225,225,0.7)' /> : null
              }
              <TouchableOpacity style={styles.buttonContainer}
                onPress={this.submit}>
                <Text style={styles.buttonText}>{signup ? 'Створити' : 'Вхід'}</Text>
              </TouchableOpacity>
              <Text style={{ textAlign: 'center', color: colors.LIGHT_PRIMARY_COLOR, marginTop: 10 }}>{signup ? 'У мене є обліковий запис' : 'У мене немає облікового запису'}</Text>
              <TouchableOpacity
                onPress={() => {
                  if (signup) {
                    navigation.goBack();
                  } else {
                    Actions.push('auth', { signup: true })
                  }
                }}
              >
                <Text style={{ textAlign: 'center', color: colors.TEXT_ICONS, fontSize: 18, fontWeight: '500' }}>
                  {signup ? 'Ввійти' : 'Створити'}
                </Text>
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
    backgroundColor: 'rgba(225,225,225,0.2)',
    marginBottom: 10,
    padding: 10,
    color: '#fff'
  },
  buttonContainer: {
    backgroundColor: colors.DARK_PRIMARY_COLOR,
    paddingVertical: 15
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700'
  }
})
