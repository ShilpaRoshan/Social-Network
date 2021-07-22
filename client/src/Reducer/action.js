import axios from "../axios";

export const RECEIVE_FRIENDS_WANNABES = "RECEIVE_FRIENDS_WANNABES";

export async function receiveFriendsAndWannabes() {
    const response = await axios.get("/api/user/friends-and-wannabes");
    console.log("[data-action.js-receiveFriendsAndWannabes]", response.data);

    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friends: data,
    };
}
