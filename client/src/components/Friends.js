import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
    receiveFriendsAndWannabes,
    acceptFriendship,
    unFriend,
} from "../Reducer/action";

export default function Friends() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(receiveFriendsAndWannabes());
    }, []);

    const friends = useSelector((state) => state.friends);
    // console.log("[Friends-file]", friends);
    return (
        <div>
            <h2>These are your friends</h2>
            <div className="friends-list">
                {friends &&
                    friends
                        .filter(({ accepted }) => accepted)
                        .map((friend) => {
                            return (
                                <div key={friend.id}>
                                    <ul>
                                        <li>
                                            <img src={friend.profile_url}></img>
                                            {friend.first_name}{" "}
                                            {friend.last_name}
                                            <button
                                                onClick={() => {
                                                    dispatch(
                                                        unFriend(friend.id)
                                                    );
                                                }}
                                            >
                                                Unfriend
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            );
                        })}
            </div>

            <h2>These wanted to be your friends:-Wannabes</h2>
            <div className="friends-list">
                {friends &&
                    friends
                        .filter(({ accepted }) => !accepted)
                        .map((friend) => {
                            return (
                                <div key={friend.id}>
                                    <ul>
                                        <li>
                                            <img src={friend.profile_url}></img>
                                            {friend.first_name}{" "}
                                            {friend.last_name}
                                            <button
                                                onClick={() => {
                                                    dispatch(
                                                        acceptFriendship(
                                                            friend.id
                                                        )
                                                    );
                                                }}
                                            >
                                                Accept
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            );
                        })}
            </div>
        </div>
    );
}
