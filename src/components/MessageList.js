import React, {Component } from 'react';
import ReactDOM from 'react-dom'
import Message from './Message';

class MessageList extends Component {
    // Je nachdem wieviele Nachrichten im Raum sind, springt die Antsicht zur letzten Nachricht
    componentWillUpdate() {
        const node = ReactDOM.findDOMNode(this);
        this.shouldScrollToBottom = node.scrollTop + node.clientHeight + 100 >= node.scrollHeight
    };
    // Springt immer zur aktuellen Nachricht
    componentDidUpdate() {
        if(this.shouldScrollToBottom) {
            const node = ReactDOM.findDOMNode(this);
            node.scrollTop = node.scrollHeight;
        }
    };

    render() {
        return (
            <div className="message-list">
                {this.props.messages.map((message, index) => {
                    return (
                        <Message key={index} username={message.senderId} text={message.text}/>  
                    )
                })}
            </div>
        );
    };
};

export default MessageList