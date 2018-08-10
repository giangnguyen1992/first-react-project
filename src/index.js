import React from 'react';
import ReactDOM from 'react-dom';
import Chatkit from '@pusher/chatkit';
import './style/style.scss';

import MessageList from './components/MessageList';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: []
    }
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
        currentUser.subscribeToRoom({
            roomId: 13513953, 
            hooks: {
                onNewMessage: message => {
                    console.log('message.text: ', message.text);
                    this.setState({
                      messages: [...this.state.messages, message]
                    })
                }
            }
        })
    })
}

  

  render() {
    return (
      <div className="app">
        <MessageList messages={this.state.messages}/>
      </div>
    )
  }
};

ReactDOM.render(<App />, document.getElementById('root'));