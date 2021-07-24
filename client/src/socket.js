import { chatMessages, chatMessage } from "./Reducer/action";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (manyMessages) =>
            store.dispatch(chatMessages(manyMessages))
        );

        socket.on("chatMessage", (singleMessage) =>
            store.dispatch(chatMessage(singleMessage))
        );
    }
};
