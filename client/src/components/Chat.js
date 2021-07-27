import { socket } from "../socket";
import { useSelector } from "react-redux";
import { useRef } from "react";

export default function Chat() {
    const messageTextArea = useRef();
    const incomingMessages = useSelector((state) => {
        console.log(
            "[incomingMessages-Chat-component-useSelector]",
            state.incomingMessages
        );
        return state.incomingMessages;
    });

    function renderMessages() {
        if (incomingMessages.length == 0) {
            return <li>No Messages!</li>;
        }
        return incomingMessages.map((message) => {
            return (
                <li key={message.id} className="each-chat-item">
                    <img
                        src={message.profile_url}
                        className="chat-user-profile"
                    ></img>

                    <p className="chat-person-name">{message.first_name}:</p>
                    <p className="chat-message">{message.message} </p>
                </li>
            );
        });
    }

    function sendMessage() {
        let currentMessage = messageTextArea.current.value;
        console.log("sendMessage", currentMessage);
        socket.emit("chatMessage", currentMessage);
        messageTextArea.current.value = "";
    }

    return (
        <div className="chat-wrapper">
            <h2>Chat</h2>
            <ul className="chat-container">{renderMessages()}</ul>
            <hr></hr>
            <textarea
                placeholder="Type your message here!"
                ref={messageTextArea}
                className="chat-textarea"
            ></textarea>
            <button
                type="submit"
                onClick={sendMessage}
                className="chat-send-button"
            >
                Send
            </button>
        </div>
    );
}
