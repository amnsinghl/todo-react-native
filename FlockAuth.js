import React, {Component} from 'react';
import {ActivityIndicator, AsyncStorage, View, WebView} from "react-native";

export default class FlockAuth extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            isDone: false
        };
    }

    componentDidMount() {
        AsyncStorage.getItem("token").then((v) => {
            if (v) {
                this.setState({
                    isLoading: false,
                    isDone: true
                })
            } else {
                this.setState({
                    isLoading: false,
                    isDone: false
                })
            }
        });
    }

    getParameterByName(url, name) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    onNavigationStateChange(navState) {
        console.log(navState);
        const url = navState.url;
        if (this.getParameterByName(url, 'guid')) {
            const guid = this.getParameterByName(url, "guid");
            const authToken = this.getParameterByName(url, "auth_token");
            console.log("found " + guid + " " + authToken);
            AsyncStorage.setItem("guid", guid);
            AsyncStorage.setItem("token", authToken);
            this.setState({
                isLoading: false,
                isDone: true
            })
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator/>
                </View>
            );
        }
        if (this.state.isDone) {
            navigate('MyTodos');
            return <View/>
        }
        return (
            <WebView
                source={{uri: 'https://auth.flock.com/login?redirect_uri=https://dev.flock.com'}}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                onNavigationStateChange={this.onNavigationStateChange.bind(this)}
            />
        )
    }
}