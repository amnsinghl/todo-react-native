import React, {Component} from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    Button,
    FlatList,
    ListView,
    Text,
    View
} from 'react-native';
import CheckBox from "react-native-check-box";

const dikeUrl = "https://proxy.handler.talk.to/go.to/dike/v5.0/getAllAppsV2";
const baseUrl = "https://apps.flock.co/todo/v2/";

class TodoItem extends Component {
    render() {
        return (
            <View style={{padding: 10}}>
                <CheckBox
                    style={{flex: 1}}
                    onClick={() => this.onClick(data)}
                    isChecked={this.props.checked}
                    rightText={this.props.state.text}
                />
                <View
                    style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 33}}>
                    <Text>{this.props.state.assignedToName}</Text>
                    <Text>{this.props.state.dueOn}</Text>
                </View>
            </View>
        )
    }
}

class TodoList extends Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    async fetchCompletedTodos() {
        const token = await AsyncStorage.getItem("todoToken");
        const url = baseUrl + "chat/" + this.props.state.chatId + "/list/" + this.props.state.listId + "/completedtodos?" + token;
        console.log(url);
        const response = await ((await fetch(url)).json());
        this.props.state.completedTodos = response[this.props.state.listId].todos;
        this.setState({});
    }

    render() {
        return (
            <View style={{
                backgroundColor: 'white',
                marginLeft: 10,
                marginRight: 10,
                marginTop: 5,
                marginBottom: 5,
                padding: 10
            }}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{this.props.state.listName}</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text>in </Text>
                    <Text style={{color: '#00c955'}}>{this.props.state.chatName}</Text>
                </View>
                <FlatList
                    data={this.props.state.todos}
                    renderItem={({item}) =>
                        <TodoItem state={item} checked={false}/>
                    }
                    keyExtractor={item => item.todoId}
                />
                <FlatList
                    data={this.props.state.completedTodos}
                    renderItem={({item}) =>
                        <TodoItem state={item} checked={true}/>
                    }
                    keyExtractor={item => item.todoId}
                />
                <View
                    style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                    <Button title="Add a to-do"
                            color="#00c955" onPress={() => navigate('MyTodos')}/>
                    <Button title="Show Completed"
                            color="#00c955" onPress={this.fetchCompletedTodos.bind(this)}/>
                </View>
            </View>
        );
    }
}

export default class MyTodos extends Component {

    static navigationOptions = {
        title: 'My To-Dos'
    };

    constructor() {
        super();
        this.state = {
            isLoading: true
        }
    }

    convertList(responseJson) {
        let ret = [];
        responseJson.chats.forEach((chat) => {
            let chatDetails = responseJson.roster.find((it) => it.chatId === chat.chatId);
            for (let li in chat.lists) {
                let todo = chat.lists[li];
                if (chatDetails) {
                    todo.chatName = chatDetails.chatName;
                } else {
                    todo.chatName = "";
                }
                todo.chatId = chat.chatId;
                ret.push(todo);
            }
        });
        return ret;
    }

    fetchTodos(todoToken) {
        const url = baseUrl + 'chat?' + todoToken;
        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
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

    async componentDidMount() {
        const todoToken = await AsyncStorage.getItem("todoToken");
        if (todoToken) {
            this.fetchTodos(todoToken);
        } else {
            const guid = await AsyncStorage.getItem("guid");
            const token = await AsyncStorage.getItem("token");
            const url = dikeUrl + "?guid=" + guid + "&token=" + token;
            const response = await (await fetch(url)).json();
            const todoApp = response.apps.filter((it) => it.id === "6d0aa37b00944ec0a7426d34ca2df048")[0];
            await AsyncStorage.setItem("eventToken", todoApp.eventToken);
            await AsyncStorage.setItem("validationToken", todoApp.validationToken);
            const todoToken = "flockEvent=a&flockEventToken=" + todoApp.eventToken;
            await AsyncStorage.setItem("todoToken", todoToken);
            this.fetchTodos(todoToken);
        }
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
