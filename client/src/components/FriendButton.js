import { useState, useEffect } from "react";
import axios from "../axios";

export default function FriendButton({ id }) {
    const [buttonText, setButtonText] = useState("");
    const [existing, setExisting] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [incoming, setIncoming] = useState(false);

    useEffect(() => {
        axios.get(`/api/user/${id}/relationship`).then((response) => {
            console.log("[relation-/api/user/:id/relationship]", response.data);
            if (response.data == false) {
                setExisting(false);
                return;
            }
            setExisting(true);
            setAccepted(response.data.accepted);
            console.log("[incoming id request]", id == response.data.sender_id);
            setIncoming(id == response.data.sender_id);
        });
    }, []);

    useEffect(() => {
        //for butten to show
        //checking relation exists if not Add friend
        if (!existing) {
            setButtonText("Add Friend Request");
            return;
        }
        //If accpeted then Unfriend(button show)
        if (accepted) {
            setButtonText("Unfriend");
            return;
        }
        // not profile owner
        if (incoming) {
            setButtonText("Accept Request");
            return;
        }
        setButtonText("Cancel Request");
    }, [existing, accepted, incoming]);

    function buttonClick() {
        console.log("hello!");
        if (!existing) {
            axios.post(`/api/user/${id}/relationship`).then(() => {
                setExisting(true);
            });
            return;
        }
        if (accepted || !incoming) {
            console.log("[DELETE-case]");
            axios.delete("/api/user/:id/relationship").then(() => {
                setExisting(false);
                setAccepted(false);
                setIncoming(false);
            });
            return;
        }
        console.log("[PUT case]");
    }

    return (
        <div>
            <button type="submit" onClick={buttonClick}>
                {buttonText}
            </button>
        </div>
    );
}
