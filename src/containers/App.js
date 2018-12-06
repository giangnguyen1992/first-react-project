import React, { Component } from 'react'
import Chatkit from '@pusher/chatkit'
import { tokenUrl, instanceLocator } from '../config'

import MessageList from '../components/MessageList'
import SendMessageForm from './SendMessageForm'
import RoomList from '../components/RoomList'

import '../style/style.scss'

class App extends Component {
    constructor() {
        super()
        this.state = {
            roomId: null,
            messages: [],
            joinableRooms: [],
            joinedRooms: []
        }
    }; 
    
    // Chatkit Congif
    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator,
            userId: 'admin',
            tokenProvider: new Chatkit.TokenProvider({
                url: tokenUrl
            })
        })
        
        chatManager.connect()
        .then(currentUser => {
            this.currentUser = currentUser,
            this.getRooms()
        })
        .catch(err => console.log('error on connecting: ', err))
    };
    

    // Fetch alle verfügbaren Room
    getRooms() {
        this.currentUser.getJoinableRooms()
        .then(joinableRooms => {
            this.setState({
                joinableRooms,
                joinedRooms: this.currentUser.rooms
            })
        })
        .catch(err => console.log('error on joinableRooms: ', err))
    };
    
    // Wählt ein Raum aus
    subscribeToRoom(roomId) {
        this.setState({ messages: [] })
        this.currentUser.subscribeToRoom({
            roomId: roomId,
            hooks: {
                onNewMessage: message => {
                    this.setState({
                        messages: [...this.state.messages, message]
                    })
                }
            }
        })
        .then(room => {
            this.setState({
                roomId: room.id
            })
            this.getRooms()
        })
        .catch(err => console.log('error on subscribing to room: ', err))
    };
    
    sendMessage(text) {
        this.currentUser.sendMessage({
            text,
            roomId: this.state.roomId
        })
    };
    
    render() {
        return (
            <div className="app">
                <RoomList
                    subscribeToRoom={(roomId) => this.subscribeToRoom(roomId)}
                    rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
                <MessageList messages={this.state.messages} />
                <SendMessageForm sendMessage={(text) =>this.sendMessage(text)} />
                
            </div>
        );
    };
};

export default App;