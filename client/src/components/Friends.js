import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { receiveFriendsAndWannabes } from "../Reducer/action";

export default function Friend() {
    const dispatch = useDispatch();
    const friends = useSelector((state) => state.friends);

    useEffect(() => {
        dispatch(receiveFriendsAndWannabes());
    }, []);

    return (
        <div>
            <h2>These are your friends</h2>
            <div className="friends-list">
                {friends &&
                    friends
                        .filter(({ accepted }) => accepted)
                        .map((friend) => {
                            return (
                                <div key={friend.id}>{friend.first_name}</div>
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
                                <div key={friend.id}>{friend.first_name}</div>
                            );
                        })}
            </div>
        </div>
    );
}
