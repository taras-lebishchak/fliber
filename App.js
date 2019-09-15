import React, { Component } from 'react';
import { StyleProvider } from 'native-base'
import { Router, Scene, Actions } from 'react-native-router-flux';

import Auth from './scenes/auth';
import Home from './scenes/home';
import History from './scenes/history';
import ShowHistory from './scenes/history/show';

import Payment from './scenes/payment';
import Profile from './scenes/profile';
import EditProfile from './scenes/profile/edit';
import EditDriver from './scenes/profile/driver';

import Orders from './scenes/orders';
import Order from './scenes/orders/show';
import Active from './scenes/orders/active';

console.disableYellowBox = true;

export default class App extends Component {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene
            key="auth"
            component={Auth}
            initial
            hideNavBar
          />
          <Scene
            key="home"
            component={Home}
            hideNavBar
          />
          <Scene
            key="history"
            component={History}
            hideNavBar
          />
            <Scene
            key="history-show"
            component={ShowHistory}
            hideNavBar
          />
          <Scene
            key="orders"
            component={Orders}
            hideNavBar
          />
          <Scene
            key="order"
            component={Order}
            hideNavBar
          />
          <Scene
            key="payment"
            component={Payment}
            hideNavBar
          />
          <Scene
            key="profile"
            component={Profile}
            hideNavBar
          />
          <Scene
            key="edit-profile"
            component={EditProfile}
            hideNavBar
          />
          <Scene
            key="edit-driver"
            component={EditDriver}
            hideNavBar
          />
          
          <Scene
            key="active"
            component={Active}
            hideNavBar
          />
        </Scene>
      </Router>
    );
  }
}


