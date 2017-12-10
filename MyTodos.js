import React, {Component} from 'react';
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    View,
    ListView,
    Image, Button, FlatList
} from 'react-native';

const baseUrl = "https://apps.flock.co/todo/v2/";
const token = "flockEvent=%7B%22name%22%3A%22client.pressButton%22%2C%22button%22%3A%22appLauncherButton%22%2C%22chatName%22%3A%22Aman%20Singhal%22%2C%22chat%22%3A%22u%3A10104fr1oryrf0r0%22%2C%22userName%22%3A%22Aman%20Singhal%22%2C%22locale%22%3A%22en-us%22%2C%22userId%22%3A%22u%3Aisgpwwyralhf9aso%22%7D&flockEventToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBJZCI6IjZkMGFhMzdiMDA5NDRlYzBhNzQyNmQzNGNhMmRmMDQ4IiwidXNlcklkIjoidTppc2dwd3d5cmFsaGY5YXNvIiwiZXhwIjoxNTEyOTY4OTA3LCJpYXQiOjE1MTIzNjQxMDcsImp0aSI6IjcwNjA5YmU2LWYzMzQtNGIzMS04Zjg1LWFjMzkwYTUyN2I2NiJ9.JCEurA8H_Uik3BN1ck4jp2gtAgYBIhP3KP-sbh4UK6I";

class TodoItem extends Component {
    render() {
        return (
            <View>
                <Text>{this.props.state.text}</Text>
                <Text>{this.props.state.dueOn}</Text>
                <Text>{this.props.state.assignedToName}</Text>
            </View>
        )
    }
}

class TodoList extends Component {
    render() {
        return (
            <View>
                <Text >{this.props.state.listName}</Text>
                <FlatList
                    data={this.props.state.todos}
                    renderItem={({item}) =>
                        <TodoItem state={item}/>
                    }
                    keyExtractor={item => item.todoId}
                />
            </View>
        );
    }
}

export default class MyTodos extends Component {

    constructor() {
        super();
        this.state = {
            isLoading: true
        }
    }

    convertList(responseJson) {
        let ret = [];
        responseJson.chats.forEach((chat) => {
            for (let li in chat.lists) {
                let todo = chat.lists[li];
                ret.push(todo);
            }
        });
        return ret;
    }

    componentDidMount() {
        return fetch(baseUrl + 'chat?' + token)
            .then((response) => response.json())
            .then((responseJson) => {
                let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    isLoading: false,
                    dataSource: ds.cloneWithRows(this.convertList(responseJson)),
                }, function () {
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
                    renderRow={(rowData) =>
                        <TodoList state={rowData}/>
                    }
                />
            </View>
        );
    }
}
