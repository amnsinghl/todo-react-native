/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    View,
    ListView
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on to reload,\n' +
    'Shake or press menu button for dev menu',
});
const baseUrl = "https://apps.flock.co/todo/v2/";
const token = "flockEvent=%7B%22name%22%3A%22client.pressButton%22%2C%22button%22%3A%22appLauncherButton%22%2C%22chatName%22%3A%22Aman%20Singhal%22%2C%22chat%22%3A%22u%3A10104fr1oryrf0r0%22%2C%22userName%22%3A%22Aman%20Singhal%22%2C%22locale%22%3A%22en-us%22%2C%22userId%22%3A%22u%3Aisgpwwyralhf9aso%22%7D&flockEventToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBJZCI6IjZkMGFhMzdiMDA5NDRlYzBhNzQyNmQzNGNhMmRmMDQ4IiwidXNlcklkIjoidTppc2dwd3d5cmFsaGY5YXNvIiwiZXhwIjoxNTEyOTY4OTA3LCJpYXQiOjE1MTIzNjQxMDcsImp0aSI6IjcwNjA5YmU2LWYzMzQtNGIzMS04Zjg1LWFjMzkwYTUyN2I2NiJ9.JCEurA8H_Uik3BN1ck4jp2gtAgYBIhP3KP-sbh4UK6I";

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        return fetch('https://facebook.github.io/react-native/movies.json')
            .then((response) => response.json())
            .then((responseJson) => {
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    isLoading: false,
                    dataSource: ds.cloneWithRows(responseJson.movies),
                }, function() {
                    // do something with new state
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator/>
                </View>
            );
        }

        return (
            <View style={{flex: 1, paddingTop: 20}}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => <Text>{rowData.title}, {rowData.releaseYear}</Text>}
                />
            </View>
        );
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
