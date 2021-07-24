import axios from "../axios";

export const RECEIVE_FRIENDS_WANNABES = "RECEIVE_FRIENDS_WANNABES";
export const ACCEPT_FRIENDSHIP = "ACCEPT_FRIENDSHIP";
export const UNFRIEND = "UNFRIEND";
export const CHAT_MESSAGES = "CHAT_MESSAGES";
export const CHAT_MESSAGE = "CHAT_MESSAGE";

export async function receiveFriendsAndWannabes() {
    const response = await axios.get("/api/friends_and_wannabes");
    // console.log(
    //     "[data-action.js-receiveFriendsAndWannabes]",
    //     response.data.result
    // );

    return {
        type: RECEIVE_FRIENDS_WANNABES,
        friends: response.data,
    };
}

export async function acceptFriendship(id) {
    // const response = await axios.get("/api/friends_and_wannabes");
    // // console.log(
    // //     "[data-action.js-receiveFriendsAndWannabes]",
    // //     response.data.result
    // // );
    const response = await axios.put(`/api/user/${id}/relationship`);
    console.log("[acceptFriendship-action]", response.data);

    return {
        type: ACCEPT_FRIENDSHIP,
        id,
    };
}

export async function unFriend(id) {
    const response = await axios.delete(`/api/user/${id}/relationship`);
    console.log("[unFriend-action]", response);

    return {
        type: UNFRIEND,
        id,
    };
}

export function chatMessages(manyMessages) {
    return {
        type: CHAT_MESSAGES,
        manyMessages,
    };
}

export function chatMessage(singleMessage) {
    console.log("[in-action-chatMessage]", singleMessage);
    return {
        type: CHAT_MESSAGE,
        singleMessage,
    };
}
