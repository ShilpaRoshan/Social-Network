import { Component } from "react";
import FriendButton from "./FriendButton";
import axios from "../axios";

const defaultImage = "../avatar.png";
export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            firstName: "",
            lastName: "",
            profileUrl: "",
            bio: "",
        };
    }
    componentDidMount() {
        const { id } = this.props.match.params;
        console.log("[id-params-OtherProfile]", id);
        axios.get("/api/user/" + id).then((response) => {
            if (!response.data) {
                this.props.history.push("/");
                return;
            }
            console.log(
                "[componentDidMount-OtherProfile]",
                response.data.firstName
            );
            this.setState({
                id: response.data.id,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                profileUrl: response.data.profileUrl,
                bio: response.data.bio,
            });
            console.log(
                "[componentDidMount-OtherProfile-state]",
                response.data.firstName
            );
        });
    }

    render() {
        return (
            <div className="other-profile">
                <img
                    src={this.state.profileUrl || defaultImage}
                    alt={`${this.state.firstName} ${this.state.lastName}`}
                    className="other-user-profilepic"
                ></img>
                <h3 className="other-profile-useraname">
                    {this.state.firstName} {this.state.lastName}
                </h3>
                <p className="other-profile-bio">{this.state.bio}</p>
                <div className="friend-request">
                    <FriendButton
                        id={this.props.match.params.id}
                    ></FriendButton>
                </div>
            </div>
        );
    }
}
