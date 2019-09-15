import React, { Component } from 'react';
import { Left, Icon, Body, Right, List, ListItem, Title } from 'native-base'
import colors from '../../../../theme/colors';

export default class BarMenuItem extends Component {
  render() {
    let { onPress, icon, title } = this.props;
    return (
      <ListItem icon last style={{ marginTop: 0, borderWidth: 0, paddingBottom:5, paddingTop:5 }} onPress={onPress}>
        <Left style={{ width: 50 }}>
          {icon}
        </Left>
        <Body style={{
          marginBottom: 10,
          marginTop: 10
        }}>
          <Title style={{
            color: colors.SECONDARY_TEXT,
            fontWeight: '500',
            textAlign: 'left',
            paddingLeft: 10
          }} >{title}</Title>
        </Body>
        <Right>
        </Right>
      </ListItem>
    );
  }
}
