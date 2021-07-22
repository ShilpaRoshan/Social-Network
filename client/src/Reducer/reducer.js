import {
    RECEIVE_FRIENDS_WANNABES,
    ACCEPT_FRIENDSHIP,
    UNFRIEND,
} from "./action";

const initialState = {
    friends: [],
};

export default function reducer(state = initialState, action) {
    if (action.type === RECEIVE_FRIENDS_WANNABES) {
        return {
            ...state,
            friends: action.friends,
        };
    }

    if (action.type === ACCEPT_FRIENDSHIP) {
        console.log("[ACCEPT_FRIENDSHIP-reducer]", action.id, state);
        const newFriends = state.friends.map((friend) => {
            if (friend.id == action.id) {
                console.log("[hello]", friend.id);
                return {
                    ...friend,
                    accepted: true,
                };
            }
            return {
                ...friend,
            };
        });
        return {
            ...state,
            friends: newFriends,
        };
    }
    if (action.type === UNFRIEND) {
        console.log("[UNFRIEND]", action.id, state);
        const deleteFriends = state.friends.filter((x) => x.id != action.id);

        return {
            ...state,
            friends: deleteFriends,
        };
    }
    return state;
}
