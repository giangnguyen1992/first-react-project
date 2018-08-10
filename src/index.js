import React from 'react';
import ReactDOM from 'react-dom';
import Chatkit from '@pusher/chatkit';
import './style/style.scss';

import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import RoomList from './components/RoomList';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      joinableRooms: [],
      joinedRooms: []
    }

    this.sendMessage = this.sendMessage.bind(this)
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
        instanceLocator: 'v1:us1:d34cb8d2-64c7-42ac-8fee-c7a4c48f1566',
        userId: 'admin', 
        tokenProvider: new Chatkit.TokenProvider({
            url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/d34cb8d2-64c7-42ac-8fee-c7a4c48f1566/token'
        })
    })
    
    chatManager.connect()
    .then(currentUser => {
        this.currentUser = currentUser
        this.currentUser.getJoinableRooms()
        .then(joinableRooms => {
          this.setState( {
            joinableRooms,
            joinedRooms: this.currentUser.rooms
          })
        })
        .catch(err => console.log('error on joinableRooms: ', err))
        this.currentUser.subscribeToRoom({
            roomId: 13513953, 
            hooks: {
                onNewMessage: message => {
                    this.setState({
                      messages: [...this.state.messages, message]
                    })
                }
            }
        })
    })
    .catch(err => console.log('error on connecting: ', err))
}

sendMessage(text) {
  this.currentUser.sendMessage({
    text: text,
    roomId: 13513953
  })
}  

  render() {
    return (
      <div className="app">
        <RoomList rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}/>
        <MessageList messages={this.state.messages}/>
        <SendMessageForm sendMessage={this.sendMessage}/>
      </div>
    )
  }
};

ReactDOM.render(<App />, document.getElementById('root'));