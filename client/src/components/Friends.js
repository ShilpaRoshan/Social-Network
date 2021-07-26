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
        <div className="friends-container">
            <section className="friends">
                <h2 className="sub-header-friends">These are your friends</h2>
                <div className="friends-list-container">
                    {friends &&
                        friends
                            .filter(({ accepted }) => accepted)
                            .map((friend) => {
                                return (
                                    <div
                                        key={friend.id}
                                        className="list-container"
                                    >
                                        <ul>
                                            <li className="friends-list-card">
                                                <img
                                                    src={friend.profile_url}
                                                    className="friends-profile-pic"
                                                ></img>
                                                <p className="friend-name">
                                                    {friend.first_name}{" "}
                                                    {friend.last_name}
                                                </p>

                                                <button
                                                    onClick={() => {
                                                        dispatch(
                                                            unFriend(friend.id)
                                                        );
                                                    }}
                                                    className="button-friend"
                                                >
                                                    Unfriend
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                );
                            })}
                </div>
            </section>

            <section className="friends">
                <h2 className="sub-header-friends">
                    These wanted to be your friends:-Wannabes
                </h2>
                <div className="friends-list-container">
                    {friends &&
                        friends
                            .filter(({ accepted }) => !accepted)
                            .map((friend) => {
                                return (
                                    <div
                                        key={friend.id}
                                        className="list-container"
                                    >
                                        <ul>
                                            <li className="friends-list-card">
                                                <img
                                                    src={friend.profile_url}
                                                    className="friends-profile-pic"
                                                ></img>
                                                <p className="friend-name">
                                                    {friend.first_name}{" "}
                                                    {friend.last_name}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        dispatch(
                                                            acceptFriendship(
                                                                friend.id
                                                            )
                                                        );
                                                    }}
                                                    className="button-friend"
                                                >
                                                    Accept
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                );
                            })}
                </div>
            </section>
        </div>
    );
}
