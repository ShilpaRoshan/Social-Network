import socket from "../socket";
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
                <li key={message.id}>
                    <strong>{message.first_name} :</strong>
                    {message.message}
                </li>
            );
        });
    }

    function sendMessage() {
        let currentMessage = messageTextArea.current.value;
        console.log("sendMessage", currentMessage);
        socket.emit("chatMessage", currentMessage);
    }

    return (
        <div className="chat-container">
            <ul>{renderMessages()}</ul>
            <textarea
                placeholder="Type your message here!"
                ref={messageTextArea}
            ></textarea>
            <button type="submit" onClick={sendMessage}>
                Send
            </button>
        </div>
    );
}
