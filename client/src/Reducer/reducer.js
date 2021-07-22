import { RECEIVE_FRIENDS_WANNABES } from "./action";

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
}
