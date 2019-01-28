/**
 * Example for InAppPopupNotification
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { InAppPopupNotification } from 'react-native-in-app-popup-notification';

export default class App extends Component {
  popup = null;
  constructor(props) {
    super(props);

  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={ this.onNotificationClick }>
          <Text style={styles.welcome}>Click to trigger!!</Text>
        </TouchableOpacity>
        <Text style={styles.instructions}>Clicking above should show an in app notification.</Text>
        <TouchableOpacity onPress= { this.onDismissClick }>
          <Text style={styles.welcome}>Click to dismiss the popup, if visible!!</Text>
        </TouchableOpacity>
        <InAppPopupNotification {...this.popupProps} ref='popup'></InAppPopupNotification>
      </View>
    );
  }

  popupProps = {
    popupWillAppear: () => console.log('Popup Will appear'),
    popupDidAppear: () => console.log('Popup did appear'),
    popupWillDisappear: () => console.log('Popup will disappear'),
    popupDidDisappear: () => console.log('Popup did disappear'),
    iconPath: 'bell',

  };

  onNotificationClick = () => {
    if(this.refs.popup) {
      this.refs.popup.displayNotification({
        title: 'Boom!',
        message: 'Custom messages work!',
      });
    }
  };

  onDismissClick = () => {
    if (this.refs.popup) {
      this.refs.popup.dismissPopup(() => console.log('Popup Dismissed through touchable opacity'));
    }
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
